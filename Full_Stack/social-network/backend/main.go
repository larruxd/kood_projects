package main

import (
	"fmt"
	"os"
	"social-network/internal/chat"
	"social-network/internal/groups"
	"social-network/internal/logger"
	"social-network/internal/server"
	"social-network/internal/users"
	"social-network/internal/websocket"
)

func initServices() {
	chatService := &chat.Service{}
	userService := &users.Service{}
	eventService := &groups.Service{}
	websocket.Initialize(userService, chatService, eventService)
}

func main() {
	fmt.Println("ran")
	initServices()

	if err := server.ServerInit(); err != nil {
		logger.ErrorLogger.Println("Server Initialization error:", err)
		fmt.Println("Server Initialization error:", err)
		os.Exit(1)
	}
}
