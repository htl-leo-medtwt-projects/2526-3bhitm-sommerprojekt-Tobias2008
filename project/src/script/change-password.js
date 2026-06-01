
        document.getElementById("savePassword")
            .addEventListener("click", () => {

                const oldPassword =
                    document.getElementById("oldPassword").value;

                const newPassword =
                    document.getElementById("newPassword").value;

                const confirmPassword =
                    document.getElementById("confirmPassword").value;

                if(newPassword !== confirmPassword){
                    alert("Passwords do not match");
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

                    if(data.success){
                        alert("Password updated");
                        window.location =
                            "./settings.html";
                    }
                    else{
                        alert(data.error);
                    }

                });

            });
