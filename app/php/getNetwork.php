<?php
session_start();

$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['net_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'network_analyzer');

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

    class UserInfo {
        var $profiles = [];
        var $connections = [];
    }

    $res = new UserInfo();

    $net_id = $_POST['net_id'];

    $query = "SELECT * FROM profiles WHERE net_id='$net_id' ORDER BY full_name; ";
    $query .= "SELECT * FROM connections WHERE net_id='$net_id' ORDER BY profile_id1, profile_id2; ";

    $mysqli->multi_query($query);

    if ($mysqli->more_results()) {
        $mysqli->next_result();
        $result = $mysqli->store_result();
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $res->profiles = $json;
    }

    if ($mysqli->more_results()) {
        $mysqli->next_result();
        $result = $mysqli->store_result();
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $res->connections = $json;
    }

    $mysqli->close();
    echo json_encode($res);

}

?>