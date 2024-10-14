import { navigateTo } from "../index.js";
import AbstractView from "./AbstractView.js";
import { handleErrorFromServer, isAuthorized } from "../common.js";
import { socket } from "../webSocket.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Log out from forum");
    }

    async getHtml() {
        return ``;
    }

    async pageAction() {
        logout();
    }
}

async function logout() {
    if (await isAuthorized()) {
        const user = JSON.parse(sessionStorage.getItem("user"));

        try {
            let url = `/logout?UserID=${user.UserID}`;
            let response = await fetch(url);
            logoutAction(response);
        } catch (e) {
            console.error(e);
            return false;
        }
    } else {
        navigateTo("/");
    }
}

async function logoutAction(response) {
    if (response.ok) {
        //console.log("closing socket?: ", socket)
        socket.close()
        localStorage.clear();
        sessionStorage.clear();
        deleteAllCookies();

        navigateTo("/login");
    } else {
        handleErrorFromServer();
    }
}

export function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
