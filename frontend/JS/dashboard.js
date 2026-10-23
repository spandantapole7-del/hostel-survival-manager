// ======================================
// HOSTEL SURVIVAL MANAGER
// DASHBOARD DATA CONNECTION
// ======================================


// LOGIN CHECK

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}


// CURRENT USER

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "login.html";
}


// ======================================
// ELEMENTS
// ======================================

const welcomeMessage =
    document.getElementById("welcomeMessage");

const userName =
    document.getElementById("userName");

const userAvatar =
    document.getElementById("userAvatar");


// ======================================
// USER INFO
// ======================================

if (currentUser.name) {

    welcomeMessage.textContent =
        `Welcome back, ${currentUser.name}! 👋`;

    userName.textContent =
        currentUser.name;

    userAvatar.textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();
}


// ======================================
// FORMAT MONEY
// ======================================

function formatMoney(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString("en-IN");

}


// ======================================
// GET BUDGET
// ======================================

function getBudget() {

    return JSON.parse(
        localStorage.getItem("hostelBudget")
    );

}


// ======================================
// GET EXPENSES
// ======================================

function getExpenses() {

    const expenses =
        JSON.parse(
            localStorage.getItem("hostelExpenses")
        ) || [];

    return expenses.filter(
        expense =>
            expense.userEmail === currentUser.email
    );

}


// ======================================
// GET CHECKLIST
// ======================================

function getChecklist() {

    const checklist =
        JSON.parse(
            localStorage.getItem("hostelChecklist")
        ) || [];

    return checklist.filter(
        item =>
            item.userEmail === currentUser.email
    );

}


// ======================================
// UPDATE DASHBOARD
// ======================================

function updateDashboard() {

    const budget =
        getBudget();

    const expenses =
        getExpenses();

    const checklist =
        getChecklist();


    // ==================================
    // EXPENSE TOTAL
    // ==================================

    let totalSpent = 0;

    expenses.forEach(expense => {

        totalSpent +=
            Number(expense.amount);

    });


    document.getElementById(
        "totalSpent"
    ).textContent =
        formatMoney(totalSpent);


    // ==================================
    // BUDGET DATA
    // ==================================

    if (budget) {

        const totalMoney =
            Number(budget.totalMoney);

        const daysRemaining =
            Number(budget.daysRemaining);

        const foodBudget =
            Number(budget.foodBudget);

        const travelBudget =
            Number(budget.travelBudget);

        const otherBudget =
            Number(budget.otherBudget);


        // Planned expenses

        const plannedExpenses =
            foodBudget +
            travelBudget +
            otherBudget;


        // Money left after planned expenses

        const plannedRemaining =
            totalMoney -
            plannedExpenses;


        // Actual balance after expenses

        const remainingBalance =
            plannedRemaining -
            totalSpent;


        // Daily spending limit

        const dailyLimit =
            daysRemaining > 0
                ? Math.max(
                    remainingBalance /
                    daysRemaining,
                    0
                )
                : 0;


        // Food allowance

        const foodAllowance =
            daysRemaining > 0
                ? foodBudget /
                  daysRemaining
                : 0;


        // ==================================
        // UPDATE CARDS
        // ==================================

        document.getElementById(
            "remainingBalance"
        ).textContent =
            formatMoney(
                Math.max(
                    remainingBalance,
                    0
                )
            );


        document.getElementById(
            "dailyLimit"
        ).textContent =
            formatMoney(dailyLimit);


        document.getElementById(
            "totalMoney"
        ).textContent =
            formatMoney(totalMoney);


        document.getElementById(
            "daysRemaining"
        ).textContent =
            `${daysRemaining} days`;


        document.getElementById(
            "foodAllowance"
        ).textContent =
            formatMoney(foodAllowance);


        document.getElementById(
            "plannedExpenses"
        ).textContent =
            formatMoney(plannedExpenses);


        // ==================================
        // BUDGET USAGE
        // ==================================

        let percentage = 0;

        if (totalMoney > 0) {

            percentage =
                (
                    (
                        plannedExpenses +
                        totalSpent
                    )
                    /
                    totalMoney
                ) * 100;

        }


        percentage =
            Math.min(
                Math.max(
                    percentage,
                    0
                ),
                100
            );


        document.getElementById(
            "budgetPercentage"
        ).textContent =
            Math.round(percentage) + "%";


        document.getElementById(
            "budgetFill"
        ).style.width =
            percentage + "%";


        // ==================================
        // STATUS MESSAGE
        // ==================================

        const status =
            document.getElementById(
                "budgetStatus"
            );


        if (remainingBalance < 0) {

            status.textContent =
                "⚠️ Your planned and actual expenses have exceeded your available money.";

            status.className =
                "status-box danger";

        }

        else if (percentage >= 80) {

            status.textContent =
                "⚠️ A large portion of your budget has been allocated or spent.";

            status.className =
                "status-box warning";

        }

        else {

            status.textContent =
                "✓ Your budget is currently within the planned amount.";

            status.className =
                "status-box";

        }

    }

    else {

        document.getElementById(
            "remainingBalance"
        ).textContent = "₹0";

        document.getElementById(
            "dailyLimit"
        ).textContent = "₹0";

        document.getElementById(
            "budgetStatus"
        ).textContent =
            "💡 Set up your budget to start tracking your finances.";

    }


    // ==================================
    // RECENT EXPENSES
    // ==================================

    displayRecentExpenses(expenses);


    // ==================================
    // CHECKLIST
    // ==================================

    updateChecklist(checklist);

}


// ======================================
// RECENT EXPENSES
// ======================================

function displayRecentExpenses(expenses) {

    const container =
        document.getElementById(
            "recentExpenses"
        );


    if (expenses.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No expenses recorded yet.
            </div>
        `;

        return;

    }


    const sortedExpenses =
        [...expenses].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    const recentExpenses =
        sortedExpenses.slice(0, 5);


    container.innerHTML = "";


    recentExpenses.forEach(expense => {

        let icon = "💰";


        if (expense.category === "Food") {
            icon = "🍔";
        }

        else if (expense.category === "Travel") {
            icon = "🚌";
        }

        else if (expense.category === "Shopping") {
            icon = "🛍️";
        }

        else if (expense.category === "Education") {
            icon = "📚";
        }

        else if (expense.category === "Other") {
            icon = "💰";
        }


        const row =
            document.createElement("div");

        row.className =
            "expense-row";


        const date =
            new Date(
                expense.date
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short"
                }
            );


        row.innerHTML = `

            <div class="expense-left">

                <div class="expense-icon">
                    ${icon}
                </div>

                <div>

                    <div class="expense-name">
                        ${escapeHTML(expense.name)}
                    </div>

                    <div class="expense-date">
                        ${date}
                    </div>

                </div>

            </div>

            <div class="expense-amount">
                ${formatMoney(expense.amount)}
            </div>

        `;


        container.appendChild(row);

    });

}


// ======================================
// CHECKLIST
// ======================================

function updateChecklist(checklist) {

    const total =
        checklist.length;


    const completed =
        checklist.filter(
            item => item.completed
        ).length;


    const percentage =
        total > 0
            ? Math.round(
                (
                    completed /
                    total
                ) * 100
            )
            : 0;


    document.getElementById(
        "checkPercentage"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "checkText"
    ).textContent =
        `${completed} of ${total} items completed`;


    const circle =
        document.getElementById(
            "checkCircle"
        );


    circle.style.background =
        `conic-gradient(
            #6c63ff ${percentage}%,
            #f0eeff ${percentage}%
        )`;

}


// ======================================
// ESCAPE HTML
// ======================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ======================================
// LOGOUT
// ======================================

document
    .getElementById("logoutBtn")
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


// ======================================
// START
// ======================================

updateDashboard();