import test from 'node:test';
import assert from 'node:assert/strict';
import { nativeColorClass, effectiveThemeMode, verifiedMount, injectionExpression, rendererStateExpression, disableExpression } from '../runtime/adapter.mjs';

const node = (...classes) => ({classList:{contains:name=>classes.includes(name)}});
const ready = mode => ({host:true,chromeCount:1,styleCount:1,pointerEvents:'none',characterLoaded:true,editorAnchored:true,
  foregroundExpected:true,foregroundCount:1,requestedMode:mode,effectiveMode:'light',themeSynchronized:true,themeTokensMatch:true});

test('system resolves to the native light or dark palette, never the literal system token',()=>{
  assert.equal(effectiveThemeMode('system','light',true),'light');
  assert.equal(effectiveThemeMode('system','dark',false),'dark');
});
test('native palette wins while a manual setting is still propagating',()=>{
  assert.equal(effectiveThemeMode('light','dark',false),'dark');
  assert.equal(effectiveThemeMode('dark','light',true),'light');
});
test('unmarked renderer uses system media only as a temporary fallback',()=>{
  assert.equal(effectiveThemeMode('system','other',true),'dark');
  assert.equal(effectiveThemeMode('system','other',false),'light');
  assert.equal(effectiveThemeMode('light','other',true),'light');
});
test('the nearest native root wins and high contrast classes are recognized',()=>{
  assert.equal(nativeColorClass([node('vs'),node('vs-dark')]),'light');
  assert.equal(nativeColorClass([node(),node('vs-dark'),node('vs')]),'dark');
  assert.equal(nativeColorClass([null,node('hc-light')]),'light');
  assert.equal(nativeColorClass([node('hc-black')]),'dark');
  assert.equal(nativeColorClass([null,node()]),'other');
});
test('mixed artwork, stale mode and wrong root tokens cannot report MOUNTED',()=>{
  assert.equal(verifiedMount(ready('system'),'system'),true);
  assert.equal(verifiedMount({...ready('system'),themeSynchronized:false},'system'),false);
  assert.equal(verifiedMount({...ready('system'),themeTokensMatch:false},'system'),false);
  assert.equal(verifiedMount(ready('light'),'system'),false);
  assert.equal(verifiedMount({...ready('dark'),effectiveMode:'light'},'dark'),false);
});
test('theme checks do not weaken structure and pointer safety',()=>{
  assert.equal(verifiedMount({...ready('system'),chromeCount:2},'system'),false);
  assert.equal(verifiedMount({...ready('system'),pointerEvents:'auto'},'system'),false);
  assert.equal(verifiedMount({...ready('system'),foregroundCount:0},'system'),false);
  assert.equal(verifiedMount({...ready('system'),foregroundExpected:false,foregroundCount:0},'system'),true);
});
test('generated renderer expressions parse and dispose theme listeners and both mode markers',()=>{
  for(const mode of ['dark','light','system']) assert.doesNotThrow(()=>new Function('return '+injectionExpression('/* fixture */',mode)));
  assert.doesNotThrow(()=>new Function('return '+rendererStateExpression()));
  const expression=injectionExpression('', 'system');
  assert.match(expression,/appearance\.disconnect\(\)/);
  assert.match(expression,/media\.removeEventListener\('change', syncMode\)/);
  assert.match(expression,/delete document\.documentElement\.dataset\.dianaCursorRequestedMode/);
  assert.match(disableExpression(),/delete document\.documentElement\.dataset\.dianaCursorRequestedMode/);
});
