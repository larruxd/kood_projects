package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Println("Usage: injector <bin1> <bin2>")
		os.Exit(1)
	}

	bin1path := os.Args[1]
	bin2path := os.Args[2]

	_, err := os.Stat(bin1path)
	if err != nil {
		fmt.Println("Error: ", err)
		os.Exit(1)
	}

	_, err = os.Stat(bin2path)
	if err != nil {
		fmt.Println("Error: ", err)
		os.Exit(1)
	}

	createWrapper(bin1path, bin2path)
}

func createWrapper(bin1 string, bin2 string) {
	wrapper := fmt.Sprintf(`
package main
import (
	_ "embed"
	"log"
	"github.com/amenzhinsky/go-memexec"
)
//go:embed %s
var bin1 []byte
//go:embed %s
var bin2 []byte
func main() {
	bins := [][]byte{bin1, bin2}
	for _, bin := range bins {
		exe, err := memexec.New(bin)
		if err != nil {
			log.Fatal(err)
		}
		defer exe.Close()
		cmd := exe.Command()
		cmd.Stdout = log.Writer()
		cmd.Stderr = log.Writer()

		err = cmd.Run()
		if err != nil {
			log.Fatal(err)
		}
	}
}`, bin1, bin2)

	filename := filepath.Base(bin1)
	compile(wrapper, filename)
}

func compile(wrapper string, bin1Filename string) {
	err := os.WriteFile("wrapper.go", []byte(wrapper), 0644)
	if err != nil {
		fmt.Println("Error: ", err)
		os.Exit(1)
	}

	cmd := exec.Command("go", "build", "-o", bin1Filename, "wrapper.go")
	err = cmd.Run()
	if err != nil {
		fmt.Println("Error: ", err)
		os.Exit(1)
	}

	os.Remove("wrapper.go")
}
