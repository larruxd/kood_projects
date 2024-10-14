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

func main() {

	if len(os.Args) > 2 {
		panic("Too many arguments. If you want to print pultiple words, type them in quotations.")
	}
	if len(os.Args) < 2 {
		panic("Not enough arguments. Type something you want the program to print.")
	}

	input := os.Args[1]
	var output string
	ascii := makeMap("standard.txt")

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
	output = strings.TrimSuffix(output, "\n")
	fmt.Println(output)
}
