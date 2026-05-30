<?php

session_start();

function saveSessionData($success, $data = null, $error = null)
{
    // optional intern speichern (falls du es brauchst)
    $_SESSION['error'] = [
        "success" => $success,
        "data" => $data,
        "error" => $error
    ];
}



if (isset($_GET['getSession'])) {

    $param = $_GET['getSession'];

    if ($param === "" || $param === null) {
        saveSessionData(true, $_SESSION, null);
    }

    if ($param === "username") {
        if (isset($_SESSION['username'])) {
            saveSessionData(true, $_SESSION['username'], null);
        } else {
            saveSessionData(false, null, "Username nicht in Session gesetzt");
        }
    }

    saveSessionData(false, null, "Session-Variable '$param' existiert nicht.");
}


function returnJSON($success, $data = null, $error = null)
{
    echo json_encode([
        "success" => $success,
        "data" => $data,
        "error" => $error
    ]);
    exit();
}