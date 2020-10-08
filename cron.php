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

    $yesterday = date('Y-m-d',strtotime("-1 days"));
    // $yesterday = '2020-10-06';
    $countries = CallAPI("GET", "https://api.covid19api.com/countries");
    $countries = json_decode($countries); 

    foreach( $countries as $country ) {
        $slug =  $country->Slug;
        $covidData = CallAPI("GET", "https://api.covid19api.com/country/". $slug. "?from=". $yesterday. "T00:00:00Z&to=". $yesterday. "T00:00:01Z");
        createData(json_decode($covidData), $conn);
        sleep(1);
    }

    // Method: POST, PUT, GET etc
    // Data: array("param" => "value") ==> index.php?param=value

    function CallAPI($method, $url, $data = false)
    {
        $curl = curl_init();

        switch ($method)
        {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);

                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_PUT, 1);
                break;
            default:
                if ($data)
                    $url = sprintf("%s?%s", $url, http_build_query($data));
        }

        // Optional Authentication:
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, "username:password");

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($curl);

        curl_close($curl);

        return $result;
    }

    function createData($data, $conn) {
        foreach ($data as $val) {
            $country = str_replace("'", "\'", $val->Country);
            $province = str_replace("'", "\'", $val->Province);
            $city = str_replace("'", "\'", $val->City);
            $sql = "INSERT INTO covid_data (country, countryCode, province, city, cityCode, lat, lon, confirmed, deaths, recovered, active, `date`) VALUES ('$country', '$val->CountryCode', '$province', '$city', '$val->CityCode', '$val->Lat', '$val->Lon', $val->Confirmed, $val->Deaths, $val->Recovered, $val->Active, '$val->Date')";
            if ($conn->query($sql) === TRUE) {
                echo $val->Country . " " . $val->Province . ": " . $val->Date . "\n";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    }
    $conn->close();
?>