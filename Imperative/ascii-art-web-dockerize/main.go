package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type menuArts struct {
	TitleArt      string
	ShadowArt     string
	StandardArt   string
	ThinkertoyArt string
}

const filename string = "ascii-art.txt"

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func menu(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("static/templates/index.html")
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		log.Fatal("404 Not Found")
	} else {
		title := asciiart("ascii", "standard", w, r)
		shadow := asciiart("abc123", "shadow", w, r)
		standard := asciiart("abc123", "standard", w, r)
		thinkertoy := asciiart("abc123", "thinkertoy", w, r)
		menu := menuArts{title, shadow, standard, thinkertoy}
		tmpl.Execute(w, menu)
	}

	if r.URL.Path != "/" {
		w.WriteHeader(http.StatusBadRequest)
		//log.Fatal(r.URL.Path + "400 Bad Request")
	}
}

func art(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("static/templates/art.html")
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		log.Fatal("404 Not Found")
	} else {
		style := r.FormValue("style")
		inputText := r.FormValue("inputText")
		art := asciiart(inputText, style, w, r)
		//safe := strings.Replace(art, "\n", "<br>", -1)
		tmpl.Execute(w, template.HTML(art))
		file, err := os.Create(filename)
		check(err)
		file.WriteString(art + "\n")
	}

	if r.URL.Path != "/ascii-art" {
		w.WriteHeader(http.StatusBadRequest)
		log.Fatal(r.URL.Path + " 400 Bad Request")
	}
}

func getFileSize() int {
	fileInfo, err := os.Stat(filename)
	check(err)
	return int(fileInfo.Size()) //get the file size
}

func file(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Disposition", "attachment; filename="+strconv.Quote(filename))
	w.Header().Set("Content-Length", strconv.Itoa(getFileSize()))
	w.Header().Set("Content-Type", "application/octet-stream")

	http.ServeFile(w, r, filename) // return file

	if r.URL.Path != "/file" {
		w.WriteHeader(http.StatusBadRequest)
		log.Fatal(r.URL.Path + " 400 Bad Request")
	}
	//TODO write long input to file
}

func faviconHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/favicon.ico")
}

func cssHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/styles.css")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", menu)
	mux.HandleFunc("/ascii-art", art)
	mux.HandleFunc("/file", file)
	mux.HandleFunc("/favicon.ico", faviconHandler)
	mux.HandleFunc("/styles.css", cssHandler)
	//http.Handle("/static/", http.FileServer(http.Dir("./static/")))

	fmt.Println("Starting server at http://127.0.0.1:8080/")
	fmt.Println("Quit the server with CONTROL-C.")

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal("500 Internal Server Error")
	}
}

func asciiart(inputText string, style string, w http.ResponseWriter, r *http.Request) string {
	symbolsListFile, err := os.ReadFile(style + ".txt")
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		log.Fatal("404 Not Found")
	} else {
		inputString := removeQuotes(string(inputText))
		symbolsList := strings.Split(string(symbolsListFile), "\n")
		wordList := strings.Split(string(inputString), "\\n")

		res := ""
		allEmpty := true
		for i, word := range wordList {
			if word != "" {
				allEmpty = false
				res += printWord(word, symbolsList)
			} else {
				if !allEmpty || i < len(wordList)-1 {
					res += "\n"
				}
			}
		}
		return res
	}
	return ""
}

func printWord(inputString string, symbolsList []string) string {
	res := ""
	for i := 0; i < 8; i++ {
		for j := 0; j < len(inputString); j++ {
			asciiSymbol := int(inputString[j])
			n := 1 + 9*(asciiSymbol-32)
			if n+i <= 856 { //check if banners have such symbol
				res += symbolsList[n+i]
			}
		}
		res += "\n"
	}
	return res
}

func removeQuotes(inputString string) string {
	if rune(inputString[0]) == '"' && rune(inputString[len(inputString)-1]) == '"' {
		len := len(inputString)
		return inputString[1 : len-1]
	}
	return inputString
}
