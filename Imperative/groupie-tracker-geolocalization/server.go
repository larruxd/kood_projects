package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func main() { // creates server and handles http requests

	var data Data
	data.artistSlice.artist, data.serverError = getData()

	/* TESTING */
	/* id := 0 // select artist id
	fmt.Printf("ID: %v\n", data.artistSlice.artist[id].ID)
	fmt.Printf("Image: %v\n", data.artistSlice.artist[id].Image)
	fmt.Printf("Name: %v\n", data.artistSlice.artist[id].Name)
	fmt.Printf("Members: %v\n", data.artistSlice.artist[id].Members)
	fmt.Printf("CreationDate: %v\n", data.artistSlice.artist[id].CreationDate)
	fmt.Printf("FirstAlbum: %v\n", data.artistSlice.artist[id].FirstAlbum)
	fmt.Printf("ConcertDate: %v\n", data.artistSlice.artist[id].ConcertDate)
	fmt.Printf("Relation: %v\n", data.artistSlice.artist[id].Relation)
	fmt.Printf("%v\n%v\n", data.serverError.ErrorCode, data.serverError.ErrorMsg) */

	//os.Exit(0) // test w/o running server

	mux := http.NewServeMux()

	mux.HandleFunc("/", indexHandler(data))
	mux.HandleFunc("/aboutartist/", aboutArtist(data))

	fileServer := http.FileServer(http.Dir("./static"))

	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	fmt.Printf("Starting server at: http://localhost:8080\nPress CTRL + c to shut it down.\n")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func indexHandler(data Data) func(w http.ResponseWriter, r *http.Request) { //handles main page

	return func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" && r.URL.Path != "/about" {
			http.Error(w, "404 - page not found.", http.StatusNotFound)
			return
		}
		if data.serverError.ErrorCode != "" {
			http.Error(w, "Server not reachable - 500 Internal Server Error", http.StatusInternalServerError)
			log.Printf("Error code: %v\n", data.serverError.ErrorCode)
			log.Printf("Error message: %v\n", data.serverError.ErrorMsg)
			return
		}
		if r.Method != "GET" {
			http.Error(w, "Bad request - 405 method not allowed.", http.StatusMethodNotAllowed)
			return
		}
		home, err := template.ParseFiles("static/index.html")
		if err != nil {
			http.Error(w, "Server not reachable - 500 Internal Server Error", http.StatusNotFound)
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		home.Execute(w, data.artistSlice.artist)
	}
}

func aboutArtist(data Data) func(w http.ResponseWriter, r *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {
		if data.serverError.ErrorCode != "" {
			http.Error(w, "Server not reachable - 500 Internal Server Error", http.StatusInternalServerError)
			log.Printf("Error code: %v\n", data.serverError.ErrorCode)
			log.Printf("Error message: %v\n", data.serverError.ErrorMsg)
			return
		}
		if r.Method != "GET" {
			http.Error(w, "Bad request - 405 method not allowed.", http.StatusMethodNotAllowed)
			return
		}
		aboutartist, err := template.ParseFiles("static/aboutartist.html")
		if err != nil {
			http.Error(w, "Server not reachable - 500 Internal Server Error", http.StatusInternalServerError)
		}
		id, err := strconv.Atoi(strings.TrimPrefix(r.URL.EscapedPath(), "/aboutartist/"))
		if err != nil {
			http.Error(w, "404 - page not found.", http.StatusNotFound)
			return
		}
		if !(1 <= id && id <= 52) {
			http.Error(w, "404 - page not found.", http.StatusNotFound)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		aboutartist.Execute(w, data.artistSlice.artist[id-1])
	}
}
