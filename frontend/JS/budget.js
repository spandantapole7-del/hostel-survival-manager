// ==========================================
// HOSTEL SURVIVAL MANAGER
// BUDGET MODULE
// ==========================================


// ------------------------------------------
// LOGIN PROTECTION
// ------------------------------------------

const isLoggedIn = localStorage.getItem("isLoggedIn");

const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
);

if (isLoggedIn !== "true" || !currentUser) {

    window.location.href = "login.html";

}


// ------------------------------------------
// ELEMENTS
// ------------------------------------------

const budgetForm =
    document.getElementById("budgetForm");

const message =
    document.getElementById("budgetMessage");


// ------------------------------------------
// FORMAT MONEY
// ------------------------------------------

function formatMoney(amount) {

    return "₹" + Number(amount || 0).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );

}


// ------------------------------------------
// SHOW MESSAGE
// ------------------------------------------

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        "message " + type;

}


// ------------------------------------------
// CALCULATE BUDGET
// ------------------------------------------

function calculateBudget() {

    const total =
        Number(
            document.getElementById("totalMoney").value
        ) || 0;

    const days =
        Number(
            document.getElementById("daysRemaining").value
        ) || 0;

    const food =
        Number(
            document.getElementById("foodBudget").value
        ) || 0;

    const travel =
        Number(
            document.getElementById("travelBudget").value
        ) || 0;

    const other =
        Number(
            document.getElementById("otherBudget").value
        ) || 0;


    const planned =
        food + travel + other;


    const remaining =
        total - planned;


    const dailyLimit =
        days > 0
            ? remaining / days
            : 0;


    const foodAllowance =
        days > 0
            ? food / days
            : 0;


    // UPDATE UI

    document.getElementById("summaryTotal")
        .textContent = formatMoney(total);

    document.getElementById("summaryPlanned")
        .textContent = formatMoney(planned);

    document.getElementById("summaryRemaining")
        .textContent = formatMoney(remaining);

    document.getElementById("remainingMoney")
        .textContent = formatMoney(remaining);

    document.getElementById("dailyLimit")
        .textContent = formatMoney(
            Math.max(0, dailyLimit)
        );

    document.getElementById("foodAllowance")
        .textContent = formatMoney(
            Math.max(0, foodAllowance)
        );

}


// ------------------------------------------
// SAVE BUDGET
// ------------------------------------------

budgetForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const total =
            Number(
                document.getElementById("totalMoney").value
            );

        const days =
            Number(
                document.getElementById("daysRemaining").value
            );

        const food =
            Number(
                document.getElementById("foodBudget").value
            ) || 0;

        const travel =
            Number(
                document.getElementById("travelBudget").value
            ) || 0;

        const other =
            Number(
                document.getElementById("otherBudget").value
            ) || 0;


        // VALIDATION

        if (!total || total <= 0) {

            showMessage(
                "Please enter a valid total amount.",
                "error"
            );

            return;

        }


        if (!days || days <= 0) {

            showMessage(
                "Days remaining must be at least 1.",
                "error"
            );

            return;

        }


        if (
            food < 0 ||
            travel < 0 ||
            other < 0
        ) {

            showMessage(
                "Expenses cannot be negative.",
                "error"
            );

            return;

        }


        const planned =
            food + travel + other;


        // PLANNED EXPENSES CANNOT EXCEED TOTAL

        if (planned > total) {

            showMessage(
                "Your planned expenses cannot be greater than your total available money.",
                "error"
            );

            return;

        }


        // CREATE BUDGET OBJECT

        const budget = {

            userEmail: currentUser.email,

            totalMoney: total,

            daysRemaining: days,

            foodBudget: food,

            travelBudget: travel,

            otherBudget: other,

            createdAt: new Date().toISOString()

        };


        // SAVE TO LOCAL STORAGE

        localStorage.setItem(
            "hostelBudget",
            JSON.stringify(budget)
        );


        // UPDATE CALCULATIONS

        calculateBudget();


        showMessage(
            "Budget saved successfully! Your dashboard has been updated.",
            "success"
        );

    }
);


// ------------------------------------------
// LOAD EXISTING BUDGET
// ------------------------------------------

function loadSavedBudget() {

    const savedBudget =
        JSON.parse(
            localStorage.getItem("hostelBudget")
        );


    if (!savedBudget) {

        calculateBudget();

        return;

    }


    document.getElementById("totalMoney").value =
        savedBudget.totalMoney || "";

    document.getElementById("daysRemaining").value =
        savedBudget.daysRemaining || "";

    document.getElementById("foodBudget").value =
        savedBudget.foodBudget || "";

    document.getElementById("travelBudget").value =
        savedBudget.travelBudget || "";

    document.getElementById("otherBudget").value =
        savedBudget.otherBudget || "";


    calculateBudget();

}


// ------------------------------------------
// LIVE CALCULATION
// ------------------------------------------

const inputs = document.querySelectorAll(
    "#budgetForm input"
);


inputs.forEach(function(input) {

    input.addEventListener(
        "input",
        calculateBudget
    );

});


// ------------------------------------------
// LOGOUT
// ------------------------------------------

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "currentUser"
            );

            window.location.href =
                "login.html";

        }
    );


// ------------------------------------------
// USER INFO
// ------------------------------------------

if (currentUser) {

    document.getElementById(
        "sidebarName"
    ).textContent = currentUser.name;


    document.getElementById(
        "userAvatar"
    ).textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();

}


// ------------------------------------------
// START
// ------------------------------------------

loadSavedBudget();