let addMenuOpen = false;
let isOwner = false;
let eventID = new URLSearchParams(window.location.search).get('event_id');
let eventData = null;
let items = null;
let itemDetails = null;

getData();


document.addEventListener("click", e => {

    const header =
        document.getElementById(
            "friends-dropdown-header"
        );

    if (!header) return;

    if (e.target.closest("#friends-dropdown-header")) {

        document
            .getElementById("friends-dropdown")
            .classList.toggle("open");
    }
});

async function getData() {
    eventData = await getEventData();
    items = await getEventItems();
    itemDetails = await getItemDetails();
    await checkOwner();



    displayEvent();

}

async function getEventData() {
    const response = await fetch('../php/event.php?action=getSingleEvent&event_id=' + eventID);
    const data = await response.json();
    if (data.success) {
        return data.data;
    } else {
        console.error("Fehler:", data.error);
    }
    return null;
}

async function getEventItems() {
    const response = await fetch('../php/event.php?action=getEventItems&event_id=' + eventID);
    const data = await response.json();
    if (data.success) {
        return data.data;
    } else {
        console.error("Fehler:", data.error);
    }
    return null;
}

async function getItemDetails() {
    const response = await fetch('../php/event.php?action=getItemDetails&event_id=' + eventID);
    const data = await response.json();
    if (data.success) {
        return data.data;
    } else {
        console.error("Fehler:", data.error);
    }
    return null;
}

async function displayEvent() {

    if (!eventData) {
        console.error("Events konnten nicht geladen werden.");
        return;
    }

    if (!items) {
        console.error("Items konnten nicht geladen werden.");
        return;
    }

    if (!itemDetails) {
        console.error("Items konnten nicht geladen werden.");
        return;
    }

    fetch("../php/event.php?action=getFavoriteStatus&event_id=" + eventID)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data === 1) {
                document.getElementById('favorite-star').classList.add('active');
            }
        });



    if (eventData.image_url) {
        document.getElementById('event-image').style.backgroundImage = `url(${eventData.image_url})`;
    } else {
        document.getElementById('event-image').style.backgroundImage = `url('../../ressources/images/profile/pre-saved-images/blackMonster.jpg')`;
    }

    document.getElementById('event-title').innerText = eventData.name;
    document.getElementById('title-text').innerText = eventData.title_text;
    document.getElementById('information').innerText = eventData.information;



    document.getElementById('items').innerHTML = '';

    const createAttributeButton = document.createElement('div');

    createAttributeButton.classList.add('create-attribute');

    createAttributeButton.innerHTML = '+ New Category';

    createAttributeButton.onclick = async () => {

        const name =
            await showInputPopup(
                "Category Name"
            );

        if (!name) return;

        const response = await fetch('../php/event.php?action=createAttribute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `event_id=${eventID}&name=${encodeURIComponent(name)}`
        });

        const data = await response.json();

        if (!data.success) {

            showPopup(
                data.error,
                "error"
            );

            return;
        }

        showPopup(
            "Category created",
            "success"
        );

        const item = document.createElement('div');

        item.classList.add('item');

        item.innerHTML = `
        <div class="item-name">${name}</div>
        <div class="item-button">
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 12h14m-7 7V5"/>
            </svg>
        </div>
    `;

        document.getElementById('items')
            .appendChild(item);
    };


    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        const itemName = document.createElement('div');
        itemName.classList.add('item-name');
        itemName.innerText = item.name;
        const itemButton = document.createElement('div');
        itemButton.classList.add('item-button');
        itemButton.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
</svg>`;

        itemButton.addEventListener('click', () => {
            loadItemDetails(item.attribute_id, eventID);
        });

        itemElement.appendChild(itemName);
        itemElement.appendChild(itemButton);
        document.getElementById('items').appendChild(itemElement);
        document.getElementById('view-event').appendChild(createAttributeButton);
    });




}



function loadItemDetails(attributeID, eventID) {
    const selectedItem = itemDetails.filter(item => item.attribute_id === attributeID);
    const selectedItemCategory = items.find(item => item.attribute_id === attributeID);


    if (!eventData) {
        console.error("Events konnten nicht geladen werden.");
        return;
    }

    if (!items) {
        console.error("Items konnten nicht geladen werden.");
        return;
    }

    if (!selectedItem) {
        console.error("Items konnten nicht geladen werden.");
        return;
    }

    console.log("Attribute ID:", attributeID);
    console.log("Event ID:", eventID);
    console.log("Item Details:", itemDetails);
    console.log("items", items);
    console.log("Event Details:", eventData);

    document.getElementById('view-event').innerHTML = '';
    document.getElementById('view-event').style.display = 'none';
    document.getElementById('item-details').innerHTML = '';

    const itemDetailsDiv = document.getElementById('item-details');
    itemDetailsDiv.innerHTML = '';
    itemDetailsDiv.innerHTML = itemDetailTemplate;

    if (eventData.image_src) {
        document.getElementById('item-image').style.backgroundImage = `url(${eventData.image_src})`;
    } else {
        document.getElementById('item-image').style.backgroundImage = `url('../../ressources/images/profile/pre-saved-images/blackMonster.jpg')`;
    }
    document.getElementById('item-title').innerHTML = selectedItemCategory.name;

    const addButton = document.createElement('div');

    addButton.classList.add('create-item');

    addButton.innerHTML = '+ New Item';

    addButton.onclick = async () => {

        const name =
            await showInputPopup(
                "Item Name"
            );

        if (!name) return;

        const response = await fetch('../php/event.php?action=createItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:
                `attribute_id=${attributeID}` +
                `&event_id=${eventID}` +
                `&name=${encodeURIComponent(name)}`
        });

        const data = await response.json();

        if (data.success) {

            showPopup(
                "Item created",
                "success"
            );

            const newItem = {
                id: Date.now(),
                name: name,
                attribute_id: attributeID,
                event_id: eventID,
                is_done: 0
            };

            itemDetails.push(newItem);

            loadItemDetails(
                attributeID,
                eventID
            );

        } else {

            showPopup(
                data.error,
                "error"
            );
        }
    };

    document.getElementById('item-wrapper')
        .appendChild(addButton);

    //document.getElementById('single-items').innerHTML = `<div id="single-item">${selectedItem.name}</div>`;

    selectedItem.forEach(item => {
        const singleItem = document.createElement('div');
        singleItem.classList.add('single-item');
        singleItem.innerHTML = `<p>${item.name}</p>`;
        singleItem.innerHTML += `<div onclick="revealInfo()" class="item-button"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
</svg>
</div>`;
        singleItem.innerHTML += `
<div
class="item-already-done-button ${item.is_done == 1 ? 'done' : ''}"
onclick="changeButton(${item.id})">
</div>`;
        document.getElementById('single-items').appendChild(singleItem);
    });
}

const viewElementTemplate = `
<div id="event-image"></div>

    <h1 id="event-title"></h1>
    <p id="title-text"></p>
    <p id="information"></p>
    <div id="viewMemberButton">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
</svg>

        View Members</div>

    <div id="items">
    </div>`;


const itemDetailTemplate = `
    <div id="item-image"></div>

    <div id="item-wrapper">
    <h1 id="item-title"></h1>
    <div id="item-description"></div>
        <div id="single-items"></div>
    </div>`;

function changeButton(itemID) {

    fetch(
        '../php/event.php?action=markItemDone',
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded'
            },
            body:
                `item_id=${itemID}` +
                `&event_id=${eventID}`
        }
    )

        .then(res => res.json())

        .then(data => {

            if (!data.success) {

                showPopup(data.error, "error");
                return;
            }

            const button =
                document.querySelector(
                    `.item-already-done-button[onclick="changeButton(${itemID})"]`
                );

            button.classList.toggle("done");

            const row =
                button.closest("#single-item");

            row.classList.toggle("done");

        });
}

const viewMemberButton =
    document.getElementById("viewMemberButton");

const popupOverlay =
    document.getElementById("member-popup-overlay");

const popupClose =
    document.getElementById("popup-close");

/* OPEN POPUP */

viewMemberButton.addEventListener("click", () => {
    popupOverlay.classList.add("active");
    document.body.classList.add("no-scroll");
});

/* CLOSE BUTTON */

popupClose.addEventListener("click", () => {
    popupOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
});

/* CLOSE WHEN CLICKING OUTSIDE */

popupOverlay.addEventListener("click", (e) => {

    if (e.target === popupOverlay) {

        popupOverlay.classList.remove("active");

    }

});

let memberPreset = `
<div class="member">
                    <div class="member-avatar"></div>
                    <div class="member-items">

    <span class="member-name">
        Max
    </span>

    <div class="member-menu">
        ⋮
    </div>

</div>
                </div>
`;

function getMembers(eventID) {
    return fetch("../php/event.php?action=getMembers&event_id=" + eventID)
        .then(response => response.json())
        .then(data => {
            console.log("Server Antwort:", data);
            if (data.success) {
                const members = data.data;
                return members;
            } else {
                console.error("Fehler:", data.error);
            }
        })
        .catch(err => {
            console.error("Fetch Fehler:", err);
        });
}

function displayMembers() {
    const membersContainer = document.getElementById('member-list');
    const eventID = new URLSearchParams(window.location.search).get('event_id');

    if (!eventID) {
        console.error("Event-ID fehlt in der URL.");
        window.location.href = '../pages/event.html';
    }

    membersContainer.innerHTML = '';

    getMembers(eventID).then(members => {
        members.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.classList.add('member');
            memberElement.innerHTML = memberPreset;
            console.log("Member Data:", member);
            memberElement.querySelector('.member-name').innerText = member;
            memberElement.querySelector('.member-menu').innerHTML = "⋮";
            if (member.image_src) {
                memberElement.querySelector('.member-avatar').style.backgroundImage = `url(${member.image_src})`;
            } else {
                memberElement.querySelector('.member-avatar').style.backgroundImage = 'url(../../ressources/images/profile/pre-saved-images/blackMonster.jpg)';
            }


            if (isOwner) {

                memberElement.querySelector(".member-menu")

                    .onclick = async () => {

                        const confirmed =
                            await showConfirmPopup(
                                `Do you really want to remove "${member}" from this event?`
                            );

                        if (!confirmed) return;

                        const response =

                            await fetch(

                                "../php/event.php?action=removeMemberFromEvent",

                                {

                                    method: "POST",

                                    headers: {

                                        "Content-Type":

                                            "application/x-www-form-urlencoded"

                                    },

                                    body:

                                        `event_id=${eventID}` +

                                        `&username=${member}`

                                }

                            );

                        const data =

                            await response.json();

                        if (data.success) {

                            showPopup(
                                "Member removed",
                                "success"
                            );

                            displayMembers();

                        } else {

                            showPopup(

                                data.error,

                                "error"

                            );

                        }

                    };

            } else {

                memberElement.querySelector(".member-menu")

                    .style.display = "none";

            }

            membersContainer.appendChild(memberElement);

        });

    })
};

document.addEventListener("click", (e) => {
    const star = e.target.closest("#favorite-star");
    if (!star) return;

    fetch("../php/event.php?action=toggleFavorite", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `event_id=${eventID}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.data === 1) {
                    star.classList.add("active");
                } else {
                    star.classList.remove("active");
                }
            } else {
                console.error("Fehler beim Favorisieren:", data.error);
            }
        })
        .catch(err => console.error("Fetch Fehler:", err));
});

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

function showInputPopup(title) {

    return new Promise(resolve => {

        const popup =
            document.getElementById("custom-popup");

        const input =
            document.getElementById("popup-input");

        document.getElementById("popup-title")
            .innerText = title;

        input.value = "";

        popup.classList.add("active");

        setTimeout(() => {

            input.focus();

        }, 100);

        input.onkeydown = (e) => {

            if (e.key === "Enter") {

                document
                    .getElementById("popup-ok")
                    .click();
            }
        };

        document.getElementById("popup-ok").onclick = () => {

            popup.classList.remove("active");

            resolve(input.value.trim());
        };

        document.getElementById("popup-cancel").onclick = () => {

            popup.classList.remove("active");

            resolve(null);
        };
    });
}

async function checkOwner() {

    const response =
        await fetch(
            '../php/event.php?action=isEventOwner&event_id=' +
            eventID
        );

    const data =
        await response.json();

    if (data.success) {

        isOwner = data.data;

        if (isOwner) {

            document
                .getElementById(
                    "add-member-button"
                )
                .style.display = "block";
            document

                .getElementById("friends-dropdown-wrapper")

                .style.display = "block";

        }
    }

}

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


document
    .getElementById("add-member-button")
    .addEventListener("click", () => {

        document
            .getElementById("friends-dropdown")
            .classList.toggle("open");

        loadFriendsForAdding();
    });

async function loadFriendsForAdding() {

    const dropdown =
        document.getElementById(
            "friends-dropdown"
        );

    dropdown.innerHTML = "";

    const friends =
        await getFriends();

    const members =
        await getMembers(eventID);

    const availableFriends =
        friends.filter(friend =>
            !members.includes(friend.username)
        );

    if (availableFriends.length === 0) {

        dropdown.innerHTML = `
        <div class="empty-friends">
            No more friends
        </div>
    `;

        return;
    }

    availableFriends.forEach(friend => {

        const row =
            document.createElement("div");

        row.classList.add("friend-row");

        row.innerHTML = `
            <span>${friend.username}</span>

            <div class="friend-add">+</div>
        `;

        row.querySelector(".friend-add")
            .onclick = () =>
                addFriendToEvent(friend.username);

        dropdown.appendChild(row);
    });
}

async function addFriendToEvent(username) {

    const response =
        await fetch(
            "../php/event.php?action=addMemberToEvent",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body:
                    `event_id=${eventID}` +
                    `&username=${username}`
            }
        );

    const data =
        await response.json();

    if (!data.success) {

        showPopup(data.error, "error");
        return;
    }

    showPopup(
        "Member added",
        "success"
    );

    document
        .getElementById("friends-dropdown")
        .classList.remove("open");

    document
        .getElementById("friends-dropdown")
        .innerHTML = "";

    addMenuOpen = false;

    displayMembers();
}



function showConfirmPopup(message) {

    return new Promise(resolve => {

        const popup =
            document.getElementById("confirm-popup");

        document.getElementById("confirm-text")
            .innerText = message;

        popup.classList.add("active");

        document.getElementById("confirm-ok").onclick = () => {

            popup.classList.remove("active");

            resolve(true);
        };

        document.getElementById("confirm-cancel").onclick = () => {

            popup.classList.remove("active");

            resolve(false);
        };
    });
}