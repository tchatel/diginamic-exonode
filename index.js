const http = require('http');
const fs = require('fs');
const zlib = require('zlib');

const ResponseWriter = require('./response-writer');

const server = http.createServer((req, res) => {
    const responseWriter = new ResponseWriter(res);
    if (req.url === '/hello') {
        responseWriter.hello();
    } else if (req.url === '/weather') {
        responseWriter.weather(34172);
    } else if (req.url === '/') {
        responseWriter.index();
    } else if (req.url === '/weather.jpg') {
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Encoding': 'gzip'
        });
        const fileReadable = fs.createReadStream(__dirname + '/weather.jpg');
        fileReadable.on('end', () => console.log('Lecture terminée'));
        const gzipTransform = zlib.createGzip();
        fileReadable.pipe(gzipTransform).pipe(res);
    } else {
        responseWriter.htmlError(404, 'introuvable');
    }
});
server.listen(8000);
