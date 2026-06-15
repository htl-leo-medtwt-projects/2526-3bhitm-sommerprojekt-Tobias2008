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
    saveSessionData(false, null, "DB Verbindung fehlgeschlagen");
}

$action = $_GET['action'] ?? '';



switch ($action) {
    case 'create':
        createEvent();
        break;

    case 'get':
        if (!isset($_GET['user'])) {
            saveSessionData(false, null, "Benutzer fehlt");
        }
        getEvent($_GET['user']);
        break;

    case 'getFavorite':
        if (!isset($_GET['user'])) {
            saveSessionData(false, null, "Benutzer fehlt");
        }
        getFavoriteEvent($_GET['user']);
        break;
    case 'getSingleEvent':
        if (!isset($_GET['event_id'])) {
            saveSessionData(false, null, "Event-ID fehlt");
        }
        getSingleEvent($_GET['event_id']);
        break;
    case 'getEventItems':
        if (!isset($_GET['event_id'])) {
            saveSessionData(false, null, "Event-ID fehlt");
        }
        getEventItems($_GET['event_id']);
        break;
    case 'getItemDetails':
        if (!isset($_GET['event_id'])) {
            saveSessionData(false, null, "Event-ID fehlt");
        }
        getItemDetails($_GET['event_id']);
        break;
    case 'markItemDone':
        if (!isset($_POST['item_id']) || !isset($_POST['event_id'])) {
            saveSessionData(false, null, "Item-ID oder Event-ID fehlt");
        }
        markItemDone($_POST['item_id'], $_POST['event_id']);
        break;
    case 'getUsername':
        getUsername();
        break;
    case 'getMembers':
        if (!isset($_GET['event_id'])) {
            saveSessionData(false, null, "Event-ID fehlt");
        }
        getMembers($_GET['event_id']);
        break;
    case 'getProfile':
        getProfile();
        break;
    case 'updateProfile':
        updateProfile();
        break;
    case 'toggleFavorite':
        if (!isset($_POST['event_id'])) {
            returnJSON(false, null, "Event-ID fehlt");
        }
        toggleFavorite($_POST['event_id']);
        break;
    case 'getParticipants':
        if (!isset($_GET['event_id'])) {
            saveSessionData(false, null, "Event-ID fehlt");
        }
        getMembers($_GET['event_id']);
        break;
    case 'getFavoriteStatus':
        if (!isset($_GET['event_id'])) {
            returnJSON(false, null, "Event-ID fehlt");
        }
        getFavoriteStatus($_GET['event_id']);
        break;
    case 'createAttribute':
        createAttribute();
        break;
    case 'createItem':
        createItem();
        break;
    case 'isEventOwner':
        if (!isset($_GET['event_id'])) {
            returnJSON(false, null, "Event-ID fehlt");
        }
        isEventOwner($_GET['event_id']);
        break;
    case 'addMemberToEvent':
        addMemberToEvent();
        break;
    case 'removeMemberFromEvent':
        removeMemberFromEvent();
        break;
    case 'deleteEvent':
        deleteEvent();
        break;
    case 'checkMemberLimit':
        checkMemberLimit();
        break;

    case 'increaseMemberLimit':
        increaseMemberLimit();
        break;
    default:
        saveSessionData(false, null, "Ungültige Aktion");
}

function createEvent()
{
    global $conn;


    $eventName = $_POST['event-name'] ?? '';
    $eventTitle = $_POST['title-text'] ?? '';
    $eventDescription = $_POST['event-information'] ?? null;
    $eventDate = $_POST['event-date'] ?? null;
    $eventLocation = $_POST['event-location'] ?? null;
    $eventMaxMembers = $_POST['max-members'] ?? null;

    $eventImageSrc = null;

    if (isset($_FILES['event-image']) && $_FILES['event-image']['error'] === 0) {

        $uploadDir = "../../ressources/images/uploads/";

        $fileName = basename($_FILES['event-image']['name']);
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        if (!in_array($fileExtension, $allowedExtensions)) {
            die("Ungültiger Dateityp");
        }

        $newFileName = uniqid() . "." . $fileExtension;
        $targetFile = $uploadDir . $newFileName;

        if (move_uploaded_file($_FILES['event-image']['tmp_name'], $targetFile)) {
            $eventImageSrc = $targetFile;
        } else {
            die("Fehler beim Upload");
        }
    }

    $stmt = $conn->prepare("
        INSERT INTO event
        (name, title_text, information, event_date, location, max_members, image_src)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "sssssis",
        $eventName,
        $eventTitle,
        $eventDescription,
        $eventDate,
        $eventLocation,
        $eventMaxMembers,
        $eventImageSrc
    );

    $eventIDstmt = $conn->prepare("SELECT MAX(event_id) FROM event;");
    $eventID = $eventIDstmt->execute() ? $eventIDstmt->get_result()->fetch_row()[0] + 1 : 1;

    if ($stmt->execute()) {
        $stmtAttendance = $conn->prepare("
            INSERT INTO attendance (username, event_id, is_creator, has_favorited)
            VALUES (?, ?, 1, 0)
        ");
        $stmtAttendance->bind_param("si", $_SESSION['username'], $eventID);
        $stmtAttendance->execute();


        $members = [];

        if (!empty($_POST['members'])) {
            $members = json_decode($_POST['members'], true);
        }


        /*
         * Alle ausgewählten Mitglieder zum Event hinzufügen
         */
        if (!empty($members)) {

            $stmtMember = $conn->prepare("
        INSERT INTO attendance
        (
            username,
            event_id,
            is_creator,
            has_favorited
        )
        VALUES (?, ?, 0, 0)
    ");

            foreach ($members as $member) {

                $username = $member['username'];

                $stmtMember->bind_param(
                    "si",
                    $username,
                    $eventID
                );

                $stmtMember->execute();
            }

        }

        $stmtAttendance->close();
    } else {
        die($stmt->error);
    }



    header("Location: ../pages/event.html");
}
function getEvent($selectedUser)
{
    global $conn;

    $stmt = $conn->prepare("
    SELECT e.* from event e
    JOIN attendance a ON e.event_id = a.event_id
    WHERE a.username = ?");

    if (!$stmt) {
        saveSessionData(false, null, "Prepare fehlgeschlagen");
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

    saveSessionData(true, $events, null);
    returnJSON(true, $events, null);
}

function getFavoriteEvent($selectedUser)
{
    global $conn;

    $stmt = $conn->prepare("
    SELECT e.* from event e
    JOIN attendance a ON e.event_id = a.event_id
    WHERE a.username = ? AND a.has_favorited = 1");

    if (!$stmt) {
        saveSessionData(false, null, "Prepare fehlgeschlagen");
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

    saveSessionData(true, $events, null);
    returnJSON(true, $events, null);
}

function getSingleEvent($eventID)
{
    global $conn;

    $stmt = $conn->prepare("SELECT * FROM event where event_id = ?");
    $stmt->bind_param('i', $eventID);

    if ($stmt->execute()) {
        $event = $stmt->get_result()->fetch_assoc();
        saveSessionData(true, $event, null);
        returnJSON(true, $event, null);

        exit;
    } else {
        returnJSON(false, null, $stmt->error);
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
        saveSessionData(true, $items, null);
        returnJSON(true, $items, null);
    } else {
        saveSessionData(false, null, $stmt->error);
        exit;
    }

}

function getItemDetails($eventID)
{
    global $conn;

    $stmt = $conn->prepare("
        SELECT *
        FROM item
        WHERE event_id = ?
        ORDER BY id ASC
    ");

    $stmt->bind_param("i", $eventID);

    if ($stmt->execute()) {

        $result = $stmt->get_result();

        $items = [];

        while ($row = $result->fetch_assoc()) {

            $items[] = $row;
        }

        returnJSON(true, $items, null);

    } else {

        returnJSON(false, null, $stmt->error);

    }
}

function markItemDone($itemID, $eventID)
{
    global $conn;

    $stmt = $conn->prepare("
        UPDATE item
        SET is_done =
        CASE
            WHEN is_done = 1 THEN 0
            ELSE 1
        END
        WHERE id = ?
        AND event_id = ?
    ");

    $stmt->bind_param(
        "ii",
        $itemID,
        $eventID
    );

    if ($stmt->execute()) {

        returnJSON(
            true,
            null,
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



function getUsername()
{
    if (isset($_SESSION['username']) && !empty($_SESSION['username'])) {
        saveSessionData(true, $_SESSION['username'], null);
        returnJSON(true, $_SESSION['username'], null);
    } else {
        saveSessionData(false, null, "Benutzer nicht angemeldet");
        returnJSON(false, null, "Benutzer nicht angemeldet");
    }
}

function getMembers($eventID)
{
    global $conn;

    $stmt = $conn->prepare("SELECT username FROM attendance WHERE event_id = ?");
    $stmt->bind_param("i", $eventID);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $members = [];
        while ($row = $result->fetch_assoc()) {
            $members[] = $row['username'];
        }
        saveSessionData(true, $members, null);
        returnJSON(true, $members, null);
    } else {
        saveSessionData(false, null, $stmt->error);
        returnJSON(false, null, $stmt->error);
    }
}


function getProfile()
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Nicht eingeloggt");
        exit();
    }

    $stmt = $conn->prepare("
        SELECT
            first_name,
            last_name,
            username,
            email,
            date_of_birth,
            image_src
        FROM user
        WHERE username = ?
    ");

    $stmt->bind_param("s", $_SESSION['username']);

    if ($stmt->execute()) {

        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        returnJSON(true, $user, null);

    } else {
        returnJSON(false, null, $stmt->error);
    }
}


function updateProfile()
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Nicht eingeloggt");
        exit();
    }

    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $email = $_POST['email'];

    $stmt = $conn->prepare("
        UPDATE user
        SET first_name = ?,
            last_name = ?,
            email = ?
        WHERE username = ?
    ");

    $stmt->bind_param(
        "ssss",
        $firstName,
        $lastName,
        $email,
        $_SESSION['username']
    );

    if ($stmt->execute()) {
        returnJSON(true, "Profil gespeichert", null);
    } else {
        returnJSON(false, null, $stmt->error);
    }
}

function toggleFavorite($eventID)
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Nicht eingeloggt");
        exit();
    }

    // Aktuellen Status holen
    $stmt = $conn->prepare("SELECT has_favorited FROM attendance WHERE username = ? AND event_id = ?");
    $stmt->bind_param("si", $_SESSION['username'], $eventID);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result) {
        returnJSON(false, null, "Attendance-Eintrag nicht gefunden");
        exit();
    }

    $newStatus = $result['has_favorited'] ? 0 : 1;

    $update = $conn->prepare("UPDATE attendance SET has_favorited = ? WHERE username = ? AND event_id = ?");
    $update->bind_param("isi", $newStatus, $_SESSION['username'], $eventID);

    if ($update->execute()) {
        returnJSON(true, $newStatus, null);
    } else {
        returnJSON(false, null, $update->error);
    }
}

function getFavoriteStatus($eventID)
{
    global $conn;

    if (!isset($_SESSION['username'])) {
        returnJSON(false, null, "Nicht eingeloggt");
        exit();
    }

    $stmt = $conn->prepare("SELECT has_favorited FROM attendance WHERE username = ? AND event_id = ?");
    $stmt->bind_param("si", $_SESSION['username'], $eventID);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    returnJSON(true, $result['has_favorited'] ?? 0, null);
}

function createAttribute()
{
    global $conn;

    $eventID = $_POST['event_id'];
    $name = $_POST['name'];

    $information = '';
    $attributeType = 'text';
    $username = $_SESSION['username'];

    $stmt = $conn->prepare("
        INSERT INTO attribute
        (name, event_id, information, username, attribute_type)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "sisss",
        $name,
        $eventID,
        $information,
        $username,
        $attributeType
    );

    if ($stmt->execute()) {
        returnJSON(true, null, null);
    } else {
        returnJSON(false, null, $stmt->error);
    }
}

function createItem()
{
    global $conn;

    $attributeID = $_POST['attribute_id'];
    $eventID = $_POST['event_id'];
    $name = trim($_POST['name']);

    if (!$name) {
        returnJSON(false, null, "Name fehlt");
        return;
    }

    $stmt = $conn->prepare("
        INSERT INTO item
        (
            name,
            event_id,
            attribute_id,
            username,
            is_done
        )
        VALUES (?, ?, ?, ?, 0)
    ");

    $stmt->bind_param(
        "siis",
        $name,
        $eventID,
        $attributeID,
        $_SESSION['username']
    );

    if ($stmt->execute()) {

        $newItem = [
            "id" => $conn->insert_id,
            "name" => $name,
            "event_id" => $eventID,
            "attribute_id" => $attributeID,
            "username" => $_SESSION['username'],
            "is_done" => 0
        ];

        returnJSON(true, $newItem, null);

    } else {

        returnJSON(false, null, $stmt->error);

    }
}

function isEventOwner($eventID)
{
    global $conn;

    $stmt = $conn->prepare("
        SELECT *
        FROM attendance
        WHERE event_id = ?
        AND username = ?
        AND is_creator = 1
    ");

    $stmt->bind_param(
        "is",
        $eventID,
        $_SESSION['username']
    );

    $stmt->execute();

    $result = $stmt->get_result();

    returnJSON(
        true,
        $result->num_rows > 0,
        null
    );
}

function addMemberToEvent()
{
    global $conn;

    $eventID = $_POST['event_id'];
    $username = $_POST['username'];

    // nur Owner darf hinzufügen

    $checkOwner = $conn->prepare("
        SELECT *
        FROM attendance
        WHERE event_id = ?
        AND username = ?
        AND is_creator = 1
    ");

    $checkOwner->bind_param(
        "is",
        $eventID,
        $_SESSION['username']
    );

    $checkOwner->execute();

    if ($checkOwner->get_result()->num_rows === 0) {
        returnJSON(false, null, "Keine Berechtigung");
        return;
    }

    // bereits im Event?

    $checkMember = $conn->prepare("
        SELECT *
        FROM attendance
        WHERE event_id = ?
        AND username = ?
    ");

    $checkMember->bind_param(
        "is",
        $eventID,
        $username
    );

    $checkMember->execute();

    if ($checkMember->get_result()->num_rows > 0) {
        returnJSON(false, null, "User bereits im Event");
        return;
    }

    $stmt = $conn->prepare("
        INSERT INTO attendance
        (
            username,
            event_id,
            is_creator,
            has_favorited
        )
        VALUES (?, ?, 0, 0)
    ");

    $stmt->bind_param(
        "si",
        $username,
        $eventID
    );

    if ($stmt->execute()) {
        returnJSON(true, null, null);
    } else {
        returnJSON(false, null, $stmt->error);
    }
}

function removeMemberFromEvent()
{
    global $conn;

    $eventID = $_POST['event_id'];
    $username = $_POST['username'];

    $stmt = $conn->prepare("
    SELECT is_creator
    FROM attendance
    WHERE event_id = ?
    AND username = ?
");

    $stmt->bind_param(
        "is",
        $eventID,
        $username
    );

    $stmt->execute();

    $result = $stmt->get_result()->fetch_assoc();

    if ($result && $result['is_creator'] == 1) {

        returnJSON(
            false,
            null,
            "The event owner cannot be removed"
        );

        return;
    }

    $stmt = $conn->prepare("
        DELETE FROM attendance
        WHERE event_id = ?
        AND username = ?
        AND is_creator = 0
    ");

    $stmt->bind_param(
        "is",
        $eventID,
        $username
    );

    if ($stmt->execute()) {
        returnJSON(true, null, null);
    } else {
        returnJSON(false, null, $stmt->error);
    }
}


function deleteEvent()
{
    global $conn;

    $eventID = $_POST['event_id'];

    // Prüfen ob User Owner ist

    $stmt = $conn->prepare("
        SELECT *
        FROM attendance
        WHERE event_id = ?
        AND username = ?
        AND is_creator = 1
    ");

    $stmt->bind_param(
        "is",
        $eventID,
        $_SESSION['username']
    );

    $stmt->execute();

    if ($stmt->get_result()->num_rows === 0) {

        returnJSON(
            false,
            null,
            "Keine Berechtigung"
        );

        return;
    }

    $conn->begin_transaction();

    try {

        // Items löschen

        $stmt = $conn->prepare("
            DELETE FROM item
            WHERE event_id = ?
        ");

        $stmt->bind_param("i", $eventID);
        $stmt->execute();

        // Attribute löschen

        $stmt = $conn->prepare("
            DELETE FROM attribute
            WHERE event_id = ?
        ");

        $stmt->bind_param("i", $eventID);
        $stmt->execute();

        // Attendance löschen

        $stmt = $conn->prepare("
            DELETE FROM attendance
            WHERE event_id = ?
        ");

        $stmt->bind_param("i", $eventID);
        $stmt->execute();

        // Event löschen

        $stmt = $conn->prepare("
            DELETE FROM event
            WHERE event_id = ?
        ");

        $stmt->bind_param("i", $eventID);
        $stmt->execute();

        $conn->commit();

        returnJSON(
            true,
            null,
            null
        );

    } catch (Exception $e) {

        $conn->rollback();

        returnJSON(
            false,
            null,
            $e->getMessage()
        );
    }
}

function checkMemberLimit()
{
    global $conn;

    $eventId = $_GET['event_id'];

    $stmt = $conn->prepare("
        SELECT max_members
        FROM event
        WHERE event_id = ?
    ");

    $stmt->bind_param("i", $eventId);
    $stmt->execute();

    $event = $stmt->get_result()->fetch_assoc();

    $stmt = $conn->prepare("
        SELECT COUNT(*) as members
        FROM attendance
        WHERE event_id = ?
    ");

    $stmt->bind_param("i", $eventId);
    $stmt->execute();

    $members = $stmt->get_result()->fetch_assoc();

    returnJSON(
        true,
        [
            "current" => (int)$members['members'],
            "max" => (int)$event['max_members']
        ],
        null
    );
}

function increaseMemberLimit()
{
    global $conn;

    $eventId = $_POST['event_id'];

    $stmt = $conn->prepare("
        UPDATE event
        SET max_members = max_members + 1
        WHERE event_id = ?
    ");

    $stmt->bind_param("i", $eventId);

    if (!$stmt->execute()) {
        returnJSON(false, null, "Could not increase limit");
    }

    returnJSON(true);
}