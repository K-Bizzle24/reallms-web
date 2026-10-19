import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const html = read('index.html');
const data = vm.runInNewContext(`${read('data.js')}\nREALLMS_DATA`);

test('public assets are independent and indexing is discouraged', () => {
  for (const name of ['index.html', 'styles.css', 'data.js', 'app.js']) {
    assert.doesNotMatch(read(name), /two-ways-in|try-then-scale|(?:src|href)=["'](?:\.\.\/|\/)/);
  }
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  for (const [, asset] of html.matchAll(/(?:src|href)="([^"#:]+\.(?:js|css))"/g)) assert.ok(read(asset).length);
  assert.doesNotMatch(html, /<input[^>]*type="(?:password|email)"/);
});

test('local fragment IDs are unique and every anchor and route resolves', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), id);
  const routes = [...html.matchAll(/data-connection="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(routes, ['web-chat', 'direct-api', 'terminal', 'editor']);
  for (const id of routes) assert.match(html, new RegExp(`<section class="connection-panel" id="${id}" tabindex="-1"`));
});

test('capabilities precede connections, remain visible, and preserve access distinctions', () => {
  assert.ok(html.indexOf('id="capabilities"') < html.indexOf('id="connect"'));
  const entries = [...html.matchAll(/<article class="capability">([\s\S]*?)<\/article>/g)].map(match => match[1]);
  assert.equal(entries.length, 6);
  for (const entry of entries) {
    assert.doesNotMatch(entry, /\shidden(?:\s|=|>)/);
    assert.match(entry, /data-capability=/);
  }
  for (const name of ['Text &amp; code', 'Documents', 'Image generation']) {
    assert.match(entries.find(entry => entry.includes(`<h3>${name}</h3>`)), /WEB CHAT \+ API/);
  }
  for (const name of ['Audio transcription', 'Embeddings', 'Reranking']) {
    assert.match(entries.find(entry => entry.includes(`<h3>${name}</h3>`)), /class="access-label">API</);
  }
  for (const [, kind] of html.matchAll(/data-capability="([^"]+)"/g)) {
    assert.ok(data.apiModels.some(model => kind === 'language' ? model.kind === 'chat' : model.kind === kind), kind);
  }
});

test('no-JS markup retains every guide, prerequisites, and authoritative references', () => {
  for (const id of ['web-chat', 'api-access', 'direct-api', 'terminal', 'editor']) {
    const opening = html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>`))[0];
    assert.doesNotMatch(opening, /\bhidden\b/);
  }
  assert.match(html, /Wait for approval/);
  assert.match(html, /both the project and its allocation/);
  assert.match(html, /PI's username/);
  assert.match(html, /create an individual API key/);
  assert.match(html, /<noscript>/);
  assert.match(html, /KB0027284/);
  assert.match(html, /KB0027272/);
  assert.match(html, /External clients do not automatically inherit REALLMS data approval/);
});

test('catalog snapshot retains distinct inventories and unverified model metadata', () => {
  assert.equal(data.checked, 'October 14, 2026');
  assert.equal(data.chatModels.length, 4);
  assert.equal(data.apiModels.length, 10);
  for (const models of [data.chatModels, data.apiModels]) {
    assert.equal(new Set(models.map(model => model.id)).size, models.length);
    for (const model of models) assert.ok(model.name && model.type && model.kind);
  }
  for (const model of data.apiModels) {
    assert.ok(Array.isArray(model.endpoints));
    for (const endpoint of model.endpoints) assert.match(endpoint, /^\/[a-z/]+$/);
  }
  const unknown = data.apiModels.find(model => model.id === 'qwen3.8-27b');
  assert.equal(unknown.kind, 'unverified');
  assert.equal(unknown.endpoints.length, 0);
});

test('every connection recipe is complete and selectable', () => {
  const keys = new Set([...html.matchAll(/(?:data-recipe|option value)="([^"]+)"/g)].map(match => match[1]));
  assert.deepEqual([...keys].sort(), Object.keys(data.recipes).sort());
  for (const recipe of Object.values(data.recipes)) {
    for (const field of ['file', 'intro', 'code', 'setup', 'check']) assert.ok(recipe[field]);
    assert.equal(new URL(recipe.docs).protocol, 'https:');
    assert.match(recipe.code, /REALLMS_API_KEY/);
  }
  for (const key of ['opencode', 'pi']) assert.doesNotThrow(() => JSON.parse(data.recipes[key].code));
  assert.match(data.recipes.continue.code, /roles: \[chat\]/);
});
