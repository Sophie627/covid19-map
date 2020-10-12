<?php
    include './database_open.php';

    $day = date('Y-m-d',strtotime("-2 days"));

    $sql = "SELECT confirmed, lat, lon, country, province, city, `date` FROM covid_data WHERE `countryCode` != 'US'";
    $result = $conn->query($sql);

    $array = array();
    while($row = $result->fetch_assoc()) {
        $array[] = $row;
    }

    echo json_encode($array);

    include './database_close.php';
?>