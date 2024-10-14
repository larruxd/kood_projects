import { formatDate, APIfetch } from "../common.js";
import { navigateTo } from "../index.js";

// let data = [];

export async function loadPosts(data) {
    // if (data.length === 0) {
    //     console.log("fetching data");
    //     data = await APIfetch("/get-forum-content", "POST");
    // }

    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";
    // console.log(data.Comments);
    for (let i = 0; i < data.Posts.length; i++) {
        const post = data.Posts[i];
        const comments = data.Comments.filter((obj) => obj.PostID === post.PostID);

        const timeString = post.Date.split("T")[1].split("Z")[0].substring(0, 5);
        const date = new Date(post.Date);
        const formattedDate = formatDate(date);

        const postDiv = document.createElement("div");
        postDiv.onclick = function () {
            history.pushState({}, null, `/?postid=${post.PostID}`);
            openPostWindow(data, post.PostID);
        };
        postDiv.id = post.PostID;
        postDiv.classList.add("post");
        postDiv.innerHTML = `
            <div class="postHeader">
                <div class="postTitle">${post.Title}</div>
                <div class="postDate">${formattedDate} ${timeString}</div>
            </div>

            <div class="postInfo">
                <div class="postUsername">By: ${post.Username}</div>
                <div class="postCategory">Category: ${post.Category}</div>
            </div>
            <br>
            <div class="postContent">${post.Content}</div>
        `;

        // postDiv.addEventListener("click", () => {
        //     console.log("open post");
        //     openPostWindow(post, comments);
        // });

        postsContainer.appendChild(postDiv);
    }
}

export async function openPostWindow(data, postID) {
    const postData = data.Posts.filter((obj) => obj.PostID == postID);
    if (postData.length === 0) {
        navigateTo("/error", "Post does not exist");
        return;
    }
    const commentsData = data.Comments.filter((obj) => obj.PostID == postID);

    // if window already open then remove it
    if (document.getElementById("postWindow")) {
        document.getElementById("postWindowBackground").remove();
        document.getElementById("postWindow").remove();
    }

    // format post date
    const postTimeString = postData[0].Date.split("T")[1].split("Z")[0].substring(0, 5);
    const postDate = new Date(postData[0].Date);
    const formattedPostDate = formatDate(postDate);

    // format comment dates
    const commentsDataFmt = commentsData.map((obj) => {
        const newObj = { ...obj };
        newObj.Time = obj.Date.split("T")[1].split("Z")[0].substring(0, 5);
        const commentDate = new Date(obj.Date);
        newObj.Date = formatDate(commentDate);
        return newObj;
    });

    const homeDiv = document.getElementById("home");
    const postWindow = document.createElement("div");
    postWindow.id = "postWindow";

    const background = document.createElement("div");
    background.id = "postWindowBackground";
    homeDiv.appendChild(background);

    postWindow.innerHTML = `
        <button class="close-button" type="button" id="closeBtn">
            <span aria-hidden="true">&times;</span>
        </button>
        
        <div class="postWindowHeader">
            <div class="postWindowDate">${formattedPostDate} ${postTimeString}</div>
            <div class="postTitle">${postData[0].Title}</div>
            <div class="postUsername">By: ${postData[0].Username}</div>
            <div class="postCategory">Category: ${postData[0].Category}</div>
        </div>
        <br>
        <div class="postWindowContent">${postData[0].Content}</div>
        <br>

        <div id="commentsTitle">Comments</div>

        <div id="newComment-container">
            <form id="newComment-form" action="javascript:" method="POST">
            
                <label for="comment-content" id="comment-content-label">Write a comment:</label><br />
                <textarea
                    id="comment-content"
                    type="text"
                    placeholder="write a comment..."
                    name="comment-content"
                    maxlength="128"
                    required
                /></textarea>
                <button type="submit" class="commentbtn" id="submitComment-button">Submit</button>
            </form>
            <div id="commentSuccess"></div>
        </div>
    `;

    for (let i = 0; i < commentsData.length; i++) {
        const comment = commentsData[i];
        const commentContainer = document.createElement("div");
        commentContainer.classList.add("comment");

        commentContainer.innerHTML = `
            <hr />
            <div class="commentAuthor">${comment.Username}:</div>
            <div class="commentContent">${comment.Content}</div>
        `;

        postWindow.appendChild(commentContainer);
    }

    homeDiv.appendChild(postWindow);

    const closeBtn = document.getElementById("closeBtn");
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("postWindowBackground").remove();
        document.getElementById("postWindow").remove();
        // loadPosts();
        history.pushState({}, null, `/`);
    });

    const newCommentForm = document.getElementById("newComment-form");
    newCommentForm.addEventListener("submit", async () => {
        const user = JSON.parse(sessionStorage.getItem("user"));

        let commentData = new FormData(newCommentForm);
        let data = {};
        for (let [key, value] of commentData.entries()) {
            data[key] = value;
        }
        data["user-id"] = user.UserID;
        data["post-id"] = postData[0].PostID;

        let options = {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            await fetch(`/new-comment`, options).then(async (response) => {
                if (response.ok) {
                    location.reload();
                } else {
                    handleErrorFromServer(response);
                }
            });
        } catch (e) {
            console.error(e);
        }
    });
}
