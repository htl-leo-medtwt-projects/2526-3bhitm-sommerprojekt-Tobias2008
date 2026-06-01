loadProfile();

function loadProfile(){

    fetch("../php/user.php?action=getProfile")
    .then(r=>r.json())
    .then(data=>{

        if(!data.success){
            return;
        }

        const user=data.data;

        document.getElementById("firstName").value=user.first_name;
        document.getElementById("lastName").value=user.last_name;
        document.getElementById("email").value=user.email;

        document.getElementById("profilePicture").src=
            user.image_src ||
            "../../ressources/images/profile/default.png";
    });
}

document
.getElementById("saveProfile")
.addEventListener("click",()=>{

    const formData=new FormData();

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

    fetch("../php/user.php?action=updateProfile",{
        method:"POST",
        body:formData
    })
    .then(r=>r.json())
    .then(data=>{

        if(data.success){
            alert("Profile updated");
        }
    });
});
