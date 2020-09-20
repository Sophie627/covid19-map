<?php
    include './database_open.php';

    // echo date("Y-m-d");
    $sql = "SELECT confirmed, lat, lon, `date` FROM covid_data";
    // $sql = "SELECT confirmed, lat, lon FROM covid_data WHERE `date` > '2020-09-17 23:59:59'";
    $result = $conn->query($sql);

    $array = array();
    while($row = $result->fetch_assoc()) {
        $array[] = $row;
    }

    echo json_encode($array);

    include './database_close.php';
?>