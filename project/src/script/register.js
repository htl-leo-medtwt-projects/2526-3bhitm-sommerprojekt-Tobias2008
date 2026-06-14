fillProfilePictures();

function fillProfilePictures() {
    const profilePictures = document.getElementById("profile-pictures");
    const profilePictureColors = [
        "black",
        "blue",
        "darkgreen",
        "darkred",
        "green",
        "lightblue",
        "orange",
        "pink",
        "purple",
        "red",
        "yellow"
    ];

    for (let i = 0; i < profilePictureColors.length; i++) {
        profilePictures.innerHTML += `<img class="profile-picture" onclick="selectProfilePicture('${profilePictureColors[i]}')" src="../../../ressources/images/profile/pre-saved-images/${profilePictureColors[i]}Monster.jpg" alt="${profilePictureColors[i]}">`;
    }
}
function selectProfilePicture(path) {

    document.querySelectorAll(".profile-picture").forEach(img => {
        img.classList.remove("selected");
    });

    const selectedImg = document.querySelector(
        `img[alt="${path}"]`
    );

    if (selectedImg) {
        selectedImg.classList.add("selected");
    }

    fetch("../../php/user.php?action=selectProfilePicture", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `profile-picture=${path}`
    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {
            showToast("Profile picture selected!", "success");
        } else {
            showToast("Selection failed ✕", "error");
        }

    })
    .catch(error => {

        console.error(error);

        showToast("Server error ✕", "error");
    });
}

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);
}


loadRegisterToast();

function loadRegisterToast() {
    fetch("../../php/global.php?getSession=error")
        .then(res => res.json())
        .then(data => {

            if (!data.success || !data.data) return;

            const err = data.data;

            if (err.success) {
                showToast(err.data || "Success", "success");
            } else {
                showToast(err.error || "Error", "error");
            }
        })
        .catch(() => {});
}