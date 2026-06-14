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