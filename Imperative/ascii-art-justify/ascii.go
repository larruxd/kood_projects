package main

import (
	"fmt"
	"os"
	"strings"
	"syscall"
	"unsafe"
)

func makeAsciiChar(input string, lettersList []byte, option string) {
	var output string
	spaces := ""
	var spaceCount uint
	ascii := makeMap(lettersList)
	width := getWidth()

	for _, w := range strings.Split(input, "\\n") { //splits input text at new line
		if w == "" { // makes new line at empty spot in case of 2 or more \n
			output += "\n"
			continue
		}
		for i := 0; i < 8; i++ { // 8 lines
			var line string
			for _, l := range w { // makes each line
				if l == 32 {
					line = line + string(ascii[int(l)][i]) + "x" // if character is space add random letter
				} else {
					line = line + string(ascii[int(l)][i])
				}
			}
			line = "x" + line
			if uint(len(strings.ReplaceAll(line, "x", ""))) > width {
				fmt.Println("Text does not fit terminal.\nTry something shorter.")
				os.Exit(0)
			}
			if option == "left" || option == "justify" {
				output += line + "\n"
				line = ""
			}
			if option == "right" {
				line = strings.ReplaceAll(line, "x", "")
				spaceCount = width - uint(len(line))
				var j uint
				for j = 0; j < spaceCount; j++ {
					spaces += " "
				}
				output += spaces + line + "\n"
				line = ""
				spaces = ""
			}
			if option == "center" {
				line = strings.ReplaceAll(line, "x", "")
				spaceCount = (width - uint(len(line))) / 2
				var j uint
				for j = 0; j < spaceCount; j++ {
					spaces += " "
				}
				output += spaces + line + "\n"
				line = ""
				spaces = ""
			}

		}
		if option == "justify" {
			slice := strings.Split(output, "\n")
			wordCount := len(strings.Split(slice[0], "x")) - 2
			if wordCount == 0 {
				fmt.Println("Need 2 or more words to use option 'justify'")
				printErr()
				os.Exit(0)
			}
			spaceCount = (width - uint(len(slice[0]))) / uint(wordCount)
			var j uint
			for j = 0; j < spaceCount; j++ {
				spaces += " "
			}
			//output = strings.ReplaceAll(output, "       x", "x")
			output = strings.ReplaceAll(output, "       x", "        "+spaces)
		}

	}
	/* for r := range strings.Split(output, "\n") {
		if uint(len(strings.Split(output, "\n")[r])) > width {
			fmt.Println("Text does not fit terminal.\nTry something shorter.")
			os.Exit(0)
		}
	} */
	output = strings.ReplaceAll(output, "x", "")
	output = strings.TrimSuffix(output, "\n") // removes extra newline
	if output == "\n" {
		fmt.Println("")
	} else if output == "" {
		fmt.Print("")
	} else {
		fmt.Println(output)
	}

}

// assigning int to each ascii letter starting from 32 to 126
func makeMap(lettersList []byte) map[int][]string {
	mp := make(map[int][]string)
	i := 31
	slice := strings.Split(string(lettersList), "\n")
	for _, r := range slice { // splits string at new line
		if r == "" { // if string is empty moves to next letter
			i++
		} else {
			mp[i] = append(mp[i], r)
		}
	}
	return mp
}

// error check
func check(err error) {
	if err != nil {
		fmt.Println(err)
		return
	}
}

// checks for invalid characters in string
func IsValidString(s string) {
	for _, r := range s {
		if r < 32 || r > 126 {
			fmt.Println("Invalid character(s) in input")
			fmt.Println("Only characters 32-126 are allowed")
			os.Exit(0)
		}
	}
}

// checks if banner is valid
func isValidBanner(banner string) {
	banner = strings.ToLower(banner)
	if banner != "standard" && banner != "shadow" && banner != "thinkertoy" {
		fmt.Println("Invalid banner")
		fmt.Println("Options are:")
		fmt.Println("		Standard")
		fmt.Println("		Shadow")
		fmt.Println("		Thinkertoy")
		os.Exit(0)
	}
}

// validates flag and option, returns option if its valid
func isValidFlagAndOption(flagAndOption string) string {
	option := ""
	flag := "--align"
	slice := strings.Split(flagAndOption, "=")
	valid := []string{"center", "left", "right", "justify"}

	if len(slice) != 2 && slice[0] != flag {
		printErr()
	}
	if slice[1] == "" {
		fmt.Println("No option after flag.")
		printOptions()
	}
	option = strings.ToLower(slice[1])
	for _, j := range valid {
		if option == j {
			return option
		}
	}
	printOptions()
	return ""
}

func printOptions() {
	fmt.Println("Valid options are:")
	fmt.Println("		center")
	fmt.Println("		left")
	fmt.Println("		right")
	fmt.Println("		justify")
	printErr()
}

type winsize struct {
	Row    uint16
	Col    uint16
	Xpixel uint16
	Ypixel uint16
}

func getWidth() uint {
	ws := &winsize{}
	retCode, _, errno := syscall.Syscall(syscall.SYS_IOCTL,
		uintptr(syscall.Stdin),
		uintptr(syscall.TIOCGWINSZ),
		uintptr(unsafe.Pointer(ws)))

	if int(retCode) == -1 {
		panic(errno)
	}
	return uint(ws.Col)
}
