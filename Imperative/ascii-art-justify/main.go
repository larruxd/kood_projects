package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	if len(os.Args) > 4 || len(os.Args) < 2 {
		printErr()
	}
	option := ""
	str := ""
	banner := "standard" //default
	flagAndOption := ""
	argsCount := len(os.Args)
	bannerPath := "banners/" + banner + ".txt"
	lettersList, err := os.ReadFile(bannerPath)
	check(err)

	if argsCount == 2 { // only print ascii art of first arg
		str := os.Args[1]
		IsValidString(str)
		makeAsciiChar(str, lettersList, option)

	} else if argsCount == 3 { // alignment + string
		flagAndOption = os.Args[1]
		str = os.Args[2]
		option = isValidFlagAndOption(flagAndOption)
		IsValidString(str)
		makeAsciiChar(str, lettersList, option)

	} else if argsCount == 4 { // alignment + string + banner
		flagAndOption = os.Args[1]
		str = os.Args[2]
		banner = strings.ToLower(os.Args[3])
		option = isValidFlagAndOption(flagAndOption)
		IsValidString(str)
		isValidBanner(banner)
		bannerPath = "banners/" + banner + ".txt"
		lettersList, err := os.ReadFile(bannerPath)
		check(err)
		makeAsciiChar(str, lettersList, option)

	} else {
		printErr()
	}
}

func printErr() {
	fmt.Println()
	fmt.Println("Usage: go run . [OPTION] [STRING] [BANNER]")
	fmt.Printf("\n")
	fmt.Println("Example: go run . --align=right something standard")
	os.Exit(0)
}
