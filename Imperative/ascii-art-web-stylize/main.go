package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

var tmpl *template.Template //global template variable

func main() { //server

	mux := http.NewServeMux()
	tmpl = template.Must(template.ParseFiles("templates/index.html"))

	mux.HandleFunc("/", home)
	mux.HandleFunc("/ascii-art", asciiPage)

	fileServer := http.FileServer(http.Dir("./static/"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
	// terminal
	log.Println("Starting server on http://localhost:8080")
	fmt.Println("Press Ctrl+C to stop")
	//start server
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}

func home(w http.ResponseWriter, r *http.Request) { // home page

	if r.URL.Path != "/" { // other pages than "/" give err 404
		http.Error(w, "404\nPAGE NOT FOUND :(", http.StatusNotFound)
		return
	}
	w.WriteHeader(200)
	tmpl = template.Must(template.ParseFiles("templates/index.html"))
	if err := tmpl.Execute(w, nil); err != nil {
		http.Error(w, "500\nInternal server error", http.StatusInternalServerError)
	}
}

func asciiPage(w http.ResponseWriter, r *http.Request) { //ascii art page

	tmpl, err := template.ParseFiles("templates/index.html") //template
	if err != nil {
		http.Error(w, "404\nPAGE NOT FOUND :(", http.StatusNotFound) // 404
		return
	}
	// banner and input from html
	if err := r.ParseForm(); err != nil {
		http.Error(w, "400 Bad request", http.StatusBadRequest) //400
		return
	}
	w.WriteHeader(200) // all good

	input := string(r.FormValue("text"))
	banner := "banners/" + r.FormValue("banner")
	output := ""

	// valid char check
	if !(IsValid(r.FormValue("text"))) {
		output = "Invalid input. Only ASCII characters 32-126 are allowed."
	} else {
		output, err = makeAsciiChar(banner, input)
		if err != nil {
			http.Error(w, "500\nInternal server error", http.StatusInternalServerError)
			return
		}
	}
	// :D
	if r.FormValue("text") == "" {
		output = "💀"
	}
	// POST output to html
	result := Ascii{Output: output}
	if err := tmpl.Execute(w, result); err != nil {
		http.Error(w, "500\nInternal server error", http.StatusInternalServerError)
		return
	}
}
