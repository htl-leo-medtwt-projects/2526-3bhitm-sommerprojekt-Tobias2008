document.getElementById("saveEmail")
    .addEventListener("click", () => {

        const email =
            document.getElementById("newEmail").value;

        fetch("../php/user.php?action=changeEmail", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },
            body:
                "email=" +
                encodeURIComponent(email)
        })
            .then(r => r.json())
            .then(data => {

console.log(data);

                if (data.success) {
                    showPopup("Email updated", "success");
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