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

getData();

async function getData() {
    eventData = await getEventData();
    items = await getEventItems();

    console.log("Event Data:", eventData);
    console.log("Event Items:", items);

    displayEvent();

}
async function getEventData() {
    const response = await fetch('../php/event.php?action=getSingleEvent&event_id=' + eventID);
    const data = await response.json();
    console.log("Server Antwort:", data);
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
    console.log("Server Antwort:", data);
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

    console.log("Event Data:", eventData);
    console.log("Event Items:", items);

    if (eventData.image_url) {
        document.getElementById('event-image').style.backgroundImage = `url(${eventData.image_url})`;
    } else {
        document.getElementById('event-image').style.backgroundImage = `url('../../ressources/images/profile/pre-saved-images/blackMonster.jpg')`;
    }

    document.getElementById('event-title').innerText = eventData.title_text;
    document.getElementById('title-text').innerText = eventData.title_text;
    document.getElementById('information').innerText = eventData.information;

    console.log("typeof items:", typeof items);
    console.log("Array check:", Array.isArray(items));
    console.log("items:", items);

    document.getElementById('items').innerHTML = '';
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        const itemName = document.createElement('div');
        itemName.classList.add('item-name');
        itemName.innerText = item.name;
        const itemButton = document.createElement('div');
        itemButton.classList.add('item-button');
        itemButton.innerHTML = `<a href="./view-item.html?item_id=${item.item_id}">View Item</a>`;

        itemElement.appendChild(itemName);
        itemElement.appendChild(itemButton);
        document.getElementById('items').appendChild(itemElement);
    });




}


function getEventMembers(eventID) { }