<?php
    $servername = "localhost";
    $username = "u331773922_root";
    $password = "Tkwdlrfjkaj627";
    $dbname = "u331773922_coviddata";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    }
?>