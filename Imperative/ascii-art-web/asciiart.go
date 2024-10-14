package main

import (
	"os"
	"strings"
)

// struct needed for html
type Ascii struct {
	Input  string
	Output string
}

func makeAsciiChar(bannerPath, input string) (string, error) {
	var output string
	ascii, err := makeMap(bannerPath)
	if err != nil {
		return output, err
	}
	// removes quotes from input (for some reason idk)
	if len(input) > 0 && input[0] == '"' {
		input = input[1:]
	}
	if len(input) > 0 && input[len(input)-1] == '"' {
		input = input[:len(input)-1]
	}

	for _, w := range strings.Split(input, "\r\n") { //splits input text at new line
		if w == "" { // makes new line at empty spot in case of 2 or more \n
			output += "\n"
			continue
		}
		for i := 0; i < 8; i++ { // 8 lines
			var line string
			for _, l := range w { // makes each line
				line = line + string(ascii[int(l)][i])
			}
			output += line + "\n"
			line = ""
		}
	}
	return output, err
}

// assigning int to each ascii letter starting from 32 which is "space"
func makeMap(path string) (map[int][]string, error) {

	mp := make(map[int][]string)
	content, err := os.ReadFile(path)
	if err != nil {
		return mp, err
	}

	i := 31
	for _, x := range strings.Split(string(content), "\n") { // splits string at new line
		if x == "" { // if string is empty moves to next letter
			i++
		} else {
			mp[i] = append(mp[i], x)
		}
	}
	return mp, err
}

// validates characters
func IsValid(s string) bool {

	for _, r := range s {
		if r == 13 || r == 10 { //html outputs these characters when you have a new line
			return true
		} else if r < 32 || r > 126 {
			return false
		}
	}
	return true
}
