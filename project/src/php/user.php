<?php

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

if (isset($_GET['action']) && $_GET['action'] === 'getProfile') {
    getProfile();
}

if (isset($_GET['action']) && $_GET['action'] === 'changePassword') {
    changePassword();
}

if (isset($_GET['action']) && $_GET['action'] === 'changeEmail') {
    changeEmail();
}

if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header("Location: ../pages/login-register/login.php");
    exit();
}

if (isset($_GET['action']) && $_GET['action'] === 'deleteAccount') {
    deleteAccount();
}

if (isset($_POST['action']) && $_POST['action'] === 'updateProfile') {
    updateProfile();
}

if (isset($_GET['action']) && $_GET['action'] === 'selectProfilePicture') {
    selectProfilePicture();
    exit();
}

if (isset($_POST['register'])) {
    registerUser();
}

if (isset($_POST['login'])) {
    loginUser();
}


function registerUser()
{



    global $conn;

    if (
        empty($_POST['first-name']) ||
        empty($_POST['last-name']) ||
        empty($_POST['username']) ||
        empty($_POST['password']) ||
        empty($_POST['confirm-password']) ||
        empty($_POST['email']) ||
        empty($_POST['birthday'])
    ) {
        saveSessionData(false, null, "Please fill in all fields.");
        header("Location: ../pages/login-register/register.php");
        exit();
    }

    if (!isset($_SESSION['selectedProfilePicture'])) {
        saveSessionData(false, null, "Please select a profile picture.");
        header("Location: ../pages/login-register/register.php");
        exit();
    }

    if ($_POST['password'] !== $_POST['confirm-password']) {
        saveSessionData(false, null, "Passwords do not match.");
        header("Location: ../pages/login-register/register.php");
        exit();
    }


    $firstName = $_POST['first-name'];
    $lastName = $_POST['last-name'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $email = $_POST['email'];
    $birthday = $_POST['birthday'];

    $check = $conn->prepare("
    SELECT username
    FROM user
    WHERE username = ?
");

    $check->bind_param("s", $username);
    $check->execute();

    if ($check->get_result()->num_rows > 0) {
        saveSessionData(false, null, "Username already exists.");
        header("Location: ../pages/login-register/register.php");
        exit();
    }

    $check = $conn->prepare("
    SELECT email
    FROM user
    WHERE email = ?
");

    $check->bind_param("s", $email);
    $check->execute();

    if ($check->get_result()->num_rows > 0) {
        saveSessionData(false, null, "Email already exists.");
        header("Location: ../pages/login-register/register.php");
        exit();
    }



    $stmt = $conn->prepare("INSERT INTO user (first_name, last_name, username, email, password, date_of_birth, image_src) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $firstName, $lastName, $username, $email, $password, $birthday, $_SESSION['selectedProfilePicture']);


    try {

        if ($stmt->execute()) {

            saveSessionData(
                true,
                "Registration successful!",
                null
            );

            header("Location: ../pages/login-register/login.php");
            exit();

        }

    } catch (Exception $e) {

        error_log($e->getMessage());

        saveSessionData(
            false,
            null,
            "Database error. Please try again later."
        );

        header("Location: ../pages/login-register/register.php");
        exit();
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



function changePassword()
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Not logged in");
    }

    if (!isset($_POST['oldPassword'], $_POST['newPassword'])) {
        returnJSON(false, null, "Missing fields");
    }

    $username = $_SESSION['username'];
    $oldPassword = $_POST['oldPassword'];
    $newPassword = $_POST['newPassword'];

    $stmt = $conn->prepare("SELECT password FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);

    if (!$stmt->execute()) {
        returnJSON(false, null, "DB error");
    }

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        returnJSON(false, null, "User not found");
    }

    $user = $result->fetch_assoc();

    if (!password_verify($oldPassword, $user['password'])) {
        returnJSON(false, null, "Old password is incorrect");
    }

    $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    $update = $conn->prepare("UPDATE user SET password = ? WHERE username = ?");
    $update->bind_param("ss", $newHashedPassword, $username);

    if (!$update->execute()) {
        returnJSON(false, null, "Could not update password");
    }

    returnJSON(true, "Password updated");
}

function changeEmail()
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Not logged in");
    }

    if (!isset($_POST['email']) || empty(trim($_POST['email']))) {
        returnJSON(false, null, "Email is required");
    }

    $email = trim($_POST['email']);
    $username = $_SESSION['username'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        returnJSON(false, null, "Invalid email format");
    }

    $check = $conn->prepare("SELECT username FROM user WHERE email = ?");
    $check->bind_param("s", $email);

    if (!$check->execute()) {
        returnJSON(false, null, "Database error");
    }

    $result = $check->get_result();

    if ($result->num_rows > 0) {
        returnJSON(false, null, "Email already in use");
    }

    $stmt = $conn->prepare("UPDATE user SET email = ? WHERE username = ?");
    $stmt->bind_param("ss", $email, $username);

    if (!$stmt->execute()) {
        returnJSON(false, null, "Could not update email");
    }

    returnJSON(true, "Email updated successfully");
}

function deleteAccount()
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Not logged in");
    }

    $username = $_SESSION['username'];

    $conn->begin_transaction();

    try {

        // 1. Events holen, die der User erstellt hat
        $stmtSelectEvents = $conn->prepare("
            SELECT event.event_id
            FROM event
            JOIN attendance ON event.event_id = attendance.event_id
            WHERE attendance.is_creator = 1
              AND attendance.username = ?
        ");

        $stmtSelectEvents->bind_param("s", $username);
        $stmtSelectEvents->execute();

        $result = $stmtSelectEvents->get_result();

        $eventIds = [];
        while ($row = $result->fetch_assoc()) {
            $eventIds[] = $row['event_id'];
        }

        $result->free();
        $stmtSelectEvents->close();

        // 2. Alle Event-bezogenen Daten löschen
        foreach ($eventIds as $eventId) {

            $stmt = $conn->prepare("DELETE FROM vote WHERE event_id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("DELETE FROM vote_option WHERE event_id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("DELETE FROM attendance WHERE event_id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("DELETE FROM purchase WHERE event_id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("DELETE FROM item WHERE event_id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $stmt->close();
        }

        // 3. User-Teilnahmen löschen
        $stmt = $conn->prepare("
            DELETE FROM attendance
            WHERE username = ?
        ");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->close();

        // 4. Freundschaften löschen
        $stmt = $conn->prepare("
            DELETE FROM friend
            WHERE user_a = ?
               OR user_b = ?
        ");
        $stmt->bind_param("ss", $username, $username);
        $stmt->execute();
        $stmt->close();

        // 5. User löschen
        $stmt = $conn->prepare("
            DELETE FROM user
            WHERE username = ?
        ");
        $stmt->bind_param("s", $username);

        if (!$stmt->execute()) {
            throw new Exception("Could not delete user");
        }

        $stmt->close();

        // 6. Session zerstören
        $_SESSION = [];
        session_destroy();

        $conn->commit();

        returnJSON(true, "Account deleted");

    } catch (Exception $e) {

        $conn->rollback();

        returnJSON(false, null, $e->getMessage());
    }
}

function selectProfilePicture()
{
    if (!isset($_POST['profile-picture'])) {
        returnJSON(false, null, "Kein Profilbild ausgewählt");
        return;
    }

    $_SESSION['selectedProfilePicture'] =
        "../../../ressources/images/profile/pre-saved-images/" .
        $_POST['profile-picture'] .
        "Monster.jpg";

    returnJSON(true, "Profilbild gespeichert", null);
}