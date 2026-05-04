<?php

session_start();



if (!isset($_SESSION['user'], $_SESSION['username'])) {
    $base = dirname($_SERVER['SCRIPT_NAME'], 3);
    header("Location: $base/src/pages/index.html");
    exit();
}

function jsonResponse($success, $data = null, $error = null)
{
    $_SESSION['json_response'] = [
        "success" => $success,
        "data" => $data,
        "error" => $error
    ];
}

if (isset($_GET['getSession'])) {

    $param = $_GET['getSession'];

    if ($param === "" || $param === null) {
        jsonResponse(true, $_SESSION, null);
    }

    if ($param === "username") {
        if (isset($_SESSION['username'])) {
            jsonResponse(true, $_SESSION['username'], null);
            returnSessionAndExit();
        } else {
            jsonResponse(false, $_SESSION, "Username nicht in Session gesetzt");
            returnSessionAndExit();
        }
    }

    jsonResponse(false, null, "Session-Variable '$param' existiert nicht.");
}

function returnSessionAndExit()
{

    if (isset($_SESSION)) {
        echo json_encode(
            $_SESSION
        );
        exit;
    } else {
        echo json_encode([
            "success" => false,
            "data" => null,
            "error" => "Keine Session-Antwort vorhanden."
        ]);
        exit;
    }
}