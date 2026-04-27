<?php

session_start();

$response = [
    "success" => false,
    "data" => null,
    "error" => null
];

function jsonResponse($success, $data, $error)
{
    global $response;

    $response['success'] = $success;
    $response['data'] = $data;
    $response['error'] = $error;
}

if (isset($_POST['getSession'])) {
    echo getSession($_POST['getSession']);
    exit();
}

function getSession($param)
{
    if ($param === "" || $param === null) {
        return json_encode($_SESSION);
    }

    if (isset($_SESSION[$param])) {
        return json_encode($_SESSION[$param]);
    } else {

        jsonResponse(false, null, "Session-Variable '$param' existiert nicht.");

        global $response;
        return json_encode($response);
    }
}