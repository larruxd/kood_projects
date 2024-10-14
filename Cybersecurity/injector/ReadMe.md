# INJECTOR

## [Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/injector)

## [Audit](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/injector/audit)

## [Video](https://www.youtube.com/watch?v=FsxgQtywdVE)

## Description

Injector is a Go program that merges two binary Go executables into one.

- Is the student able to explain clearly how his program works?

The program works by taking two go binary executable's paths from arguments then creates a wrapper go program that embeds the two files and uses go-memexec package to load them into memory and execute them. It then compiles the new program into binary executable.

- Is the student able to explain clearly how we can merge 2 programs?

The Two programs are merged by wrapping whem in a new binary executable that takes the first two binaries and executes them from memory.

## Requirements

- Golang

## Instructions

### Install

Clone repo:

```sh
git clone https://01.kood.tech/git/laurilaretei/injector
```

For dependencies:

```sh
go mod download
```

### Usage

```sh
go run . <bin1> <bin2>
```

**But first!**

**Create 2 binaries:**

Easy way:

```sh
sh createBin.sh
```

To create your own binaries make a `.go` file and put whatever inside.

Example:

```go
package main

import "fmt"

func main() {
	fmt.Println("01")
}
```

Compile:

```sh
go build -o <bin_filename> <go_file>
```

Binary outputs:

```sh
$ ./bin1.bin
01
$ ./hello.bin
Hello, World!
```

To combine 2 binaries run:

```sh
go run . bin.bin hello.bin
```

Run first binary again:

```sh
$ bin.bin
01
Hello, world!
```

## Author

**[laurilaretei](https://01.kood.tech/git/laurilaretei)**
