package app

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

func newPostHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	case "POST":
		var newPostInfo NewPost
		err := json.NewDecoder(r.Body).Decode(&newPostInfo)
		if err != nil {
			log.Println(err)
		}
		//posts := SelectSQLScript("SELECT title FROM posts")
		//var title sql.NullString
		userID := r.URL.Query().Get("UserID")
		catID, _ := SqlDb.Query("SELECT id FROM category WHERE name=?", newPostInfo.Category)
		var id sql.NullInt16
		for catID.Next() {
			catID.Scan(&id)
		}
		res := int(id.Int16)
		sqlScript := `
		INSERT INTO posts (
			title,
			content,
			user_id,
			category_id
		)
		VALUES (?, ?, ?, ?)`
		_, err = SqlDb.Exec(
			sqlScript,
			newPostInfo.Title,
			newPostInfo.Content,
			userID,
			res,
		)
		if err != nil {
			http.Error(w, "Server error, unable to submit post", 500)
			return
		}
		w.WriteHeader(http.StatusOK)
		// result := getAllPosts()
		// fmt.Println(result)
		/* for posts.Next() {
			result = append(result, posts.Scan(&title))
			fmt.Println("title ", posts.Scan(&title))
		} */
		//fmt.Println("see on ", posts)
	}
}

func newCommentHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	case "POST":
		var newCommentInfo NewComment
		err := json.NewDecoder(r.Body).Decode(&newCommentInfo)
		if err != nil {
			log.Println(err)
		}

		sqlScript := `
		INSERT INTO comments (
			user_id,
			post_id,
			content
		)
		VALUES (?, ?, ?)`
		_, err = SqlDb.Exec(
			sqlScript,
			newCommentInfo.UserID,
			newCommentInfo.PostID,
			newCommentInfo.Content,
		)
		if err != nil {
			http.Error(w, "Server error, unable to submit post", 500)
			return
		}
		w.WriteHeader(http.StatusOK)
		// result := getAllPosts()
		// fmt.Println(result)
		/* for posts.Next() {
			result = append(result, posts.Scan(&title))
			fmt.Println("title ", posts.Scan(&title))
		} */
		//fmt.Println("see on ", posts)
	}
}
