import { main } from "./main.js";

export function loginListener() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let formData = new FormData(loginForm);
        let loginData = {};

        for (let [key, value] of formData.entries()) {
            loginData[key] = value;
        }

        auth(loginData.LoginID, loginData.password);
    });
    // }
}

async function auth(username, password) {
    const authURL = "https://01.kood.tech/api/auth/signin";

    const credentials = btoa(`${username}:${password}`);
    const jwtToken = await getToken(authURL, credentials);

    console.log("JWT: " + jwtToken);
    if (jwtToken) {
        sessionStorage.setItem("jwt", jwtToken);
        // document.cookie = `jwt=${jwtToken}; path=/; secure; samesite=Lax`;
        // await new Promise((r) => setTimeout(r, 500));
        main();
    }
}

async function getToken(url, credentials) {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
        },
    };

    try {
        let resp = await fetch(url, requestOptions);
        if (resp.status === 200) {
            clearLoginErr();
            return resp.json();
        } else if (resp.status === 401) {
            loginErr("User doesn't exist");
            clearUsername();
            clearPassword();
        } else if (resp.status === 403) {
            loginErr("Wrong password");
            clearPassword();
        } else {
            throw new Error("Failed to obtain JWT");
        }
    } catch (e) {
        console.error(e);
    }
}
function clearLoginErr() {
    document.getElementById("loginFeedback").innerHTML = "";
}

function loginErr(text) {
    document.getElementById("loginFeedback").innerHTML = text;
}

function clearPassword() {
    document.getElementById("password").value = "";
}

function clearUsername() {
    document.getElementById("LoginID").value = "";
}
