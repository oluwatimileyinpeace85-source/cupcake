// ========================================
// AURORA CAKES - AUTHENTICATION
// ========================================


// ========================================
// LOCAL STORAGE HELPERS
// ========================================

function getJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        return value ? JSON.parse(value) : fallback;

    } catch (error) {

        console.error("Could not read localStorage:", error);

        return fallback;
    }
}


function setJSON(key, value) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}


function getCurrentUser() {

    return getJSON(
        "ac_user",
        null
    );
}


// ========================================
// AUTH PAGE
// ========================================

function initAuth() {

    const shell =
        document.getElementById("authShell");

    if (!shell) {
        return;
    }


    // ====================================
    // IMPORTANT:
    // If a user is already logged in,
    // don't allow them to stay on auth.html.
    // ====================================

    if (getCurrentUser()) {

        window.location.replace("index.html");

        return;
    }


    // ====================================
    // GET LOGIN & SIGNUP PANELS
    // ====================================

    const loginPanel =
        document.getElementById("loginPanel");

    const signupPanel =
        document.getElementById("signupPanel");


    if (!loginPanel || !signupPanel) {

        console.error(
            "Login or signup panel could not be found."
        );

        return;
    }


    // ====================================
    // SWITCH TO SIGNUP
    // ====================================

    function showSignup() {

        shell.classList.add("signup-mode");

        loginPanel.setAttribute(
            "aria-hidden",
            "true"
        );

        signupPanel.setAttribute(
            "aria-hidden",
            "false"
        );


        const loginMessage =
            document.getElementById("loginMessage");

        const signupMessage =
            document.getElementById("signupMessage");


        if (loginMessage) {
            loginMessage.textContent = "";
        }

        if (signupMessage) {
            signupMessage.textContent = "";
        }
    }


    // ====================================
    // SWITCH TO LOGIN
    // ====================================

    function showLogin() {

        shell.classList.remove("signup-mode");

        loginPanel.setAttribute(
            "aria-hidden",
            "false"
        );

        signupPanel.setAttribute(
            "aria-hidden",
            "true"
        );


        const loginMessage =
            document.getElementById("loginMessage");

        const signupMessage =
            document.getElementById("signupMessage");


        if (loginMessage) {
            loginMessage.textContent = "";
        }

        if (signupMessage) {
            signupMessage.textContent = "";
        }
    }


    // ====================================
    // SIGNUP BUTTONS
    // ====================================

    document
        .querySelectorAll("[data-signup]")
        .forEach(button => {

            button.addEventListener(
                "click",
                showSignup
            );

        });


    // ====================================
    // LOGIN BUTTONS
    // ====================================

    document
        .querySelectorAll("[data-login]")
        .forEach(button => {

            button.addEventListener(
                "click",
                showLogin
            );

        });


    // ====================================
    // PASSWORD SHOW / HIDE
    // ====================================

    document
        .querySelectorAll("[data-toggle-password]")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const input =
                        button
                            .closest(".input-line")
                            ?.querySelector("input");


                    if (!input) {
                        return;
                    }


                    if (input.type === "password") {

                        input.type = "text";

                        button.textContent = "🔓";

                        button.setAttribute(
                            "aria-label",
                            "Hide password"
                        );

                    } else {

                        input.type = "password";

                        button.textContent = "🔒";

                        button.setAttribute(
                            "aria-label",
                            "Show password"
                        );
                    }

                }
            );

        });


    // ========================================
    // SIGN UP
    // ========================================

    const signupForm =
        document.getElementById("signupForm");


    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            function (event) {

                // VERY IMPORTANT:
                // Prevent the browser from putting
                // email/password in the URL.

                event.preventDefault();


                const form =
                    new FormData(signupForm);


                const name =
                    (form.get("name") || "")
                        .trim();


                const email =
                    (form.get("email") || "")
                        .trim()
                        .toLowerCase();


                const password =
                    form.get("password") || "";


                const message =
                    document.getElementById(
                        "signupMessage"
                    );


                // =================================
                // VALIDATION
                // =================================

                if (!name || !email || !password) {

                    if (message) {

                        message.textContent =
                            "Please fill in all fields.";

                    }

                    return;
                }


                if (password.length < 6) {

                    if (message) {

                        message.textContent =
                            "Password must be at least 6 characters.";

                    }

                    return;
                }


                // =================================
                // GET EXISTING USERS
                // =================================

                const users =
                    getJSON(
                        "ac_users",
                        []
                    );


                // =================================
                // CHECK EXISTING EMAIL
                // =================================

                const existingUser =
                    users.find(
                        user =>
                            user.email === email
                    );


                if (existingUser) {

                    if (message) {

                        message.textContent =
                            "An account with this email already exists. Please login.";

                    }

                    return;
                }


                // =================================
                // CREATE NEW USER
                // =================================

                const newUser = {

                    name: name,

                    email: email,

                    password: password

                };


                // =================================
                // SAVE USER
                // =================================

                users.push(newUser);

                setJSON(
                    "ac_users",
                    users
                );


                // =================================
                // LOG USER IN
                // =================================

                setJSON(
                    "ac_user",
                    newUser
                );


                // =================================
                // GO TO WEBSITE
                // =================================

                window.location.replace(
                    "index.html"
                );

            }
        );

    }


    // ========================================
    // LOGIN
    // ========================================

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                // Prevent normal HTML form submission.
                event.preventDefault();


                const form =
                    new FormData(loginForm);


                const email =
                    (form.get("email") || "")
                        .trim()
                        .toLowerCase();


                const password =
                    form.get("password") || "";


                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                // =================================
                // GET USERS
                // =================================

                const users =
                    getJSON(
                        "ac_users",
                        []
                    );


                // =================================
                // FIND USER
                // =================================

                const foundUser =
                    users.find(
                        user =>
                            user.email === email &&
                            user.password === password
                    );


                // =================================
                // WRONG LOGIN
                // =================================

                if (!foundUser) {

                    if (message) {

                        message.textContent =
                            "Email or password is incorrect.";

                    }

                    return;
                }


                // =================================
                // LOGIN SUCCESSFUL
                // =================================

                setJSON(
                    "ac_user",
                    foundUser
                );


                // =================================
                // GO TO WEBSITE
                // =================================

                window.location.replace(
                    "index.html"
                );

            }
        );

    }


    // ========================================
    // FORGOT PASSWORD
    // ========================================

    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                alert(
                    "Password recovery will be available soon. Please contact Aurora Cakes."
                );

            }
        );

    }


    // ========================================
    // START ON LOGIN
    // ========================================

    showLogin();

}


// ========================================
// START AUTHENTICATION
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    initAuth
);