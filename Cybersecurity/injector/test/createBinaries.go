package main

import (
	"os"
	"os/exec"
)

func main() {
	file1 := `
	package main
	import "fmt"
	func main() {
		fmt.Println("01")
	}
	`
	file2 := `
	package main
	import "fmt"
	func main() {
		fmt.Println("hello world")
	}
	`

	err := createFile("file1.go", file1)
	if err != nil {
		panic(err)
	}
	err = compileFile("file1.go", "bin1.bin")
	if err != nil {
		panic(err)
	}
	err = deleteFile("file1.go")
	if err != nil {
		panic(err)
	}

	err = createFile("file2.go", file2)
	if err != nil {
		panic(err)
	}
	err = compileFile("file2.go", "bin2.bin")
	if err != nil {
		panic(err)
	}
	err = deleteFile("file2.go")
	if err != nil {
		panic(err)
	}

}

func createFile(fileName, fileContent string) error {
	// Create a file
	f, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer f.Close()

	// Write the content to the file
	_, err = f.WriteString(fileContent)
	if err != nil {
		return err
	}

	return nil
}

func compileFile(fileName string, binName string) error {
	// Compile the file
	cmd := exec.Command("go", "build", "-o", binName, fileName)
	err := cmd.Run()
	if err != nil {
		return err
	}

	return nil
}

func deleteFile(fileName string) error {
	// Delete the file
	err := os.Remove(fileName)
	if err != nil {
		return err
	}

	return nil
}
