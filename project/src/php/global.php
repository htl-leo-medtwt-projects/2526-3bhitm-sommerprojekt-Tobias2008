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

    header('Content-Type: application/json');

    $param = $_GET['getSession'];

    // gesamte session
    if ($param === "" || $param === null) {
        echo json_encode([
            "success" => true,
            "data" => $_SESSION,
            "error" => null
        ]);
        exit();
    }

    // username
    if ($param === "username") {
        if (isset($_SESSION['username'])) {
            echo json_encode([
                "success" => true,
                "data" => $_SESSION['username'],
                "error" => null
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "data" => null,
                "error" => "Username nicht in Session"
            ]);
        }
        exit();
    }

    if ($param === "error") {
        echo json_encode([
            "success" => true,
            "data" => $_SESSION['error'] ?? null,
            "error" => null
        ]);

        unset($_SESSION['error']);
        exit();
    }

    echo json_encode([
        "success" => false,
        "data" => null,
        "error" => "Session-Variable existiert nicht"
    ]);
    exit();
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