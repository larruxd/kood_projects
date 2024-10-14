package main

import (
	"log"
	"net/http"
	"path/filepath"
)

func main() {
	// Get the absolute path of the parent directory
	dir, err := filepath.Abs("../")
	if err != nil {
		log.Fatal(err)
	}

	// Serve the index.html file
	http.Handle("/", http.FileServer(http.Dir(dir)))

	// Start the server
	log.Println("Server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
