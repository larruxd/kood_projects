package sqlQueries

import (
	"errors"
	"fmt"
	"social-network/internal/database"
	"social-network/internal/logger"
	"social-network/internal/structs"
	"strings"
	"time"
)

func AddNewEvent(event structs.GroupEvent) (int, error) { //Return event id or error
	startTime, err := time.Parse(time.RFC3339, event.StartTime)
	if err != nil {
		logger.ErrorLogger.Println("invalid timestamp format for event start time", err)
		return 0, errors.New("invalid timestamp format for event start time")
	}

	createdAt, err := time.Parse(time.RFC3339, event.CreatedAt)
	if err != nil {
		logger.ErrorLogger.Println("invalid timestamp format for created at", err)
		return 0, errors.New("invalid timestamp format for created at")
	}

	stmt, err := database.DB.Prepare(`INSERT INTO group_events (group_id, creator_id, title, description, event_date, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
	if err != nil {
		logger.ErrorLogger.Println("DB prepare error when adding new group event", err)
		return 0, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(event.GroupId, event.CreatorId, event.Title, event.Description, startTime, createdAt)
	if err != nil {
		logger.ErrorLogger.Println("DB exec error when adding new group event", err)
		return 0, err
	}

	eventIDint64, err := result.LastInsertId()
	if err != nil {
		logger.ErrorLogger.Println("Get last insert id error when adding new group event", err)
		return 0, err
	}

	eventID := int(eventIDint64)

	return eventID, nil
}

func GetGroupEvents(groupID int) (structs.GroupEventPayload, error) {
	var payload structs.GroupEventPayload
	stmt, err := database.DB.Prepare(`SELECT * FROM group_events WHERE group_id = ? ORDER BY event_date ASC`)
	if err != nil {
		logger.ErrorLogger.Println("DB prepare error when geting group events", err)
		return payload, err
	}
	defer stmt.Close()

	rows, err := stmt.Query(groupID)
	if err != nil {
		logger.ErrorLogger.Println("DB query error when geting group events", err)
		return payload, err
	}
	defer rows.Close()

	for rows.Next() {
		var event structs.GroupEvent
		err := rows.Scan(
			&event.Id,
			&event.GroupId,
			&event.CreatorId,
			&event.Title,
			&event.Description,
			&event.StartTime,
			&event.CreatedAt,
		)
		if err != nil {
			return payload, err
		}
		payload.Data = append(payload.Data, event)
	}
	return payload, nil
}

func UpdateAttendee(request structs.UpdateAttendeeRequest) error {
	tx, err := database.DB.Begin()
	if err != nil {
		logger.ErrorLogger.Println("DB transaction error when updating attendee", err)
		return err
	}
	defer tx.Rollback()

	result, err := tx.Exec(`
        UPDATE group_event_members
        SET status = ?
        WHERE user_id = ? AND event_id = ? AND group_id = ?
    `, request.Status, request.UserID, request.EventID, request.GroupID)
	if err != nil {
		logger.ErrorLogger.Println("DB execute error when updating attendee", err)
		return err
	}

	affectedRows, err := result.RowsAffected()
	if err != nil {
		logger.ErrorLogger.Println("RowsAffected check error when updating attendee", err)
		return err
	}

	if affectedRows == 0 { //when user hasnt pressed going/not before
		_, err := tx.Exec(`
            INSERT INTO group_event_members (user_id, group_id, event_id, status)
            VALUES (?, ?, ?, ?)
        `, request.UserID, request.GroupID, request.EventID, request.Status)

		if err != nil {
			logger.ErrorLogger.Println("DB execute error when adding new attendee", err)
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		logger.ErrorLogger.Println("DB commit error when updating attendee", err)
		return err
	}

	return nil
}

func AddEventReceipts(eventID int, recipientIDs []int) error {
	if len(recipientIDs) == 0 {
		return nil
	}

	var placeholders []string
	var args []interface{}
	for _, recipientID := range recipientIDs {
		placeholders = append(placeholders, "(?, ?)")
		args = append(args, eventID, recipientID)
	}
	values := strings.Join(placeholders, ",")

	stmt, err := database.DB.Prepare(fmt.Sprintf("INSERT INTO event_receipts (event_id, recipient_id) VALUES %s", values))
	if err != nil {
		logger.ErrorLogger.Println("DB prepare error for batch insert into event receipts", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(args...)
	if err != nil {
		logger.ErrorLogger.Println("DB exec error for batch insert into event receipts", err)
		return err
	}

	return nil
}

func GetEventAttendees(groupID int) (map[int][]structs.GroupEventAttendees, error) {
	payload := make(map[int][]structs.GroupEventAttendees)
	stmt, err := database.DB.Prepare(`SELECT event_id, user_id, status FROM group_event_members WHERE group_id = ?`)
	if err != nil {
		logger.ErrorLogger.Println("DB prepare error when getting group event attendees", err)
		return payload, err
	}
	defer stmt.Close()

	rows, err := stmt.Query(groupID)
	if err != nil {
		logger.ErrorLogger.Println("DB query error when getting group event attendees", err)
		return payload, err
	}
	defer rows.Close()

	for rows.Next() {
		var eventID int
		var attendee structs.GroupEventAttendees
		err := rows.Scan(
			&eventID,
			// &event.GroupID, // currently not needed only used as a selector
			&attendee.UserID,
			&attendee.Status,
		)
		if err != nil {
			return payload, err
		}
		payload[eventID] = append(payload[eventID], attendee)
	}
	return payload, nil
}

func GetUserEvents(userID int) ([]structs.GroupEventWithTitles, error) {
	var payload []structs.GroupEventWithTitles
	stmt, err := database.DB.Prepare(`
		SELECT g.id, g.group_id, g.creator_id, gr.title AS group_title, g.description, g.event_date, g.created_at, g.title AS event_title
		FROM group_event_members AS m
		JOIN group_events AS g ON m.event_id = g.id
		JOIN groups AS gr ON g.group_id = gr.id
		WHERE m.user_id = ? AND m.status = 1
		ORDER BY g.event_date ASC
	`)
	if err != nil {
		logger.ErrorLogger.Println("DB prepare error when getting user events", err)
		return payload, err
	}
	defer stmt.Close()

	rows, err := stmt.Query(userID)
	if err != nil {
		logger.ErrorLogger.Println("DB query error when getting user events", err)
		return payload, err
	}
	defer rows.Close()

	for rows.Next() {
		var event structs.GroupEventWithTitles
		err := rows.Scan(
			&event.Id,
			&event.GroupId,
			&event.CreatorId,
			&event.GroupTitle,
			&event.Description,
			&event.StartTime,
			&event.CreatedAt,
			&event.Title,
		)
		if err != nil {
			return payload, err
		}
		payload = append(payload, event)
	}
	return payload, nil
}

func GetPendingEventReceipts(userID int) ([]structs.GroupEventWithTitles, error) {
	query := `SELECT
    ge.id AS id,
    ge.group_id AS groupid,
    ge.creator_id AS creatorid,
    ge.title AS title,
    ge.event_date AS starttime,
    ge.description AS description,
    ge.created_at AS createdat,
    g.title AS grouptitle
	FROM
    event_receipts er
	JOIN
    group_events ge ON er.event_id = ge.id
	JOIN
    groups g ON ge.group_id = g.id
	WHERE
    er.recipient_id = ?`
	rows, err := database.DB.Query(query, userID)
	if err != nil {
		logger.ErrorLogger.Println("Error quering db for pending events", err)
		return nil, err
	}
	defer rows.Close()

	var messages []structs.GroupEventWithTitles
	for rows.Next() {
		var event structs.GroupEventWithTitles
		if err := rows.Scan(
			&event.Id,
			&event.GroupId,
			&event.CreatorId,
			&event.Title,
			&event.StartTime,
			&event.Description,
			&event.CreatedAt,
			&event.GroupTitle,
		); err != nil {
			logger.ErrorLogger.Println("Error scanning rows for pending chat messages", err)
			return nil, err
		}
		messages = append(messages, event)
	}
	return messages, nil
}

func RemoveEventReceipts(userID int, eventIDs []int) error {
	placeholders := make([]string, len(eventIDs))
	for i := range eventIDs {
		placeholders[i] = "?"
	}
	placeholderStr := strings.Join(placeholders, ", ")

	query := `DELETE FROM event_receipts WHERE event_id IN (` + placeholderStr + `) AND recipient_id = ?`

	args := make([]interface{}, len(eventIDs)+1)
	for i, id := range eventIDs {
		args[i] = id
	}
	args[len(eventIDs)] = userID

	_, err := database.DB.Exec(query, args...)
	return err
}
