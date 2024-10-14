export var socket

import {
    sendSocket,
    fillUserField,
    isOnline,
    newMessage,
    launchListeners,
    clearChat,
    addNotification,
    showTypingVisual,
    hideTypingVisual
} from "./wsFunctions.js";

export default async function wsLaunch() {

    if (socket && socket.readyState === WebSocket.OPEN) {
        // If a WebSocket connection is open, close it and go agane
        // console.log("in socket check", socket)
        await socket.close();
        wsLaunch()
    } else {

        let currentUser = JSON.parse(sessionStorage.getItem("user"));
        socket = new WebSocket(`ws://localhost:8080/ws?UserID=${currentUser.UserID}`);

        socket.onopen = function (event) {
            console.log("WebSocket connection opened, ", event);
        };

        socket.onmessage = function (event) {

            var message = JSON.parse(event.data);

            const messageField = document.getElementById("messageField")

            switch (message.type) {
                case "newUser":
                    sendSocket("newUser")
                    break
                case "fillUserField":
                    fillUserField(message, currentUser)
                    break
                case "updateOnlineUsers":
                    message.data.forEach(user => {
                        isOnline(true, user)
                    });
                    break
                case "updateOfflineUsers":
                    isOnline(false, message.data)
                    break
                case "message":
                    newMessage(message, currentUser, messageField, "written")
                    break
                case "chatOpen":
                    clearChat()
                    if (message.data) {
                        message.data.forEach(element => {
                            newMessage(element, currentUser, messageField, "fetchedOpen")
                        });
                    }
                    break
                case "chatMore":
                    if (message.data) {
                        message.data.forEach(element => {
                            newMessage(element, currentUser, messageField, "fetchedScroll")
                        });
                        // To set scroll position to where it was
                        const messageHeight = document.querySelector(".messageDiv").clientHeight;
                        const newScrollPosition = (message.data.length + 1) * messageHeight;
                        messageField.scrollTop = newScrollPosition;
                    }
                    break
                case "initalNotifications":
                    if (message.data) {
                        message.data.forEach(element => {
                            addNotification(element)
                        });
                    }
                    break
                case "startedTyping":
                    showTypingVisual(message.sender)
                    break
                case "stoppedTyping":
                    hideTypingVisual(message.sender)
                    break
                default:
                    console.log("uknown type: ", message.type)
                    console.log(message)
                    break
            }

        };

        socket.onclose = function (event) {
            console.log("WebSocket connection closed,", event);
        };

        socket.onerror = function (error) {
            console.log("Websocket error, ", error)
            console.log("Error message: " + error.message);
            console.log("Error code: " + error.code);
        }

        launchListeners()
    }

}
