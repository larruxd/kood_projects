package main

import (
	"fmt"
	"os"
	"reflect"
	"regexp"
	"strings"
)

// Reads filename (provided by user) and bannerPath (to compare), turns ascii art into text, returns text as sring
func reverseAscii(fileName string, bannerPath string, lettersList []byte) string {
	result := ""
	file, err := os.ReadFile("testfiles/" + fileName)
	check(err)

	if string(file) == "" {
		return result
	}
	artStrings := strings.Split(string(file), "\n")
	lastSpace := 0
	if len(artStrings) != 9 { // wrong format error handling
		panic("Wrong format")
	}
	for i := range artStrings[0] {
		space := true
		for j, str := range artStrings {
			if j < len(artStrings)-1 && string(str[i]) != " " {
				space = false
			}
		}
		if space {
			var letter []string
			for j, str := range artStrings {
				if j < len(artStrings)-1 {
					letter = append(letter, "")
					letter[j] += str[lastSpace:i] + " "
				}
			}
			lastSpace = i + 1
			result += string(findLetter(letter, string(lettersList)))
		}
	}
	result = correctSpaces(result)
	return result
}

// compares input ascii character to characters in banner files, returns if
func findLetter(letter []string, lettersList string) rune {
	for i, j := range makeMap([]byte(lettersList)) {
		if reflect.DeepEqual(letter, j) {
			return rune(i)
		}
	}
	return ' '
}

func correctSpaces(res string) string { //turns "      " into " "
	re := regexp.MustCompile(`\s{6}`)
	spaces := re.FindAllStringSubmatch(res, -1)
	for _, space := range spaces {
		res = strings.ReplaceAll(res, space[0], " ")
	}
	return res
}

// needed for when --reverse is not used
func makeAsciiChar(input string, lettersList []byte) {
	var output string
	ascii := makeMap(lettersList)

	for _, w := range strings.Split(input, "\\n") { //splits input text at new line
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
	output = strings.TrimSuffix(output, "\n") // removes extra newline
	if output == "\n" {
		fmt.Println("")
	} else if output == "" {
		fmt.Print("")
	} else {
		fmt.Println(output)
	}
}

// assigning int to each ascii letter starting from 32 which is "space"
func makeMap(content []byte) map[int][]string {
	mp := make(map[int][]string)
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

func check(err error) {
	if err != nil {
		fmt.Println(err)
		return
	}
}
