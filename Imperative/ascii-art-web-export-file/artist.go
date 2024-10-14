package main

import (
	"fmt"
	"os"
	"strings"
)

func makeArt(input string, style string) string { //is the project manager, requesting work and providing output to func main
	var inpt string
	style = "banners/" + style + ".txt"
	//inpt = strings.ReplaceAll(input, "\n", "\\n")
	inpt = input
	inpt = crlf(inpt)
	inptString := strings.Split(inpt, ";;;")
	var SlicedChars []int
	var LenOfArr int
	arr := makeArray(0)
	Arrayline := 0
	LineNR := len(inptString) - 1
	for i := 0; i < len(inptString); i++ {
		SlicedChars = asciiConv(inptString[i])
		LenOfArr = len(SlicedChars)
		for j := 0; j < LenOfArr; j++ {
			arr = fillArr(arr, asciiArt(SlicedChars[j], style), Arrayline)
		}
		if i < LineNR {
			if len(inptString[i+1]) == 0 { //checks if there are double newline \\n's, in which case only inputs one new line(as requested in the task)
				arr = append(arr, []string{})
				Arrayline = Arrayline + 1
			} else {
				arr = addArray(arr)
				Arrayline = Arrayline + 9
			}
		}
	}
	output := printArr(arr, Arrayline)
	return output
}

func asciiConv(input string) []int { //returns ascii characters's numerical position values
	SlicedChars := []rune(input)
	output := []int{}
	for i := 0; i < len(SlicedChars); i++ {
		output = append(output, int(SlicedChars[i]))
	}
	return output
}

func makeArray(input int) [][]string { //makes a banner 2d slice
	result := [][]string{}
	if input == 0 {
		for i := 0; i < 9; i++ {
			result = append(result, []string{})
		}
	}
	return result
}

func addArray(input [][]string) [][]string { //adds a new row to banner
	for i := 0; i < 9; i++ {
		input = append(input, []string{})
	}
	return input
}

func fillArr(input [][]string, text []string, line int) [][]string { //fills banner 2d slice with ascii art
	result := input
	for j := 0; j < 9; j++ {
		result[j+line] = append(result[j+line], text[j])
	}
	return result
}

func printArr(input [][]string, lines int) string { // converts banner data to a printable string
	array := []string{}
	lines = lines + 9
	for i := 0; i < lines; i++ {
		for j := 0; j < len(input[i]); j++ {
			array = append(array, input[i][j])
		}
		array = append(array, "\n")
	}

	output := strings.Join(array, "")
	return output
}

func asciiArt(input int, style string) []string { //returns the corresponding artsy ascii character to the ascii character input
	inpt := int(input)
	file, err := os.ReadFile(style)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	temp := strings.Split(string(file), "\n")
	arv := []string{}

	inpt = 9 * (inpt - 32)
	for i := 0; i < 9; i++ {
		arv = append(arv, temp[i+inpt])
	}
	return arv
}

func invalidChars(str string) bool {
	for _, v := range str {
		if v < 32 || v > 126 {
			if v == 13 || v == 10 {
				continue
			}
			return false
		}
	}
	return true
}

func crlf(input string) string { //replaces LF and CR newline characters with \\n
	SlicedChars := []rune(input)
	temp := []string{}
	output := ""
	for i := 0; i < len(SlicedChars); i++ {
		if SlicedChars[i] == 13 || SlicedChars[i] == 10 {
			temp = append(temp, string(59))
			temp = append(temp, string(59))
			temp = append(temp, string(59))
		} else {
			temp = append(temp, string(SlicedChars[i]))
		}
	}
	output = strings.Join(temp, "")
	return output
}
