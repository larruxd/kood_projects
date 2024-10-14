package main

type Artist struct {
	ID           int      `json:"id"`
	Image        string   `json:"image"`
	Name         string   `json:"name"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	Locations    string   `json:"locations"`
	ConcertDates string   `json:"concertDates"`
	Relations    string   `json:"relations"`
	Location     []string
	ConcertDate  []string
	Relation     map[string][]string
}

type Locations struct {
	Index []struct {
		ID        int      `json:"id"`
		Locations []string `json:"locations"`
		Dates     string   `json:"dates"`
	} `json:"index"`
}

type Dates struct {
	Index []struct {
		ID    int      `json:"id"`
		Dates []string `json:"dates"`
	} `json:"index"`
}

type Relations struct {
	Index []struct {
		Relations map[string][]string `json:"datesLocations"`
	} `json:"index"`
}

type Error struct {
	ErrorCode string
	ErrorMsg  string
}

type ArtistSlice struct {
	artist []Artist
}

type Data struct {
	artistSlice ArtistSlice
	serverError Error
}
