package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Data struct {
	Ants  int64
	Rooms []map[string][]int64
	Links [][]string
}

type Rooms struct {
	Name      string
	Neighbors []string
	Start     bool
	End       bool
}

const (
	errdata  = "ERROR: invalid data format, "
	errAnts  = errdata + "invalid number of ants."
	errStart = errdata + "no start room found."
	errEnd   = errdata + "no end room found."
	errPath  = errdata + "no paths found."
)

func readFile(filePath string) Data {

	var (
		data         Data
		ants         bool   // keep track if ants number is already added
		previousLine string // keep track of previous line to add start or end to room name
		hasStart     bool
		hasEnd       bool
	)

	content, err := os.Open(filePath)
	if err != nil {
		fmt.Println(err)
		os.Exit(0)
	}
	defer content.Close()
	scanner := bufio.NewScanner(content)
	// checks for errors during scan
	for scanner.Scan() {
		line := scanner.Text()
		// print line to terminal
		if line == "" {
			continue
		}
		if line == "##start" {
			hasStart = true
		}
		if line == "##end" {
			hasEnd = true
		}
		if line[0] == '#' && line[1] != '#' {
			continue
		}
		if line[0] == 'L' {
			continue
		}
		// first line nr of ants
		if !ants {
			data.Ants, err = strconv.ParseInt(line, 10, 0)
			if err != nil {
				fmt.Println(errAnts)
				os.Exit(0)
			}
			if data.Ants < 1 {
				fmt.Println(errAnts)
				os.Exit(0)
			}
			ants = true
			continue
		}
		// rooms
		if x := strings.Split(line, " "); len(x) == 3 {
			// variables for name and coordinates (idk if i even need them but I'll catch them anyway)
			roomName := x[0]
			x_coord, err := strconv.ParseInt(x[1], 10, 0)
			if err != nil {
				fmt.Println(err)
				os.Exit(0)
			}
			y_coord, err := strconv.ParseInt(x[2], 10, 0)
			if err != nil {
				fmt.Println(err)
				os.Exit(0)
			}

			room := make(map[string][]int64)
			// add "start" to start room
			if previousLine == "##start" {
				room["start "+roomName] = append(room[roomName], x_coord, y_coord)

			} else if previousLine == "##end" { // add "end" to end room
				room["end "+roomName] = append(room[roomName], x_coord, y_coord)

			} else {
				room[roomName] = append(room[roomName], x_coord, y_coord)
			}
			data.Rooms = append(data.Rooms, room)
		}
		previousLine = line
		// connections
		if x := strings.Split(line, "-"); len(x) == 2 {
			connections := []string{x[0], x[1]}
			data.Links = append(data.Links, connections)
		}
	}
	if !hasStart {
		fmt.Println(errStart)
		os.Exit(0)
	}
	if !hasEnd {
		fmt.Println(errEnd)
		os.Exit(0)
	}
	return data
}

func printFileContents(filepath string) {
	file, err := os.Open(filepath)
	if err != nil {
		fmt.Println(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			continue
		}
		if line[0] == '#' && line[1] != '#' {
			continue
		}
		fmt.Println(line)
	}
	if err := scanner.Err(); err != nil {
		fmt.Println(err)
	}
	fmt.Println()
}
