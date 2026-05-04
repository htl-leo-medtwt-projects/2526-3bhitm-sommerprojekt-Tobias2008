<?php

session_start();

header('Content-Type: application/json');


function jsonResponse($success, $data = null, $error = null)
{
    // optional intern speichern (falls du es brauchst)
    $_SESSION['json_response'] = [
        "success" => $success,
        "data" => $data,
        "error" => $error
    ];

    echo json_encode([
        "success" => $success,
        "data" => $data,
        "error" => $error
    ]);

    exit();
}



if (isset($_GET['getSession'])) {

    $param = $_GET['getSession'];

    if ($param === "" || $param === null) {
        jsonResponse(true, $_SESSION, null);
    }

    if ($param === "username") {
        if (isset($_SESSION['username'])) {
            jsonResponse(true, $_SESSION['username'], null);
        } else {
            jsonResponse(false, null, "Username nicht in Session gesetzt");
        }
    }

    jsonResponse(false, null, "Session-Variable '$param' existiert nicht.");
}
