import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist', 'runtime');
// Explicit allowlist: never package the adapter's mutable state, logs or backups.
const files = new Map();
for (const name of ['adapter.mjs', 'delivery-runtime.mjs', 'settings-jsonc.mjs', 'README-LOCAL.txt']) {
  const file = path.join(root, 'runtime', name);
  if (fs.existsSync(file)) files.set(name, fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
}
for (const name of ['LICENSE', 'ASSET_LICENSES.md', 'SECURITY.md']) files.set(name, fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n/g, '\n'));
const isCursor = fs.existsSync(path.join(root, 'visual-blueprint', 'diana-cursor.css'));
files.set('theme.css', fs.readFileSync(path.join(root, 'visual-blueprint', isCursor ? 'diana-cursor.css' : 'diana-grok-bot.css'), 'utf8').replace(/\r\n/g, '\n'));
for (const entry of fs.readdirSync(path.join(root, 'assets'), { withFileTypes: true })) {
  if (entry.isFile() && /^[a-z0-9-]+\.png$/.test(entry.name)) files.set(`assets/${entry.name}`, fs.readFileSync(path.join(root, 'assets', entry.name)));
}
if (isCursor) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const extension = { name: manifest.name, displayName: manifest.displayName, description: manifest.description,
    version: '0.1.0', publisher: manifest.publisher, engines: manifest.engines, categories: ['Themes'], contributes: manifest.contributes };
  files.set('extension/package.json', JSON.stringify(extension, null, 2) + '\n');
  for (const name of ['diana-day-color-theme.json', 'diana-night-color-theme.json']) files.set(`extension/themes/${name}`, fs.readFileSync(path.join(root, 'themes', name), 'utf8').replace(/\r\n/g, '\n'));
}
// A previous local run may have created state beside these immutable files.
// Never silently fold that state into a release directory, or delete it.
const expected = new Set([...files.keys(), 'SHA256SUMS.txt']);
function inspectExisting(directory, prefix = '') {
  if (!fs.existsSync(directory)) return;
  if (fs.lstatSync(directory).isSymbolicLink()) throw new Error('Runtime output symlink refused');
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error('Runtime output symlink refused');
    if (entry.isDirectory()) {
      if (![...expected].some(name => name.startsWith(relative + '/'))) throw new Error(`Unexpected output directory preserved: ${relative}. Move it aside before building.`);
      inspectExisting(path.join(directory, entry.name), relative + '/');
    } else if (!entry.isFile() || !expected.has(relative)) throw new Error(`Unexpected output file preserved: ${relative}. Move it aside before building.`);
  }
}
inspectExisting(out);
const hashes = [];
for (const [relative, contents] of [...files].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
  const dest = path.join(out, relative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, contents);
  hashes.push(`${createHash('sha256').update(contents).digest('hex')}  ${relative}`);
}
fs.writeFileSync(path.join(out, 'SHA256SUMS.txt'), hashes.join('\n') + '\n');
console.log(JSON.stringify({ status: 'built', files: files.size, path: out, runtimeTested: false }));
