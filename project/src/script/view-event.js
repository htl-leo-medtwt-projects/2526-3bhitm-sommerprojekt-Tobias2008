
/*

<div id="event-image"></div>

    <h1 id="event-title"></h1>
    <p id="title-text"></p>
    <p id="information"></p>
    <div id="viewMemberButton">
        View Members</div>

    <div id="items"></div>

*/


let eventID = new URLSearchParams(window.location.search).get('event_id');
let eventData = null;
let items = null;
let itemDetails = null;

getData();

async function getData() {
    eventData = await getEventData();
    items = await getEventItems();
    itemDetails = await getItemDetails();



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



    if (eventData.image_url) {
        document.getElementById('event-image').style.backgroundImage = `url(${eventData.image_url})`;
    } else {
        document.getElementById('event-image').style.backgroundImage = `url('../../ressources/images/profile/pre-saved-images/blackMonster.jpg')`;
    }

    document.getElementById('event-title').innerText = eventData.title_text;
    document.getElementById('title-text').innerText = eventData.title_text;
    document.getElementById('information').innerText = eventData.information;



    document.getElementById('items').innerHTML = '';
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
    document.getElementById('view-event').style.display = 'none'
    const itemDetailsDiv = document.getElementById('item-details');
    itemDetailsDiv.innerHTML = itemDetailTemplate;

    if (eventData.image_src) {
        document.getElementById('item-image').style.backgroundImage = `url(${eventData.image_src})`;
    } else {
        document.getElementById('item-image').style.backgroundImage = `url('../../ressources/images/profile/pre-saved-images/blackMonster.jpg')`;
    }
    document.getElementById('item-title').innerHTML = selectedItemCategory.name;

    //document.getElementById('single-items').innerHTML = `<div id="single-item">${selectedItem.name}</div>`;

    selectedItem.forEach(item => {
        const singleItem = document.createElement('div');
        singleItem.id = 'single-item';
        singleItem.innerHTML = `<p>${item.name}</p>`;
        singleItem.innerHTML += `<div onclick="revealInfo()" class="item-button"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
</svg>
</div>`;
        singleItem.innerHTML += `<div class="item-already-done-button" onclick="changeButton(${item.id})"></div>`;

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
    const button = document.querySelector(`.item-already-done-button[onclick="changeButton(${itemID})"]`);


    if (button.classList.contains('done')) {
        button.classList.remove('done');
        button.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';

        fetch(`../php/event.php?action=markItemDone&item_id=${itemID}&event_id=${eventID}`, {
            method: 'POST'
        });


    } else {
        button.classList.add('done');
        button.style.backgroundColor = 'rgba(0, 255, 0, 0.6)';
    }

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

});

/* CLOSE BUTTON */

popupClose.addEventListener("click", () => {

    popupOverlay.classList.remove("active");

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
                    <span class="member-name"></span>
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
            if (member.image_src) {
                memberElement.querySelector('.member-avatar').style.backgroundImage = `url(${member.image_src})`;
            } else {
                memberElement.querySelector('.member-avatar').style.backgroundImage = 'url(../../ressources/images/profile/pre-saved-images/blackMonster.jpg)';
            }
            membersContainer.appendChild(memberElement);
        });
    });
}