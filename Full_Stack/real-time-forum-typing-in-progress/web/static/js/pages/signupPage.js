import AbstractView from "./AbstractView.js";
import { navigateTo } from "../index.js";
import { handleErrorFromServer, APIfetch } from "../common.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Sign up to forum");
        this.setCss("signup.css");
        this.setLinks([{ link: "/login", label: "Log In" }]);
    }

    async getHtml() {
        return `
            <form id="signup-form">
                <div class="signup-container">
                    <h1>Sign Up</h1>
                    <p>Please fill in this form to create an account.</p>
                    <hr />
                    <label for="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        name="username"
                        maxlength="20"
                        required
                    />
                    <span id="username-error" class="error"></span>

                    <label for="email">Email</label>
                    <input 
                        id="email" 
                        type="text" 
                        placeholder="Enter Email" 
                        name="email"
                        maxlength="30"  
                        required
                    />
                    <span id="email-error" class="error"></span>

                    <label for="first-name">First Name</label>
                    <input
                        id="first-name"
                        type="text"
                        placeholder="Enter first Name"
                        name="first-name"
                        maxlength="20"
                    />
                    <span id="first-name-error" class="error"></span>

                    <label for="last-name">Last Name</label>
                    <input
                        id="last-name"
                        type="text"
                        placeholder="Enter Last Name"
                        name="last-name"
                        maxlength="20"
                    />
                    <span id="last-name-error" class="error"></span>

                    <label for="age">Age</label>
                    <input 
                        id="age" 
                        type="text" 
                        placeholder="Enter age" 
                        name="age" 
                        min="1"
                        max="122"
                        maxlength="3"
                    />
                    <span id="age-error" class="error"></span>

                    <label for="gender">Gender</label>
                    <select id="gender" name="gender">
                        <option value="">-</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <label for="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        maxlength="35"
                        required
                    />
                    <span id="password-error" class="error"></span>

                    <label for="password-repeat">Repeat Password</label>
                    <input
                        id="password-repeat"
                        type="password"
                        placeholder="Repeat Password"
                        name="password-repeat"
                        maxlength="35"
                        required
                    />
                    <span id="password-repeat-error" class="error"></span>

                    <span id="signupSuccess"></span>
                    <div class="clearfix">
                        <button type="button" class="cancelbtn" id="cancelbtn">Cancel</button>
                        <button type="submit" class="signupbtn" id="signupbtn">Sign Up</button>
                    </div>
                    
                </div>
            </form>
    `;
    }

    async pageAction() {
        register();
    }
}

async function register() {
    const signupForm = document.getElementById("signup-form");

    // cancel button redirects to /login
    document.getElementById("cancelbtn").addEventListener("click", () => {
        navigateTo("/login");
    });
    // fetch list of users and email and validate entered data
    await APIfetch("/list-users-emails", "POST").then((data) => {
        validateUsername("username", data.Users);
        validateEmail("email", data.Emails);
    });
    validateAge("age");
    validateFirstLastname("first-name", "last-name");
    validatePassword("password", "password-repeat");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        let formData = new FormData(signupForm);
        let data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        console.log(data);

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
            await fetch("/user-signup", options).then(async (response) => {
                if (response.ok) {
                    console.log("Signup successful");
                    document.querySelector("#signupSuccess").innerHTML =
                        "Signup Successful<br>Redirecting to login page";

                    // sleep so time to read
                    await new Promise((r) => setTimeout(r, 1000));
                    navigateTo("/login");
                } else {
                    handleErrorFromServer(response);
                }
            });
        } catch (e) {
            console.error(e);
        }
    });
}

/* function isValidSignupRequest() {
    const errors = document.querySelectorAll("span");
    errors.forEach((error) => {});
} */

function validateUsername(id, userList) {
    const formElem = document.getElementById(id);
    const regex = /^[A-Za-z\d\_]+$/;

    formElem.addEventListener("input", () => {
        const valid = formElem.value.match(regex);

        if (isTaken(userList, formElem.value)) {
            showError(id, "Username already in use");
            disableSignupBtn();
        } else if (formElem.value.length < 3) {
            showError(id, "Username is too short");
            disableSignupBtn();
        } else if (formElem.value.length > 20) {
            showError(id, "Username too long");
            disableSignupBtn();
        } else if (!valid) {
            showError(id, "Username contains invalid character(s)");
            disableSignupBtn();
        } else {
            clearError(id);
            enableSignupBtn();
        }

        if (formElem.value == "") {
            clearError(id);
            disableSignupBtn();
        }
    });
}

function validateEmail(id, emailList) {
    const formElem = document.getElementById(id);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formElem.addEventListener("input", () => {
        const valid = formElem.value.match(regex);

        if (isTaken(emailList, formElem.value)) {
            showError(id, "Email already in use");
            disableSignupBtn();
        } else if (!valid) {
            showError(id, "Not a valid email address");
            disableSignupBtn();
        } else {
            clearError(id);
            enableSignupBtn();
        }

        if (formElem.value == "") {
            clearError(id);
            disableSignupBtn();
        }
    });
}

function validateAge(id) {
    const formElem = document.getElementById(id);
    const regex = /^\d+$/;

    formElem.addEventListener("input", () => {
        const valid = formElem.value.match(regex);

        if (!valid) {
            showError(id, "Has to be a number");
            disableSignupBtn();
        } else if (formElem.value < 13) {
            showError(id, "Too young to register");
            disableSignupBtn();
        } else if (formElem.value > 122) {
            showError(id, "Not a valid age");
            disableSignupBtn();
        } else {
            clearError(id);
            enableSignupBtn();
        }

        if (formElem.value == "") {
            clearError(id);
            disableSignupBtn();
        }
    });
}

function validateFirstLastname(id1, id2) {
    const firstNameElem = document.getElementById(id1);
    const lastNameElem = document.getElementById(id2);

    const regex =
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

    firstNameElem.addEventListener("input", () => {
        const valid = firstNameElem.value.match(regex);

        if (!valid) {
            showError(id1, "Contains invalid character(s)");
            disableSignupBtn();
        } else {
            clearError(id1);
            enableSignupBtn();
        }

        if (firstNameElem.value == "") {
            clearError(id1);
            disableSignupBtn();
        }
    });
    lastNameElem.addEventListener("input", () => {
        const valid = lastNameElem.value.match(regex);

        if (!valid) {
            showError(id2, "Contains invalid character(s)");
            disableSignupBtn();
        } else {
            clearError(id2);
            enableSignupBtn();
        }

        if (lastNameElem.value == "") {
            clearError(id2);
            disableSignupBtn();
        }
    });
}

function validatePassword(id1, id2) {
    const passwordElem = document.getElementById(id1);
    const passwordRepeatElem = document.getElementById(id2);

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    passwordElem.addEventListener("input", () => {
        const valid = passwordElem.value.match(regex);

        if (!valid) {
            showError(
                id1,
                `Minimum eight characters, 
                at least one uppercase letter, 
                one lowercase letter and one number`
            );
            disableSignupBtn();
        } else {
            clearError(id1);
            enableSignupBtn();
        }

        if (passwordElem.value == "") {
            clearError(id1);
            disableSignupBtn();
        }
    });
    passwordRepeatElem.addEventListener("input", () => {
        if (passwordElem.value !== passwordRepeatElem.value) {
            showError(id2, "Passwords do not match");
            disableSignupBtn();
        } else {
            clearError(id2);
            enableSignupBtn();
        }

        if (passwordRepeatElem.value == "") {
            clearError(id2);
            disableSignupBtn();
        }
    });
}

function isTaken(list, subject) {
    if (Object.values(list).indexOf(subject) > -1) {
        console.log("taken");
        return true;
    } else {
        return false;
    }
}

function showError(id, errorMessage) {
    const errorElement = document.getElementById(id + "-error");
    errorElement.textContent = errorMessage;
}

// Function to clear error message
function clearError(id) {
    const errorElement = document.getElementById(id + "-error");
    errorElement.textContent = "";
}

function disableSignupBtn() {
    document.querySelector("#signupbtn").disabled = true;
}
function enableSignupBtn() {
    document.querySelector("#signupbtn").disabled = false;
}
