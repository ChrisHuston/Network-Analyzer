<?php
session_start();
class UserInfo {
    var $login_error = "NONE";
    var $profiles = [];
    var $connections = [];
    var $summaries = [];
    var $net_id;
    var $full_name;
    var $priv_level = 1;
}

$res = new UserInfo();

$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['net_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'network_analyzer');

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

    $net_id = $_SESSION['net_id'];
    $res->net_id = $net_id;
    $res->full_name = $_SESSION['full_name'];
    $res->priv_level = $_SESSION['priv_level'];

    $query = "SELECT user_name FROM summaries WHERE net_id='$net_id'; ";
    $result = $mysqli->query($query);
    list($user) = $result->fetch_row();
    if (empty($user)) {
        $course_id = $_SESSION['canvas_course_id'];
        $query = "INSERT INTO summaries (net_id, user_name, course_id) VALUES
        ('$net_id','$res->full_name', '$course_id'); ";
        $mysqli->query($query);
    }

    $query = "SELECT * FROM profiles WHERE net_id='$net_id' ORDER BY full_name; ";
    $query .= "SELECT * FROM connections WHERE net_id='$net_id' ORDER BY profile_id1, profile_id2; ";
    $query .= "SELECT p.net_id, s.user_name, COUNT(*) AS network_size, SUM(same_school) AS agg_school,
            SUM(is_faculty) AS agg_faculty, SUM(same_industry) as agg_industry, SUM(more_senior) as agg_senior,
            SUM(same_level) as agg_level, SUM(more_junior) as agg_junior, SUM(same_gender) AS agg_gender,
            SUM(same_nationality) AS agg_nationality,
            SUM(same_ethnicity) AS agg_ethnicity, SUM(tech_skill) AS agg_tech,
            SUM(finance_skill) AS agg_finance, SUM(ops_skill) AS agg_ops,
            SUM(sales_skill) AS agg_sales, SUM(prod_skill) AS agg_prod,
            SUM(gm_skill) AS agg_gm, SUM(vc_skill) AS agg_vc, SUM(other_skill) AS agg_other,
            SUM(same_skill) AS agg_skill,
            (SELECT COUNT(*) FROM connections c WHERE c.net_id=p.net_id) AS num_connections
        FROM profiles p
        INNER JOIN summaries s
            ON s.net_id=p.net_id
        GROUP BY net_id; ";

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
    if ($mysqli->more_results()) {
        $mysqli->next_result();
        $result = $mysqli->store_result();
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $res->summaries = $json;
    }

    $mysqli->close();
    echo json_encode($res);

} else {
    $res->login_error = "Authentication error.";
    echo json_encode($res);
}

?>