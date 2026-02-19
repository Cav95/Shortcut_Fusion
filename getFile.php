<?php
// Percorso della cartella dove si trovano i file
$baseDir = "Z:\\Root"; // Modifica questo percorso se necessario

if (isset($_GET['code']) && isset($_GET['path'])) {
    $code = $_GET['code'];
    $path = $_GET['path'];
} else {
    http_response_code(400);
    exit('Errore: parametro "code" o "path" mancante.');
}
// Percorso relativo al file nella cartella mockup (aggiorna se necessario)
$relativePath = '\\' . $path . $code . '.pdf'; // Sostituisci con il nome del file che vuoi scaricare
$filePath = $baseDir . $relativePath;
/*http_response_code(404);
    exit('Errore: file non trovato.' . $filePath);*/

//$realPath = realpath($filePath);
if (!file_exists($filePath)) {
    http_response_code(404);
    exit('Errore: file non trovato.' . $filePath);
}
$realPath = $filePath;

// Determina il MIME type se possibile
$mime = mime_content_type($realPath) ?: 'application/octet-stream';

// Imposta le intestazioni per il download
header('Content-Description: File Transfer');
header('Content-Type: ' . $mime);
header('Content-Disposition: attachment; filename="' . basename($realPath) . '"');
header('Content-Transfer-Encoding: binary');
header('Content-Length: ' . filesize($realPath));
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Expires: 0');

// Pulisce il buffer di output
if (ob_get_length()) {
    ob_clean();
}
flush();

// Legge e invia il file
readfile($realPath);
exit;
