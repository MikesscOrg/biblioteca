const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

function resolveFile(urlPath) {
  const pathname = urlPath === '/' ? '/index.html' : urlPath;
  const decodedPath = decodeURIComponent(pathname);
  const candidate = path.join(rootDir, decodedPath);

  if (!candidate.startsWith(rootDir)) {
    throw new Error('Ruta inválida');
  }

  return candidate;
}

function createServer() {
  return http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const filePath = resolveFile(requestUrl.pathname);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('No encontrado');
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[extension] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fs.readFileSync(filePath));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(error.message);
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => {
    console.log(`Servidor listo en http://localhost:${port}`);
  });
}

module.exports = { createServer };
