<?php include "../../php/global.php"; ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>

    <link rel="stylesheet" href="../../style/global.css">
    <link rel="stylesheet" href="../../style/register.css">
</head>

<body>

<h1 id="headline">Register</h1>

<form action="../../php/user.php" method="POST">

    <input type="text" placeholder="First Name..." name="first-name">

    <input type="text" placeholder="Last Name..." name="last-name">

    <input type="text" placeholder="Nickname..." name="username">

    <input type="password" placeholder="Password..." name="password">

    <input type="password" placeholder="Repeat Password..." name="confirm-password">

    <input type="email" placeholder="E-Mail..." name="email">

    <input type="date" name="birthday">

    <input type="hidden" name="register" value="1">

    <?php
    if (isset($_SESSION['error']) && $_SESSION['error']['success'] === false) {
        echo '<p class="error">' . $_SESSION['error']['error'] . '</p>';
    }
    ?>

    <label id="profile-pictures-text">
        which Profile Picture describes YOU the most?
    </label>

    <div id="profile-pictures"></div>

    <button class="register" type="submit">Register</button>

    <label id="have-account">
        Already have an account? <a href="./login.php">Login</a>
    </label>

</form>

<footer>
    <p>&copy; 2026 Payreder Management. All rights reserved.</p>
</footer>

</body>
</html>