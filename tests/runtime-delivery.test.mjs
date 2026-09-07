import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { trustedSocket, options, verifyBundle } from '../runtime/delivery-runtime.mjs';
import { inspect } from '../runtime/settings-jsonc.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const built = spawnSync(process.execPath, [path.join(root, 'scripts/build-runtime.mjs')], { encoding: 'utf8', windowsHide: true });
assert.equal(built.status, 0, built.stderr);

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'diana-delivery-test-'));
  t.after(() => {
    assert.equal(path.dirname(dir), path.resolve(os.tmpdir()));
    assert.ok(path.basename(dir).startsWith('diana-delivery-test-'));
    fs.rmSync(dir, { recursive: true });
  });
  const runtime = path.join(dir, 'package with spaces');
  const source = path.join(root, 'dist/runtime');
  const names = fs.readFileSync(path.join(source, 'SHA256SUMS.txt'), 'utf8').trim().split('\n').map(line => line.split('  ')[1]);
  for (const relative of [...names, 'SHA256SUMS.txt']) {
    const dest = path.join(runtime, relative);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, fs.readFileSync(path.join(source, relative)));
  }
  const appdata = path.join(dir, 'profile with spaces', 'Roaming');
  const profile = path.join(dir, 'profile with spaces');
  const settings = path.join(appdata, 'Cursor', 'User', 'settings.json');
  const env = { ...process.env, APPDATA: appdata, USERPROFILE: profile, DIANA_TARGET_EXE: '', DIANA_CDP_CONSENT: '' };
  const run = code => spawnSync(process.execPath, ['--input-type=module', '-e', `import fs from 'node:fs'; import {configureTheme,restoreAppearance} from ${JSON.stringify(pathToFileURL(path.join(runtime, 'adapter.mjs')).href)}; ${code}`], { encoding: 'utf8', windowsHide: true, env });
  return { dir, runtime, settings, env, run, write(text) { fs.mkdirSync(path.dirname(settings), { recursive: true }); fs.writeFileSync(settings, text); } };
}

test('fresh user install / mode switch / restore / repeated restore', t => {
  const f = fixture(t);
  const result = f.run("configureTheme('dark');configureTheme('light');restoreAppearance();restoreAppearance();");
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(f.settings), false);
  assert.equal(fs.existsSync(path.join(f.env.USERPROFILE, '.cursor/extensions/lanmengsakura.diana-cursor-theme-0.1.0')), false);
});
test('pre-existing JSONC and original appearance survive two cycles', t => {
  const f = fixture(t), original = '{// keep comments\n"workbench.colorTheme":"Original", "window.autoDetectColorScheme":true,"editor.fontSize":14,"nested":{"workbench.colorTheme":"do not touch"}}';
  f.write(original);
  const result = f.run("configureTheme('dark');configureTheme('light');restoreAppearance();configureTheme('system');restoreAppearance();");
  assert.equal(result.status, 0, result.stderr);
  const restored = fs.readFileSync(f.settings, 'utf8');
  assert.deepEqual(inspect(restored).value, inspect(original).value);
  assert.ok(restored.includes('// keep comments'));
});
test('edits made after mounting and unrelated extension files are preserved', t => {
  const f = fixture(t);
  f.write('{"workbench.colorTheme":"Original","editor.fontSize":14}');
  assert.equal(f.run("configureTheme('dark');").status, 0);
  f.write('{"workbench.colorTheme":"User choice","editor.fontSize":18}');
  const result = f.run('restoreAppearance();');
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(inspect(fs.readFileSync(f.settings, 'utf8')).value, { 'workbench.colorTheme': 'User choice', 'editor.fontSize': 18 });
});
test('invalid settings are never rewritten', t => {
  const f = fixture(t), invalid = '{"user value": }';
  f.write(invalid);
  assert.notEqual(f.run("configureTheme('dark');").status, 0);
  assert.equal(fs.readFileSync(f.settings, 'utf8'), invalid);
});
test('portable Cursor uses its own user-data and extensions directories', t => {
  const f = fixture(t), executable = path.join(f.dir, 'portable with spaces', 'Cursor.exe');
  fs.mkdirSync(path.join(path.dirname(executable), 'data'), { recursive: true });
  const config = options(f.runtime, 'Cursor.exe', { DIANA_TARGET_EXE: executable }, []);
  assert.equal(config.settings, path.join(path.dirname(executable), 'data/user-data/User/settings.json'));
  assert.equal(config.extensions, path.join(path.dirname(executable), 'data/extensions'));
});
test('no-consent start fails before state creation or native commands', t => {
  const f = fixture(t), exe = path.join(f.dir, 'Cursor.exe');
  fs.writeFileSync(exe, 'fixture only, never executed');
  const result = spawnSync(process.execPath, [path.join(f.runtime, 'adapter.mjs'), 'start', 'dark', '--exe', exe], { encoding: 'utf8', env: f.env, windowsHide: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /CDP_CONSENT_REQUIRED|WINDOWS_REQUIRED/);
  assert.equal(fs.existsSync(path.join(f.runtime, 'state')), false);
  assert.equal(fs.existsSync(f.settings), false);
});
test('tampered bundles and traversal manifests are refused', t => {
  const f = fixture(t);
  verifyBundle(f.runtime);
  fs.appendFileSync(path.join(f.runtime, 'theme.css'), '/* changed */');
  assert.throws(() => verifyBundle(f.runtime), /BUNDLE_HASH_MISMATCH/);
  fs.writeFileSync(path.join(f.runtime, 'SHA256SUMS.txt'), '0'.repeat(64) + '  ../adapter.mjs\n');
  assert.throws(() => verifyBundle(f.runtime), /BUNDLE_PATH_INVALID/);
});
test('CDP discovery cannot redirect to a foreign address or port', () => {
  assert.equal(trustedSocket('ws://127.0.0.1:54321/devtools/page/abc', 54321), true);
  for (const url of ['ws://127.0.0.1:54322/devtools/page/a','ws://localhost:54321/devtools/page/a','ws://example.test:54321/devtools/page/a','ws://user@127.0.0.1:54321/devtools/page/a','ws://127.0.0.1:54321/devtools/browser/a','ws://127.0.0.1:54321/devtools/page/a#x']) assert.equal(trustedSocket(url, 54321), false);
});
