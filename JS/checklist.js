// ===============================
// HOSTEL SURVIVAL MANAGER
// CHECKLIST MODULE
// ===============================


// LOGIN PROTECTION

const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}


// CURRENT USER

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if (!currentUser) {
    window.location.href = "login.html";
}


// ELEMENTS

const checklistForm =
    document.getElementById("checklistForm");

const itemInput =
    document.getElementById("itemInput");

const checklistContainer =
    document.getElementById("checklistContainer");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const clearBtn =
    document.getElementById("clearBtn");

const message =
    document.getElementById("message");


// USER INFORMATION

const userName =
    document.getElementById("userName");

const userAvatar =
    document.getElementById("userAvatar");

if (currentUser.name) {

    userName.textContent =
        currentUser.name;

    userAvatar.textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();
}


// STORAGE KEY

const STORAGE_KEY = "hostelChecklist";


// GET CHECKLIST

function getChecklist() {

    const allItems =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    return allItems.filter(
        item =>
            item.userEmail === currentUser.email
    );
}


// SAVE CHECKLIST

function saveChecklist(items) {

    const allItems =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    const otherUsersItems =
        allItems.filter(
            item =>
                item.userEmail !== currentUser.email
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
            ...otherUsersItems,
            ...items
        ])
    );
}


// SHOW MESSAGE

function showMessage(text) {

    message.textContent = text;
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 2000);
}


// RENDER CHECKLIST

function renderChecklist() {

    const items = getChecklist();

    checklistContainer.innerHTML = "";


    // EMPTY STATE

    if (items.length === 0) {

        checklistContainer.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🏠
                </div>

                <h3>No checklist items yet</h3>

                <p>
                    Add things you need for your hostel life above.
                </p>

            </div>
        `;

        updateProgress(items);

        return;
    }


    // CREATE ITEMS

    items.forEach(item => {

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "check-item";

        if (item.completed) {
            itemElement.classList.add("completed");
        }


        itemElement.innerHTML = `

            <div class="item-left">

                <input
                    type="checkbox"
                    class="item-checkbox"
                    ${item.completed ? "checked" : ""}
                    onchange="toggleItem(${item.id})"
                >

                <span class="item-name">
                    ${escapeHTML(item.name)}
                </span>

            </div>

            <button
                class="delete-item"
                onclick="deleteItem(${item.id})"
                title="Delete item">

                🗑️

            </button>
        `;


        checklistContainer.appendChild(
            itemElement
        );

    });


    updateProgress(items);
}


// UPDATE PROGRESS

function updateProgress(items) {

    const total =
        items.length;

    const completed =
        items.filter(
            item => item.completed
        ).length;


    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressPercent.textContent =
        percentage + "%";

    progressFill.style.width =
        percentage + "%";

    progressText.textContent =
        `${completed} of ${total} items completed`;
}


// ADD ITEM

checklistForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const itemName =
            itemInput.value.trim();


        // VALIDATION

        if (itemName === "") {

            showMessage(
                "Please enter an item."
            );

            return;
        }


        const items =
            getChecklist();


        // DUPLICATE CHECK

        const alreadyExists =
            items.some(
                item =>
                    item.name.toLowerCase() ===
                    itemName.toLowerCase()
            );


        if (alreadyExists) {

            showMessage(
                "This item is already on your checklist."
            );

            return;
        }


        // NEW ITEM

        const newItem = {

            id: Date.now(),

            userEmail:
                currentUser.email,

            name:
                itemName,

            completed:
                false

        };


        items.push(newItem);

        saveChecklist(items);


        itemInput.value = "";

        renderChecklist();

        showMessage(
            "Item added successfully! ✓"
        );

    }
);


// TOGGLE ITEM

function toggleItem(id) {

    const items =
        getChecklist();


    const item =
        items.find(
            item => item.id === id
        );


    if (!item) return;


    item.completed =
        !item.completed;


    saveChecklist(items);

    renderChecklist();
}


// DELETE ITEM

function deleteItem(id) {

    const items =
        getChecklist();


    const updatedItems =
        items.filter(
            item => item.id !== id
        );


    saveChecklist(updatedItems);

    renderChecklist();

    showMessage(
        "Item deleted."
    );
}


// CLEAR COMPLETED

clearBtn.addEventListener(
    "click",
    function() {

        const items =
            getChecklist();


        const completedItems =
            items.filter(
                item => item.completed
            );


        if (completedItems.length === 0) {

            showMessage(
                "There are no completed items to clear."
            );

            return;
        }


        const remainingItems =
            items.filter(
                item => !item.completed
            );


        saveChecklist(remainingItems);

        renderChecklist();

        showMessage(
            "Completed items cleared."
        );

    }
);


// ESCAPE HTML

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


// LOGOUT

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


// INITIAL LOAD

renderChecklist();