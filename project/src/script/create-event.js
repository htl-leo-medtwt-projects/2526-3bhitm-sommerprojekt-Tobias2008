// Drag & Drop für Bild-Upload Beginn

const box = document.getElementById("input-field-image");
const input = document.getElementById("fileInput");
const preview = document.getElementById("image-preview");

// Klick → Explorer öffnen
box.addEventListener("click", () => input.click());

// Drag over
box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.classList.add("dragover");
});

// Drag leave
box.addEventListener("dragleave", () => {
    box.classList.remove("dragover");
});

// Drop
box.addEventListener("drop", (e) => {

    e.preventDefault();

    box.classList.remove("dragover");

    const files = e.dataTransfer.files;

    input.files = files;

    if (files.length > 0) {

        showPreview(files[0]);

    }

});

// Drag & Drop für Bild-Upload Ende

function createEvent() {

    console.log("Erstelle Event...");

    fetch("../php/event.php?action=create", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            eventName: "Geburtstag",
            eventTitle: "Max Party",
            eventDescription: "Geburtstagsfeier mit Freunden",
            eventDate: "2026-05-01",
            eventLocation: "Linz",
            eventMaxMembers: "20",
            eventImageSrc: ""
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Server Antwort:", data);

            if (data.success) {
                console.log("Event ID:", data.data.id);
            } else {
                console.error("Fehler:", data.error);
            }
        })
        .catch(err => {
            console.error("Fetch Fehler:", err);
        });

}


function showPreview(file) {

    if (!file) return;

    preview.src = URL.createObjectURL(file);

    preview.hidden = false;

    box.classList.add("has-image");
}

input.addEventListener("change", () => {

    if (input.files.length > 0) {

        showPreview(input.files[0]);

    }
});

let selectedMembers = [];

document
    .getElementById("add-members-box")
    .addEventListener("click", async () => {

        document
            .getElementById("member-popup")
            .classList.add("active");

        await loadFriends();
    });

document
    .getElementById("close-member-popup")
    .addEventListener("click", () => {

        document
            .getElementById("member-popup")
            .classList.remove("active");
    });


async function getFriends() {

    const response =
        await fetch(
            "../php/friends.php?action=getFriends"
        );

    const data =
        await response.json();

    if (data.success) {
        return data.data;
    }

    return [];
}
async function loadFriends() {

    const container =
        document.getElementById("friends-list");

    container.innerHTML = "";

    const friends =
        await getFriends();

    const availableFriends =
        friends.filter(friend =>
            !selectedMembers.some(
                member =>
                    member.username === friend.username
            )
        );

    if (availableFriends.length === 0) {

        container.innerHTML = `
            <div class="empty-friends">
                No friends available
            </div>
        `;

        return;
    }

    availableFriends.forEach(friend => {

        const row =
            document.createElement("div");

        row.classList.add("friend-row");


        if (
            friend.image_src &&
            friend.image_src !== "null" &&
            friend.image_src !== null &&
            friend.image_src !== undefined
        ) {

            const value = '../../' + 
                String(friend.image_src).trim();
        }

        row.innerHTML = `
    <div class="member-info">

        <img
            src="${value}"
            class="member-avatar"
            alt="${friend.username}"
        >

        <span>${friend.username}</span>

    </div>

    <div class="friend-add">
        +
    </div>
`;

        row.querySelector(".friend-add")
            .onclick = () =>
                addMember(friend);
        container.appendChild(row);
    });
}

function addMember(friend) {

    selectedMembers.push(friend);

    updateSelectedMembers();

    loadFriends();
}

function updateSelectedMembers() {

    const container =
        document.getElementById(
            "selected-members"
        );

    container.innerHTML = "";

    selectedMembers.forEach(user => {

        if (
            user.image_src &&
            user.image_src !== "null" &&
            user.image_src !== null &&
            user.image_src !== undefined
        ) {

            const value = '../.' +
                String(user.image_src).trim();
        }

        const row =
            document.createElement("div");

        row.classList.add("member-row");

        row.innerHTML = `

        <div class="member-info">

            <img
                src="${value}"
                class="member-avatar"
                alt="${user.username}"
            >

            <span>${user.username}</span>

        </div>

        <span class="remove-member">
            ✕
        </span>
    `;

        row.querySelector(".remove-member")
            .onclick = () =>
                removeMember(user.username);

        container.appendChild(row);
    });

    document
        .getElementById("members")
        .value =
        JSON.stringify(
            selectedMembers
        );
}

function removeMember(username) {

    selectedMembers =
        selectedMembers.filter(
            member =>
                member.username !== username
        );

    updateSelectedMembers();
    loadFriends();
}