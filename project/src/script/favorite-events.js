fetch("../php/event.php?action=getUsername")
.then(r=>r.json())
.then(user=>{

    fetch("../php/event.php?action=getFavorite&user="+user.data)
    .then(r=>r.json())
    .then(data=>{

        const container =
        document.getElementById("favoriteContainer");

        data.data.forEach(event=>{

            container.innerHTML += `
            <div class="favorite-card">

                <div class="favorite-image"
                style="background-image:url('${event.image_src || "../../ressources/images/placeholder_event.jpg"}')">
                </div>

                <div class="favorite-content">

                    <div class="favorite-name">
                        ${event.name}
                    </div>

                    <div class="favorite-title">
                        ${event.title_text}
                    </div>

                    <a
                    class="favorite-btn"
                    href="./view-Event.html?event_id=${event.event_id}">
                    Open Event
                    </a>

                </div>

            </div>`;
        });

    });

});
