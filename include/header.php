<?php

    require_once 'AdcpEngine.php';
    
    if(!isset($publico)){
        Adcp::checkLogin();
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title><?php if(isset($title)){echo $title." - ".ADCP_TITLE;} else{ echo ADCP_TITLE;}?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <script type="text/javascript" src="js/adcp.login.js?v=1.5"></script>
    <script type="text/javascript" src="js/kickstart.js?v=1.5"></script>
    
    <link rel="stylesheet" type="text/css" href="css/kickstart.css" />
    <link rel="stylesheet" type="text/css" href="css/datepicker/jquery-ui.min.css" />
    <link rel="stylesheet" type="text/css" href="css/adcp.css" />
</head>
<body>
    <div id="respuesta"></div>
    <div id="container">