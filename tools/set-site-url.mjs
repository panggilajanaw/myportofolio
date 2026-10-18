#!/usr/bin/env node
/**
 * Makes the Open Graph / Twitter image tags absolute and adds og:url + canonical.
 * Social platforms (Telegram, TikTok, Instagram, X, ...) need absolute URLs for link previews.
 *
 *   node tools/set-site-url.mjs https://your-domain.tld
 *
 * Safe to run more than once. No dependencies.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const input = process.argv[2];
let origin;
try {
  const u = new URL(input);
  if (!/^https?:$/.test(u.protocol)) throw new Error('not http(s)');
  origin = u.origin;
} catch {
  console.error('Usage: node tools/set-site-url.mjs https://your-domain.tld');
  process.exit(1);
}

const file = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), 'index.html');
let html = fs.readFileSync(file, 'utf8');
const image = `${origin}/assets/images/og-image.png`;

html = html
  .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`)
  .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${image}$2`);

if (/<meta property="og:url"/.test(html)) {
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${origin}/$2`);
} else {
  html = html.replace(/(<meta property="og:type" content="website">)/, `$1\n  <meta property="og:url" content="${origin}/">`);
}

if (/<link rel="canonical"/.test(html)) {
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${origin}/$2`);
} else {
  html = html.replace(/(<meta name="author"[^>]*>)/, `$1\n  <link rel="canonical" href="${origin}/">`);
}

fs.writeFileSync(file, html);
console.log(`index.html now points at ${origin}`);
