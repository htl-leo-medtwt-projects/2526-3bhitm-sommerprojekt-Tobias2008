loadPage();

let relations = {};

/* LOAD PAGE */

function loadPage() {

    fetch(
        "../php/friends.php?action=getRelations"
    )

        .then(res => res.json())

        .then(data => {

            if (data.success) {

                relations = data.data;
            }

            loadUsers();
            loadFriends();
            loadRequests();
        });
}


/* TOGGLE */

function toggleFriendsSection(id) {

    const element =
        document.getElementById(id);

    element.classList.toggle("active");
}


/* TEMPLATE */

function createUserHTML(
    username,
    buttonsHTML
) {

    return `

    <div class="friend-user">

        <div class="friend-name">
            ${username}
        </div>

        <div class="friend-buttons">

            ${buttonsHTML}

        </div>

    </div>
    `;
}


/* BUTTON CREATION */

function createButton(
    text,
    className,
    callback
) {

    const button =
        document.createElement("button");

    button.className =
        `friend-btn ${className}`;

    button.innerText = text;

    button.addEventListener(
        "click",
        callback
    );

    return button;
}


/* USERS */

function loadUsers() {

    fetch("../php/friends.php?action=getAllUsers")

        .then(res => res.json())

        .then(data => {

            const container =
                document.getElementById("users");

            container.innerHTML = "";

            if (!data.success || !data.data) {

                container.innerHTML =
                    `<div class="empty">
                Error loading users
            </div>`;

                return;
            }

            if (data.data.length === 0) {

                container.innerHTML =
                    `<div class="empty">
                No users found
            </div>`;

                return;
            }

            data.data.forEach(user => {

                const wrapper =
                    document.createElement("div");

                wrapper.innerHTML =
                    createUserHTML(user, "");

                const card =
                    wrapper.firstElementChild;

                const buttons =
                    card.querySelector(".friend-buttons");


                /* ALREADY ADDED */

                if (relations[user]) {

                    const addedBtn =
                        document.createElement("button");

                    addedBtn.className =
                        "friend-btn remove-btn";

                    addedBtn.innerText =
                        "Added";

                    addedBtn.disabled = true;

                    addedBtn.style.opacity = "0.5";

                    addedBtn.style.cursor = "default";

                    buttons.appendChild(addedBtn);

                }

                /* NOT ADDED */

                else {

                    const addBtn =
                        createButton(
                            "Add",
                            "add-btn",
                            () => addFriend(user, addBtn)
                        );

                    buttons.appendChild(addBtn);
                }

                container.appendChild(card);
            });
        })

        .catch(error => {

            console.error(error);
        });
}


/* ADD FRIEND */

function addFriend(user, buttonElement) {

    const formData =
        new FormData();

    formData.append(
        "friend",
        user
    );

    fetch(
        "../php/friends.php?action=addFriend",
        {
            method: "POST",
            body: formData
        }
    )

        .then(res => res.json())

        .then(data => {

            if (data.success) {

                showPopup(
                    "Friend request sent",
                    "success"
                );

                /* BUTTON DIRECTLY CHANGE */

                buttonElement.innerText =
                    "Added";

                buttonElement.disabled = true;

                buttonElement.classList.remove(
                    "add-btn"
                );

                buttonElement.classList.add(
                    "remove-btn"
                );

                buttonElement.style.opacity =
                    "0.5";

                buttonElement.style.cursor =
                    "default";

            } else {

                showPopup(
                    data.error || "Error",
                    "error"
                );
            }
        })

        .catch(error => {

            console.error(error);
        });
}


/* REQUESTS */

function loadRequests() {

    fetch("../php/friends.php?action=getRequests")

        .then(res => res.json())

        .then(data => {

            const container =
                document.getElementById("requests");

            container.innerHTML = "";

            if (!data.success || !data.data) {

                container.innerHTML =
                    `<div class="empty">
                Error loading requests
            </div>`;

                return;
            }

            if (data.data.length === 0) {

                container.innerHTML =
                    `<div class="empty">
                No friend requests
            </div>`;

                return;
            }

            data.data.forEach(user => {

                const wrapper =
                    document.createElement("div");

                wrapper.innerHTML =
                    createUserHTML(user, "");

                const card =
                    wrapper.firstElementChild;

                const buttons =
                    card.querySelector(".friend-buttons");

                const acceptBtn =
                    createButton(
                        "Accept",
                        "accept-btn",
                        () => acceptRequest(user)
                    );

                const declineBtn =
                    createButton(
                        "Decline",
                        "decline-btn",
                        () => declineRequest(user)
                    );

                buttons.appendChild(acceptBtn);
                buttons.appendChild(declineBtn);

                container.appendChild(card);
            });
        })

        .catch(error => {

            console.error(error);
        });
}


/* ACCEPT */

function acceptRequest(user) {

    const formData =
        new FormData();

    formData.append(
        "friend",
        user
    );

    fetch(
        "../php/friends.php?action=acceptRequest",
        {
            method: "POST",
            body: formData
        }
    )

        .then(res => res.json())

        .then(data => {

            if (data.success) {

                showPopup(
                    "Friend added",
                    "success"
                );

                loadPage();

            } else {

                showPopup(
                    data.error || "Error",
                    "error"
                );
            }
        });
}


/* DECLINE */

function declineRequest(user) {

    const formData =
        new FormData();

    formData.append(
        "friend",
        user
    );

    fetch(
        "../php/friends.php?action=declineRequest",
        {
            method: "POST",
            body: formData
        }
    )

        .then(res => res.json())

        .then(data => {

            if (data.success) {

                showPopup(
                    "Request removed",
                    "success"
                );

                loadPage();

            } else {

                showPopup(
                    data.error || "Error",
                    "error"
                );
            }
        });
}


/* FRIENDS */

function loadFriends() {

    fetch("../php/friends.php?action=getFriends")

        .then(res => res.json())

        .then(data => {

            const container =
                document.getElementById("friends");

            container.innerHTML = "";

            if (!data.success || !data.data) {

                container.innerHTML =
                    `<div class="empty">
                Error loading friends
            </div>`;

                return;
            }

            if (data.data.length === 0) {

                container.innerHTML =
                    `<div class="empty">
                No friends yet
            </div>`;

                return;
            }

            data.data.forEach(user => {

                const wrapper =
                    document.createElement("div");

                wrapper.innerHTML =
                    createUserHTML(user, "");

                const card =
                    wrapper.firstElementChild;

                const buttons =
                    card.querySelector(".friend-buttons");

                const removeBtn =
                    createButton(
                        "Remove",
                        "remove-btn",
                        () => removeFriend(user)
                    );

                buttons.appendChild(removeBtn);

                container.appendChild(card);
            });
        })

        .catch(error => {

            console.error(error);
        });
}


/* REMOVE */

function removeFriend(user) {

    const formData =
        new FormData();

    formData.append(
        "friend",
        user
    );

    fetch(
        "../php/friends.php?action=removeFriend",
        {
            method: "POST",
            body: formData
        }
    )

        .then(res => res.json())

        .then(data => {

            if (data.success) {

                showPopup(
                    "Friend removed",
                    "success"
                );

                loadPage();

            } else {

                showPopup(
                    data.error || "Error",
                    "error"
                );
            }
        });
}


/* POPUP */

function showPopup(
    message,
    type = "success"
) {

    const popup =
        document.createElement("div");

    popup.classList.add(
        "popup",
        type
    );

    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => {

        popup.classList.add("hidden");

        setTimeout(() => {

            popup.remove();

        }, 300);

    }, 2500);
}