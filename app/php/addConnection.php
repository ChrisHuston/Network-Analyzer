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

    $net_id = $_SESSION['net_id'];
    $profile_id1 = $_POST['profile_id1'];
    $profile_id2 = $_POST['profile_id2'];

    $query = "INSERT INTO connections (net_id, profile_id1, profile_id2) VALUES
        ('$net_id', '$profile_id1', '$profile_id2')";
    $result = $mysqli->query($query);

    $mysqli->close();
    echo json_encode($result);
} else {
    session_unset();
}

?>