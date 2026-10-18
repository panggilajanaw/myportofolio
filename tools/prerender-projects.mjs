#!/usr/bin/env node
/**
 * Writes the project cards (English, "All" filter) into index.html between
 *   <!--projects:start-->  and  <!--projects:end-->
 * so the Projects section is real HTML even if JavaScript never runs. At runtime js/projects.js
 * re-renders the grid (language, filters), so this only matters for the no-JS / failed-JS case.
 *
 * Run it after editing js/projects.js:   node tools/prerender-projects.mjs
 * No dependencies; it evaluates the same renderer the browser uses.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = { navigator: {}, document: {}, location: {} };
sandbox.window = sandbox;
vm.createContext(sandbox);

for (const file of ['core.js', 'i18n.js', 'projects.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), sandbox, { filename: file });
}

const cards = sandbox.KZ.projects.renderCards('all');
const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const marker = /(<!--projects:start-->)[\s\S]*?(<!--projects:end-->)/;
if (!marker.test(html)) {
  console.error('Markers <!--projects:start--> / <!--projects:end--> not found in index.html');
  process.exit(1);
}
fs.writeFileSync(indexPath, html.replace(marker, (_m, a, b) => `${a}\n${cards}\n${b}`));
console.log(`Prerendered ${sandbox.KZ.projects.data.length} project cards into index.html`);
