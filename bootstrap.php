<?php
session_start();
require_once "utils/functions.php";
require_once "db/database.php";
const PET_IMG_DIR = "./upload/pet/";
const UPLOAD_PET_DIR = "../upload/pet/";
const DESIGN_IMG_DIR = "./upload/design/";
$username = "PDMUser";
$password = "PDMUser";

try {
    // Il DSN mappa esattamente la tua stringa JDBC nel formato richiesto da PDO_SQLSRV
    $dsn = "sqlsrv:server=DBSRV02,1433;Database=EdmDb_2008_001;Encrypt=false;TrustServerCertificate=false;LoginTimeout=30";
    
    // Creazione della connessione
    $dbh = new PDO($dsn, $username, $password);
    
    // Imposta la modalità di errore di PDO per lanciare eccezioni
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connessione PDO stabilita con successo al DBSRV02!";
    
} catch(PDOException $e) {
    http_response_code(500);
    exit('Errore di connessione: ' . $e->getMessage());
}