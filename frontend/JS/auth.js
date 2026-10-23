// ==========================================
// HOSTEL SURVIVAL MANAGER
// AUTHENTICATION JAVASCRIPT
// ==========================================


// ------------------------------------------
// PASSWORD SHOW / HIDE
// ------------------------------------------

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "🙈";

    } else {

        input.type = "password";
        button.textContent = "👁";

    }
}


// ------------------------------------------
// SHOW MESSAGE
// ------------------------------------------

function showMessage(message, type) {

    const messageBox = document.getElementById("authMessage");

    if (!messageBox) return;

    messageBox.textContent = message;

    messageBox.className = "auth-message " + type;
}


// ------------------------------------------
// SIGNUP
// ------------------------------------------

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms =
            document.getElementById("terms").checked;


        // NAME VALIDATION

        if (name.length < 2) {

            showMessage(
                "Please enter a valid name.",
                "error"
            );

            return;
        }


        // EMAIL VALIDATION

        if (!email.includes("@")) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        // PASSWORD VALIDATION

        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        // CONFIRM PASSWORD

        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        // TERMS

        if (!terms) {

            showMessage(
                "Please accept the terms to continue.",
                "error"
            );

            return;
        }


        // CHECK EXISTING USER

        const existingUser =
            JSON.parse(localStorage.getItem("hostelUser"));


        if (
            existingUser &&
            existingUser.email === email
        ) {

            showMessage(
                "An account with this email already exists.",
                "error"
            );

            return;
        }


        // SAVE USER

        const user = {

            name: name,

            email: email,

            password: password,

            createdAt: new Date().toISOString()

        };


        localStorage.setItem(
            "hostelUser",
            JSON.stringify(user)
        );


        showMessage(
            "Account created successfully! Redirecting...",
            "success"
        );


        // REDIRECT TO LOGIN

        setTimeout(function() {

            window.location.href = "login.html";

        }, 1500);

    });

}


// ------------------------------------------
// LOGIN
// ------------------------------------------

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        // GET SAVED USER

        const savedUser =
            JSON.parse(localStorage.getItem("hostelUser"));


        // NO ACCOUNT

        if (!savedUser) {

            showMessage(
                "No account found. Please create an account first.",
                "error"
            );

            return;
        }


        // CHECK EMAIL

        if (email !== savedUser.email) {

            showMessage(
                "Incorrect email address.",
                "error"
            );

            return;
        }


        // CHECK PASSWORD

        if (password !== savedUser.password) {

            showMessage(
                "Incorrect password.",
                "error"
            );

            return;
        }


        // LOGIN SUCCESS

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );


        localStorage.setItem(
            "currentUser",
            JSON.stringify(savedUser)
        );


        showMessage(
            "Login successful! Opening dashboard...",
            "success"
        );


        setTimeout(function() {

            window.location.href = "dashboard.html";

        }, 1000);

    });

}