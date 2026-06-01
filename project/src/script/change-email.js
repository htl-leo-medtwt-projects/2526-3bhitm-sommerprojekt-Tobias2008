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

                if (data.success) {
                    alert("Email updated");
                    window.location =
                        "./settings.html";
                }
                else {
                    alert(data.error);
                }

            });

    });
