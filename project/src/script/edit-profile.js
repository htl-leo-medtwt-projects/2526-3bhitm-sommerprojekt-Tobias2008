loadProfile();

function loadProfile(){

    fetch("../php/user.php?action=getProfile")
    .then(r => r.json())
    .then(data => {
        console.log(data);

        if (!data.success) return;

        const user = data.data;

        document.getElementById("firstName").value = user.first_name;
        document.getElementById("lastName").value = user.last_name;
        document.getElementById("dateOfBirth").value = user.date_of_birth;

        if(user.image_src && !user.image_src.includes('.')) {
                    document.getElementById("profilePicture").src =
                    "../../ressources/images/profile/pre-saved-images/" + user.image_src + "Monster.jpg";
                } else if (user.image_src) {
                    document.getElementById("profilePicture").src =
                    '../.'+user.image_src;
                } else {
                    document.getElementById("profilePicture").src =
                    "../../ressources/images/profile/pre-saved-images/lightblueMonster.jpg"
                }

    });
}


document.getElementById("saveProfile").addEventListener("click", () => {

    const formData = new FormData();

    formData.append("first_name", document.getElementById("firstName").value);
    formData.append("last_name", document.getElementById("lastName").value);
    formData.append("date_of_birth", document.getElementById("dateOfBirth").value);
    formData.append("action", "updateProfile");

    fetch("../php/user.php", {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showPopup("Profile updated", "success");
        } else {
            showPopup(data.message || "Error", "error");
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