package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	inputLen := len(os.Args)
	//flag := "--reverse"
	if inputLen < 2 || inputLen > 2 {
		usage()
		return
	}
	flag := "--reverse"
	arg := os.Args[1]
	bannerPath := "standard.txt"
	lettersList, err := os.ReadFile(bannerPath)
	check(err)
	if strings.Split(arg, "=")[0] == flag { // if finds flag sends file to reverseAscii, prints result
		fileName := (strings.Split(arg, "=")[1])
		result := reverseAscii(fileName, bannerPath, lettersList)
		fmt.Println(result)

	} else { // if no flag turns input string into ascii art and prints it to CLI
		if !(IsValid(arg)) {
			fmt.Println("Invalid characters in string.")
			return
		}
		makeAsciiChar(arg, lettersList)
	}
}

func usage() {
	fmt.Println("Usage: go run . [OPTION]")
	fmt.Printf("\n")
	fmt.Println("Example: go run . --reverse=<fileName>")
}
