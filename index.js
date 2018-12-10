// Dependecies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const unifiedServer = (req, res) => {

    const parsedURL = url.parse(req.url, true);

    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    const decoder = new StringDecoder('utf-8');
    let payload = '';

    req.on('data', (data) => {
        payload += decoder.write(data);
    });

    req.on('end', () => {
        payload += decoder.end();

        const choosenHandler = typeof (router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound;

        choosenHandler((statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            payload = typeof (payload) == 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
}

const httpServer = http.createServer(unifiedServer);

httpServer.listen(3000, () => {
    console.log(`The server is listening on port 3000!`);
});

let handlers = {};

handlers.hello = (callback) => {
    callback(200, { message: 'Hello World!' });
}

handlers.notFound = (callback) => {
    callback(404);
}

const router = {
    hello: handlers.hello
}
