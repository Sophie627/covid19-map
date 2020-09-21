<?php
    include './database_open.php';

    $day = date('Y-m-d',strtotime("-2 days"));

    // echo date("Y-m-d");
    $sql = "SELECT confirmed, lat, lon, `date` FROM covid_data";
    // $sql = "SELECT confirmed, lat, lon FROM covid_data WHERE `date` >= '$day 00:00:00'";
    // echo $sql;exit;
    $result = $conn->query($sql);

    $array = array();
    while($row = $result->fetch_assoc()) {
        $array[] = $row;
    }

    echo json_encode($array);

    include './database_close.php';
?>