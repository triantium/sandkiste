// Load HTTP module
// Achtung das modul https funktioniert nur mit https verbindungen, sonst muss http verwendet werden
const http = require('https');

module.exports = {
    /**
     * Funktion nimmt ein json objekt an und sendet dieses an den Salatkind bestellserver
     */
    post_json_object: function(data) {
        // Zu string umwandeln, damit daten geschickt werden können
        const post_data = JSON.stringify(data);
        console.log('POST data: ' + post_data);

        // Optionen wie der request aussehen soll setzten
        const post_options = {
            host: 'salatkind.emundo.eu',
            port: 443, // 443 wegen https
            path: '/rest/warenkorbAufgeben',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };

        // Request objekt erstellen, die Funktion gibt die Antwort des Servers in der Konsole aus
        const post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                console.log('Response: ' + chunk);
            });
        });

        // Post daten dem request hinzufügen
        post_req.write(post_data);

        // Request an den Server Abschicken
        post_req.end();
    }
};
