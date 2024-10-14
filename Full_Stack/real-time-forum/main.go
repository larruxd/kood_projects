package main

import (
	"01.kood.tech/git/MarkusKa/real-time-forum/app"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	app.DatabaseAction("reset")
	app.LaunchServer()
}
