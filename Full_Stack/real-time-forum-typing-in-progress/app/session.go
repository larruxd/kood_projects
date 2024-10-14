package app

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	//database "01.kood.tech/git/MarkusKa/real-time-forum/database"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func loginHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var loginInfo LoginInfo
	err := json.NewDecoder(r.Body).Decode(&loginInfo)
	if err != nil {
		fmt.Println(err)
	}

	var userID int
	var password string

	query := "SELECT id, password FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?"
	err = SqlDb.QueryRow(query, strings.ToLower(loginInfo.LoginID), strings.ToLower(loginInfo.LoginID)).Scan(&userID, &password)
	if err != nil {
		// WRONG USERNAME/EMAIL
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("User doesn't exist"))
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(loginInfo.Password))
	if err != nil {
		// WRONG PW
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Wrong password"))
		return
	}

	// remove any previous session (if user closed site and didn't logout)
	RemoveSessionById(userID)

	response := LoginResponse{
		LoginName: GetUsername(userID),
		UserID:    userID,
		CookieKey: createCookie(w, userID),
	}

	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Println(err)
	}

}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var signupInfo SignupInfo

	err := json.NewDecoder(r.Body).Decode(&signupInfo)
	if err != nil {
		log.Println(err)
	}

	var user, email string

	userErr := SqlDb.QueryRow("SELECT username FROM users WHERE username=?", signupInfo.Username).Scan(&user)
	emailErr := SqlDb.QueryRow("SELECT username FROM users WHERE username=?", signupInfo.Email).Scan(&email)

	switch {
	case userErr == sql.ErrNoRows && emailErr == sql.ErrNoRows:
		// CRYPT PASSWORD
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(signupInfo.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Server error, unable to create your account.", 500)
			return
		}

		// INSERT USER TO DB
		sqlScript := `
		INSERT INTO users (
			username,
			password,
			email,
			age,
			gender,
			first_name,
			last_name
		) 
		VALUES (?, ?, ?, ?, ?, ?, ?)`
		_, err = SqlDb.Exec(
			sqlScript,
			signupInfo.Username,
			hashedPassword,
			signupInfo.Email,
			signupInfo.Age,
			signupInfo.Gender,
			signupInfo.FirstName,
			signupInfo.LastName,
		)
		if err != nil {
			http.Error(w, "Server error, unable to create your account.", 500)
			return
		}
		w.Write([]byte("Account created succsessfully"))
		NewUserCreated(GetUserID(signupInfo.Username))
		return
	case err != nil:
		http.Error(w, "Server error, unable to create your account.", 500)
		return
	default:
		http.Redirect(w, r, "/login", http.StatusMovedPermanently)

	}
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("UserID")

	log.Println("userID, " + userID)

	cookie := &http.Cookie{
		Name:   "session-" + userID,
		Value:  "",
		MaxAge: -1,
	}
	http.SetCookie(w, cookie)

	userIDint, err := strconv.Atoi(userID)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// go func() { // needs to be goroutine because of <- operator is a blocking operator by default
	// 	Ch <- userIDint
	// }()

	RemoveSessionById(userIDint)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logout was successful!"))

}

func authHandler(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("CookieKey")
	userIDstr := r.URL.Query().Get("UserID")

	var hasActiveSession bool
	err := SqlDb.QueryRow("SELECT EXISTS(SELECT 1 FROM session WHERE key = ? AND user_id = ?)", key, userIDstr).Scan(&hasActiveSession)
	if err != nil {
		log.Println(err)
	}

	if hasActiveSession {

		userIDint, err := strconv.Atoi(userIDstr)
		if err != nil {
			log.Println(err)
		}

		response := &LoginResponse{
			UserID:    userIDint,
			LoginName: GetUsername(userIDint),
			CookieKey: key,
		}
		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)
	} else {
		response := "session not found"

		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(jsonResponse)
	}
}

func createCookie(w http.ResponseWriter, userID int) string {
	session := uuid.Must(uuid.NewV4()).String()
	expiresAt := time.Now().Add(12 * time.Hour)
	//maxAge := int(12 * time.Hour)

	cookie := &http.Cookie{
		Name:     "session-" + strconv.Itoa(userID),
		Value:    session,
		Expires:  expiresAt,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, cookie)

	SqlDb.Exec("DELETE FROM session WEHERE user_id = ?", userID)
	query, err := SqlDb.Prepare("INSERT INTO session (key, user_id) VALUES (?, ?)")
	if err != nil {
		log.Println(err)
	}
	defer query.Close()
	query.Exec(session, userID)

	return session
}
