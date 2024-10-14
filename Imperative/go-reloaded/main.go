package main

import (
	"os"
)

// divides string to substrings
func process(str string) string {

	tokens := tokenize(str)
	tokens = runOperations(tokens)

	return mergeTokens(tokens)
}

// function for reading and writing
func goReloaded(input, output string) {

	text := readFile(input)
	writeFile(output, process(text))
}

// read files
func readFile(path string) string {

	bytes, err := os.ReadFile(path)
	if err != nil {
		panic("failed to read file")
	}
	return string(bytes)

}

// write files
func writeFile(path string, text string) {

	bytes := []byte(text)
	err := os.WriteFile(path, bytes, 0775)
	if err != nil {
		panic("failed writing file")
	}
}

func main() {

	if len(os.Args) == 3 {
		input := (os.Args[1])
		output := (os.Args[2])
		goReloaded(input, output)
	} else {
		panic("Something went wrong")
	}
}
