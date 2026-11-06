/**
 * Server Node.js Siap Hosting (VPS / Render / Railway / Cloud Run / Server Lokal Sekolah)
 * Perpustakaan Digital Sumber Ilmu - SD Negeri 1 Rejoso
 * Tanpa perlu library eksternal (Zero-Dependency) - Langsung jalan dengan `node server.js`
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Endpoint API Database (Mendukung /api/db maupun /api.php agar seragam)
  if (pathname === '/api/db' || pathname === '/api.php') {
    if (req.method === 'GET') {
      fs.readFile(DB_PATH, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'error', message: 'Database belum ditemukan' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(data);
      });
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        // Batas ukuran payload 15MB (untuk menampung upload gambar karya/logo base64)
        if (body.length > 15 * 1024 * 1024) {
          req.destroy();
        }
      });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed && parsed.settings && parsed.books && parsed.students) {
            fs.writeFile(DB_PATH, JSON.stringify(parsed, null, 2), 'utf8', (err) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ status: 'error', message: 'Gagal menyimpan database' }));
                return;
              }
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ status: 'success', message: 'Database tersimpan di server' }));
            });
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'error', message: 'Struktur database tidak valid' }));
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'error', message: 'JSON tidak valid' }));
        }
      });
      return;
    }
  }

  // Healthcheck Endpoint untuk layanan Cloud Hosting
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', app: 'Perpustakaan Sumber Ilmu SDN 1 Rejoso' }));
    return;
  }

  // Static File Serving
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback SPA ke index.html
      const fallbackPath = path.join(__dirname, 'index.html');
      fs.readFile(fallbackPath, (errFallback, content) => {
        if (errFallback) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Halaman Tidak Ditemukan');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(`📚 Perpustakaan Digital Sumber Ilmu - SD Negeri 1 Rejoso`);
  console.log(`🚀 Server aktif di: http://localhost:${PORT}`);
  console.log(`💾 Endpoint Database Terpadu: http://localhost:${PORT}/api/db`);
  console.log(`=============================================================`);
});

