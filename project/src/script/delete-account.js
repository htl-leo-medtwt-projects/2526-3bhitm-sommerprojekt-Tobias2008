const deleteBtn = document.getElementById("deleteBtn");

const confirmModal = document.getElementById("confirmModal");
const infoModal = document.getElementById("infoModal");

const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

const closeInfo = document.getElementById("closeInfo");
const infoTitle = document.getElementById("infoTitle");
const infoText = document.getElementById("infoText");

function openModal(modal) {
    modal.classList.add("show");
}

function closeModal(modal) {
    modal.classList.remove("show");
}

// DELETE BUTTON → öffnet Confirm Modal
deleteBtn.addEventListener("click", () => {
    openModal(confirmModal);
});

// Cancel
cancelDelete.addEventListener("click", () => {
    closeModal(confirmModal);
});

// Confirm Delete
confirmDelete.addEventListener("click", async () => {
    closeModal(confirmModal);

    try {
        const res = await fetch("../php/user.php?action=deleteAccount", {
            method: "POST"
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = "../pages/login-register/login.php";
        } else {
            showInfo("Fehler", data.error || "Delete failed");
        }

    } catch (err) {
        console.error(err);
        showInfo("Serverfehler", "Bitte später erneut versuchen.");
    }
});

// Info Modal
function showInfo(title, text) {
    infoTitle.textContent = title;
    infoText.textContent = text;
    openModal(infoModal);
}

closeInfo.addEventListener("click", () => {
    closeModal(infoModal);
});

// Klick outside modal = close
[confirmModal, infoModal].forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal);
    });
});