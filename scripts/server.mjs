import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(
  path.dirname(fileURLToPath(import.meta.url))
);

const useDist = process.argv.includes('--dist');

const base = useDist
  ? path.join(root, 'dist')
  : path.join(root, 'src');

const pub = useDist
  ? base
  : path.join(root, 'public');

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 5173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.md': 'text/markdown'
};

async function fileExists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');

    let relativePath = decodeURIComponent(
      url.pathname
    );

    let target = path.join(
      base,
      relativePath
    );

    if (
      !useDist &&
      await fileExists(
        path.join(pub, relativePath)
      )
    ) {
      target = path.join(
        pub,
        relativePath
      );
    }

    if (!(await fileExists(target))) {
      target = path.join(
        base,
        'index.html'
      );
    }

    const data = await readFile(target);

    res.writeHead(200, {
      'Content-Type':
        types[path.extname(target)] ||
        'application/octet-stream',

      'Cache-Control': 'no-store'
    });

    res.end(data);

  } catch (error) {
    res.writeHead(500);
    res.end(String(error));
  }
}).listen(port, host, () => {
  console.log(
    `Impulsa UMA: http://${host}:${port}`
  );
});