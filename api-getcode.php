<?php
require_once "./bootstrap.php";

if (!isset($_GET['code'])) {
    http_response_code(400);
    exit('Errore: parametro "code" mancante.');
}
$code = $_GET['code'];

$sql = "SELECT TOP (1) *
  FROM [EdmDb_2008_001].[dbo].[LINK]
  where linkCodice = ?
  and linkBomQty is NULL
  order by linkREV desc;";
   $stmt = $dbh->prepare($sql);
   $stmt->bindParam(1, $code);
   $stmt->execute();


header("Content-Type: application/json");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));