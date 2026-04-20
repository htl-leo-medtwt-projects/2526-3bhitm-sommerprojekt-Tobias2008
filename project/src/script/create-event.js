const box = document.getElementById("input-field-image");
const input = document.getElementById("fileInput");

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

  console.log(files);
});