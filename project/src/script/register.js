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
        profilePictures.innerHTML += `<img class="profile-picture" src="../../../ressources/images/profile/pre-saved-images/${profilePictureColors[i]}Monster.jpg" alt="${profilePictureColors[i]}">`;
    }
}