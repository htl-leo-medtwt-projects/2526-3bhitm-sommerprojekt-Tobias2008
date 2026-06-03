fetch("../php/event.php?action=getUsername")
.then(r=>r.json())
.then(userData=>{

    fetch("../php/event.php?action=get&user="+userData.data)
    .then(r=>r.json())
    .then(data=>{

        const container =
            document.getElementById("eventsContainer");

        data.data.forEach(event=>{

            container.innerHTML += `
            <div class="event-card">

                <div class="event-image"
                style="background-image:url('${event.image_src || "../../ressources/images/placeholder_event.jpg"}')">
                </div>

                <div class="event-content">

                    <div class="event-name">${event.name}</div>

                    <div class="event-title">
                        ${event.title_text}
                    </div>

                    <div class="event-info">
                        ${event.information}
                    </div>

                    <a class="event-btn"
                    href="./view-Event.html?event_id=${event.event_id}">
                        Open Event
                    </a>

                </div>

            </div>`;
        });
    });

});