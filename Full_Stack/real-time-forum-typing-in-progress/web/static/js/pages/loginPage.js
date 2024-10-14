import { isAuthorized } from "../common.js";
import { navigateTo } from "../index.js";
import wsLaunch from "../webSocket.js";
import AbstractView from "./AbstractView.js";
import { deleteAllCookies } from "./logoutPage.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login to forum");
        this.setCss("login.css");
        this.setLinks([{ link: "/signup", label: "Sign Up" }]);
    }

    async getHtml() {
        return `
            <form id="login-form">
                <div class="login-container">
                    <h1>Log In</h1>
                    <p>Don't have an account yet?</p><br>
                    <a href="/signup" data-link>Sign up here!</a>
                    <hr />
                    <label for="LoginID">Username / Email</label>
                    <input
                        id="LoginID"
                        type="text"
                        placeholder="Enter username or email"
                        name="LoginID"
                        required
                    />
                    <span id="username-error" class="error"></span>

                    <label for="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        required
                    />
                    <span id="password-error" class="error"></span>

                    <span id="loginFeedback" class="error"></span>
                    <div class="clearfix">
                        <button type="submit" class="loginbtn" id="loginbtn">Login</button>
                    </div>
                    
                </div>
            </form>
    `;
    }

    async pageAction() {
        login();
    }
}

async function login() {
    if (await isAuthorized()) {
        navigateTo("/");
    } else {
        const loginForm = document.getElementById("login-form");

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            let formData = new FormData(loginForm);
            let loginData = {};

            for (let [key, value] of formData.entries()) {
                loginData[key] = value;
            }

            // console.log(loginData);

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            };

            try {
                let response = await fetch("/user-login", options);
                loginResponse(response);
            } catch (e) {
                console.error(e);
            }
        });
    }
}

async function loginResponse(response) {
    const feedbackElem = document.getElementById("loginFeedback");
    if (response.ok) {
        console.log("Login info correct");
        feedbackElem.style.color = "green";
        feedbackElem.innerHTML = "Info correct, Logging in...";

        let data = await response.json();
        sessionStorage.setItem("user", JSON.stringify(data));
        //wsLaunch()

        await new Promise((r) => setTimeout(r, 1000));
        navigateTo("/");
    } else {
        let data = await response.text();
        feedbackElem.innerHTML = data;
    }
}
