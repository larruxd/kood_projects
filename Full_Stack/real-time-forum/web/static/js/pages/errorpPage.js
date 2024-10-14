import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(arg) {
        super();
        this.setTitle("Error");
        this.setLinks([
            { link: "/", label: "Home" },
            { link: "/logout", label: "Log out" },
        ]);

        if (arg == undefined) arg = "";
        this.errorMessage = arg;
    }

    async getHtml() {
        return `<div>
                    <h1>Error</h1>
                    <h3>${this.errorMessage}</h3>
                </div>`;
    }

    async pageAction() {}
}
