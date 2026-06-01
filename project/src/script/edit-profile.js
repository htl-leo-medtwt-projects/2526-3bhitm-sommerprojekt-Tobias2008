loadProfile();

function loadProfile() {

    fetch("../php/user.php?action=getProfile")
        .then(response => response.json())
        .then(data => {

            if (!data.success) {
                alert(data.error);
                return;
            }

            const user = data.data;

            document.getElementById("firstName").value =
                user.first_name;

            document.getElementById("lastName").value =
                user.last_name;

            document.getElementById("email").value =
                user.email;
        });
}

document
.getElementById("saveProfile")
.addEventListener("click", saveProfile);

function saveProfile() {

    const formData = new FormData();

    formData.append(
        "first_name",
        document.getElementById("firstName").value
    );

    formData.append(
        "last_name",
        document.getElementById("lastName").value
    );

    formData.append(
        "email",
        document.getElementById("email").value
    );

    fetch("../php/user.php?action=updateProfile", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {
            alert("Profile updated");
            location.href = "./settings.html";
        } else {
            alert(data.error);
        }

    });
}