import React, { useState, useEffect, useContext } from "react";
import { UsersContext } from "./users-context";
import { ChatContext } from "./chat-context";

export const WebSocketContext = React.createContext({
  websocket: null,
  newPrivateMsgsObj: null,
  setNewPrivateMsgsObj: () => {},
  newGroupMsgsObj: null,
  setNewGroupMsgsObj: () => {},
  notificationQueue: [],
  popNotificationFromQueue: () => {},
  newNotiFollowReplyObj: null,
  setNewNotiFollowReplyObj: () => {},
  newNotiJoinReplyObj: null,
  setNewNotiJoinReplyObj: () => {},
  newNotiInvitationReplyObj: null,
  setNewNotiInvitationReplyObj: () => {},
  onlineUsers: [],
  setOnlineUsers: () => {},
  newGroupObj: null,
  setnewGroupObj: () => {},
  newGroupEventObj: null,
  setNewGroupEventObj: () => {},
});

export const WebSocketContextProvider = (props) => {
  const { currentChat } = useContext(ChatContext);
  const { updateUserInList, onNewUserReg } = useContext(UsersContext);

  const [socket, setSocket] = useState(null);
  const [newChatMsgObj, setNewChatMsgObj] = useState(null);
  const [newPrivateMsgsObj, setNewPrivateMsgsObj] = useState(null);
  const [newGroupMsgsObj, setNewGroupMsgsObj] = useState(null);

  const [notificationQueue, setNotificationQueue] = useState([]);

  const [newNotiFollowReplyObj, setNewNotiFollowReplyObj] = useState(null);
  const [newNotiJoinReplyObj, setNewNotiJoinReplyObj] = useState(null);
  const [newNotiInvitationReplyObj, setNewNotiInvitationReplyObj] =
    useState(null);

  const [followRequestResult, setFollowRequestResult] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [newGroupEventObj, setNewGroupEventObj] = useState(null);

  const currUserId = localStorage.getItem("user_id");

  let TEMPNUMBER = 90;

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080/ws");

    newSocket.onopen = () => {
      console.log("ws connected");
      setSocket(newSocket);
    };

    newSocket.onclose = () => {
      console.log("bye ws");
      setSocket(null);
    };

    newSocket.onerror = (err) => console.log("ws error");

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => handleIncomingMessage(message);
      sendWsReadyMessage(socket);
    }
  }, [socket, currentChat]);

  // When a new notification arrives
  const addNotificationToQueue = (notification) => {
    setNotificationQueue((prevQueue) => [...prevQueue, notification]);
  };

  // Expose the queue and a method to clear the processed notification
  const popNotificationFromQueue = () => {
    setNotificationQueue((prevQueue) => prevQueue.slice(1));
  };

  const handleIncomingMessage = (message) => {
    const combinedMsgObj = JSON.parse(message.data);

    if (combinedMsgObj.messages && Array.isArray(combinedMsgObj.messages)) {
      combinedMsgObj.messages.forEach((msgObj) => {
        console.log("New ws msg: ", msgObj);

        switch (msgObj.type) {
          case "followRequest":
            addNotificationToQueue({
              id: "follow_req_" + msgObj.payload.id, //Using source userID as id/key, because it's always unique
              type: "follow-req",
              sourceid: msgObj.payload.id,
              targetid: Number(currUserId),
            });
            break;
          case "followRequestResult":
            if (msgObj.payload.accepted) {
              updateUserInList(msgObj.payload.userdata);
            }
            setFollowRequestResult({
              userId: msgObj.payload.requestedid,
              status: msgObj.payload.accepted,
            });
            break;
          case "onlineUsersList":
            if (msgObj.payload !== null) {
              setOnlineUsers(
                new Set(msgObj.payload.map((userData) => userData.id))
              );
            }
            break;

          case "userOnline":
            console.log("User came online: ", msgObj.payload);
            setOnlineUsers(
              (prevOnlineUsers) =>
                new Set([...prevOnlineUsers, msgObj.payload.id])
            );
            break;

          case "userOffline":
            setOnlineUsers((prevOnlineUsers) => {
              const newOnlineUsers = new Set(prevOnlineUsers);
              newOnlineUsers.delete(msgObj.payload.id);
              return newOnlineUsers;
            });
            break;

          case "chatMessages":
            console.log("newg message payload:", msgObj.payload); //TODO remove later
            msgObj.payload.forEach((message) => {
              if (isMessageForCurrentChat(message, currentChat)) {
                setNewChatMsgObj(message);
              } else if (!message.group_chat) {
                addNotificationToQueue({
                  id: "private_chat_msg_" + message.id,
                  type: "private-chat-msg",
                  sourceid: message.sender_id,
                  targetid: Number(currUserId),
                });
              } else {
                addNotificationToQueue({
                  id: "group_chat_msg_" + message.id,
                  type: "group-chat-msg",
                  sourceid: message.sender_id,
                  targetid: Number(currUserId),
                  groupid: message.group_id,
                  groupname: message.group_name,
                });
              }
            });
            sendChatMessagesReply(msgObj.payload);
            break;
          case "newGroupRequest":
            msgObj.payload.forEach((request) => {
              addNotificationToQueue({
                id: "new_group_request" + TEMPNUMBER,
                type: "new_group_request",
                groupPayload: request,
                sourceid: Number(currUserId),
                targetid: Number(request.creatorid),
              });
              TEMPNUMBER++;
            });
            break;
          case "newGroupInvite":
            msgObj.payload.forEach((request) => {
              addNotificationToQueue({
                id: "new_group_invite" + TEMPNUMBER,
                type: "new_group_invite",
                groupPayload: request,
                sourceid: Number(currUserId),
                targetid: Number(request.creatorid),
              });
              TEMPNUMBER++;
            });
            break;
          case "newUserRegistered":
            console.log("New user registered");
            onNewUserReg();
            break;
          case "newGroupEvent":
            msgObj.payload.forEach((event) => {
              addNotificationToQueue({
                id: "new_group_event_" + event.id,
                type: "new_group_event",
                groupPayload: event,
                sourceid: Number(event.creatorid),
                targetid: Number(currUserId),
              });
            });
            sendEventNotifReply(msgObj.payload);
            break;
          default:
            console.log("Received unknown type ws message");
            break;
        }
      });
    }
  };

  const isMessageForCurrentChat = (message, currentChat) => {
    return (
      message.group_chat === currentChat.groupChat &&
      (message.group_chat
        ? message.group_id === currentChat.recipientId
        : message.sender_id === currentChat.recipientId)
    );
  };

  const sendChatMessagesReply = (receivedMessages) => {
    const replyMsg = {
      type: "chatMessagesReply",
      payload: receivedMessages,
    };
    socket.send(JSON.stringify(replyMsg));
  };

  const sendEventNotifReply = (receivedEvents) => {
    const replyMsg = {
      type: "newGroupEventReply",
      payload: receivedEvents,
    };
    socket.send(JSON.stringify(replyMsg));
  };

  const sendWsReadyMessage = (socket) => {
    // To notify server that ready to receive ws messages
    socket.send(JSON.stringify({ type: "readyForWsMessages" }));
  };

  return (
    <WebSocketContext.Provider
      value={{
        websocket: socket,
        newChatMsgObj: newChatMsgObj,
        setNewChatMsgObj: setNewChatMsgObj,
        newPrivateMsgsObj: newPrivateMsgsObj,
        setNewPrivateMsgsObj: setNewPrivateMsgsObj,
        newGroupMsgsObj: newGroupMsgsObj,
        setNewGroupMsgsObj: setNewGroupMsgsObj,
        notificationQueue: notificationQueue,
        popNotificationFromQueue: popNotificationFromQueue,
        newNotiFollowReplyObj: newNotiFollowReplyObj,
        setNewNotiFollowReplyObj: setNewNotiFollowReplyObj,
        newNotiJoinReplyObj: newNotiJoinReplyObj,
        setNewNotiJoinReplyObj: setNewNotiJoinReplyObj,
        newNotiInvitationReplyObj: newNotiInvitationReplyObj,
        setNewNotiInvitationReplyObj: setNewNotiInvitationReplyObj,
        followRequestResult: followRequestResult,
        setFollowRequestResult: setFollowRequestResult,
        onlineUsers: onlineUsers,
        setOnlineUsers: setOnlineUsers,
        newGroupEventObj: newGroupEventObj,
        setNewGroupEventObj: setNewGroupEventObj,
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
