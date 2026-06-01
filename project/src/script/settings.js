loadProfile();

function loadProfile() {

    fetch("../php/event.php?action=getProfile")
        .then(response => response.json())
        .then(data => {

            console.log(data);

            if (!data.success) {
                console.error(data.error);
                return;
            }

            const user = data.data;

            document.getElementById("username").innerHTML =
                "@" + user.username;

            document.getElementById("email").innerHTML =
                user.email;

                console.log(user.image_src);

                if(user.image_src && !user.image_src.includes('.')) {
                    document.getElementById("profilePicture").src =
                    "../../ressources/images/profile/pre-saved-images/" + user.image_src + "Monster.jpg";
                } else if (user.image_src) {
                    document.getElementById("profilePicture").src =
                    user.image_src;
                } else {
                    document.getElementById("profilePicture").src =
                    "../../ressources/images/profile/pre-saved-images/lightblueMonster.jpg"
                }

        })
        .catch(error => {
            console.error(error);
        });
}