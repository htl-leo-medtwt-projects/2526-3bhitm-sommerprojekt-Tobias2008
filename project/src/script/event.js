
    const favoriteEventForm =
        `<div class="favorite-event">
                <div class="favorite-event-image"></div>

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
                    <div class="messageUser"></div>
                    <div class="viewMore"><a href="./view-Event.html">Read More...</a></div>
                </div>
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






displayEvents("anna2");

function getEvents(user) {
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

function displayEvents(user) {
    const allEventsContainer = document.getElementById('all-events');

    allEventsContainer.innerHTML = '';

    getEvents(user).then(events => {
        events.forEach((event, num) => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('single-event');
            eventElement.innerHTML = normalEventForm;

            /*
            <div class="single-event">
                <div class="single-event-left">
                    <div class="single-event-image"></div>
                    <div class="single-event-owner">Owner: John Doe</div>
                </div>
    
    
                <div class="single-event-right">
                    <div class="single-event-title">Party Time</div>
                    <div class="single-event-text-title">Join - it will be fun!</div>
                    <div class="single-event-information">Best Event in the whole Town! Please bring a good mood and your
                        friends! I...</div>
                    <div class="single-event-button"><a href="./view-Event.html">Read more...</a></div>
                </div>
    
            </div>
            */

            allEventsContainer.appendChild(eventElement);

            if (event.image_url) {
                eventElement.querySelector('.single-event-image').style.backgroundImage = `url(${event.image_url})`;
            } else {
                eventElement.querySelector('.single-event-image').style.backgroundImage = 'url(../../ressources/images/profile/pre-saved-images/blackMonster.jpg)';
            }
            document.querySelectorAll('.single-event-owner')[num].innerHTML = `Owner: ${event.owner}`;
            document.querySelectorAll('.single-event-title')[num].innerHTML = event.name;
            document.querySelectorAll('.single-event-text-title')[num].innerHTML = event.title_text;
            document.querySelectorAll('.single-event-information')[num].innerHTML = event.information;

        })
    })
};
