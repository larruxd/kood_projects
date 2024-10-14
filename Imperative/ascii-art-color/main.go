package main

import (
	"fmt"
	"os"
	"strings"
)

// TODO : find out
func main() {
	if len(os.Args) > 4 || len(os.Args) < 2 {
		printErr()
	}
	flag := "--color"
	str := ""
	color := ""
	charTBC := "" // characters to be colored
	var flagAndColor []string
	argsCount := len(os.Args)
	bannerPath := "standard.txt"
	lettersList, err := os.ReadFile(bannerPath)
	check(err)

	if argsCount == 2 { // only print ascii art of first arg
		str := os.Args[1]
		if strings.Split(str, "=")[0] == flag {
			printErr()
		}
		IsValidString(str)
		makeAsciiChar(str, lettersList, charTBC, color)
	} else if argsCount == 3 { // color + string
		flagAndColor = strings.Split(os.Args[1], "=")
		str = os.Args[2]
		if len(flagAndColor) == 2 && flagAndColor[0] == flag {
			color := flagAndColor[1]
			isValidColor(color)
			IsValidString(str)
			makeAsciiChar(str, lettersList, charTBC, color)

		} else {
			printErr()
		}
	} else if argsCount == 4 { // color + letters-to-be-colored + string
		flagAndColor = strings.Split(os.Args[1], "=")
		charTBC := os.Args[2]
		str = os.Args[3]

		if len(flagAndColor) == 2 && flagAndColor[0] == flag && len(charTBC) <= len(str) {
			if !(strings.Contains(str, charTBC)) {
				printErr()
			}
			color := strings.Split(os.Args[1], "=")[1]
			isValidColor(color)
			IsValidString(charTBC)
			IsValidString(str)
			makeAsciiChar(str, lettersList, charTBC, color)

		} else {
			printErr()
		}
	} else {
		printErr()
	}
}

func printErr() {
	fmt.Println("Usage: go run . [OPTION] [STRING]")
	fmt.Printf("\n")
	fmt.Println("EX: go run . --color=<color> <letters to be colored> 'something'")
	os.Exit(0)
}
