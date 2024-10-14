package app

import (
	"fmt"
	"net/http"
)

var port = "8080"

func LaunchServer() {
	// every page uses index.html
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./web/index.html")
	})
	http.Handle("/web/", http.StripPrefix("/web/", http.FileServer(http.Dir("web"))))

	http.HandleFunc("/user-login", loginHandler)
	http.HandleFunc("/user-signup", signupHandler)
	http.HandleFunc("/auth", authHandler)
	http.HandleFunc("/logout", logoutHandler)
	http.HandleFunc("/list-users-emails", usernameEmailListHandler)
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/new-post", newPostHandler)
	http.HandleFunc("/new-comment", newCommentHandler)
	http.HandleFunc("/get-forum-content", forumContentHandler)

	fmt.Println("Server listening on :8080")
	fmt.Println("http://localhost:" + port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
