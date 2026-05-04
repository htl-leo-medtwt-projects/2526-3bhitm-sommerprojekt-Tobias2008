<?php


if (!isset($_SESSION['user']) || !$_SESSION['user']) {
    header("Location: ../pages/login-register/login.html");
    exit();
}

?>