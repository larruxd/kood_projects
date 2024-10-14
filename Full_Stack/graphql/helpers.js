export function isAuthorized() {
    // Get the JWT token from the cookie
    // const cookies = document.cookie.split("; ");
    // console.log(cookies);
    // const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));

    const jwt = sessionStorage.getItem("jwt");

    // If the JWT cookie is found
    if (jwt) {
        return true;
    }
    return false;
}

export function clearJwtCookie() {
    const cookies = document.cookie.split(";");
    const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));
    if (jwtCookie) {
        const eqPos = jwtCookie.indexOf("=");
        const name = eqPos > -1 ? jwtCookie.substr(0, eqPos) : jwtCookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

export function getJwtToken() {
    // const cookies = document.cookie.split("; ");
    // const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));
    // return jwtCookie.slice(4);
    return sessionStorage.getItem("jwt");
}
