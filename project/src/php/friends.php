<?php

require 'global.php';
require 'authcheck.php';

header('Content-Type: application/json');

$_db_host = 'db_server';
$_db_username = 'PreGame';
$_db_password = 'pregamepassword';
$_db_datenbank = 'PreGame';

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_datenbank);

if ($conn->connect_error) {
    returnJSON(false, null, "DB Fehler");
    exit();
}

$action = $_GET['action'] ?? '';

switch ($action) {

    case 'getAllUsers':
        getAllUsers();
        break;

    case 'addFriend':
        addFriend();
        break;

    case 'getRequests':
        getRequests();
        break;

    case 'acceptRequest':
        acceptRequest();
        break;

    case 'declineRequest':
        declineRequest();
        break;

    case 'getFriends':
        getFriends();
        break;

    case 'removeFriend':
        removeFriend();
        break;
    case 'getRelations':
        getRelations();
        break;

    default:
        returnJSON(false, null, "Ungültige Aktion");
}


function getAllUsers()
{
    global $conn;

    $currentUser = $_SESSION['username'];

    $stmt = $conn->prepare("
        SELECT username
        FROM user
        WHERE username != ?
    ");

    $stmt->bind_param("s", $currentUser);

    if ($stmt->execute()) {

        $result = $stmt->get_result();

        $users = [];

        while ($row = $result->fetch_assoc()) {
            $users[] = $row['username'];
        }

        returnJSON(true, $users, null);

    } else {
        returnJSON(false, null, $stmt->error);
    }
}


function addFriend()
{

    global $conn;

    $currentUser = $_SESSION['username'];
    $friend = $_POST['friend'] ?? '';

    if ($friend == '') {
        returnJSON(false, null, "Kein Benutzer");
        exit();
    }

    // Bereits vorhanden?
    $check = $conn->prepare("
        SELECT *
        FROM friend
        WHERE
        (user_a = ? AND user_b = ?)
        OR
        (user_a = ? AND user_b = ?)
    ");

    $check->bind_param(
        "ssss",
        $currentUser,
        $friend,
        $friend,
        $currentUser
    );

    $check->execute();

    if ($check->get_result()->num_rows > 0) {
        returnJSON(false, null, "Bereits vorhanden");
        exit();
    }

    $stmt = $conn->prepare("
        INSERT INTO friend (user_a, user_b, accepted)
        VALUES (?, ?, 0)
    ");

    $stmt->bind_param("ss", $currentUser, $friend);

    if ($stmt->execute()) {
        returnJSON(true, "Anfrage gesendet", null);
    } else {
        returnJSON(false, null, $stmt->error);
    }
}


function getRequests()
{

    global $conn;

    $currentUser = $_SESSION['username'];

    $stmt = $conn->prepare("
        SELECT user_a
        FROM friend
        WHERE user_b = ?
        AND accepted = 0
    ");

    $stmt->bind_param("s", $currentUser);

    if ($stmt->execute()) {

        $result = $stmt->get_result();

        $requests = [];

        while ($row = $result->fetch_assoc()) {
            $requests[] = $row['user_a'];
        }

        returnJSON(true, $requests, null);

    } else {
        returnJSON(false, null, $stmt->error);
    }
}


function acceptRequest()
{

    global $conn;

    $currentUser = $_SESSION['username'];
    $friend = $_POST['friend'];

    $stmt = $conn->prepare("
        UPDATE friend
        SET accepted = 1
        WHERE user_a = ?
        AND user_b = ?
    ");

    $stmt->bind_param("ss", $friend, $currentUser);

    if ($stmt->execute()) {
        returnJSON(true, "Freund akzeptiert", null);
    } else {
        returnJSON(false, null, $stmt->error);
    }
}


function declineRequest()
{

    global $conn;

    $currentUser = $_SESSION['username'];
    $friend = $_POST['friend'];

    $stmt = $conn->prepare("
        DELETE FROM friend
        WHERE user_a = ?
        AND user_b = ?
        AND accepted = 0
    ");

    $stmt->bind_param("ss", $friend, $currentUser);

    if ($stmt->execute()) {
        returnJSON(true, "Anfrage gelöscht", null);
    } else {
        returnJSON(false, null, $stmt->error);
    }
}


function getFriends()
{

    global $conn;

    $currentUser = $_SESSION['username'];

    $stmt = $conn->prepare("
        SELECT
            CASE
                WHEN user_a = ? THEN user_b
                ELSE user_a
            END as friend
        FROM friend
        WHERE
        (user_a = ? OR user_b = ?)
        AND accepted = 1
    ");

    $stmt->bind_param(
        "sss",
        $currentUser,
        $currentUser,
        $currentUser
    );

    if ($stmt->execute()) {

        $result = $stmt->get_result();

        $friends = [];

        while ($row = $result->fetch_assoc()) {
            $friends[] = $row['friend'];
        }

        returnJSON(true, $friends, null);

    } else {
        returnJSON(false, null, $stmt->error);
    }
}


function removeFriend()
{

    global $conn;

    $currentUser = $_SESSION['username'];
    $friend = $_POST['friend'];

    $stmt = $conn->prepare("
        DELETE FROM friend
        WHERE
        (user_a = ? AND user_b = ?)
        OR
        (user_a = ? AND user_b = ?)
    ");

    $stmt->bind_param(
        "ssss",
        $currentUser,
        $friend,
        $friend,
        $currentUser
    );

    if ($stmt->execute()) {
        returnJSON(true, "Freund entfernt", null);
    } else {
        returnJSON(false, null, $stmt->error);
    }
}

function getRelations() {

    global $conn;

    $currentUser = $_SESSION['username'];

    $stmt = $conn->prepare("
    
        SELECT
            user_a,
            user_b,
            accepted

        FROM friend

        WHERE
        user_a = ?
        OR
        user_b = ?
    ");

    $stmt->bind_param(
        "ss",
        $currentUser,
        $currentUser
    );

    if($stmt->execute()) {

        $result =
        $stmt->get_result();

        $relations = [];

        while($row = $result->fetch_assoc()) {

            $otherUser =
            $row['user_a'] == $currentUser
            ? $row['user_b']
            : $row['user_a'];

            $relations[$otherUser] = [

                "accepted" =>
                    $row['accepted']
            ];
        }

        returnJSON(
            true,
            $relations,
            null
        );

    } else {

        returnJSON(
            false,
            null,
            $stmt->error
        );
    }
}