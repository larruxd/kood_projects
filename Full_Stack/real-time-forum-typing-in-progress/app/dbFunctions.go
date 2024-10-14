package app

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/signal"
	"syscall"

	_ "github.com/mattn/go-sqlite3"
)

const dbPath = "database/database.db"

var SqlDb *sql.DB

func ExecSQLScript(sqlScript string) (sql.Result, error) {
	DB, _ := sql.Open("sqlite3", dbPath) // Open the created SQLite File
	value, err := DB.Exec(sqlScript)
	if err != nil {
		fmt.Println(err)
	}
	DB.Close() // Closing the database
	return value, err
}

func SelectSQLScript(query string) *sql.Rows {
	// Open db
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// get rows
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	return rows
}

func GetAllOfType(data string, table string) []string {
	script := "SELECT " + data + " FROM " + table
	rows := SelectSQLScript(script)
	var temp []string
	for rows.Next() {
		var value string
		err := rows.Scan(&value)
		if err != nil {
			log.Fatal(err)
		}
		temp = append(temp, value)
	}
	if err := rows.Err(); err != nil {
		fmt.Println(err)
	}

	// sort.Strings(temp)

	return temp
}

func GetChatHistory(message, table, sender, receiver string) []struct {
	Message  string
	DateSent string
	Sender   string
	Receiver string
} {
	script := "SELECT " + message + ", dateSent, user_id, receiver_id FROM " + table + " WHERE (user_id=" + sender + " AND receiver_id=" + receiver + ") OR (user_id=" + receiver + " AND receiver_id=" + sender + ")"
	rows := SelectSQLScript(script)

	var temp []struct {
		Message  string
		DateSent string
		Sender   string
		Receiver string
	}

	for rows.Next() {
		var message string
		var dateSent string
		var user_id int
		var receiver_id int
		err := rows.Scan(&message, &dateSent, &user_id, &receiver_id)
		if err != nil {
			log.Fatal(err)
		}

		temp = append(temp, struct {
			Message  string
			DateSent string
			Sender   string
			Receiver string
		}{
			Message:  message,
			DateSent: dateSent,
			Sender:   GetUsername(user_id),
			Receiver: GetUsername(receiver_id),
		})
	}
	if err := rows.Err(); err != nil {
		fmt.Println(err)
	}

	return temp
}

func GetUserID(LoginID string) (userID int) {
	query, err := SqlDb.Prepare("SELECT id FROM users WHERE username = ? OR email = ?")
	if err != nil {
		fmt.Println(err)
	}
	defer query.Close()
	err = query.QueryRow(LoginID, LoginID).Scan(&userID)
	if err != nil {
		fmt.Println(err)
	}
	return userID
}

func GetUsername(userID int) (username string) {
	query, err := SqlDb.Prepare("SELECT username FROM users WHERE id = ?")
	if err != nil {
		fmt.Println(err)
	}
	defer query.Close()
	err = query.QueryRow(userID).Scan(&username)
	if err != nil {
		fmt.Println(err)
	}
	return username
}

func getCategory(categoryID int) (category string) {
	query, err := SqlDb.Prepare("SELECT name FROM category WHERE id = ?")
	if err != nil {
		fmt.Println(err)
	}
	defer query.Close()
	err = query.QueryRow(categoryID).Scan(&category)
	if err != nil {
		fmt.Println(err)
	}
	return category
}

func RemoveSessionById(id int) {
	_, err := SqlDb.Exec("DELETE FROM session WHERE user_id = ?", id)
	if err != nil {
		log.Println(err)
	}
}

// "reset" to reset, "default" to just open? up for modifying
func DatabaseAction(action string) {

	// deleteDatabase()
	// fmt.Println("testdelete")

	//if db doesnt exist
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		fmt.Println("No database found, creating...")
		initDatabase()
		return
	} else {
		switch action {
		case "reset":
			deleteDatabase()
			initDatabase()
		default:
			openDatabase()
		}
	}

}

func gracefulShutdown() {
	// Create a channel to receive signals (os.Signal)
	c := make(chan os.Signal, 1)

	// Notify the channel 'c' when the server receives the Interrupt signal (Ctrl+C)
	// or the SIGTERM signal (terminate signal)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	//gorutine that waits for a signal on channel "c", closes the database and exits app
	go func() {
		<-c
		fmt.Println("\nShutting down...")

		if SqlDb != nil {
			SqlDb.Close()
		}

		os.Exit(0)
	}()
}

func openDatabase() {
	// Open or create database.db
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal(err)
	}
	// defer db.Close()
	SqlDb = db
	gracefulShutdown()
}

func initDatabase() {

	openDatabase()

	// Init default tables
	scriptPath := "database/sql-scripts/database.sql"
	tableInit, err := ioutil.ReadFile(scriptPath)
	if err != nil {
		log.Fatal(err)
	}

	_, err = SqlDb.Exec(string(tableInit))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Database schema created successfully.")
}

// To reset Database
func deleteDatabase() {

	err := os.Remove(dbPath)
	if err != nil && !os.IsNotExist(err) {
		log.Fatal(err)
	}
	fmt.Println("Database deleted")
}

func getAllPosts() []PostResponse {
	var allPosts []PostResponse
	// var testAllPosts []AllPost
	// sqlScript := `Select
	// 				p.title, p.content, p.created_at, c.name, u.username
	// 			FROM posts p
	// 			JOIN category c
	// 			ON p.category_id=c.id
	// 			JOIN users u
	// 			ON p.user_id=u.id`
	// testResult := SelectSQLScript(sqlScript)
	result := SelectSQLScript("Select * From posts")
	var id, user_id, category_id sql.NullInt16
	var title, content, created_at sql.NullString
	// for testResult.Next() {
	// 	testResult.Scan(&title, &content, &created_at, &name, &username)
	// 	testPost := AllPost{
	// 		Title:    string(title.String),
	// 		Content:  string(content.String),
	// 		Category: string(name.String),
	// 		Date:     string(created_at.String),
	// 		User:     string(username.String)}
	// 	testAllPosts = append(testAllPosts, testPost)
	// }

	for result.Next() {
		result.Scan(&id, &title, &content, &user_id, &category_id, &created_at)
		post := PostResponse{
			PostID:     int(id.Int16),
			UserID:     int(user_id.Int16),
			Username:   GetUsername(int(user_id.Int16)),
			Title:      string(title.String),
			Content:    string(content.String),
			CategoryID: int(category_id.Int16),
			Category:   getCategory(int(category_id.Int16)),
			Date:       string(created_at.String),
		}
		allPosts = append(allPosts, post)
	}
	//fmt.Println(testResult)
	//fmt.Println("testallposts: ", testAllPosts)
	return allPosts
}

func getAllComments() []CommentsResponse {
	var allComments []CommentsResponse

	result := SelectSQLScript("Select * From comments")
	var id, user_id, post_id sql.NullInt16
	var content, created_at sql.NullString

	for result.Next() {
		result.Scan(&id, &user_id, &post_id, &content, &created_at)
		comment := CommentsResponse{
			CommentID: int(id.Int16),
			PostID:    int(post_id.Int16),
			UserID:    int(user_id.Int16),
			Username:  GetUsername(int(user_id.Int16)),
			Content:   string(content.String),
			Date:      string(created_at.String),
		}
		allComments = append(allComments, comment)
	}
	return allComments
}
