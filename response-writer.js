const https = require('https');
const { join } = require('path');

class ResponseWriter {
    constructor(res) {
        this.res = res;
    }
    hello() {
        const now = new Date();
        const timeString = `${ 
            ('0' + now.getHours()).slice(-2)
        }:${ 
            ('0' + now.getMinutes()).slice(-2) 
        }`;
        this.htmlSuccess(`
            <h1>Heure du serveur</h1>
            <p>Bonjour, il est : ${ timeString }</p>
        `);
    }
    weather(city) {
        const token = '08ddcc5675b44ea1f2c567010e544d25c47ca45a8392efc9ff693e471ebee936';
        const weatherApiUrl = `https://api.meteo-concept.com/api/forecast/daily?insee=${city}&token=${token}`;
        const headers = {Accept: 'application/json'};
        https.get(weatherApiUrl, {headers}, apiResponse => {
            let responseData = '';
            apiResponse.on('data', chunk => {
                console.log('chunk:', chunk);
                responseData += chunk;
            });
            apiResponse.on('end', () => {
                const json = JSON.parse(responseData);
                const tableRows = json.forecast
                    .map(f => `<tr><td>${f.tmin}</td><td>${f.tmax}</td></tr>`)
                    .join('');
                this.htmlSuccess(`
                    <h1>Météo à ${json.city.name}</h1>
                    <table>
                      <tr><th>T° min</th><th>T° max</th></tr>
                      ${tableRows}
                    </table>
                `);
            });
        });
    }
    index() {
        this.htmlSuccess(`
            <h1>Exo Node</h1>
            <p><img src="weather.jpg"></p>
            <ul>
            <li><a href="hello">Heure du serveur</a></li>
            <li><a href="weather">Météo à Montpellier</a></li>
            </ul>
        `);
    }
    htmlSuccess(bodyContent) {
        this.res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        this.res.end(`<html><body>${bodyContent}</body></html>`);
    }
    htmlError(status, message) {
        this.res.writeHead(status, {'Content-Type': 'text/html; charset=utf-8'});
        this.res.end(`<html><body>Erreur : ${message}</body></html>`);
    }
}

module.exports = ResponseWriter;