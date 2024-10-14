package main

import (
	"log"
	"net/http"
)

func main() {
	var port = ":8080"
	startServer(port)
}

func startServer(port string) {

	fs := http.FileServer(http.Dir("."))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		if r.URL.Path == "/" {
			http.ServeFile(w, r, "index.html")
			return
		}
		fs.ServeHTTP(w, r)
	})

	log.Println("Server running")
	log.Println("http://localhost" + port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		panic(err)
	}

}
