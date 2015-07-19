<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['net_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', "network_analyzer");
    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

    $profile_id = $_POST['profile_id'];

    $query = "DELETE FROM profiles WHERE profile_id='$profile_id'; ";
    $query .= "DELETE FROM connections WHERE (profile_id1='$profile_id' OR profile_id2='$profile_id'); ";
    $result = $mysqli->multi_query($query);

    $mysqli->close();
    echo json_encode($result);
} else {
    session_unset();
}

?>