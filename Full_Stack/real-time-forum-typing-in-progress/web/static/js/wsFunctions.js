import { socket } from "./webSocket.js";

class MessageData {
    constructor(type, data, dateSent, receiver, receiverOffline) {
        this.type = type;
        this.data = data;
        this.dateSent = dateSent; // time is sent as UTC, Coordinated Universal Time zone which is standard.
        this.receiver = receiver;
        this.receiverOffline = receiverOffline;
    }

    toJSON() {
        return {
            type: this.type,
            data: this.data,
            dateSent: this.dateSent,
            receiver: this.receiver,
            receiverOffline: this.receiverOffline,
        };
    }
}

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
// Is global because using in newMessage()
let openChat = "";

export function launchListeners() {
    const chatField = document.getElementById("chatField");

    document.getElementById("sendButton").addEventListener("click", function () {
        sendMessage();
    });
    chatField.addEventListener("keypress", function (e) {
        if (e.code === "Enter") {
            if (chatField.style.visibility != "hidden") {
                sendMessage();
            }
        }
    });

    let typingTimer;
    const stopTypingDelay = 3000; // 3 seconds
    let typingFlag = false;

    const inputField = document.getElementById("chatField");
    inputField.addEventListener("keypress", function (e) {
        if (e.key != "Enter" && !typingFlag) {
            typingFlag = true;
            sendSocket("startedTyping", "", "", openChat);
        }
        clearTimeout(typingTimer);

        typingTimer = setTimeout(function () {
            typingFlag = false;
            sendSocket("stoppedTyping", "", "", openChat);
        }, stopTypingDelay);
    });

    document.getElementById("userField").addEventListener("click", function (e) {
        if (e.target.classList.contains("user")) {
            // If currently open chat is not the one clicked on
            if (openChat !== e.target.id) {
                clearChat();

                var messageInput = document.getElementById("inputField");
                messageInput.value = "";

                openChat = e.target.id;
                historyIndex = 1;

                let chatName = chatField.querySelector("#chatName");
                chatName.textContent = openChat;

                sendSocket("chatOpen", "", "", openChat);

                // Remove notification
                const userDiv = document.getElementById(openChat);
                const notifyBubble = userDiv.querySelector(".notifyBubble");
                if (notifyBubble) {
                    notifyBubble.remove();
                }

                if (chatField.style.visibility == "hidden") {
                    chatField.style.visibility = "";
                }
                messageInput.focus();
            } else {
                chatField.style.visibility = "hidden";
                openChat = "";
                historyIndex = 1;
                clearChat();
            }
        }
    });

    const messageField = document.getElementById("messageField");
    let historyIndex = 1;

    messageField.addEventListener(
        "scroll",
        debounce(function () {
            if (messageField.scrollTop === 0 && chatField.style.visibility === "") {
                // User has scrolled to the top
                sendSocket("moreMessages", historyIndex.toString(), "", openChat);
                historyIndex++;
            }
        }, 250)
    );
}

export function clearChat() {
    const messageField = document.getElementById("messageField");
    while (messageField.firstChild) {
        messageField.removeChild(messageField.firstChild);
    }
}

function sendMessage() {
    var messageInput = document.getElementById("inputField");
    var data = messageInput.value;

    if (data.trim() === "") {
        return;
    }

    const eventDate = new Date();

    sendSocket("message", data, eventDate, openChat);

    messageInput.value = "";

    const userField = document.getElementById("userField");
    userField.insertBefore(document.getElementById(openChat), userField.firstChild);
}

export function sendSocket(type, data, date, receiver) {
    if (type === "message") {
        // console.log(document.getElementById(openChat).classList.contains("online"))
        // const receiverOffline = !document.getElementById(openChat).classList.contains("online")
        const receiverOffline = true;
        // if (openChat === ){

        // }
        const messageObj = new MessageData(type, data, date, receiver, receiverOffline);
        const jsonString = JSON.stringify(messageObj);
        socket.send(jsonString);
    } else {
        const messageObj = new MessageData(type, data, date, receiver);
        const jsonString = JSON.stringify(messageObj);
        socket.send(jsonString);
    }
}

export function isOnline(isOnline, user) {
    const userDiv = document.getElementById(user);
    if (userDiv) {
        if (isOnline) {
            userDiv.classList.add("online");
        } else {
            userDiv.classList.remove("online");
        }
    }
}

export function newMessage(message, currentUser, messageField, type) {
    // if this websocket is the senders websocket OR the currently selected chat by the receiver is the message sender
    if (currentUser.LoginName === message.sender || message.sender === openChat) {
        // console.log(message)
        sendSocket("remPending", openChat);
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("messageDiv");
        if (message.sender === currentUser.LoginName) {
            messageDiv.classList.add("sent");
        } else {
            messageDiv.classList.add("received");
        }

        createDiv("", "senderDiv", message.sender, messageDiv);
        createDiv("", "textDiv", message.data, messageDiv);

        // Create the date div seperately cause its different
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("dateDiv");
        var theDate = new Date(message.dateSent);
        dateDiv.textContent =
            theDate.getDate() +
            " " +
            monthNames[theDate.getMonth()] +
            "\n" +
            ("0" + theDate.getHours()).slice(-2) +
            ":" +
            ("0" + theDate.getMinutes()).slice(-2);

        messageDiv.appendChild(dateDiv);

        if (type === "written") {
            messageField.appendChild(messageDiv);
            messageField.scrollTop = messageField.scrollHeight;
            const userField = document.getElementById("userField");
            userField.insertBefore(document.getElementById(openChat), userField.firstChild);
        } else if (type === "fetchedOpen") {
            messageField.insertBefore(messageDiv, messageField.firstChild);
            messageField.scrollTop = messageField.scrollHeight;
        } else if (type === "fetchedScroll") {
            messageField.insertBefore(messageDiv, messageField.firstChild);
        }
    } else {
        addNotification(message.sender);
    }
}
export function addNotification(target) {
    const userDiv = document.getElementById(target);
    const notifyBubble = userDiv.querySelector(".notifyBubble");
    if (!notifyBubble && userDiv) {
        createDiv("", "notifyBubble", "", userDiv);
        // move it to be the first div
        const userField = document.getElementById("userField");
        userField.insertBefore(userDiv, userField.firstChild);
    }
}
export function showTypingVisual(sender) {
    const userDiv = document.getElementById(sender);
    if (userDiv) {
        const typingIndicator = userDiv.querySelector(".typing-indicator");
        if (typingIndicator) {
            typingIndicator.classList.add("dotAnimation");
            typingIndicator.style.visibility = "";
        }
    }
}

export function hideTypingVisual(target) {
    const userDiv = document.getElementById(target);
    const typingIndicator = userDiv.querySelector(".typing-indicator");
    if (typingIndicator) {
        typingIndicator.classList.remove("dotAnimation");
        typingIndicator.style.visibility = "hidden";
    }
}

function debounce(func, delay) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

function createDiv(id, theClass, data, appendTo) {
    const div = document.createElement("div");
    div.id = id;
    div.classList.add(theClass);
    div.textContent = data;
    appendTo.appendChild(div);
    return div;
}

export function fillUserField(message, currentUser) {
    message.data.forEach((user) => {
        const existingDiv = document.getElementById(user);
        if (!existingDiv) {
            createUserDiv(userField, user, currentUser);
        }
    });
}

function createUserDiv(userField, user, currentUser) {
    // const existingDiv = document.getElementById(user)
    if (user === currentUser.LoginName) {
        return;
    }
    const userDiv = createDiv(user, "user", user, userField);
    createTypingIndicator(userDiv);
}

function createTypingIndicator(userDiv) {
    const typingIndicator = createDiv("", "typing-indicator", "", userDiv);
    typingIndicator.style.visibility = "hidden";
    let i = 0;
    while (i < 3) {
        const dotDiv = createDiv("", "dot", "", typingIndicator);
        i++;
    }
    // createDiv("", "dot", "", typingIndicator)
    // createDiv("", "dot", "", typingIndicator) // im lazy
    // createDiv("", "dot", "", typingIndicator)
}
