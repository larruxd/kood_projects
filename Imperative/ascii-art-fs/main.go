package main

import (
	"fmt"
	"os"
	"strings"
)

// assigning int to each ascii letter starting from 32 which is "space"
func makeMap(path string) map[int][]string {

	mp := make(map[int][]string)
	content, _ := os.ReadFile(path)
	i := 31

	for _, x := range strings.Split(string(content), "\n") { // splits string at new line
		if x == "" { // if string is empty moves to next letter
			i++
		} else {
			mp[i] = append(mp[i], x)
		}
	}
	return mp
}

// validates characters
func IsValid(s string) bool {
	for _, r := range s {
		if r < 32 || r > 126 {
			return false
		}
	}
	return true
}

func main() {

	// input validation
	if len(os.Args) > 3 {
		panic("Too many arguments.\nUsage: go run . [STRING] [BANNER]")

	}
	if len(os.Args) < 3 {
		panic("Not enough arguments.\nUsage: go run . [STRING] [BANNER]")

	}
	if os.Args[2] != "shadow" && os.Args[2] != "thinkertoy" && os.Args[2] != "standard" {
		panic("Wrong banner name. Options are: shadow, thnikertoy or standard")

	}

	input := os.Args[1]
	banner := os.Args[2]
	if !IsValid(input) {
		panic("Invalid character in string!\nValid characters are ASCII 32-126")
	}

	if banner == "shadow" {
		banner = "shadow.txt"
	} else if banner == "thinkertoy" {
		banner = "thinkertoy.txt"
	} else if banner == "standard" {
		banner = "standard.txt"
	}

	ascii := makeMap(banner)
	var output string

	for _, w := range strings.Split(input, "\\n") { //splits input text at new line
		if w == "" { // makes new line at empty spot in case of 2 or more \n
			output += "\n"
			continue
		}
		for i := 0; i < 8; i++ { // 8 lines
			var line string
			for _, l := range w { // makes each line
				line = line + string(ascii[int(l)][i]) // int(l) takes each letters int value
			}
			output += line + "\n"
			line = ""
		}
	}
	output = strings.TrimSuffix(output, "\n") // removes extra newline
	// handles newline and empty outputs
	if output == "\n" {
		fmt.Println("")
	} else if output == "" {
		fmt.Print("")
	} else {
		fmt.Println(output)
	}
}
