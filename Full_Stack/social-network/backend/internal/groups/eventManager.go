package groups

import (
	"encoding/json"
	"errors"
	"net/http"
	"social-network/internal/config"
	"social-network/internal/logger"
	"social-network/internal/sqlQueries"
	"social-network/internal/structs"
	"social-network/internal/websocket"
	"strings"
	"time"
)

func CreateEvent(w http.ResponseWriter, r *http.Request) {
	var Event structs.GroupEvent

	if err := json.NewDecoder(r.Body).Decode(&Event); err != nil {
		logger.ErrorLogger.Println("Error decoding new event request: ", err)
		http.Error(w, "error decoding: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Get creator ID from context and add to Event struct
	val := r.Context().Value("userID")
	creatorId, ok := val.(int)
	if !ok || creatorId == 0 {
		logger.ErrorLogger.Println("Error creating new event: invalid user ID in context")
		http.Error(w, "Invalid user ID in context", http.StatusInternalServerError)
		return
	}
	Event.CreatorId = creatorId

	if err := validateEvent(Event); err != nil {
		logger.ErrorLogger.Println("Error validating new event request", err)
		http.Error(w, "error validating new event request: "+err.Error(), http.StatusBadRequest)
		return
	}

	eventID, err := sqlQueries.AddNewEvent(Event)
	if err != nil {
		logger.ErrorLogger.Println("Error adding new event to db: ", err)
		http.Error(w, "Error adding new event to db", http.StatusInternalServerError)
		return
	}
	Event.Id = eventID
	//--------------------add to event_receipt table--------------------
	allGroupMembers, err := sqlQueries.GetGroupMembers(Event.GroupId)
	if err != nil {
		logger.ErrorLogger.Println("Error geting group members from db: ", err)
		return
	}

	var recipientMembers []int

	for _, member := range allGroupMembers.Members {
		if member.UserId == Event.CreatorId {
			continue
		} else if member.Status < 0 {
			continue
		}
		recipientMembers = append(recipientMembers, member.UserId)
	}

	err = sqlQueries.AddEventReceipts(Event.Id, recipientMembers)
	if err != nil {
		logger.ErrorLogger.Println("Error adding event_receipts to db: ", err)
		return
	}
	//--------------------add to event_receipt table--------------------
	go attemptToSendEventNotif(Event)

	response := structs.GroupEventResponse{
		Status: "success",
		Event:  Event,
	}

	// Set the header and encode the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func validateEvent(Event structs.GroupEvent) error {
	// Check if title or description is not empty
	if strings.TrimSpace(Event.Title) == "" || strings.TrimSpace(Event.Description) == "" {
		return errors.New("error creating new event: missing title or description")
	}

	// Check if event start time is valid and in the future
	eventStartTime, err := time.Parse(time.RFC3339, Event.StartTime)
	if err != nil {
		return errors.New("error creating new event: invalid starttime timestamp")
	}
	if !eventStartTime.After(time.Now()) {
		return errors.New("error creating new event: start time is not in the future")
	}

	// Check if created at timestamp is valid
	if _, err := time.Parse(time.RFC3339, Event.CreatedAt); err != nil {
		return errors.New("error creating new event: invalid created at timestamp")
	}

	// Confirm creator is member of the group
	creatorIsMember := sqlQueries.GroupMember(Event.CreatorId, Event.GroupId)
	if !creatorIsMember {
		return errors.New("error creating new event: event creator is not member of the group")
	}

	return nil
}

func attemptToSendEventNotif(Event structs.GroupEvent) {
	// Safety net to recover from any panic within the goroutine
	defer func() {
		if r := recover(); r != nil {
			logger.ErrorLogger.Printf("Recovered in attemptToSendEvent: %v\n", r)
		}
	}()

	var targetIDs []int

	// Get all group members to whom to send the Event
	allGroupMembers, err := sqlQueries.GetGroupMembers(Event.GroupId)
	if err != nil {
		logger.ErrorLogger.Printf("Error getting group members for group %d: %v\n", Event.GroupId, err)
		return
	}

	for _, member := range allGroupMembers.Members {
		if member.UserId != Event.CreatorId &&
			member.Status >= 0 &&
			websocket.IsClientOnline(member.UserId) {
			targetIDs = append(targetIDs, member.UserId)
		}
	}

	// Add group name to Event
	groupName, err := sqlQueries.GetGroupName(Event.GroupId)
	if err != nil {
		logger.ErrorLogger.Printf("Error getting group name for group %d: %v\n", Event.GroupId, err)
		return
	}

	// Swap to new struct to fit group title
	eventWithTitles := structs.GroupEventWithTitles{
		Id:          Event.Id,
		GroupId:     Event.GroupId,
		CreatorId:   Event.CreatorId,
		Title:       Event.Title,
		StartTime:   Event.StartTime,
		Description: Event.Description,
		CreatedAt:   Event.CreatedAt,
		GroupTitle:  groupName,
	}

	envelopeBytes, err := websocket.ComposeWSEnvelopeMsg(config.WsMsgTypes.NEW_GROUP_EVENT, []structs.GroupEventWithTitles{eventWithTitles})
	if err != nil {
		for _, targetID := range targetIDs {
			websocket.SendErrorMessage(targetID, "Error marshaling Event notif")
		}
		logger.ErrorLogger.Printf("Error composing Event notif: %v\n", err)
		return
	}

	// Send the envelope to the recipient(s) using WebSocket
	for _, targetID := range targetIDs {
		err = websocket.SendMessageToUser(targetID, envelopeBytes)
		if err != nil {
			logger.ErrorLogger.Printf("Error sending message to user %d: %v\n", targetID, err)
		}
	}
}

type Service struct {
}

func (s *Service) SendPendingEventReceipts(userID int) {
	events, err := sqlQueries.GetPendingEventReceipts(userID)
	if err != nil {
		logger.ErrorLogger.Println("Error getting pending events for user ", userID, err)
		websocket.SendErrorMessage(userID, "Error getting pending events")
		return
	}
	if len(events) == 0 {
		return
	}

	envelopeBytes, err := websocket.ComposeWSEnvelopeMsg(config.WsMsgTypes.NEW_GROUP_EVENT, events)
	if err != nil {
		websocket.SendErrorMessage(userID, "Error marshaling events")
		logger.ErrorLogger.Printf("Error composing events: %v\n", err)
		return
	}

	// Send the envelope to the recipient using WebSocket
	err = websocket.SendMessageToUser(userID, envelopeBytes)
	if err != nil {
		logger.ErrorLogger.Printf("Error sending message to user %d: %v\n", userID, err)
	}
}

func (s *Service) ConfirmEventNotiDelivery(userID int, eventIDs []int) error {
	err := sqlQueries.RemoveEventReceipts(userID, eventIDs)
	if err != nil {
		logger.ErrorLogger.Printf("Error removing event receipts for user %d for events: %v, err: %v", userID, eventIDs, err)
	}
	return err
}
