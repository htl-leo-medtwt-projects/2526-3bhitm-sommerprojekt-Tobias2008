<?php

include "../../php/global.php";



?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../../style/global.css">
    <link rel="stylesheet" href="../../style/login.css">
</head>

<body>
    <div id="headgap"></div>
    <h1 id="headline">Login</h1>
    <form action="../../php/user.php" method="POST">
        <input type="text" placeholder="Nickname..." name="username" id="username">
        <?php if (isset($_SESSION['error']) && $_SESSION['error']['success'] === false && $_SESSION['error']['error'] === "Username is not registered.") {
                    echo '<p class="error">' . $_SESSION['error']['error'] . '</p>';
                }
        ?>
        <input type="password" placeholder="Password..." name="password" id="password">
        <Label id="forgot-password">Forgot Password?</Label>
        <?php if (isset($_SESSION['error']) && $_SESSION['error']['success'] === false && $_SESSION['error']['error'] === "Password is wrong.") {
                    echo '<p class="error">' . $_SESSION['error']['error'] . '</p>';
                }
        ?>
        <button class="login" type="submit">Login</button>
        <Label id="no-account">You dont have an account? <a href="./register.html">Sign in</a></Label>

        <input type="hidden" name="login" value="1">
    </form>
    <footer>
        <p>&copy; 2026 Payreder Management. All rights reserved.</p>
    </footer>
</body>

</html>