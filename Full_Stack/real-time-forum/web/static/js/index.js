// https://www.youtube.com/watch?v=6BozpmSjk-Y

import homePage from "./pages/homePage.js";
import errorpPage from "./pages/errorpPage.js";
import loginPage from "./pages/loginPage.js";
import logoutPage from "./pages/logoutPage.js";
import signupPage from "./pages/signupPage.js";
import { isAuthorized } from "./common.js";


export const navigateTo = (url, arg = "") => {
    history.pushState(null, null, url);
    router(arg);
};

const router = async (arg) => {
    const routes = [
        { path: "/error", view: errorpPage },
        { path: "/", view: homePage },
        { path: "/login", view: loginPage },
        { path: "/logout", view: logoutPage },
        { path: "/signup", view: signupPage },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: location.pathname === route.path,
        };
    });

    let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true,
        };
        arg = "Page Not Found";
    }

    const view = new match.route.view(arg);

    document.querySelector("#app").innerHTML = await view.getHtml();
    await view.pageAction(); 
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});

