<?php
require("databaseinfo.php");

function parseToXML($htmlStr)
{
$xmlStr=str_replace('<','&lt;',$htmlStr);
$xmlStr=str_replace('>','&gt;',$xmlStr);
$xmlStr=str_replace('"','&quot;',$xmlStr);
$xmlStr=str_replace("'",'&#39;',$xmlStr);
$xmlStr=str_replace("&",'&amp;',$xmlStr);
return $xmlStr;
}


// Opens a connection to a MySQL server
$connection=mysql_connect ($servername, $username, $password);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Set the active MySQL database
$db_selected = mysql_select_db($database, $connection);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error());
}

// Select all the rows in the markers table
$query = "SELECT * FROM parking_spots WHERE 1 ORDER BY SpotID desc";
$query2= "SELECT * FROM parking_spots, Garages WHERE parking_spots.SpotID=Garages.SpotID ORDER BY parking_spots.SpotID desc";
$result = mysql_query($query);
$result2 = mysql_query($query2);
if (!$result) {
  die('Invalid query: ' . mysql_error());
}

header("Content-type: text/xml");

// Start XML file, echo parent node
echo '<markers>';


// Iterate through the rows, printing XML nodes for each
while ($row = @mysql_fetch_assoc($result)){
  // ADD TO XML DOCUMENT NODE
  echo '<marker ';
  echo 'SpotID="' . $row['SpotID'] . '" ';
  echo 'TypeOfPass="' . $row['TypeOfPass'] . '" ';
  echo 'Free="' . $row['Free'] . '" ';
  echo 'Meter="' . $row['Meter'] . '" ';
  echo 'Garage="' . $row['Garage'] . '" ';
  echo 'ResidentPass="' . $row['ResidentPass'] . '" ';
  echo 'NumberofSpots="' . $row['NumberofSpots'] . '" ';
  echo 'Latitude="' . $row['Latitude'] . '" ';
  echo 'Longitude="' . $row['Longitude'] . '" ';
  echo 'Notes="' . $row['Notes'] . '" ';
  echo '/>';
}
while ($row = @mysql_fetch_assoc($result2)){
	echo '<marker ';
	echo 'SpotID="' . $row['SpotID'] . '" ';
	echo 'Garage="' . $row['Garage'] . '" ';
	echo 'Name="' . $row['Name'] . '" ';
	echo 'TimeFree="' . $row['TimeFree'] . '" ';
	echo 'Rates="' . $row['Rates'] . '" ';
	echo 'Latitude="' . $row['Latitude'] . '" ';
    echo 'Longitude="' . $row['Longitude'] . '" ';
  	echo '/>';
}


// End XML file
echo '</markers>';






?>







