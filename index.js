const http = require('http');
const ResponseWriter = require('./response-writer');

const server = http.createServer((req, res) => {
    const responseWriter = new ResponseWriter(res);
    if (req.url === '/hello') {
        responseWriter.hello();
    } if (req.url === '/weather') {
        responseWriter.weather(34172);
    } else {
        responseWriter.index();
    }
});
server.listen(8000);
