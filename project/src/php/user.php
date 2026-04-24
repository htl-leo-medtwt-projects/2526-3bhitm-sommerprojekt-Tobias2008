<?php
session_start();

$_db_host = 'db_server';
$_db_username = 'PreGame';
$_db_password = 'pregamepassword';
$_db_datenbank = 'PreGame';

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_datenbank);

if ($conn->connect_error) {
    jsonResponse(false, null, "DB Verbindung fehlgeschlagen");
}

$response = [
    "success" => false,
    "data" => null,
    "error" => null
];

if (isset($_POST['action'])) {
    if($_POST['action'] === 'selectProfilePicture') {
        $_SESSION['selectedProfilePicture'] = $_POST['profile-picture'];
    }
}

if (isset($_POST['register'])) {
    /*

    <form action="../../php/user.php">
        <input type="text" placeholder="First Name..." name="first-name" id="first-name">
        <input type="text" placeholder="Last Name..." name="last-name" id="last-name">
        <input type="text" placeholder="Nickname..." name="username" id="username">
        <input type="password" placeholder="Password..." name="password" id="password">
        <input type="password" placeholder="Repeat Password..." name="confirm-password" id="confirm-password">
        <input type="email" placeholder="E-Mail..." name="email" id="email">
        <input type="date" placeholder="Birthday..." name="birthday" id="birthday">

        <input type="hidden" name="register" value="1">

        <Label id="profile-pictures-text">which Profil Picture discribes YOU the most?</Label>
        <div id="profile-pictures"></div>


        <button class="register" type="submit">Register</button>
        <Label id="have-account">Already have an account? <a href="./login.html">Login</a></Label>
    </form>


    */

    registerUser();

}


function registerUser() {
global $conn, $response;

        if (!isset($_POST['first-name'], $_POST['last-name'], $_POST['username'], $_POST['password'], $_POST['confirm-password'], $_POST['email'], $_POST['birthday'], $_SESSION['selectedProfilePicture'])) {
            $response['success'] = false;
            $response['data'] = null;
            $response['error'] = "Bitte füllen Sie alle Felder aus.";
            $_SESSION['userResponse']= $response;
            header("Location: ../pages/login-register/register.html");
        }

        if ($_POST['password'] !== $_POST['confirm-password']) {
            $response['success'] = false;
            $response['data'] = null;
            $response['error'] = "Die Passwörter stimmen nicht überein.";
            $_SESSION['userResponse']= $response;
            header("Location: ../pages/login-register/register.html");
        }

        $firstName = $_POST['first-name'];
        $lastName = $_POST['last-name'];
        $username = $_POST['username'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $email = $_POST['email'];
        $birthday = $_POST['birthday'];


        $stmt = $conn->prepare("INSERT INTO user (first_name, last_name, username, email, password, birthday, image_src) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $firstName, $lastName, $username, $email, $password, $birthday, $_SESSION['selectedProfilePicture']);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['data'] = "Registrierung erfolgreich!";
            $response['error'] = null;
            $_SESSION['userResponse'] = $response;
            header("Location: ../pages/login-register/login.html");
        } else {
            $response['success'] = false;
            $response['data'] = null;
            $response['error'] = "Fehler bei der Registrierung: " . $stmt->error;
            $_SESSION['userResponse'] = $response;
            header("Location: ../pages/login-register/register.html");

        }

        $stmt->close();
}




?>

