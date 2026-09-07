import test from 'node:test';
import assert from 'node:assert/strict';
import { inspect, rawValue, editValue, restoreValues } from '../runtime/settings-jsonc.mjs';

for (const source of ['{}', '{"editor.fontSize":14}', '{// note\n}', '{"nested":{"workbench.colorTheme":"nested"}, // workbench.colorTheme\n}', '\uFEFF{\r\n  // keep\r\n  "x":[1,2,],\r\n}']) {
  test(`add and restore without losing user values: ${JSON.stringify(source)}`, () => {
    const changed = editValue(source, 'workbench.colorTheme', '"Diana Night"');
    assert.equal(inspect(changed).value['workbench.colorTheme'], 'Diana Night');
    assert.deepEqual(inspect(editValue(changed, 'workbench.colorTheme', null)).value, inspect(source).value);
    if (source.includes('// keep')) assert.ok(changed.includes('// keep'));
  });
}
test('compact last/first/middle properties and trailing comment', () => {
  for (const source of ['{"x":1,"theme":"a"}', '{"theme":"a","x":1}', '{"x":1,"theme":"a","y":2}', '{"theme":"a",/* keep */}']) {
    const expected = inspect(source).value; delete expected.theme;
    assert.deepEqual(inspect(editValue(source, 'theme', null)).value, expected);
  }
});
test('ignores commented and nested keys and strings containing URLs/braces', () => {
  const source = '{// "theme":"fake"\n"nested":{"theme":"x"},"url":"https://host/{}", "theme":"real"}';
  assert.equal(rawValue(source, 'theme'), '"real"');
  assert.equal(inspect(editValue(source, 'theme', '"new"')).value.nested.theme, 'x');
});
test('restores a previously selected theme, not just an empty settings file', () => {
  const result = restoreValues('{"theme":"Diana Night","editor":14}', { theme: '"Original"' }, { theme: '"Diana Night"' });
  assert.equal(inspect(result.text).value.theme, 'Original');
  assert.deepEqual(result.conflicts, []);
});
test('preserves user changes made while the theme was enabled', () => {
  const source = '{"theme":"User choice"}';
  assert.deepEqual(restoreValues(source, { theme: '"Original"' }, { theme: '"Diana Night"' }), { text: source, conflicts: ['theme'] });
});
test('invalid input is refused without trying to repair the user file', () => {
  for (const value of ['{"x":}', '[1]', '{"x":1,"x":2}', '{/*', '{"x":"abc}', '{/}']) assert.throws(() => inspect(value), /SETTINGS_INVALID/);
});
