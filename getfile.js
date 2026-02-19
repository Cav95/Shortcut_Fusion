// small enhancement: set current year
try {
    document.getElementById('year').textContent = new Date().getFullYear();
} catch (e) { }

async function download() {
    const code = document.getElementById('opencode').value.trim();

    if (!code) {
        alert('Per favore, inserisci un codice prima di scaricare.');
        return;
    }

    try {
        const response = await fetch('api-getcode.php?code=' + encodeURIComponent(code));
        const text = await response.text();
        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            console.error('Server error response:', text);
            throw new Error('Errore nella richiesta: ' + response.status);
        }

        // If server returned JSON (by header or by text starting with [ or {), parse it, otherwise log HTML
        let data = null;
        if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('JSON parse error — server returned:', text);
                alert('Risposta non valida dal server. Controlla la console per i dettagli.');
                return;
            }
        } else {
            // Non-JSON response (probably HTML/error page)
            console.error('Non-JSON response from api-getcode.php:', text);
            alert('Il server ha risposto con HTML invece di JSON. Controlla la console per dettagli.');
            return;
        }

        if (!data || (Array.isArray(data) && data.length === 0)) {
            alert('Nessun risultato trovato per il codice inserito.');
            return;
        }

        const first = Array.isArray(data) ? data[0] : data;
        const fileCode = first && (first.linkCodice || first.code || '');
        const filePath = first && (first.linkPath || '');

        if (!fileCode) {
            console.error('Parsed JSON but missing linkCodice:', first);
            alert('Risultato non valido: manca `linkCodice`. Controlla la console.');
            return;
        }

        let url = 'getFile.php?code=' + encodeURIComponent(fileCode);
        if (filePath) url += '&path=' + encodeURIComponent(filePath);
        window.open(url, '_blank');
        console.log('success');

    } catch (error) {
        console.error('Errore:', error);
        alert('Si è verificato un errore durante il download. Per favore riprova.');
    }
}