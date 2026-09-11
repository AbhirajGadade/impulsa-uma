"""Package the adapted portal modules with deterministic cache-safe filenames."""
from pathlib import Path
import hashlib
import json

project = Path(__file__).resolve().parents[1]
source = project / 'src' / 'portal'
dist = project / 'dist'
assets = dist / 'assets'
assets.mkdir(exist_ok=True)
files = sorted(p for p in source.iterdir() if p.suffix in ('.js', '.css'))
release = hashlib.sha256(b''.join(p.name.encode() + b'\0' + p.read_bytes() for p in files)).hexdigest()[:12]
names = {p.name: p.stem + '.uma-' + release + p.suffix for p in files}
for old in assets.glob('*.uma-*'):
    if old.suffix in ('.js', '.css'): old.unlink()
for p in files:
    text = p.read_text()
    for old, new in names.items(): text = text.replace(old, new)
    (assets / names[p.name]).write_text(text)

shell = (project / 'src' / 'index.html').read_text()
for old, new in names.items(): shell = shell.replace(old, new)
routes = ['', 'plantillas', 'crear', 'analizar', 'comunidad', 'privacidad', 'terminos']
for route in routes:
    page = dist / route / 'index.html'
    page.parent.mkdir(parents=True, exist_ok=True)
    page.write_text(shell)
(project / 'src' / 'portal-build.json').write_text(json.dumps({'release': release, 'entry': names['index-DSiOxGBJ.js'], 'routes': routes}, indent=2) + '\n')
print(f'Prepared {len(files)} portal modules and {len(routes)} routes, release {release}.')
