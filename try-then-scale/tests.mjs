import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const html = read('index.html');
const css = read('styles.css');
const js = read('app.js');
const data = vm.runInNewContext(`${read('data.js')}\nREALLMS_DATA`);

test('public assets are independent and the preview discourages indexing', () => {
  for (const source of [html, css, js, read('data.js')]) {
    assert.doesNotMatch(source, /two-ways-in|(?:src|href)=["'](?:\.\.\/|\/)/);
  }
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  for (const [, asset] of html.matchAll(/(?:src|href)="([^"#:]+\.(?:js|css))"/g)) {
    assert.ok(read(asset).length, asset);
  }
});

test('IDs are unique and all local anchors and copy targets resolve', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/(?:href="#|data-copy=")([^"]+)"/g)) {
    assert.ok(ids.includes(id), `Missing target: ${id}`);
  }
  for (const id of ['chat', 'api', 'models']) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"[^>]*>`));
    assert.doesNotMatch(html, new RegExp(`<section[^>]*id="${id}"[^>]*hidden`));
  }
  assert.ok(html.indexOf('id="chat"') < html.indexOf('id="api"'));
  assert.match(html, /Just your IU login\.<br> No separate access request\./);
});

test('catalog snapshot keeps access methods and unverified metadata distinct', () => {
  assert.equal(data.chatModels.length, 4);
  assert.equal(data.apiModels.length, 10);
  for (const models of [data.chatModels, data.apiModels]) {
    assert.equal(new Set(models.map(model => model.id)).size, models.length);
    for (const model of models) assert.ok(model.name && model.type && model.kind);
  }
  for (const model of data.apiModels) {
    assert.ok(Array.isArray(model.endpoints), `Missing endpoint array: ${model.id}`);
    for (const endpoint of model.endpoints) assert.match(endpoint, /^\/[a-z/]+$/);
  }
  const unverified = data.apiModels.find(model => model.id === 'qwen3.8-27b');
  assert.equal(unverified.kind, 'unverified');
  assert.equal(unverified.endpoints.length, 0);
});

test('every recipe option has instructions, code, and an HTTPS source', () => {
  const options = [...html.matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(options, Object.keys(data.recipes));
  for (const recipe of Object.values(data.recipes)) {
    for (const field of ['file', 'intro', 'code', 'setup', 'check']) assert.ok(recipe[field]);
    assert.equal(new URL(recipe.docs).protocol, 'https:');
    assert.match(recipe.code, /REALLMS_API_KEY/);
  }
  for (const key of ['opencode', 'pi']) assert.doesNotThrow(() => JSON.parse(data.recipes[key].code));
});
