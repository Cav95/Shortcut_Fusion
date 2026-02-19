<?php
if (!isset($_GET['AddinCmd'])) {
    http_response_code(400);
    echo "Bad Request: 'AddinCmd' parameter is required.";
}
$url = "http://192.168.0.242/FUSION/plm.html?ClientID=8604d71f-eac9-4f70-928a-cb146295152c&locale=it&IISIDX=0&contextID=hrboomomfa&opencode=" . urlencode($_GET['opencode']) . "&AddinCmd=" . urlencode($_GET['AddinCmd']);

header("Location: " . $url);
exit();
