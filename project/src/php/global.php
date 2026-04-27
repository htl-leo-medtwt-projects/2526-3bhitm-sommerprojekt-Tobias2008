<?php

session_start();

header('Content-Type: application/json');

function jsonResponse($success, $data = null, $error = null)
{
    echo json_encode([
        "success" => $success,
        "data" => $data,
        "error" => $error
    ]);
    exit;
}

if (isset($_POST['getSession'])) {

    $param = $_POST['getSession'];

    if ($param === "" || $param === null) {
        jsonResponse(true, $_SESSION, null);
    }

    if (isset($_SESSION[$param])) {
        jsonResponse(true, $_SESSION[$param], null);
    }

    jsonResponse(false, null, "Session-Variable '$param' existiert nicht.");
} 