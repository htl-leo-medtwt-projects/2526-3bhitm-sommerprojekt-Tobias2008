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

                if (user.image_src) {
                    document.getElementById("profilePicture").src = '../.' + user.image_src;
                }
        })
        .catch(error => {
            console.error(error);
        });
}