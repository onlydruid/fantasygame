<html>
<body>
 
 
<?php
$con = mysql_connect("localhost","root","francis1");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("users", $con);
 
$sql="INSERT INTO userlist(username, password, email)
VALUES
('$_POST[username]','$_POST[password]','$_POST[email]')";
 
if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
echo "1 record added";
 
mysql_close($con)
?>
</body>
</html>