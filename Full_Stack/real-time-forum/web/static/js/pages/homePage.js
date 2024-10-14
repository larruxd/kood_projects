import { navigateTo } from "../index.js";
import AbstractView from "./AbstractView.js";
import { APIfetch, handleErrorFromServer, isAuthorized } from "../common.js";
import wsLaunch from "../webSocket.js";
import { loadPosts, openPostWindow } from "./postsComments.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Forum");
        this.setCss("home.css");
        this.setLinks([{ link: "/logout", label: "Log out" }]);
    }

    async getHtml() {
        return `
        <div id="welcome"></div>

        <div id="home">
            <h1>Posts</h1>
            <button id="newPost-button">New Post</button>
            <div id="newPost-container" style="display: none">
                <form id="newPost-form" action="javascript:" method="POST">
                    <label for="post-title-input">Title</label><br />
                    <input
                        id="post-title-input"
                        type="text"
                        placeholder="Title"
                        name="post-title"
                        maxlength="128"
                        required
                    />
                    <br />
                    <label for="post-content-input">Content</label><br />
                    <textarea
                        id="post-content-input"
                        type="text"
                        placeholder="Content"
                        name="post-content"
                        maxlength="1000"
                        rows="2"
                        cols="50"
                        required
                    ></textarea>
                    <br />
                    <label for="category">Category</label><br />
                    <select id="category" name="post-category" required>
                        //get from db
                        <option value="Random">Random</option>
                        <option value="Specific">Specific</option>
                        <option value="Very general">Very general</option></select
                    ><br />
                    <span id="postSuccess"></span><br />
                    <button type="button" class="cancelbtn" id="cancelPost-button">Cancel</button>
                    <button type="submit" class="postbtn" id="submitPost-button">Submit</button>
                </form>
            </div>
            <div id="posts"></div>
        </div>

        <div id="userField"></div>

        <div id="chatField" style="visibility: hidden">
            <div id="chatName"></div>
            <div id="messageField"></div>
            <div id="inputItems">
                <textarea id="inputField"></textarea>
                <button id="sendButton">Send<span class="tooltiptext">Enter to send</span></button>
            </div>
        </div>
                `;
    }

    async pageAction() {
        if (await isAuthorized()) {
            const loginName = JSON.parse(sessionStorage.getItem("user")).LoginName;

            document.getElementById("welcome").innerHTML = `Welcome ${loginName}!`;

            document.getElementById("newPost-button").addEventListener("click", () => {
                document.getElementById("newPost-container").style.display = "block";
            });

            document.getElementById("cancelPost-button").addEventListener("click", () => {
                document.getElementById("newPost-container").style.display = "none";
            });


            const postsData = await APIfetch("/get-forum-content", "POST");
            loadPosts(postsData);
            newPost();
            wsLaunch();
            // if url contains postid param open post window
            if (window.location.search.substring(1, 7) === "postid") {
                openPostWindow(postsData, window.location.search.split("=")[1]);
            }
        } else {
            console.log("Unautorized");
            navigateTo("/login");
        }
    }
}

async function newPost() {
    const newPost = document.getElementById("newPost-form");
    document.getElementById("cancelPost-button").addEventListener("click", () => {
        document.getElementById("post-title-input").value = "";
        document.getElementById("post-content-input").value = "";
        document.getElementById("newPost-container").style.display = "none";
    });
    newPost.addEventListener("submit", async (e) => {
        let postData = new FormData(newPost);
        let data = {};
        for (let [key, value] of postData.entries()) {
            data[key] = value;
        }
        let options = {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        const user = JSON.parse(sessionStorage.getItem("user"));
        try {
            await fetch(`/new-post?UserID=${user.UserID}`, options).then(async (response) => {
                if (response.ok) {
                    document.querySelector("#postSuccess").innerHTML =
                        "New post created successfully!";
                    await new Promise((r) => setTimeout(r, 500));
                    navigateTo("/");
                } else {
                    handleErrorFromServer(response);
                }
            });
        } catch (e) {
            console.error(e);
        }
    });
}
