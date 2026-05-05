<?php

require 'global.php';
require 'authcheck.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');


$_db_host = 'db_server';
$_db_username = 'PreGame';
$_db_password = 'pregamepassword';
$_db_datenbank = 'PreGame';

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_datenbank);

if ($conn->connect_error) {
    jsonResponse(false, null, "DB Verbindung fehlgeschlagen");
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create':
        createEvent();
        break;

    case 'get':
        if (!isset($_GET['user'])) {
            jsonResponse(false, null, "Benutzer fehlt");
        }
        getEvent($_GET['user']);
        break;

    case 'getFavorite':
        if (!isset($_GET['user'])) {
            jsonResponse(false, null, "Benutzer fehlt");
        }
        getFavoriteEvent($_GET['user']);
        break;
    case 'getSingleEvent':
        if (!isset($_GET['event_id'])) {
            jsonResponse(false, null, "Event-ID fehlt");
        }
        getSingleEvent($_GET['event_id']);
        break;
    case 'getEventItems':
        if (!isset($_GET['event_id'])) {
            jsonResponse(false, null, "Event-ID fehlt");
        }
        getEventItems($_GET['event_id']);
        break;
    case 'getItemDetails':
        if (!isset($_GET['event_id'])) {
            jsonResponse(false, null, "Event-ID fehlt");
        }
        getItemDetails($_GET['event_id']);
        break;
    case 'markItemDone':
        if (!isset($_POST['item_id']) || !isset($_POST['event_id'])) {
            jsonResponse(false, null, "Item-ID oder Event-ID fehlt");
        }
        markItemDone($_POST['item_id'], $_POST['event_id']);
        break;
    default:
        jsonResponse(false, null, "Ungültige Aktion");
}

function createEvent()
{
    global $conn;

    $eventName = $_POST['eventName'] ?? '';
    $eventTitle = $_POST['eventTitle'] ?? '';
    $eventDescription = $_POST['eventDescription'] ?? null;
    $eventDate = $_POST['eventDate'] ?? null;
    $eventLocation = $_POST['eventLocation'] ?? null;
    $eventMaxMembers = $_POST['eventMaxMembers'] ?? null;
    $eventImageSrc = $_POST['eventImageSrc'] ?? null;

    if (empty($eventName) || empty($eventTitle)) {
        jsonResponse(false, null, "Event-Name und Titel dürfen nicht leer sein");
    }

    $stmt = $conn->prepare("INSERT INTO event (name, title_text, information, event_date, location, max_members, image_src) VALUES (?, ?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        jsonResponse(false, null, "Prepare fehlgeschlagen");
    }

    $stmt->bind_param("sssssss", $eventName, $eventTitle, $eventDescription, $eventDate, $eventLocation, $eventMaxMembers, $eventImageSrc);

    if ($stmt->execute()) {
        jsonResponse(true, "Event erfolgreich erstellt", null);
    } else {
        jsonResponse(false, null, $stmt->error);
    }

    $stmt->close();
}

function getEvent($selectedUser)
{
    global $conn;

    $stmt = $conn->prepare("
    SELECT e.* from event e
    JOIN attendance a ON e.event_id = a.event_id
    WHERE a.username = ?");

    if (!$stmt) {
        jsonResponse(false, null, "Prepare fehlgeschlagen");
    }



    $stmt->bind_param("s", $selectedUser);
    $stmt->execute();

    $result = $stmt->get_result();

    $events = [];

    while ($row = $result->fetch_assoc()) {

        $statement = $conn->prepare("
  SELECT username FROM attendance
  WHERE event_id = ? AND is_creator = 1
");

        if ($statement) {
            $statement->bind_param("i", $row['event_id']);

            if ($statement->execute()) {
                $ownerResult = $statement->get_result();

                if ($ownerRow = $ownerResult->fetch_assoc()) {
                    $row['owner'] = $ownerRow['username'];
                } else {
                    $row['owner'] = null;
                }
            } else {
                $row['owner'] = null;
            }
        } else {
            $row['owner'] = null;
        }

        $events[] = $row;
    }

    jsonResponse(true, $events, null);
}

function getFavoriteEvent($selectedUser)
{
    global $conn;

    $stmt = $conn->prepare("
    SELECT e.* from event e
    JOIN attendance a ON e.event_id = a.event_id
    WHERE a.username = ? AND a.has_favorited = 1");

    if (!$stmt) {
        jsonResponse(false, null, "Prepare fehlgeschlagen");
    }

    $stmt->bind_param("s", $selectedUser);
    $stmt->execute();

    $result = $stmt->get_result();

    $events = [];

    while ($row = $result->fetch_assoc()) {
        $statement = $conn->prepare("
    SELECT username FROM attendance
    WHERE event_id = ? AND is_creator = 1");
        if ($statement) {
            $statement->bind_param("i", $row['event_id']);

            if ($statement->execute()) {
                $ownerResult = $statement->get_result();

                if ($ownerRow = $ownerResult->fetch_assoc()) {
                    $row['owner'] = $ownerRow['username'];
                } else {
                    $row['owner'] = null;
                }
            } else {
                $row['owner'] = null;
            }
        } else {
            $row['owner'] = null;
        }


        $events[] = $row;

    }

    jsonResponse(true, $events, null);
}

function getSingleEvent($eventID)
{
    global $conn;

    $stmt = $conn->prepare("SELECT * FROM event where event_id = ?");
    $stmt->bind_param('i', $eventID);

    if ($stmt->execute()) {
        $event = $stmt->get_result()->fetch_assoc();
        jsonResponse(true, $event, null);
    } else {
        jsonResponse(false, null, $stmt->error);
        exit;
    }

}

function getEventItems($eventID)
{
    global $conn;

    $stmt = $conn->prepare("SELECT * FROM attribute WHERE event_id = ?");
    $stmt->bind_param('i', $eventID);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        jsonResponse(true, $items, null);
    } else {
        jsonResponse(false, null, $stmt->error);
        exit;
    }

}


function getItemDetails($eventID)
{
    global $conn;

    $stmt = $conn->prepare("SELECT * FROM item WHERE event_id = ?");
    $stmt->bind_param('i', $eventID);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        jsonResponse(true, $items, null);
    } else {
        jsonResponse(false, null, $stmt->error);
        exit;
    }

}

function markItemDone($itemID, $eventID)
{
    global $conn;

    $namestmt = $conn->prepare("SELECT name FROM item WHERE id = ?");
    $namestmt->bind_param("i", $itemID);
    $name = null;
    if($namestmt->execute()) {
        $name = $namestmt->get_result()->fetch_assoc()['name'];
    }
    


    $stmt = $conn->prepare("INSERT INTO item (name, event_id, is_done, username) VALUES (?, ?, 1, ?)");
    $stmt->bind_param('sis', $name, $eventID);

    if ($stmt->execute()) {
        jsonResponse(true, "Item als erledigt markiert", null);
    } else {
        jsonResponse(false, null, $stmt->error);
    }
}