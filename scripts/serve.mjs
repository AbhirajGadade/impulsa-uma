import { createReadStream, existsSync, realpathSync, statSync, watch } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { build, distRoot, projectRoot } from './build.mjs';

const envPath = path.join(projectRoot, '.env');
if (existsSync(envPath)) process.loadEnvFile(envPath);

const args = process.argv.slice(2);
let host = process.env.HOST?.trim() || '127.0.0.1';
let port = process.env.PORT?.trim() || '5173';
let watching = false;
for (let index = 0; index < args.length; index++) {
  const arg = args[index];
  if (arg === '--watch') watching = true;
  else if ((arg === '--port' || arg === '--host') && args[index + 1]) {
    if (arg === '--port') port = args[++index];
    else host = args[++index];
  } else throw new Error(`Unknown or incomplete option: ${arg}`);
}
if (!/^\d+$/.test(port) || Number(port) > 65535) throw new Error('PORT must be an integer from 0 to 65535.');

build();

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8', '.map': 'application/json',
};
const withinDist = filename => {
  const relative = path.relative(distRoot, filename);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};
const server = createServer((req, res) => {
  const fail = (status, message) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : message);
  };
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return fail(405, 'Method not allowed');
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { return fail(400, 'Invalid URL'); }
  if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some(part => part.startsWith('.'))) {
    return fail(404, 'Not found');
  }
  let filename = path.resolve(distRoot, `.${pathname}`);
  if (!withinDist(filename)) return fail(404, 'Not found');
  try {
    if (statSync(filename).isDirectory()) filename = path.join(filename, 'index.html');
    filename = realpathSync(filename);
    if (!withinDist(filename) || !statSync(filename).isFile()) return fail(404, 'Not found');
    const size = statSync(filename).size;
    res.writeHead(200, {
      'Content-Type': types[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      'Content-Length': size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') return res.end();
    createReadStream(filename).on('error', () => res.destroy()).pipe(res);
  } catch (error) {
    fail(['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500, 'File unavailable');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is busy. Try: npm run dev -- --port 5174`
    : `Server failed: ${error.message}`);
  process.exit(1);
});
server.listen(Number(port), host, () => {
  const address = server.address();
  const displayHost = host.includes(':') ? `[${host}]` : host;
  console.log(`Impulsa UMA: http://${displayHost}:${address.port}`);
  console.log(watching ? 'Watching src/ and public/. Save your changes, then refresh your browser.' : 'Press Ctrl+C to stop.');
});

const watchers = [];
let timer;
if (watching) {
  for (const directory of ['src', 'public']) {
    watchers.push(watch(path.join(projectRoot, directory), { recursive: true }, (_, filename) => {
      if (directory === 'src' && String(filename).replaceAll('\\', '/') === 'portal-build.json') return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try { build(); } catch (error) { console.error(`Build failed: ${error.message}`); }
      }, 200);
    }));
  }
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    clearTimeout(timer);
    watchers.forEach(watcher => watcher.close());
    server.close();
    server.closeAllConnections();
  });
}
