<?php
session_start();
require_once 'ims-blti/blti.php';
$context = new BLTI("YourSecret", false, false);

if ( $context->valid ) {
  $_SESSION['canvas_course_id'] = $_POST['custom_canvas_course_id'];
  $_SESSION['net_id'] = strtolower($_POST['custom_canvas_user_login_id']);
  $_SESSION['full_name'] = $_POST['lis_person_name_full'];
  $roles = $_POST['roles'];
  if (strpos($roles, 'Administrator') !== false) {
    $_SESSION['priv_level'] = 5;
  } else if (strpos($roles, 'Instructor') !== false) {
    $_SESSION['priv_level'] = 4;
  } else if (strpos($roles, 'Designer') !== false || strpos($roles, 'ContentDeveloper') !== false) {
    $_SESSION['priv_level'] = 3;
  } else if (strpos($roles, 'TeachingAssistant') !== false) {
    $_SESSION['priv_level'] = 2;
  } else {
    $_SESSION['priv_level'] = 1;
  }
}
?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Network Analyzer</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="styleSheet" href="../bower_components/angular-ui-grid/ui-grid.min.css"/>
    <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="../bower_components/angular-material/angular-material.min.css">
    <link rel="stylesheet" href="styles/main.css">
  </head>
  <body ng-app="networkAnalyzerApp">
    <!-- Add your site or application content here -->
    <div class="container-fluid">
      <div ng-view=""></div>
    </div>

    <script src="../bower_components/angular/angular.min.js"></script>
    <script src="../bower_components/angular-animate/angular-animate.min.js"></script>
    <script src="../bower_components/angular-touch/angular-touch.min.js"></script>
    <script src="../bower_components/angular-route/angular-route.min.js"></script>
    <script src="../bower_components/lodash/dist/lodash.min.js"></script>
    <script src="../bower_components/angular-ui-grid/ui-grid.min.js"></script>
    <script src="../bower_components/angular-material/angular-material.min.js"></script>
    <script src="../bower_components/angular-aria/angular-aria.min.js"></script>
    <script src="../bower_components/d3/d3.js"></script>
    <script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
        <script src="scripts/app.js"></script>
        <script src="scripts/controllers/main.js"></script>
        <script src="scripts/services/user.js"></script>
        <script src="scripts/directives/force_layout.js"></script>
</body>
</html>
