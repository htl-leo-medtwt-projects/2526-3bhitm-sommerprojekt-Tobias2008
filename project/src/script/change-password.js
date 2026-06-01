
document.getElementById("savePassword")
    .addEventListener("click", () => {

        const oldPassword =
            document.getElementById("oldPassword").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
            showPopup("Passwords do not match", "error");
            return;
        }

        fetch("../php/user.php?action=changePassword", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },
            body:
                "oldPassword=" +
                encodeURIComponent(oldPassword) +
                "&newPassword=" +
                encodeURIComponent(newPassword)
        })
            .then(r => r.json())
            .then(data => {

                if (data.success) {
                    showPopup("Password updated", "success");
                    window.location =
                        "./settings.html";
                }
                else {
                    showPopup(data.error, "error");
                }

            });

    });

function showPopup(message, type = "success") {
    const popup = document.getElementById("popup");

    popup.className = `popup ${type}`;
    popup.textContent = message;

    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2500);
}