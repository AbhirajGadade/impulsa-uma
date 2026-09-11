import { createHash } from 'node:crypto';
import {
  cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const distRoot = path.join(projectRoot, 'dist');

/** Build exclusively from src/ and public/; no network or Python required. */
export function build() {
  const source = path.join(projectRoot, 'src', 'portal');
  const files = readdirSync(source).filter(name => /\.(js|css)$/.test(name)).sort();
  const contents = new Map(files.map(name => [name, readFileSync(path.join(source, name))]));
  const hash = createHash('sha256');
  for (const name of files) hash.update(name).update('\0').update(contents.get(name));
  const release = hash.digest('hex').slice(0, 12);
  const names = new Map(files.map(name => {
    const ext = path.extname(name);
    return [name, `${name.slice(0, -ext.length)}.uma-${release}${ext}`];
  }));
  const rewrite = text => {
    for (const [oldName, newName] of names) text = text.replaceAll(oldName, newName);
    return text;
  };
  const routes = JSON.parse(readFileSync(path.join(projectRoot, 'src', 'routes.json'), 'utf8'));
  if (!Array.isArray(routes) || !routes.every(route => typeof route === 'string' && /^(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route))) {
    throw new Error('src/routes.json must contain relative route paths without leading slashes.');
  }

  rmSync(distRoot, { recursive: true, force: true });
  cpSync(path.join(projectRoot, 'public'), distRoot, { recursive: true });
  const assets = path.join(distRoot, 'assets');
  mkdirSync(assets, { recursive: true });
  for (const name of files) {
    writeFileSync(path.join(assets, names.get(name)), rewrite(contents.get(name).toString('utf8')));
  }
  const html = rewrite(readFileSync(path.join(projectRoot, 'src', 'index.html'), 'utf8'));
  for (const route of routes) {
    const directory = path.join(distRoot, route);
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, 'index.html'), html);
  }
  writeFileSync(path.join(projectRoot, 'src', 'portal-build.json'), `${JSON.stringify({
    release, entry: names.get('index-DSiOxGBJ.js'), routes,
  }, null, 2)}\n`);
  console.log(`Built ${files.length} modules and ${routes.length} routes (release ${release}).`);
  return { release, routes };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
