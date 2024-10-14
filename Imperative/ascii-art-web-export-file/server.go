package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
)

var output string

func main() { // creates server and handles http requests

	mux := http.NewServeMux()

	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/ascii-art", asciiHandler)
	mux.HandleFunc("/export-file", fileHandler)

	fileServer := http.FileServer(http.Dir("./static"))

	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	fmt.Printf("Starting server at: http://localhost:8080, press CTRL + c to shut it down.\n")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func indexHandler(w http.ResponseWriter, r *http.Request) { //handles main page

	home, err := template.ParseFiles("static/index.html")
	if err != nil {
		http.Error(w, "Server not reachable - 500 Internal Server Error", http.StatusNotFound)
	}
	if r.URL.Path != "/" {
		http.Error(w, "404 - page not found.", http.StatusNotFound)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Bad request - 405 method not allowed.", http.StatusMethodNotAllowed)
		return
	}
	home.Execute(w, output)
}

func asciiHandler(w http.ResponseWriter, r *http.Request) { //handles the ascii-art conversion process
	if r.URL.Path != "/ascii-art" {
		http.Error(w, "Bad request - 404 Page Not Found.", http.StatusNotFound)
		return
	}
	if r.Method != "POST" {
		http.Error(w, "Bad request - 405 method not allowed.", http.StatusMethodNotAllowed)
		return
	}
	text := r.FormValue("input")
	if !(invalidChars(r.FormValue("input"))) {
		//http.Error(w, "Invalid Input - 400 Bad Rquest", http.StatusMethodNotAllowed)
		//return
		output = "Invalid characters present, conversion unsuccessful. \n Note: The characters allowed are standard latin alphabet letters, numbers and symbols."
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	font := r.FormValue("banner_styles")
	if font != "standard" && font != "shadow" && font != "thinkertoy" {
		http.Error(w, "Bad request - 404 Banner not found", http.StatusNotFound)
		return
	}

	output = makeArt(text, font)
	http.Redirect(w, r, "/", http.StatusFound)
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/export-file" {
		http.Error(w, "Bad request - 404 Page Not Found.", http.StatusNotFound)
		return
	}
	if r.Method != "POST" {
		http.Error(w, "Bad request - 405 method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Add("Content-Disposition", "attachment; filename=ascii-art.txt") //tells the client to open an "save-as" window
	w.Header().Add("Content-Type", "text/html; charset=utf-8")                  //tells the client specifics about the incoming file
	w.Header().Add("Content-Length", strconv.Itoa(len(output)))                 //tells the client the size of the document
	//fmt.Println(len(output))
	fmt.Fprint(w, output)
}
