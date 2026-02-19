        // small enhancement: set current year
        try {
            document.getElementById('year').textContent = new Date().getFullYear();
        } catch (e) {}
        // Basic client-side validation visual feedback + open target page with query args
        (function() {
            'use strict';
            var forms = document.querySelectorAll('.needs-validation');
            Array.prototype.slice.call(forms).forEach(function(form) {
                form.addEventListener('submit', function(event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        event.preventDefault();
                        // gather values
                        var opencode = document.getElementById('opencode').value.trim();
                        if (opencode === '') {
                            alert('Per favore, inserisci un codice prima di cercare.');
                            form.classList.add('was-validated');
                            return;
                        }
                        var addin = document.querySelector('input[name="AddinCmd"]:checked');
                        var addinVal = addin ? addin.value : '';
                        var clientID = document.getElementById('ClientID').value;
                        var locale = document.getElementById('locale').value;
                        var IISIDX = document.getElementById('IISIDX').value;
                        var contextID = document.getElementById('contextID').value;
                        var base = 'http://192.168.0.242/FUSION/plm.html';
                        var params = new URLSearchParams();
                        params.set('opencode', opencode);
                        if (addinVal) params.set('AddinCmd', addinVal);
                        if (clientID) params.set('ClientID', clientID);
                        if (locale) params.set('locale', locale);
                        if (IISIDX) params.set('IISIDX', IISIDX);
                        if (contextID) params.set('contextID', contextID);
                        // open result in a new tab (change to '_self' to reuse same tab)
                        window.open(base + (base.indexOf('?') === -1 ? '?' : '&') + params.toString(), '_blank');
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        })();

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