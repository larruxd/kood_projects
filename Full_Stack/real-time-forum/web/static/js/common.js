import { navigateTo } from "./index.js";
import { deleteAllCookies } from "./pages/logoutPage.js";
import { openPostWindow } from "./pages/postsComments.js";

export async function isAuthorized() {
    if (document.cookie.split("-")[0] === "session") {
        const userID = document.cookie.split("=")[0].split("-")[1];
        const key = document.cookie.split("=")[1];

        let hasSession = await hasCookie(userID, key);

        if (hasSession) {
            return true;
        } else {
            localStorage.clear();
            sessionStorage.clear();
            deleteAllCookies();
            console.log("localStorage, sessionStorage and cookies cleared.");
        }
    }
    return false;
}

async function hasCookie(userID, key) {
    const url = `/auth?CookieKey=${key}&UserID=${userID}`;

    try {
        let response = await fetch(url, {
            method: "POST",
        });

        if (response.ok) {
            // if tab or browser was closed recreates the user element in sessionStorage
            if (!sessionStorage.getItem("user")) {
                let data = await response.json();
                sessionStorage.setItem("user", JSON.stringify(data));
            }
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function handleErrorFromServer(response) {
    let errorMsg = await response.text();
    navigateTo("/error", errorMsg);
}

export async function APIfetch(url, reqMethod) {
    return fetch(url, {
        method: reqMethod,
    })
        .then((response) => response.json())
        .catch((e) => {
            console.error(e);
        });
}

export function formatDate(date) {
    var day = date.getDate() ; // one day off for some reason
    var month = date.getMonth() + 1; // Months are zero-based, so add 1
    var year = date.getFullYear();

    // Ensure that the day and month have leading zeros if needed
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    // Format the date as 'YYYY-MM-DD'
    return day + "." + month + "." + year;
}
