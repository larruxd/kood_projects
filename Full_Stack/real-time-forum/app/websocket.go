package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"

	//"01.kood.tech/git/MarkusKa/real-time-forum/database"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// var Ch = make(chan int)
var Ac = make(map[int]*websocket.Conn)

type updateMessage struct {
	Type            string `json:"type"`
	Data            string `json:"data"`
	DateSent        string `json:"dateSent"`
	Receiver        string `json:"receiver"`
	Sender          string `json:"sender"`
	ReceiverOffline bool   `json:"receiverOffline"`
}

type updateOnline struct {
	Type string   `json:"type"`
	Data []string `json:"data"`
}

type popChatHistory struct {
	Type string          `json:"type"`
	Data []updateMessage `json:"data"`
}

type updateOffline struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

type messageNotifications struct {
	Type string   `json:"type"`
	Data []string `json:"data"`
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	userId, _ := strconv.Atoi(r.URL.Query().Get("UserID"))
	if Ac[userId] == nil {

		// getLastMessageDatesByUserID(userId)

		upgrader.CheckOrigin = func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			//fmt.Println("origin is: " + origin)
			return origin == "http://localhost:8080" //or just blank return true for all
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("Error upgrading connection:", err)
			return
		}
		log.Println("WS opened")
		go reader(userId, conn)
	}
}

func reader(thisUserID int, conn *websocket.Conn) {

	Ac[thisUserID] = conn

	fillUserField(thisUserID)
	updateOnlineUsers(thisUserID)

	displayInitalNotifications(thisUserID)

	for {
		// Read message from the client
		_, msg, err := conn.ReadMessage()
		if err != nil {
			_, isWebsocketCloseError := err.(*websocket.CloseError)

			// Will also exit when window is closed (websocket: close 1001 (going away))
			// also when closing on JS side "close 1005(no status)" // APPARENTLY NOT ANYMORE
			fmt.Println("Error reading message:", err)
			if isWebsocketCloseError {
				// if websocketCloseError.Code == websocket.CloseGoingAway {
				// 	// go func() {
				// 	// 	Ch <- thisUserID
				// 	// }()
				// }
				// fmt.Println("goroutine break")
				break
			}
		}

		// fmt.Printf("Received: %s\n", msg)

		var response updateMessage
		err = json.Unmarshal(msg, &response)
		if err != nil {
			fmt.Println("Error unmarshaling message:", err)
		}
		switch response.Type {
		case "message":
			updateChat(response, thisUserID)
		case "newUser":
			fillUserField(thisUserID)
		case "remPending":
			removePending(thisUserID, GetUserID(response.Data)) // called to often, simplify
		case "chatOpen":
			fillHistory(thisUserID, GetUserID(response.Receiver), 0, "chatOpen")
			removePending(thisUserID, GetUserID(response.Receiver))
		case "moreMessages":
			thenumb, err := strconv.Atoi(response.Data)
			if err != nil {
				fmt.Println("Error on Atoi conversion:", err)
			}
			fillHistory(thisUserID, GetUserID(response.Receiver), thenumb, "chatMore")
		default:
		}
	}

	updateOfflineUsers(thisUserID)

	delete(Ac, thisUserID)

	fmt.Println("Goroutine closing")
}

func NewUserCreated(thisUserID int) {
	// fmt.Println("New user created", GetUsername(thisUserID), thisUserID)
	var response updateOnline
	response.Type = "newUser"
	broadcastToAll(response)
}

func displayInitalNotifications(thisUserID int) {
	users, err := getChatsWithPendingMessages(thisUserID)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	// fmt.Println(users)
	var response messageNotifications
	response.Data = users
	response.Type = "initalNotifications"
	broadcastMsg(response, thisUserID)
}

func getChatsWithPendingMessages(currentUser int) ([]string, error) {

	rows, err := SqlDb.Query("SELECT DISTINCT user_id FROM chat WHERE receiver_id = ? AND pending = true", currentUser)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var chatIDs []string

	for rows.Next() {
		var userID int
		err := rows.Scan(&userID)
		if err != nil {
			return nil, err
		}
		chatIDs = append(chatIDs, GetUsername(userID))
	}
	return chatIDs, nil
}

func removePending(target int, sender int) {
	_, err := SqlDb.Exec("UPDATE chat SET pending = false WHERE receiver_id = ? AND user_id = ? AND pending = true", target, sender)
	if err != nil {
		fmt.Println("Remove pending err", err)
	}
}

func fillHistory(thisUserID, receiverID, iteration int, responseType string) {
	chatHistory := GetChatHistory("message", "chat", strconv.Itoa(thisUserID), strconv.Itoa(receiverID))

	var response popChatHistory
	response.Type = responseType

	numIterations := len(chatHistory)
	if numIterations > 10 {
		numIterations = 10
	}

	startIdx := len(chatHistory) - (iteration * 10) - 1
	endIdx := startIdx - numIterations + 1

	if startIdx < 0 {
		return
	}
	if endIdx < 0 {
		endIdx = 0
	}

	for i := startIdx; i >= endIdx; i-- {
		var message updateMessage
		message.Type = "message"
		message.Data = chatHistory[i].Message
		message.DateSent = chatHistory[i].DateSent
		message.Receiver = chatHistory[i].Receiver
		message.Sender = chatHistory[i].Sender

		response.Data = append(response.Data, message)
	}

	broadcastMsg(response, thisUserID)
}

func updateOfflineUsers(thisUserID int) {
	var response updateOffline
	response.Type = "updateOfflineUsers"
	response.Data = GetUsername(thisUserID)
	broadcastToAll(response)
}

func updateOnlineUsers(thisUserID int) {
	var onlineUsers []string
	for userID := range Ac {
		onlineUsers = append(onlineUsers, GetUsername(userID))
	}

	var response updateOnline
	response.Type = "updateOnlineUsers"
	response.Data = onlineUsers
	broadcastToAll(response)
}

func getLastMessageDatesByUserID(userid int) []string {
	lastMessageDates := make(map[string]string)

	query := `
        SELECT user_id, receiver_id, MAX(dateSent) AS lastDate
        FROM chat
        WHERE (receiver_id = ? OR user_id = ?)
        GROUP BY user_id, receiver_id
    `
	rows, err := SqlDb.Query(query, userid, userid)
	if err != nil {
		fmt.Println("Query error", err)
	}
	defer rows.Close()

	for rows.Next() {
		var user_id int
		var receiver_id int
		var lastDate string
		err := rows.Scan(&user_id, &receiver_id, &lastDate)
		if err != nil {
			fmt.Println("Scan error", err)
		}

		var key string
		if user_id == userid {
			key = GetUsername(receiver_id)
		} else {
			key = GetUsername(user_id)
		}

		lastMessageDates[key] = lastDate
	}
	keys := make([]string, 0, len(lastMessageDates))
	for key := range lastMessageDates {
		keys = append(keys, key)
	}

	sort.Slice(keys, func(i, j int) bool {
		return lastMessageDates[keys[i]] > lastMessageDates[keys[j]]
	})

	return keys
}

func sortUserField(thisUserID int) []string {
	var users = GetAllOfType("username", "users")

	sort.Slice(users, func(i, j int) bool {
		return strings.ToLower(users[i]) < strings.ToLower(users[j])
	})

	lastMessageKeys := getLastMessageDatesByUserID(thisUserID)
	var combinedUsers []string
	combinedUsers = append(combinedUsers, lastMessageKeys...)

	for _, user := range users {
		if !contains(combinedUsers, user) {
			combinedUsers = append(combinedUsers, user)
		}
	}
	return combinedUsers
}

func fillUserField(thisUserID int) {
	combinedUsers := sortUserField(thisUserID)
	var response updateOnline
	response.Type = "fillUserField"
	response.Data = combinedUsers
	broadcastMsg(response, thisUserID)
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func updateChat(response updateMessage, thisUserID int) {
	response.Sender = GetUsername(thisUserID)

	broadcastMsg(response, thisUserID)
	broadcastMsg(response, GetUserID(response.Receiver))

	saveChatHistory(response, thisUserID)
}

func saveChatHistory(response updateMessage, thisUserID int) {
	sqlScript := `
	INSERT INTO chat (
		user_id,
		receiver_id,
		dateSent,
		message,
		pending
	)
	VALUES (?, ?, ?, ?, ?)`
	_, err := SqlDb.Exec(
		sqlScript,
		thisUserID,
		GetUserID(response.Receiver),
		response.DateSent,
		response.Data,
		response.ReceiverOffline,
	)
	if err != nil {
		fmt.Println("Error saving message to DB:", err)
	}
}

func broadcastToAll(response interface{}) {
	for i := range Ac {
		broadcastMsg(response, i)
	}
}

func broadcastMsg(response interface{}, userID int) {
	if senderConn, ok := Ac[userID]; ok {
		err := senderConn.WriteJSON(response)
		if err != nil {
			fmt.Println("Error broadcasting message to sender:", err)
		}
	} else {
		fmt.Println("WebSocket connection not found for user:", GetUsername(userID))
	}
}

