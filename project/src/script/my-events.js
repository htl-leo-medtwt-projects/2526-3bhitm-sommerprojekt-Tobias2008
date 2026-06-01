fetch("../php/event.php?action=getUsername")
.then(response => response.json())
.then(data => {

    if (!data.success) return;

    fetch(
        "../php/event.php?action=get&user=" +
        data.data
    )
    .then(response => response.json())
    .then(eventData => {

        const container =
            document.getElementById("eventsContainer");

        eventData.data.forEach(event => {

            container.innerHTML += `
                <div class="settings-card">
                    <h3>${event.name}</h3>
                    <p>${event.title_text}</p>
                </div>
            `;
        });
    });
});