<?php

/* TODO: 
 * Exeptionhandling bei Login / Registrierung
 * Fehlermeldungen auf der Seite anzeigen
 */

require 'global.php';

$_db_host = 'db_server';
$_db_username = 'PreGame';
$_db_password = 'pregamepassword';
$_db_datenbank = 'PreGame';

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_datenbank);

if ($conn->connect_error) {
    jsonResponse(false, null, "DB Verbindung fehlgeschlagen");
} else if (isset($_SESSION['user'], $_SESSION['username']) && $_SESSION['user']) {
    header("Location: ../pages/index.html");
    exit();
}


if (isset($_POST['action'])) {
    if ($_POST['action'] === 'selectProfilePicture') {
        $_SESSION['selectedProfilePicture'] = $_POST['profile-picture'];
    }
}

if (isset($_POST['register'])) {
    registerUser();
}

if (isset($_POST['login'])) {
    loginUser();
}

if (!isset($_POST['action'], $_POST['register'], $_POST['login'])) {
    header("Location: ../pages/login-register/login.html");
    exit();
}


function registerUser()
{

    die("REGISTER FUNCTION HIT");

    
    global $conn;

    if (!isset($_POST['first-name'], $_POST['last-name'], $_POST['username'], $_POST['password'], $_POST['confirm-password'], $_POST['email'], $_POST['birthday'], $_SESSION['selectedProfilePicture'])) {
        jsonResponse(false, null, "Bitte füllen Sie alle Felder aus.");
        header("Location: ../pages/login-register/register.html");
        exit();
    }

    if ($_POST['password'] !== $_POST['confirm-password']) {
        jsonResponse(false, null, "Die Passwörter stimmen nicht überein.");
        header("Location: ../pages/login-register/register.html");
        exit();
    }

    $firstName = $_POST['first-name'];
    $lastName = $_POST['last-name'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $email = $_POST['email'];
    $birthday = $_POST['birthday'];


    $stmt = $conn->prepare("INSERT INTO user (first_name, last_name, username, email, password, date_of_birth, image_src) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $firstName, $lastName, $username, $email, $password, $birthday, $_SESSION['selectedProfilePicture']);

    if ($stmt->execute()) {
        jsonResponse(true, "Registrierung erfolgreich!", null);
        header("Location: ../pages/login-register/login.html");
        exit();
    } else {
        jsonResponse(false, null, "Fehler bei der Registrierung: " . $stmt->error);
        header("Location: ../pages/login-register/register.html");

    }

    $stmt->close();
}


function loginUser()
{
    global $conn;

    if (!isset($_POST['username'], $_POST['password'])) {
        jsonResponse(false, null, "Bitte füllen Sie alle Felder aus.");
        header("Location: ../pages/login-register/login.html");
        exit();
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        jsonResponse(false, null, "Benutzername ist falsch.");
        header("Location: ../pages/login-register/login.html");
        exit();
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password'])) {
        jsonResponse(false, null, "Passwort ist falsch.");
        header("Location: ../pages/login-register/login.html");
        exit();
    }

    jsonResponse(true, "Login erfolgreich!", null);
    $_SESSION['username'] = $username;
    $_SESSION['user'] = true;
    header("Location: ../pages/event.html");
    exit();
}



?>