package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	//"01.kood.tech/git/MarkusKa/real-time-forum/database"
)

func usernameEmailListHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	// EPIC security measures
	case "GET":
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		//http.Redirect(w, r, "/error", http.StatusMethodNotAllowed)
	case "POST":
		queryUsers := "SELECT username FROM users"
		queryEmails := "SELECT email FROM users"
		rowsUsers := SelectSQLScript(queryUsers)
		rowsEmails := SelectSQLScript(queryEmails)

		var usernamesEmails UsernamesEmails

		// Iterate through the results and add to struct
		for rowsUsers.Next() {
			var username string
			err := rowsUsers.Scan(&username)
			if err != nil {
				log.Fatal(err)
			}
			usernamesEmails.Users = append(usernamesEmails.Users, username)
		}
		if err := rowsUsers.Err(); err != nil {
			fmt.Println(err)
		}

		for rowsEmails.Next() {
			var email string
			err := rowsEmails.Scan(&email)
			if err != nil {
				log.Fatal(err)
			}
			usernamesEmails.Emails = append(usernamesEmails.Emails, email)
		}
		if err := rowsEmails.Err(); err != nil {
			fmt.Println(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		// Encode and send the response data as JSON
		json.NewEncoder(w).Encode(usernamesEmails)
	}
}

func forumContentHandler(w http.ResponseWriter, r *http.Request) {

	switch r.Method {

	case "GET":
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		//http.Redirect(w, r, "/error", http.StatusMethodNotAllowed)
	case "POST":
		posts := getAllPosts()
		comments := getAllComments()

		var postsComments PostsComments

		postsComments.Posts = posts
		postsComments.Comments = comments

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		// Encode and send the response data as JSON
		json.NewEncoder(w).Encode(postsComments)
	}

}
