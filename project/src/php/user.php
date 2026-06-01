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
    returnJSON(false, null, "DB Verbindung fehlgeschlagen");
}
/*else if (isset($_SESSION['user'], $_SESSION['username']) && $_SESSION['user']) {
    header("Location: ../pages/index.html");
    exit();
}
*/

// GET
if (isset($_GET['action']) && $_GET['action'] === 'getProfile') {
    getProfile();
}

// POST
if (isset($_POST['action']) && $_POST['action'] === 'updateProfile') {
    updateProfile();
}

if (isset($_POST['register'])) {
    registerUser();
}

if (isset($_POST['login'])) {
    loginUser();
}

/*if (!isset($_POST['action'], $_POST['register'], $_POST['login'])) {
    header("Location: ../pages/login-register/login.html");
    exit();
}
*/

function registerUser()
{



    global $conn;

    if (!isset($_POST['first-name'], $_POST['last-name'], $_POST['username'], $_POST['password'], $_POST['confirm-password'], $_POST['email'], $_POST['birthday'], $_SESSION['selectedProfilePicture'])) {
        saveSessionData(false, null, "Please fill in all fields.");
        header("Location: ../pages/login-register/register.php");
        exit();
    }

    if ($_POST['password'] !== $_POST['confirm-password']) {
        saveSessionData(false, null, "The passwords do not match.");
        header("Location: ../pages/login-register/register.php");
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
        saveSessionData(true, "Registration successful!", null);
        header("Location: ../pages/login-register/login.html");
        exit();
    } else {
        saveSessionData(false, null, "Error during registration: " . $stmt->error);
        header("Location: ../pages/login-register/register.php");

    }

    $stmt->close();
}


function loginUser()
{
    global $conn;

    if (!isset($_POST['username'], $_POST['password'])) {
        saveSessionData(false, null, "Please fill in all fields.");
        header("Location: ../pages/login-register/login.php");
        exit();
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        saveSessionData(false, null, "Username is not registered.");
        header("Location: ../pages/login-register/login.php");
        exit();
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password'])) {
        saveSessionData(false, null, "Password is wrong.");
        header("Location: ../pages/login-register/login.php");
        exit();
    }

    saveSessionData(true, "Login successful!", null);
    $_SESSION['username'] = $username;
    $_SESSION['user'] = true;
    header("Location: ../pages/event.html");
    exit();
}





function getProfile()
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Not logged in");
    }

    $username = $_SESSION['username'];

    $stmt = $conn->prepare("
        SELECT first_name, last_name, date_of_birth, image_src
        FROM user
        WHERE username = ?
    ");

    if (!$stmt) {
        returnJSON(false, null, "SQL prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $username);

    if (!$stmt->execute()) {
        returnJSON(false, null, "SQL execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        returnJSON(false, null, "User not found");
    }

    $user = $result->fetch_assoc();

    returnJSON(true, $user);
}


function updateProfile()
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Not logged in");
    }

    $username = $_SESSION['username'];
    $first = $_POST['first_name'] ?? null;
    $last = $_POST['last_name'] ?? null;
    $dob = $_POST['date_of_birth'] ?? null;

    if (!$first || !$last || !$dob) {
        returnJSON(false, null, "Missing fields");
    }

    $stmt = $conn->prepare("
        UPDATE user 
        SET first_name=?, last_name=?, date_of_birth=?
        WHERE username=?
    ");

    $stmt->bind_param("ssss", $first, $last, $dob, $username);

    if (!$stmt->execute()) {
        returnJSON(false, null, $stmt->error);
    }

    returnJSON(true, "Updated");
}

?>
