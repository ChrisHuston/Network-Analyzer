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

    $full_name = $mysqli->real_escape_string($_POST['full_name']);
    $industry = $mysqli->real_escape_string($_POST['industry']);
    $school = $mysqli->real_escape_string($_POST['school']);
    $profile_id = $_POST['profile_id'];
    $same_industry = $_POST['same_industry'];
    $same_school = $_POST['same_school'];
    $is_faculty = $_POST['is_faculty'];
    $more_senior = $_POST['more_senior'];
    $same_level = $_POST['same_level'];
    $more_junior = $_POST['more_junior'];
    $same_gender = $_POST['same_gender'];
    $same_nationality = $_POST['same_nationality'];
    $same_ethnicity = $_POST['same_ethnicity'];
    $tech_skill = $_POST['tech_skill'];
    $finance_skill = $_POST['finance_skill'];
    $ops_skill = $_POST['ops_skill'];
    $sales_skill = $_POST['sales_skill'];
    $prod_skill = $_POST['prod_skill'];
    $gm_skill = $_POST['gm_skill'];
    $vc_skill = $_POST['vc_skill'];
    $other_skill = $_POST['other_skill'];
    $same_skill = $_POST['same_skill'];

    $query = "UPDATE profiles SET full_name='$full_name', industry='$industry', same_industry='$same_industry',
        school='$school', same_school='$same_school', is_faculty='$is_faculty', more_senior='$more_senior',
        same_level='$same_level', more_junior='$more_junior', same_gender='$same_gender',
        same_nationality='$same_nationality', same_ethnicity='$same_ethnicity', tech_skill='$tech_skill',
        finance_skill='$finance_skill', ops_skill='$ops_skill', sales_skill='$sales_skill',
        prod_skill='$prod_skill', gm_skill='$gm_skill', vc_skill='$vc_skill', other_skill='$other_skill',
        same_skill='$same_skill'
        WHERE profile_id='$profile_id'";
    $result = $mysqli->query($query);

    $mysqli->close();
    echo json_encode($result);
} else {
    session_unset();
}

?>