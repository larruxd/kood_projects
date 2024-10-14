package main

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

func getData() ([]Artist, Error) {

	var serverError Error

	/* Artists API */
	var artist []Artist
	resp, err := http.Get("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		serverError.ErrorCode = "500"
		serverError.ErrorMsg = "Artist API failed to load"
		return artist, serverError
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		serverError.ErrorCode = "500"
		serverError.ErrorMsg = "Failed to read Artist data"
		return artist, serverError
	}
	json.Unmarshal(body, &artist)

	/* Locations API */
	var locations Locations
	resp, err = http.Get("https://groupietrackers.herokuapp.com/api/locations")
	if err != nil {
		serverError.ErrorCode = "500"
		serverError.ErrorMsg = "Locations API failed to load"
		return artist, serverError
	}
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		serverError.ErrorCode = "500"
		serverError.ErrorMsg = "Failed to read Locations Data"
		return artist, serverError
	}
	json.Unmarshal(body, &locations)

	/* Dates API */
	/* var dates Dates
	resp, err = http.Get("https://groupietrackers.herokuapp.com/api/dates")
	if err != nil {
		serverError.ErrorCode = "500"
		serverError.ErrorMsg = "Dates API failed to load"
		return artist, serverError
	}
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		serverError.ErrorCode = "500"
		serverError.ErrorMsg = "Failed to read Dates data"
		return artist, serverError
	}
	json.Unmarshal(body, &dates) */

	/* Relations API */
	var relations Relations
	resp, err = http.Get("https://groupietrackers.herokuapp.com/api/relation")
	if err != nil {
		serverError.ErrorCode = "500"
		serverError.ErrorMsg = "Relations API failed to load"
		return artist, serverError
	}
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		serverError.ErrorCode = "500"
		serverError.ErrorMsg = "Failed to read Relations data"
		return artist, serverError
	}
	json.Unmarshal(body, &relations)

	for x := range artist {
		artist[x].Location = locations.Index[x].Locations
		//artist[x].ConcertDate = dates.Index[x].Dates
		artist[x].Relation = relations.Index[x].Relations

		var key string
		var value []string
		tempMap := make(map[string][]string)
		for j := range artist[x].Relation {
			key = strings.Replace(j, "-", ", ", -1)
			key = strings.Replace(key, "_", " ", -1)
			key = strings.Title(key)
			if len(strings.Split(key, ", ")[len(strings.Split(key, ", "))-1]) <= 3 {
				key = strings.Replace(key, strings.Split(key, ", ")[len(strings.Split(key, ", "))-1], strings.ToUpper(strings.Split(key, ", ")[len(strings.Split(key, ", "))-1]), -1)
			}
			value = nil
			for k, _ := range artist[x].Relation[j] {
				//fmt.Println(artist[l].Relation[j][k])
				value = append(value, artist[x].Relation[j][k])
			}
			tempMap[key] = value
		}
		artist[x].Relation = tempMap
	}

	return artist, serverError
}
