package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"text/template"
)

type ScoreBoard struct {
	Rank  int    `json:"rank"`
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

var port = "8080"

func main() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/GETscore", scoreGEThandler)
	http.HandleFunc("/POSTscore", scorePOSThandler)

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

func scoreGEThandler(w http.ResponseWriter, r *http.Request) {
	scores, err := readScores()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(scores)
}

func scorePOSThandler(w http.ResponseWriter, r *http.Request) {
	scores, err := readScores()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var newScore ScoreBoard
	json.NewDecoder(r.Body).Decode(&newScore)
	fmt.Println(newScore)
	scores = append(scores, newScore)

	err = writeScores(scores)
	if err != nil {
		http.Error(w, "Error writing scores:"+err.Error(), http.StatusInternalServerError)
		return
	}

	sortScores()
}

func readScores() ([]ScoreBoard, error) {
	file, err := ioutil.ReadFile("data/scoreboard.json")
	if err != nil {
		return nil, err
	}
	var scores []ScoreBoard
	json.Unmarshal(file, &scores)

	return scores, nil
}

func writeScores(scores []ScoreBoard) error {
	jsonScores, err := json.Marshal(scores)
	if err != nil {
		return err
	}
	err = ioutil.WriteFile("data/scoreboard.json", jsonScores, 0644)
	if err != nil {
		return err
	}

	return nil
}

func sortScores() {
	file, err := ioutil.ReadFile("data/scoreboard.json")
	if err != nil {
		fmt.Println(err)
	}
	var scores []ScoreBoard
	json.Unmarshal(file, &scores)
	for i := 0; i < len(scores); i++ {
		for j := 0; j < len(scores); j++ {

			if scores[i].Score > scores[j].Score {
				scores[i], scores[j] = scores[j], scores[i]
			} else if scores[i].Score == scores[j].Score {
				if formatTime(scores[i].Time) < formatTime(scores[j].Time) {
					scores[i], scores[j] = scores[j], scores[i]
				}
			}
			//scoreTimeInMilliseconds := formatTime(scores[i].Time)
		}
	}
	for i := 0; i < len(scores); i++ {
		scores[i].Rank = i + 1
	}
	jsonScores, err := json.Marshal(scores)
	if err != nil {
		fmt.Println(err)
	}
	err = ioutil.WriteFile("data/scoreboard.json", jsonScores, 0644)
	if err != nil {
		fmt.Println(err)
	}

}

func formatTime(unformatedTime string) int {
	var minAndSec = strings.Split(unformatedTime, ":")
	min, err := strconv.Atoi(minAndSec[0])
	if err != nil {
		fmt.Println(err)
	}
	sec, err := strconv.Atoi(minAndSec[1])
	if err != nil {
		fmt.Println(err)
	}

	return (min * 60000) + (sec * 1000)
}
