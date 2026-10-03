// ==========================================
// HOSTEL SURVIVAL MANAGER
// EXPENSE MODULE
// ==========================================


// ------------------------------------------
// LOGIN PROTECTION
// ------------------------------------------

const isLoggedIn =
    localStorage.getItem("isLoggedIn");

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser") || "null"
    );


if (
    isLoggedIn !== "true" ||
    !currentUser
) {

    window.location.href = "login.html";

}


// ------------------------------------------
// ELEMENTS
// ------------------------------------------

const expenseForm =
    document.getElementById("expenseForm");

const expenseList =
    document.getElementById("expenseList");

const expenseMessage =
    document.getElementById("expenseMessage");

const categoryFilter =
    document.getElementById("categoryFilter");


// ------------------------------------------
// TODAY'S DATE
// ------------------------------------------

document.getElementById("expenseDate").value =
    new Date().toISOString().split("T")[0];


// ------------------------------------------
// FORMAT MONEY
// ------------------------------------------

function formatMoney(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString(
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

    expenseMessage.textContent = text;

    expenseMessage.className =
        "message " + type;

}


// ------------------------------------------
// GET EXPENSES
// ------------------------------------------

function getExpenses() {

    return JSON.parse(
        localStorage.getItem("hostelExpenses") || "[]"
    );

}


// ------------------------------------------
// SAVE EXPENSES
// ------------------------------------------

function saveExpenses(expenses) {

    localStorage.setItem(
        "hostelExpenses",
        JSON.stringify(expenses)
    );

}


// ------------------------------------------
// ADD EXPENSE
// ------------------------------------------

expenseForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "expenseName"
            ).value.trim();


        const amount =
            Number(
                document.getElementById(
                    "expenseAmount"
                ).value
            );


        const category =
            document.getElementById(
                "expenseCategory"
            ).value;


        const date =
            document.getElementById(
                "expenseDate"
            ).value;


        // VALIDATION

        if (!name) {

            showMessage(
                "Please enter an expense name.",
                "error"
            );

            return;

        }


        if (!amount || amount <= 0) {

            showMessage(
                "Please enter a valid amount greater than ₹0.",
                "error"
            );

            return;

        }


        if (!category) {

            showMessage(
                "Please select a category.",
                "error"
            );

            return;

        }


        if (!date) {

            showMessage(
                "Please select a date.",
                "error"
            );

            return;

        }


        // GET EXISTING

        const expenses =
            getExpenses();


        // CREATE EXPENSE

        const newExpense = {

            id:
                Date.now(),

            userEmail:
                currentUser.email,

            name:
                name,

            amount:
                amount,

            category:
                category,

            date:
                date

        };


        // ADD

        expenses.push(
            newExpense
        );


        // SAVE

        saveExpenses(
            expenses
        );


        // RESET

        expenseForm.reset();


        document.getElementById(
            "expenseDate"
        ).value =
            new Date()
                .toISOString()
                .split("T")[0];


        showMessage(
            "Expense added successfully!",
            "success"
        );


        renderExpenses();

    }
);


// ------------------------------------------
// RENDER EXPENSES
// ------------------------------------------

function renderExpenses() {

    const allExpenses =
        getExpenses();


    // ONLY CURRENT USER

    const userExpenses =
        allExpenses.filter(
            expense =>
                expense.userEmail ===
                currentUser.email
        );


    const selectedCategory =
        categoryFilter.value;


    let filteredExpenses =
        userExpenses;


    if (
        selectedCategory !==
        "All"
    ) {

        filteredExpenses =
            userExpenses.filter(
                expense =>
                    expense.category ===
                    selectedCategory
            );

    }


    // SORT NEWEST FIRST

    filteredExpenses.sort(
        function(a, b) {

            return (
                new Date(b.date) -
                new Date(a.date)
            );

        }
    );


    // EMPTY

    if (
        filteredExpenses.length ===
        0
    ) {

        expenseList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🧾
                </div>

                No expenses found.

                <br>

                Add your first expense
                to start tracking.

            </div>

        `;

        updateSummary(
            userExpenses
        );

        return;

    }


    // ICONS

    const icons = {

        Food: "🍔",

        Travel: "🚌",

        Shopping: "🛍️",

        Education: "📚",

        Other: "💳"

    };


    expenseList.innerHTML =
        filteredExpenses.map(
            function(expense) {

                return `

                    <div class="expense-item">

                        <div class="expense-icon">

                            ${
                                icons[
                                    expense.category
                                ] || "💳"
                            }

                        </div>


                        <div class="expense-info">

                            <div class="expense-name">

                                ${escapeHTML(
                                    expense.name
                                )}

                            </div>

                            <div class="expense-meta">

                                ${
                                    escapeHTML(
                                        expense.category
                                    )
                                }
                                ·
                                ${
                                    formatDate(
                                        expense.date
                                    )
                                }

                            </div>

                        </div>


                        <div class="expense-amount">

                            -${formatMoney(
                                expense.amount
                            )}

                        </div>


                        <button
                            class="delete-button"
                            onclick="deleteExpense(${expense.id})"
                            title="Delete expense"
                        >
                            ×
                        </button>

                    </div>

                `;

            }
        ).join("");


    updateSummary(
        userExpenses
    );

}


// ------------------------------------------
// DELETE EXPENSE
// ------------------------------------------

function deleteExpense(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {
        return;
    }


    const expenses =
        getExpenses();


    const updatedExpenses =
        expenses.filter(
            expense =>
                expense.id !== id
        );


    saveExpenses(
        updatedExpenses
    );


    renderExpenses();


    showMessage(
        "Expense deleted successfully.",
        "success"
    );

}


// ------------------------------------------
// SUMMARY
// ------------------------------------------

function updateSummary(
    expenses
) {

    const total =
        expenses.reduce(
            function(sum, expense) {

                return (
                    sum +
                    Number(
                        expense.amount
                    )
                );

            },
            0
        );


    document.getElementById(
        "totalSpent"
    ).textContent =
        formatMoney(total);


    document.getElementById(
        "expenseCount"
    ).textContent =
        expenses.length;


    // GET BUDGET

    const budget =
        JSON.parse(
            localStorage.getItem(
                "hostelBudget"
            ) || "null"
        );


    if (budget) {

        const remaining =
            Number(
                budget.totalMoney
            ) - total;


        document.getElementById(
            "remainingBalance"
        ).textContent =
            formatMoney(
                remaining
            );

    } else {

        document.getElementById(
            "remainingBalance"
        ).textContent =
            "Set budget";

    }

}


// ------------------------------------------
// DATE FORMAT
// ------------------------------------------

function formatDate(date) {

    if (!date) {
        return "";
    }


    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


// ------------------------------------------
// HTML ESCAPE
// ------------------------------------------

function escapeHTML(value) {

    return String(value).replace(
        /[&<>"']/g,
        function(character) {

            return {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#39;"

            }[character];

        }
    );

}


// ------------------------------------------
// FILTER
// ------------------------------------------

categoryFilter.addEventListener(
    "change",
    renderExpenses
);


// ------------------------------------------
// USER INFO
// ------------------------------------------

if (currentUser) {

    document.getElementById(
        "sidebarName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "userAvatar"
    ).textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();

}


// ------------------------------------------
// LOGOUT
// ------------------------------------------

document
    .getElementById(
        "logoutButton"
    )
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
// INITIALIZE
// ------------------------------------------

renderExpenses();