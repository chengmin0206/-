const http = require('http');
const fs = require('fs');
const path = require('path');

const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
};

http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    let filePath = '.' + (urlPath === '/' ? '/main.html' : urlPath);
    let ext = path.extname(filePath).toLowerCase();

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
        } else {
            res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
            res.end(data);
        }
    });
}).listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});