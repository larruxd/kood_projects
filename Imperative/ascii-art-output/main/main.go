package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"os"
)

func Convert(a string, b [][]string) [][]string {
	conv := [][]string{}
	for _, letter := range a {
		if letter == 32 {
			conv = append(conv, b[0])
			continue
		} else if letter == '\n' {
			q := []string{"\n"}
			conv = append(conv, q)
			continue
		}
		conv = append(conv, b[letter-32])
	}
	return conv
}

func ReadFiles(a string) [][]string {
	file, err := os.Open(a)
	if err != nil {
		Err()
		log.Fatal(err)
	}
	defer file.Close()
	letters := [][]string{}
	chars := []string{}
	scan := bufio.NewScanner(file) // Scans the file that we opened
	k := 0                         // Line counter for 8 lines
	y := 0
	for scan.Scan() {
		if y == 0 {
			y++
			continue
		}
		line := scan.Text() // Turns the scanned text into a string
		if k == 8 {
			chars = append(chars, line)
			letters = append(letters, chars)
			k = 0
			chars = nil
			continue
		}
		chars = append(chars, line) // Add the line to the slice
		k++
	}
	return letters
}

func FixArgs(h string) string {
	runeH := []rune(h)
	fixed := ""
	for f := 0; f < len(runeH); f++ {
		if f < len(runeH)-1 && (runeH[f] == 92 && runeH[f+1] == 'n') {
			fixed += "\n"
			runeH = append(runeH[:f], runeH[f+1:]...)
		} else {
			fixed += string(runeH[f])
		}
	}
	return fixed
}

func Display(converted [][]string, file *os.File) {
	line := 0
	newLine := false
	p := 0
	w := 0
	length := len(converted)
	onlyLine := false
	end := false
	for line <= 8 {
		if end && line == 8 {
			if len(converted) > 1 {
				file.Write([]byte("\n"))
				fmt.Printf("\n")
			}
			break
		}
		if onlyLine {
			file.Write([]byte("\n"))
			fmt.Printf("\n")
			line = 8
			onlyLine = false
			continue
		}
		if line == 8 && newLine && !onlyLine { // If it finishes a section of letters before a newline
			length = len(converted)
			line = 0
			newLine = false
			p = w
			continue
		} else if line == 8 { // Once everything is finished
			break
		}
		for letter := p; letter < length; letter++ {
			if converted[letter][line] == "\n" {
				if letter == len(converted)-1 {
					end = true
				}
				if letter == p {
					length = letter
					w = letter + 1
					newLine = true
					line = 7
					if !end {
						onlyLine = true
					}
					break
				} else if !newLine {
					length = letter
					w = letter + 1
					newLine = true
					break
				}
			}
			file.Write([]byte(converted[letter][line]))
			fmt.Printf(converted[letter][line])
		}
		if !onlyLine {
			file.Write([]byte("\n"))
			fmt.Printf("\n")
			line++
		}
	}
}

func Err() {
	fmt.Println("Usage: go run . [OPTION] [STRING] [BANNER]")
	fmt.Printf("\n")
	fmt.Println("Example: go run . --output=<fileName.txt> something standard")
}

var (
	outputFlag = flag.String("output", "nil", "file output")
)

func main() {
	if len(os.Args) < 2 || len(os.Args[1]) == 0 || len(os.Args) > 4 {
		Err()
	} else {
		flag.Parse()
		a := flag.NFlag()          // We get number of flags defined in command line to find text to be converted
		fileName := "standard.txt" // Default banner is standard.txt
		if len(os.Args)-1-a == 2 { // If there are 2 arguments after flags, it will take the last argument as banner
			fileName = os.Args[len(os.Args)-1] + ".txt"
		}
		letters := ReadFiles(fileName)      // Reads the letters from the text file and puts them in a slice of slices
		args := FixArgs(os.Args[1+a])       // Fixes newlines, also finds the convertable text based on the amount of flags
		converted := Convert(args, letters) // Converts the args into slices of lines from ascii-art file
		if *outputFlag != "nil" {           // If a file output is specified, it will create and write into the file
			f, err := os.Create(*outputFlag)
			if err != nil {
				panic(err)
			}
			defer f.Close()
			Display(converted, f)
		} else { // If an output flag is not specified, it will simply print the ascii-art
			var f *os.File = nil
			Display(converted, f)
		}
	}
}
