<?php

session_start();

$response = [
    "success" => false,
    "data" => null,
    "error" => null
];

function jsonResponse($success, $data, $error) {
    global $response;

    $response['success'] = $success;
    $response['data'] = $data;
    $response['error'] = $error;
}

function jsonResponseAndExit($success, $data, $error) {
    global $response;
    jsonResponse($success, $data, $error);

    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}