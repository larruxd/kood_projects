package sqlQueries

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"social-network/internal/database"
	"social-network/internal/logger"
	"social-network/internal/structs"
)

func GroupMember(userid, groupid int) bool {
	var exists bool
	if err := database.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM group_members WHERE user_id = ? AND group_id = ?)`, userid, groupid).Scan(&exists); err != nil {
		return false
	}

	return exists
}

func GroupExist(groupid int) bool {
	var exists bool
	if err := database.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM groups WHERE id = ?)`, groupid).Scan(&exists); err != nil {
		return false
	}

	return exists
}

func RequestExists(userid, groupid int) bool {
	var exists bool

	if err := database.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM group_requests WHERE user_id = ? AND group_id = ? AND request_status != 2)`, userid, groupid).Scan(&exists); err != nil && err != sql.ErrNoRows {
		logger.ErrorLogger.Println(err)
		return false
	}

	return exists // probably need to change this part once we decide how to handle denied requests.
}

func AddGroupMember(userid, groupid int) error {
	if GroupMember(userid, groupid) {
		return errors.New("user is already a member of the group")
	}
	_, err := database.DB.Exec(`INSERT INTO group_members(user_id, group_id, invite_status) VALUES(?, ?, 0)`, userid, groupid) // dont think invite_status is necessary
	if err != nil {
		logger.ErrorLogger.Println(err)
		fmt.Println(err)
		return err
	}

	return nil
}

func GroupRequestLeader(userid, groupid int) error {
	_, err := database.DB.Exec(`INSERT INTO group_requests(user_id, group_id, request_status) VALUES(?, ?, ?)`, userid, groupid, 1)
	if err != nil {
		logger.ErrorLogger.Println(err)
		fmt.Println(err)
		return err
	}

	return nil
}

func CreateGroup(creatorid int, title string, description string) error { // maybe use BeginTx  here
	result, err := database.DB.Exec(`INSERT INTO groups(creator_id, title, description) VALUES(?, ?, ?)`, creatorid, title, description)
	if err != nil {
		logger.ErrorLogger.Println(err)
		fmt.Println(err)
		return err
	}

	groupid, err := result.LastInsertId()
	if err != nil {
		logger.ErrorLogger.Println(err)
		fmt.Println(err)
		return err
	}

	err = AddGroupMember(creatorid, int(groupid))
	if err != nil {
		logger.ErrorLogger.Println(err)
		fmt.Println(err)
		return err
	}

	err = GroupRequestLeader(creatorid, int(groupid))
	if err != nil {
		logger.ErrorLogger.Println(err)
		fmt.Println(err)
		return err
	}

	return nil
}

func SendGroupRequest(userid, groupid int, isInvited bool) error {
	if !GroupExist(groupid) {
		return errors.New("group with this id does not exist")
	}
	if GroupMember(userid, groupid) {
		return errors.New("user is already a group member")
	}
	if RequestExists(userid, groupid) {
		return errors.New("user has already made a request to this group")
	}
	status := 0
	if isInvited {
		status = 4
	}
	_, err := database.DB.Exec(`INSERT INTO group_requests(user_id, group_id, request_status) 
	 VALUES(?, ?, ?)
	 `, userid, groupid, status)
	if err != nil {
		logger.ErrorLogger.Println(err)
		fmt.Println(err)
		return err
	}

	return nil
}

func AcceptGroupRequest(userid, otheruserid, groupid int) error {
	if !GroupExist(groupid) {
		return errors.New("group with this id does not exist")
	}

	if GroupMember(otheruserid, groupid) { // switch if other group member invited the person, might cause insane security risk not sure
		temp := otheruserid
		otheruserid = userid
		userid = temp
	} else if !GroupMember(userid, groupid) {
		return errors.New("you do not have permissions to accept this request")
	}

	if !RequestExists(otheruserid, groupid) {
		return errors.New("request to this group does not exist")
	}
	_, err := database.DB.Exec(`UPDATE group_requests SET request_status = 1 WHERE user_id = ? AND group_id = ? AND request_status IN (0, 4)`, otheruserid, groupid)
	if err != nil {
		logger.ErrorLogger.Println(err.Error())
		return err
	}
	err = AddGroupMember(otheruserid, groupid)
	if err != nil {
		logger.ErrorLogger.Println(err)
		return err
	}
	return nil
}

func DeclineGroupRequest(userid, otheruserid, groupid int) error {
	if !GroupExist(groupid) {
		return errors.New("group with this id does not exist")
	}

	if GroupMember(otheruserid, groupid) {
		temp := otheruserid
		otheruserid = userid
		userid = temp
	} else if !GroupMember(userid, groupid) {
		return errors.New("you do not have permissions to decline this request")
	}

	if !RequestExists(otheruserid, groupid) {
		return errors.New("request to this group does not exist")
	}
	_, err := database.DB.Exec(`DELETE FROM group_requests WHERE user_id = ? AND group_id = ?`, otheruserid, groupid)
	if err != nil {
		logger.ErrorLogger.Println(err.Error())
		return err
	}
	return nil
}

func GetAllGroups() ([]structs.GroupStruct, error) {
	var Groups []structs.GroupStruct

	// Query to get all groups
	rows, err := database.DB.Query(`SELECT * FROM groups`)
	if err != nil {
		logger.ErrorLogger.Println(err.Error())
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var Group structs.GroupStruct
		if err := rows.Scan(&Group.Id, &Group.Creator, &Group.Title, &Group.Description, &Group.CreatedAt); err != nil {
			logger.ErrorLogger.Println(err.Error())
			return nil, err
		}

		// Now, for each group, get the member data
		memberData, err := GetGroupMembers(Group.Id)
		if err != nil {
			logger.ErrorLogger.Println("Error getting group members for group", Group.Id, ":", err.Error())
			// You might continue with the next group or return an error.
			continue // or return nil, err
		}

		Group.Members = memberData.Members     // Ad structs
		Group.MemberCount = len(Group.Members) // You can now set MemberCount based on the length of Members

		Groups = append(Groups, Group)
	}

	return Groups, nil
}

func GetGroups(amount, offset int) ([]structs.GroupStruct, error) {
	var Groups []structs.GroupStruct

	var rows *sql.Rows
	var err error

	// Check if amount is greater than 0 to apply pagination
	if amount > 0 {
		rows, err = database.DB.Query(`SELECT * from groups LIMIT ? OFFSET ?`, amount, offset)
	} else {
		// Fetch all groups if amount is 0 or a specific sentinel value
		rows, err = database.DB.Query(`SELECT * from groups`)
	}

	if err != nil {
		logger.ErrorLogger.Println(err.Error())
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var Group structs.GroupStruct
		if err := rows.Scan(&Group.Id, &Group.Creator, &Group.Title, &Group.Description, &Group.CreatedAt); err != nil {
			logger.ErrorLogger.Println(err.Error())
			return nil, err
		}

		Group.MemberCount = GetGroupMemberCount(Group.Id)
		Groups = append(Groups, Group)
	}

	return Groups, nil
}

func GetJoinedGroups(userID int) ([]structs.GroupStruct, error) {
	var joinedGroups []structs.GroupStruct

	query := `
		SELECT g.*
		FROM group_members gm
		JOIN groups g ON gm.group_id = g.id
		WHERE gm.user_id = ?`

	rows, err := database.DB.Query(query, userID)
	if err != nil {
		logger.ErrorLogger.Println("Error quering db for joined groups", err.Error())
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var Group structs.GroupStruct
		if err := rows.Scan(&Group.Id, &Group.Creator, &Group.Title, &Group.Description, &Group.CreatedAt); err != nil {
			logger.ErrorLogger.Println("Error scanning rows for joined groups", err.Error())
			return nil, err
		}

		joinedGroups = append(joinedGroups, Group)
	}

	return joinedGroups, nil
}

func GetGroupMembers(groupid int) (structs.GroupMembersStruct, error) {
	var Members structs.GroupMembersStruct
	rows, err := database.DB.Query(`
	SELECT
	u.id, 
	u.username,
	u.first_name, 
	r.request_status,
	MAX(CASE
	WHEN (u.id = gr.creator_id)  THEN 3 
	WHEN (g.user_id = u.id AND r.request_status = 1) THEN 0
	ELSE -1
	END) Status
	FROM group_members g ,group_requests r, groups gr, users u 
	WHERE (g.group_id = $1 AND g.user_id = u.id AND gr.id = $1) OR (r.user_id = u.id AND r.group_id = $1 AND gr.id = $1)
	GROUP BY u.id
	ORDER BY Status DESC
	;
	`, groupid) // this query could be optimized a lot probably
	if err != nil {
		logger.ErrorLogger.Println(err.Error())
		return Members, err
	}
	defer rows.Close()

	for rows.Next() {
		var empty int
		var sqlUsername sql.NullString
		var Member structs.GroupMemberStruct

		if err := rows.Scan(&Member.UserId, &sqlUsername, &Member.FirstName, &empty, &Member.Status); err != nil {
			logger.ErrorLogger.Println(err.Error())
			return Members, err
		}

		if sqlUsername.Valid {
			Member.Username = sqlUsername.String
		} else {
			Member.Username = ""
		}

		Members.GroupId = groupid
		Members.Members = append(Members.Members, Member)
	}

	return Members, nil
}

func GetGroupMemberCount(groupid int) int {
	var count int
	rows, err := database.DB.Query(`SELECT COUNT(group_id)
	FROM group_members
	WHERE group_id = ?;
	 `, groupid)
	if err != nil {
		logger.ErrorLogger.Println(err.Error())
		return 0
	}
	defer rows.Close()
	rows.Next()
	err = rows.Scan(&count)
	if err != nil {
		logger.ErrorLogger.Println(err.Error())
		return 0
	}

	return count

}

func GetTotalGroupCount() int {
	var count int
	err := database.DB.QueryRow(`SELECT COUNT(id) FROM groups`).Scan(&count)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}
	return count
}

func CancelGroupRequest(userid, groupid int) error {
	if !GroupExist(groupid) {
		return errors.New("group with this id does not exist")
	}
	if GroupMember(userid, groupid) {
		return errors.New("user is already a member of this group")
	}
	if !RequestExists(userid, groupid) {
		return errors.New("request to this group does not exist")
	}
	_, err := database.DB.Exec(`DELETE from group_requests WHERE user_id = ? AND group_id = ? AND request_status = 0`, userid, groupid)
	return err
}

func RemoveUserFromGroup(userid, groupid int) error { // currently also removes requests aswell (might want to change that later on)
	ctx := context.Background()
	tx, err := database.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.ExecContext(ctx, `DELETE from group_members WHERE user_id = $1 AND group_id = $2`, userid, groupid)
	if err != nil {
		logger.ErrorLogger.Println(err)
		return err
	}

	_, err = tx.ExecContext(ctx, `DELETE from group_requests WHERE user_id = $1 AND group_id = $2 AND request_status != 2`, userid, groupid)
	if err != nil {
		logger.ErrorLogger.Println(err)
		return err
	}

	if err = tx.Commit(); err != nil {
		logger.ErrorLogger.Println(err)
		return err
	}

	return err
}

func GetGroup(groupid int) structs.GroupStruct {
	var group structs.GroupStruct
	err := database.DB.QueryRow(`SELECT * FROM groups WHERE id = ?`, groupid).Scan(&group.Id, &group.Creator, &group.Title, &group.Description, &group.CreatedAt)
	if err != nil {
		logger.ErrorLogger.Println("ERROR: ", err)
	}
	return group
}

func GetGroupName(groupID int) (string, error) {
	var groupName string
	err := database.DB.QueryRow(`SELECT title FROM groups WHERE id = ?`, groupID).Scan(&groupName)
	if err != nil {
		logger.ErrorLogger.Println("Error getting group name:", err)
		return "", err
	}
	return groupName, nil
}

func IsCreator(groupID, userID int) bool {
	var creatorid int
	err := database.DB.QueryRow(`SELECT creator_id FROM groups WHERE id = ? AND creator_id = ?`, groupID, userID).Scan(&creatorid)
	if err != nil {
		logger.ErrorLogger.Println("Error getting group name:", err)
		return false
	}

	return true
}

func KickFromGroup(groupID, userID, userToKickID int) bool {
	if !IsCreator(groupID, userID) || userID == userToKickID {
		return false
	}
	err := RemoveUserFromGroup(userToKickID, groupID)
	if err != nil {
		logger.ErrorLogger.Println("Got error KickFromGroup: ", err)
		return false
	}

	return true
}

func GetGroupPosts(userID int) ([]structs.PostStruct, error) {

	// query group ids
	rows, err := database.DB.Query(`SELECT group_id FROM group_members WHERE user_id = ?`, userID)
	if err != nil {
		logger.ErrorLogger.Println("Error getting group ids:", err)
		return nil, err
	}
	defer rows.Close()

	var groupIDs []int
	for rows.Next() {
		var groupID int
		if err := rows.Scan(&groupID); err != nil {
			logger.ErrorLogger.Println("Error scanning rows for group ids:", err)
			return nil, err
		}

		groupIDs = append(groupIDs, groupID)
	}

	// query posts
	var posts []structs.PostStruct
	for _, groupID := range groupIDs {
		rows, err := database.DB.Query(`SELECT * FROM group_posts WHERE group_id = ?`, groupID)
		if err != nil {
			logger.ErrorLogger.Println("Error getting group posts:", err)
			return nil, err
		}
		defer rows.Close()

		for rows.Next() {
			var post structs.PostStruct
			if err := rows.Scan(&post.Id, &post.Author, &post.GroupID, &post.Message, &post.CreatedAt); err != nil {
				logger.ErrorLogger.Println("Error scanning rows for group posts:", err)
				return nil, err
			}

			posts = append(posts, post)
		}
	}

	return posts, nil
}

func GetGroupComments(postID int) ([]structs.CommentStruct, error) {

	var comments []structs.CommentStruct
	rows, err := database.DB.Query(`SELECT * FROM group_post_comments WHERE group_post_id = ?`, postID)
	if err != nil {
		logger.ErrorLogger.Println("Error getting group comments:", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var comment structs.CommentStruct
		if err := rows.Scan(&comment.Id, &comment.UserId, &comment.PostId, &comment.Message, &comment.CreatedAt); err != nil {
			logger.ErrorLogger.Println("Error scanning rows for group comments:", err)
			return nil, err
		}

		comments = append(comments, comment)
	}

	return comments, nil
}

func InsertNewGroupPost(post structs.PostStruct) error {
	// Prepare the SQL query
	query := "INSERT INTO group_posts (author_id, group_id, message) VALUES (?, ?, ?)"
	stmt, err := database.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Execute the query
	_, err = stmt.Exec(post.Author, post.GroupID, post.Message)
	if err != nil {
		return err
	}

	return nil
}

func InsertNewGroupComment(comment structs.CommentStruct) error {
	// Prepare the SQL query
	query := "INSERT INTO group_post_comments (group_post_id, author_id, message) VALUES (?, ?, ?)"
	stmt, err := database.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Execute the query
	_, err = stmt.Exec(comment.PostId, comment.UserId, comment.Message)
	if err != nil {
		return err
	}

	return nil
}

func GetPendingGroupRequestsCreator(user int) ([]structs.GroupRequestToCreator, error) {
	query := `
	SELECT gr.user_id, gr.group_id
	FROM group_requests gr
	JOIN groups g ON gr.group_id = g.id
	WHERE gr.request_status = ? AND g.creator_id = ?
	`

	rows, err := database.DB.Query(query, 0, user)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var resultArr []structs.GroupRequestToCreator

	for rows.Next() {
		var result structs.GroupRequestToCreator
		if err := rows.Scan(&result.UserId, &result.GroupId); err != nil {
			return nil, err
		}
		resultArr = append(resultArr, result)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return resultArr, nil
}

func GetPendingGroupRequestsInvite(user int) ([]int, error) {
	query := `
	SELECT group_id
	FROM group_requests
	WHERE request_status = ? AND user_id = ?
	`

	rows, err := database.DB.Query(query, 4, user)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groupIDs []int

	for rows.Next() {
		var userID int
		if err := rows.Scan(&userID); err != nil {
			return nil, err
		}
		groupIDs = append(groupIDs, userID)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groupIDs, nil
}
