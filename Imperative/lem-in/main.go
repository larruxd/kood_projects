package main

import (
	"fmt"
	"os"
	"time"
)

func main() {
	var data Data
	timeStart := time.Now()
	// checking if file is provided
	if len(os.Args) < 2 {
		fmt.Println("ERROR: No file path provided")
		return
	}
	if len(os.Args) > 2 {
		fmt.Println("Error: Too many arguments")
		return
	}

	filePath := os.Args[1]
	data = readFile(filePath)
	allPaths := paths(&data)
	uniquePaths := uniquePaths(&allPaths)
	requiredPaths := requiredPaths(&uniquePaths, int(data.Ants))
	printFileContents(filePath)
	moveAnts(&data, requiredPaths)

	timeElapsed := time.Since(timeStart)
	fmt.Printf("Time elapsed: %f\n", timeElapsed.Seconds())
}
