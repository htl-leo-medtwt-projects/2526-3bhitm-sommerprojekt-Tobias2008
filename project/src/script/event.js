// CONSTANT PATTERNS
const searchInput = document.getElementById("event-name");

const favoriteEventForm =
    `<div class="favorite-event-image"></div>

                <div class="eventGridSystem">
                    <div class="left">
                        <h1 class="eventTitle"></h1>
                        <p class="title-text"></p>
                        <p class="informationText"></p>

                    </div>
                    <div class="right">
                        <div class="creator"></div>
                        <div class="date"></div>
                        <div class="location"></div>
                        <div class="participants"></div>
                    </div>
                </div>

                <div class="buttons">
                    <div class="view"></div>
            </div>`;

const normalEventForm =
    `<div class="single-event-left">
                    <div class="single-event-image"></div>
                    <div class="single-event-owner">Owner: John Doe</div>
                </div>


                <div class="single-event-right">
                    <div class="single-event-title">Party Time</div>
                        <div class="single-event-text-title">Join - it will be fun!</div>
                        <div class="single-event-information">Best Event in the whole Town! Please bring a good mood and your
                        friends! I...</div>
                    <div class="single-event-button"><a href="./view-Event.html">Read more...</a></div>
                </div>`;


// REST CODE


//getSessionData();


/*function getSessionData() {
    fetch("../php/global.php?getSession")
        .then(response => response.text())
        .then(data => {
            console.log("Session Data:", data);
            if (data.success) {
                const username = data.data;
                console.log("Aktueller Benutzer:", username);
                getAllEventsFromDB(username);
            } else {
                console.error("Fehler beim Abrufen der Session:", data.error);
            }
        })
        .catch(err => {
            console.error("Fetch Fehler:", err);
        });
}*/

getUsernameAndCallEventloader();

function getUsernameAndCallEventloader() {
    fetch ("../php/event.php?action=getUsername")
    .then(response => response.json())   
    .then(data => {
        console.log("Session Data:", data);
        if (data.success) {
            const username = data.data;
            console.log("Aktueller Benutzer:", username);
            displayEvents(username);
        } else {
            console.error("Fehler beim Abrufen der Session:", data.error);
            window.location.href = "../pages/login-register/login.php";
        }
    })
    .catch(err => {
        console.error("Fetch Fehler:", err);
    }); 
}


function getAllEventsFromDB(user) {
    console.log('../php/event.php?action=get&user=' + user);

    return fetch("../php/event.php?action=get&user=" + user)
        .then(response => response.json())
        .then(data => {
            console.log("Server Antwort:", data);

             if (data.success) {
                const events = data.data;
                return events;
            } else {
                console.error("Fehler:", data.error);
            }
        })
        .catch(err => {
            console.error("Fetch Fehler:", err);
        });
}

function getFavoriteEventsFromDB(user) {
    console.log('../php/event.php?action=getFavorite&user=' + user)

    
    return fetch("../php/event.php?action=getFavorite&user=" + user)
        .then(response => response.json())
        .then(data => {
            console.log("Server Antwort:", data);
            if (data.success) {
                const events = data.data;
                return events;
            } else {
                console.error("Fehler:", data.error);
            }
        })
        .catch(err => {
            console.error("Fetch Fehler:", err);
        });
}

function displayEvents(user) {
    displayFavoriteEvents(user);
    displayAllEvents(user);
};



function displayFavoriteEvents(user) {
    const favoriteEventsContainer = document.getElementById('eventSlider');
    favoriteEventsContainer.innerHTML = '';

    getFavoriteEventsFromDB(user).then(events => {
        events.forEach((event, num) => {

            const eventElement = document.createElement('div');
            eventElement.classList.add('favorite-event');
            eventElement.innerHTML = favoriteEventForm;

            favoriteEventsContainer.appendChild(eventElement);

            if (event.image_src) {
                eventElement.querySelector('.favorite-event-image').style.backgroundImage = `url(${event.image_src})`;
            } else {
                eventElement.querySelector('.favorite-event-image').style.backgroundImage = 'url(../../ressources/images/placeholder_event.jpg)';
            }

    

            document.querySelectorAll('.eventTitle')[num].innerHTML = event.name;
            document.querySelectorAll('.title-text')[num].innerHTML = event.title_text;
            document.querySelectorAll('.informationText')[num].innerHTML = getEventInfo(event);
            console.log('Event', event);
            document.querySelectorAll('.creator')[num].innerHTML = `Creator: ${event.owner}`;
            document.querySelectorAll('.date')[num].innerHTML = `Date: ${event.event_date}`;
            document.querySelectorAll('.location')[num].innerHTML = `Location: ${event.location}`;

            getMaxMembers(num,event.max_members,event.event_id);
            document.querySelectorAll('.view')[num].innerHTML = `<a class="viewMore" href="./view-Event.html?event_id=${event.event_id}">Read more...</a>`;
        }
        )
    }
    )
}

function displayAllEvents(user) {
    const allEventsContainer = document.getElementById('all-events');

    allEventsContainer.innerHTML = '';

    getAllEventsFromDB(user).then(events => {
        console.log("Alle Events:", events);
        events.forEach((event, num) => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('single-event');
            eventElement.innerHTML = normalEventForm;

            allEventsContainer.appendChild(eventElement);

            if (event.image_src) {
                eventElement.querySelector('.single-event-image').style.backgroundImage = `url(${event.image_src})`;
            } else {
                eventElement.querySelector('.single-event-image').style.backgroundImage = 'url(../../ressources/images/placeholder_event.jpg)';
            }
            document.querySelectorAll('.single-event-owner')[num].innerHTML = `Owner: ${event.owner}`;
            document.querySelectorAll('.single-event-title')[num].innerHTML = event.name;
            document.querySelectorAll('.single-event-text-title')[num].innerHTML = event.title_text;
            document.querySelectorAll('.single-event-information')[num].innerHTML = getEventInfo(event);

            document.querySelectorAll('.single-event-button')[num].innerHTML = `<a href="./view-Event.html?event_id=${event.event_id}">Read more...</a>`;

        })
    })
}

function getMaxMembers(num, max_members, eventID) {


    fetch("../php/event.php?action=getParticipants&event_id=" + eventID)
        .then(response => response.json())
        .then(data => {
            console.log("Teilnehmerzahl:", data);
            if (data.success) {
                const participants = data.data;
                document.querySelectorAll('.participants')[num].innerHTML = `${participants.length} / ${max_members} Teilnehmer`;

            } else {
            }


        })        .catch(err => {
        });
}


function getEventInfo(event){

    let info = "";

    if(event.information.length > 60){
        info = event.information.substring(0, 60) + "...";
    } else {
        info = event.information;
    }

    return info;
}



searchInput.addEventListener("input", async (e) => {

    const query = e.target.value.trim();

    const favoriteSection = document.getElementById("favorite-events");
    const favoriteSlider = document.getElementById("event-slider-padding");
    const eventsForYou = document.getElementById("event-for-user");
    const allEvents = document.getElementById("all-events");

    const searchResults = document.getElementById("search-results");
    const noResults = document.getElementById("no-search-results");

    /*
        Keine Suche -> normale Ansicht
    */

    if (query === "") {

        favoriteSection.style.display = "block";
        favoriteSlider.style.display = "block";
        eventsForYou.style.display = "block";
        allEvents.style.display = "block";

        searchResults.innerHTML = "";
        noResults.innerHTML = "";

        return;
    }

    /*
        Normale Events ausblenden
    */

    favoriteSection.style.display = "none";
    favoriteSlider.style.display = "none";
    eventsForYou.style.display = "none";
    allEvents.style.display = "none";

    /*
        Suche
    */

    const response = await fetch(
        `../php/event.php?action=searchEvents&query=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    searchResults.innerHTML = "";
    noResults.innerHTML = "";

    if (!data.success) {
        noResults.innerHTML = "Fehler bei der Suche";
        return;
    }

    if (data.data.length === 0) {
        noResults.innerHTML = "Keine Events gefunden";
        return;
    }

    data.data.forEach(event => {

        const eventElement = document.createElement("div");

        eventElement.classList.add("single-event");

        eventElement.innerHTML = normalEventForm;

        searchResults.appendChild(eventElement);

        /*
            Bild
        */

        if (event.image_src) {
            eventElement.querySelector('.single-event-image')
                .style.backgroundImage = `url(${event.image_src})`;
        } else {
            eventElement.querySelector('.single-event-image')
                .style.backgroundImage =
                'url(../../ressources/images/placeholder_event.jpg)';
        }

        /*
            Daten
        */

        eventElement.querySelector('.single-event-owner')
            .innerHTML = `Owner: ${event.owner}`;

        eventElement.querySelector('.single-event-title')
            .innerHTML = event.name;

        eventElement.querySelector('.single-event-text-title')
            .innerHTML = event.title_text;

        eventElement.querySelector('.single-event-information')
            .innerHTML = getEventInfo(event);

        eventElement.querySelector('.single-event-button')
            .innerHTML =
            `<a href="./view-Event.html?event_id=${event.event_id}">
                Read more...
            </a>`;
    });
});