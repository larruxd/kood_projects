package main

import (
	"fmt"
	"os"
	"strings"
)

var (
	Reset  = "\033[0m"
	Black  = "\u001b[38;5;0m"
	Red    = "\u001b[38;5;1m"
	Green  = "\u001b[38;5;2m"
	Yellow = "\u001b[38;5;226m"
	Blue   = "\u001b[38;5;4m"
	Purple = "\u001b[38;5;5m"
	Cyan   = "\u001b[38;5;14m"
	Orange = "\u001b[38;5;202m"
)

// array for colors
var slice = [8]string{"red", "green", "yellow", "blue", "purple", "cyan", "black", "orange"}

func makeAsciiChar(input string, lettersList []byte, charTBC string, color string) {

	var output string
	color = assignColor(color)
	ascii := makeMap(lettersList)
	inputSlice := strings.Split(input, "\\n") //splits input text at new line

	if charTBC != "" { // if characters-to-be-colored is not empty
		for _, x := range inputSlice {
			if x == "" {
				output += "\n"
				continue
			}
			charTBC2 := "ü" + charTBC + "ü" // add random invalid characters to either side for spliting
			for i := 0; i < 8; i++ {        // for 8 lines
				var line string
				var inputSlice2 []string
				x = strings.Replace(x, charTBC, charTBC2, -1) // replace all instances of charTBC with the version with characters on either side
				x = strings.Replace(x, "üü", "ü", -1)         // remove double character
				inputSlice2 = strings.Split(x, "ü")           // splits string at ü, makes []string
				//fmt.Println(inputSlice2)
				for _, y := range inputSlice2 { // repeats for every string in []string
					// if string matches charTBC adds color to line
					if y == charTBC {
						for _, z := range y {
							line = line + color + string(ascii[int(z)][i]) + Reset
						}
					} else {
						for _, z := range y {
							line = line + string(ascii[int(z)][i])
						}
					}
				}
				output += line + "\n"
				line = ""
			}
		}

	} else { // if charTBC is not specified
		for _, x := range inputSlice {
			if x == "" {
				output += "\n"
				continue
			}
			for i := 0; i < 8; i++ {
				var line string
				for _, z := range x {
					if color == "" {
						line = line + string(ascii[int(z)][i])
					} else {
						line = line + color + string(ascii[int(z)][i]) + Reset
					}

				}
				output += line + "\n"
				line = ""
			}
		}
	}

	output = strings.TrimSuffix(output, "\n")
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
	i := 32
	slice := strings.Split(string(content), "\n")
	//x := 32
	for _, r := range slice { // splits string at new line
		if r == "" { // if string is empty moves to next letter
			i++
		} else {
			mp[i] = append(mp[i], r)
		}
	}
	return mp
}

// validates characters
func IsValidString(s string) {
	for _, r := range s {
		if r < 32 || r > 126 {
			fmt.Println("Invalid character(s) in input")
			fmt.Println("Only characters 32-126 are allowed")
			os.Exit(0)
		}
	}
}

// error check
func check(err error) {
	if err != nil {
		fmt.Println(err)
		return
	}
}

// Validated colors + prints colors if invalid
func isValidColor(color string) {
	color = strings.ToLower(color)
	valid := false
	for _, r := range slice {
		if r == color {
			valid = true
		}
	}
	if !valid {
		fmt.Println("Invalid color.")
		fmt.Println("Valid colors are:")
		fmt.Println(Black + "		Black" + Reset)
		fmt.Println(Red + "		Red" + Reset)
		fmt.Println(Green + "		Green" + Reset)
		fmt.Println(Yellow + "		Yellow" + Reset)
		fmt.Println(Blue + "		Blue" + Reset)
		fmt.Println(Purple + "		Purple" + Reset)
		fmt.Println(Cyan + "		Cyan" + Reset)
		fmt.Println(Orange + "		Orange" + Reset)
		os.Exit(0)
	}
}

func assignColor(color string) string {
	color = strings.ToLower(color)
	if color == "black" {
		color = Black
	}
	if color == "red" {
		color = Red
	}
	if color == "green" {
		color = Green
	}
	if color == "yellow" {
		color = Yellow
	}
	if color == "blue" {
		color = Blue
	}
	if color == "purple" {
		color = Purple
	}
	if color == "cyan" {
		color = Cyan
	}
	if color == "orange" {
		color = Orange
	}
	return color
}
