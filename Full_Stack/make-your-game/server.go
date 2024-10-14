package main

import (
	"fmt"
	"net/http"
	"text/template"
)

var port = "8080"

func main() {
	http.HandleFunc("/", indexHandler)

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.Handle("/src/", http.StripPrefix("/src/", http.FileServer(http.Dir("src"))))
	http.Handle("/graphics/", http.StripPrefix("/graphics/", http.FileServer(http.Dir("graphics"))))
	http.Handle("/sounds/", http.StripPrefix("/sounds/", http.FileServer(http.Dir("sounds"))))

	fmt.Println("Server running")
	fmt.Println("http://localhost:" + port)
	http.ListenAndServe(":"+port, nil)

}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	temp, _ := template.ParseFiles("static/index.html")

	if r.URL.Path != "/" {
		http.Error(w, "404 - not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	} else {
		temp.Execute(w, nil)
	}
}
