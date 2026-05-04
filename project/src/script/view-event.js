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

function getData() {
    eventData = getEventData();
    items = getEventItems();
}

function getEventData() {
    fetch('../php/event.php?action=getSingleEvent&event_id=' + eventID)
        .then(response => response.json())
        .then(data => {
            console.log("Server Antwort:", data);
            if (data.success) {
                return data.data;
            } else {
                console.error("Fehler:", data.error);
            }
        })
        .catch(err => {
            console.error("Fetch Fehler:", err);
        });
}

function getEventItems() {
    fetch('../php/event.php?action=getEventItems&event_id=' + eventID)
        .then(response => response.json())
        .then(data => {
            console.log("Server Antwort:", data);
            if (data.success) {
                return data.data;
            } else {
                console.error("Fehler:", data.error);
            }
        })
        .catch(err => {
            console.error("Fetch Fehler:", err);
        });
}


function displayEvent() {

    if (!eventData || !items) {
        console.error("Daten konnten nicht geladen werden.");
        return;
    }

    document.getElementById('event-image').style.backgroundImage = `url(${eventData.image_url})`;
    document.getElementById('event-title').innerText = eventData.title_text;
    document.getElementById('title-text').innerText = eventData.title_text;
    document.getElementById('information').innerText = eventData.information;

    


}


function getEventMembers(eventID) { }