package groups

import (
	"encoding/json"
	"net/http"
	"social-network/internal/config"
	"social-network/internal/logger"
	"social-network/internal/sqlQueries"
	"social-network/internal/structs"
	"social-network/internal/websocket"
)

func SendGroupRequest(w http.ResponseWriter, r *http.Request) {
	var GroupRequest structs.GroupRequestStruct
	var GroupRequestNotif structs.GroupRequestNotifStruct
	var isInvited bool // will be true if group owner invited, false if requested themselves
	UserID := r.Context().Value("userID").(int)

	if err := json.NewDecoder(r.Body).Decode(&GroupRequest); err != nil {
		http.Error(w, "ERROR: "+err.Error(), http.StatusBadRequest)
		return
	}

	User := sqlQueries.GetUserFromID(UserID)

	if GroupRequest.UserId != 0 {
		isInvited = true
		UserID = GroupRequest.UserId
	}

	if User.ID == 0 {
		http.Error(w, "ERROR: USER DOES NOT EXIST.", http.StatusBadRequest)
	}

	if GroupRequest.GroupId == 0 {
		http.Error(w, "Group id empty", http.StatusBadRequest)
		return
	}

	if err := sqlQueries.SendGroupRequest(UserID, GroupRequest.GroupId, isInvited); err != nil {
		http.Error(w, "Error sending group request: "+err.Error(), http.StatusBadRequest)
		return
	}

	group := sqlQueries.GetGroup(GroupRequest.GroupId)
	var sendTo int // who should receive the notification
	if isInvited {
		sendTo = UserID
	} else {
		sendTo = group.Creator
	}

	GroupRequestNotif.UserId = User.ID
	GroupRequestNotif.Username = User.Username
	GroupRequestNotif.GroupName = group.Title
	GroupRequestNotif.GroupId = GroupRequest.GroupId
	GroupRequestNotif.CreatorId = group.Creator
	// ^ can do this in a better way

	var GroupRequestNotifPayload []structs.GroupRequestNotifStruct
	GroupRequestNotifPayload = append(GroupRequestNotifPayload, GroupRequestNotif)

	envelopeBytes, err := websocket.ComposeWSEnvelopeMsg(config.WsMsgTypes.NEW_GROUP_REQUEST, GroupRequestNotifPayload)
	if err != nil {
		websocket.SendErrorMessage(UserID, "Error marshaling chat messages")
		logger.ErrorLogger.Printf("Error composing chat messages for user %d: %v\n", UserID, err)
		return
	}

	err = websocket.SendMessageToUser(sendTo, envelopeBytes)
	if err != nil {
		logger.ErrorLogger.Printf("Error sending message to user %d: %v\n", group.Creator, err)
	}

	// fmt.Println(GroupRequest)
	var GroupResponse structs.GroupRequestResponse
	GroupResponse.Result = "Successfully sent the request."
	json.NewEncoder(w).Encode(GroupResponse)
}

func (s *Service) SendPendingGroupRequests(userID int) {
	//this returns userIDs and groupIDs where USER is groupCreator and has a pending request (0)
	requests, err := sqlQueries.GetPendingGroupRequestsCreator(userID)
	if err != nil {
		logger.ErrorLogger.Println("Error getting pending events for user ", userID, err)
		websocket.SendErrorMessage(userID, "Error getting pending events")
		return
	}
	if len(requests) == 0 {
		return
	}

	var GroupRequestNotifPayload []structs.GroupRequestNotifStruct

	for _, request := range requests {

		User := sqlQueries.GetUserFromID(request.UserId)
		group := sqlQueries.GetGroup(request.GroupId)
		groupRequestNotif := structs.GroupRequestNotifStruct{
			UserId:    request.UserId,
			Username:  User.Username,
			GroupId:   request.GroupId,
			GroupName: group.Title,
			CreatorId: userID,
		}

		GroupRequestNotifPayload = append(GroupRequestNotifPayload, groupRequestNotif)
	}

	envelopeBytes, err := websocket.ComposeWSEnvelopeMsg(config.WsMsgTypes.NEW_GROUP_REQUEST, GroupRequestNotifPayload)
	if err != nil {
		websocket.SendErrorMessage(userID, "Error marshaling group request payload")
		logger.ErrorLogger.Printf("Error composing group request payload: %v\n", err)
		return
	}

	err = websocket.SendMessageToUser(userID, envelopeBytes)
	if err != nil {
		logger.ErrorLogger.Printf("Error sending message to user %d: %v\n", userID, err)
	}
}

func (s *Service) SendPendingGroupInvites(userID int) {
	//this returns groupIDs where the USER was invited to
	invites, err := sqlQueries.GetPendingGroupRequestsInvite(userID)
	if err != nil {
		logger.ErrorLogger.Println("Error getting pending events for user ", userID, err)
		websocket.SendErrorMessage(userID, "Error getting pending events")
		return
	}

	if len(invites) == 0 {
		return
	}

	var groupInvitePayload []structs.GroupRequestNotifStruct

	for _, groupID := range invites {
		group := sqlQueries.GetGroup(groupID)
		User := sqlQueries.GetUserFromID(group.Creator)

		groupInviteNotif := structs.GroupRequestNotifStruct{
			UserId:    User.ID,
			Username:  User.Username,
			GroupId:   groupID,
			GroupName: group.Title,
			CreatorId: group.Creator,
		}

		groupInvitePayload = append(groupInvitePayload, groupInviteNotif)
	}

	envelopeBytes, err := websocket.ComposeWSEnvelopeMsg(config.WsMsgTypes.NEW_GROUP_INVITE, groupInvitePayload)
	if err != nil {
		websocket.SendErrorMessage(userID, "Error marshaling group invite payload")
		logger.ErrorLogger.Printf("Error composing group invite payload: %v\n", err)
		return
	}

	err = websocket.SendMessageToUser(userID, envelopeBytes)
	if err != nil {
		logger.ErrorLogger.Printf("Error sending message to user %d: %v\n", userID, err)
	}
}
