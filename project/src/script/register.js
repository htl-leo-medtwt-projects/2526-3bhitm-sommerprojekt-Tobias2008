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
    fetch("../../php/user.php?action=selectProfilePicture" , {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `action=selectProfilePicture&profile-picture=${path}`
    }).then(response => {
        if (response.ok) {
            console.log("Profile picture selected successfully");
        } else {
            console.error("Error selecting profile picture");
        }
    }).catch(error => {
        console.error("Error selecting profile picture:", error);
    });
}