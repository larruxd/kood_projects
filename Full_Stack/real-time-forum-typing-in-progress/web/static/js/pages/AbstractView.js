export default class {
    constructor() {}

    setTitle(title) {
        document.title = title;
    }

    setCss(fileName) {
        if (document.querySelector("#pageCss") !== null) {
            document.querySelector("#pageCss").remove();
        }

        document.querySelector(
            "head"
        ).innerHTML += `<link id="pageCss" rel="stylesheet" type="text/css" href="web/static/css/${fileName}" />`;
    }

    setLinks(data) {
        const nav = document.getElementById("nav");
        nav.innerHTML = "";
        data.forEach((entry) => {
            nav.innerHTML += `<a href="${entry.link}" data-link>${entry.label}</a>`;
        });
    }

    async getHtml() {
        return "";
    }

    async pageAction() {
        return;
    }
}
