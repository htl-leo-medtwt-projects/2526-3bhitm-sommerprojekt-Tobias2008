<?php

session_start();

$response = [
    "success" => false,
    "data" => null,
    "error" => null
];

function jsonResponse($success, $data, $error) {
    global $response;

    header('Content-Type: application/json');
    $response['success'] = $success;
    $response['data'] = $data;
    $response['error'] = $error;
    echo json_encode($response);
}