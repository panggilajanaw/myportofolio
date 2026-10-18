# KUROZ4PH — Cinematic Developer Portfolio

A framework-free static portfolio for **Muhammad Nawal Fajar Riyadi** (KUROZ4PH): Frontend Developer and founder of Deraclas Community.
Semantic HTML, Tailwind CSS (compiled), vanilla JavaScript, CSS animation and a Canvas 2D starfield. No React, no bundler, no runtime dependencies — open `index.html` or deploy the folder as-is.

It is the Stitch "Projects" page turned into a full site: the dark neon-purple / cyan HUD look, Space Grotesk + Inter, the five project cards, spec modal, filters, audio widget and floating nav are all kept, then extended with an intro, a light theme, EN/ID, a command palette and the remaining sections.

---

## What's in it

| Area | Notes |
|---|---|
| Intro | Plays once per browser session, has a **Skip** button (also `Esc`/`Enter`), skipped for `prefers-reduced-motion` and for deep links (`#projects`). The progress bar is driven by four real signals (UI ready, fonts, project data, audio check) — it is not a fake percentage. A 5 s failsafe in the page head removes the overlay if scripts fail. |
| Sections | Home, About, Skills, Projects, Socials, Contact, Footer. |
| Projects | Five projects rendered from one data file. Filter counts, the "5 projects" and "0 / 5 public demos" stats are computed from that data. Accessible modal: `Esc`, backdrop click, close buttons, focus trap, scroll lock, focus returns to the opener. |
| Theme | Dark by default, designed light theme. First visit follows the system preference; the choice is stored in `localStorage`; no flash on load (set in a tiny inline script in `<head>`). |
| Language | English / Bahasa Indonesia from one dictionary (`js/i18n.js`). Sets `<html lang>`, persists, leaves brand names, handles and URLs untranslated. |
| Command palette | `Ctrl+K` / `⌘K` or the header button. Jump to sections, toggle theme, switch language, open GitHub, replay the intro. Arrow keys + `Enter`, `Esc` closes. It never steals the shortcut from text fields on the page. |
| Audio player | Real `HTMLAudioElement` player: play/pause, next/prev, seek, volume, mute, loading / error / ended states. **No autoplay.** Ships with an empty track list and shows a clear "Audio unavailable" state until you add music (see [Add music](#add-music)). |
| Accessibility | Skip link, visible focus rings, labelled landmarks, `aria-pressed` on toggles, live regions, reduced-motion support, `inert` background behind dialogs, no horizontal overflow down to 320 px. |
| No JavaScript | All sections and the five project cards are real HTML, the nav anchors work, and JS-only controls (filters, palette, audio) are hidden rather than left dead. |

Keyboard: `Ctrl/⌘ + K` palette · `Esc` closes any dialog or skips the intro · `Tab` to the first stop for the **Skip to content** link.

---

## Folder structure

```
kuroz4ph-portfolio/
├─ index.html                 Page markup, SEO/OG meta, JSON-LD, inline icon sprite
├─ css/
│  ├─ tailwind.css            COMPILED Tailwind (generated — see "Rebuild the CSS")
│  └─ style.css               Theme tokens (dark/light), animation, nav, modal, palette, intro
├─ js/                        Plain scripts, loaded in this order (no modules, works from file://)
│  ├─ core.js                 KZ.config (edit me) + utilities (overlay layer, focus trap, toast…)
│  ├─ i18n.js                 EN / ID dictionary and switcher
│  ├─ projects.js             PROJECT DATA (edit me) + cards, filters, modal
│  ├─ audio.js                Audio player — TRACKS list (edit me)
│  ├─ fx.js                   Starfield, scroll reveal, hero pointer effects, intro
│  └─ main.js                 Theme, language buttons, floating nav, command palette, boot
├─ assets/
│  ├─ images/og-image.png     1200×630 social preview
│  ├─ icons/                  Logo, favicon (svg/png), apple-touch-icon
│  └─ audio/                  Put your music here (see assets/audio/README.md)
├─ src/tailwind.input.css     Tailwind entry (components layer)
├─ tailwind.config.js         Stitch design tokens mapped to CSS variables
├─ tools/
│  ├─ prerender-projects.mjs  Writes the static (no-JS) project cards into index.html
│  └─ set-site-url.mjs        Makes og:image/canonical absolute for your domain
├─ package.json               Only used to rebuild the CSS
├─ vercel.json                Security headers only
└─ README.md
```

---

## Run it locally

No build step is needed. Pick one:

```bash
# any static server
python3 -m http.server 8000      # then open http://localhost:8000
# or
npx serve .
```

Opening `index.html` directly from disk also works. Two things to know:

* Google Fonts and the Stitch preview images are loaded from the internet. Offline, the page falls back to system fonts, and project cards fall back to a styled HUD panel (the fallback is built in).
* The audio *visualizer* only runs when the page is served over `http(s)` from the same origin as the audio files (a browser rule — wiring `file://` audio into Web Audio would mute it). Plain playback works either way.

---

## Customise

### Identity, social links, e-mail — `js/core.js`

`KZ.config` holds brand, owner, role, community and the four social URLs (used by the palette and e-mail logic).
**The same URLs are also written in `index.html`** (header, social cards, contact buttons, footer, and the JSON-LD `sameAs`) so that links work without JavaScript. If a handle changes, search `index.html` for the old value and replace it there too.

**E-mail:** `email` ships empty on purpose — no address is invented. Set `email: 'you@your-domain.tld'` and a contact card plus a palette command appear automatically (and the card is a plain `mailto:` link; there is no backend or form).

### Projects — `js/projects.js`

Each project is an object in `PROJECTS` with bilingual text (`{ en, id }`), `categories`, a `stack` list, an `image`, and:

```js
links: {
  github: 'https://github.com/nawwtech',   // repo URL — shown on the card and in the modal
  demo:   null,                            // set to 'https://…' when a live demo exists
}
```

* `demo: null` → the card says **"No public demo"** as plain text. Nothing clickable is left dead. Add a URL and a real "Live demo" link appears on the card and in the modal, and the **Public demos** counter updates by itself.
* Every project currently points its `github` link at your profile (`https://github.com/nawwtech`), because per-repo URLs were not provided. Replace each with the real repository URL.
* Filters, counts and the "SYS.INDEX // 05 ENTRIES" label are generated from this array. Add a project, add a category id to `CATEGORIES`, or remove one — nothing else needs touching.

After editing project data, refresh the no-JS markup:

```bash
node tools/prerender-projects.mjs
```

(Needed only so visitors without JavaScript and search engines see up-to-date cards. The live site renders from the same data.)

### Project images

The five card images are the **original Stitch preview URLs** (`lh3.googleusercontent.com`). They are placeholders from the design tool and could change or expire. Replace them with your own screenshots:

1. Put images in `assets/images/projects/` (e.g. `deraclas-hub.webp`, ~1200×800).
2. Change `image.src` in `js/projects.js` and write a real `alt`.
3. Re-run `node tools/prerender-projects.mjs`.

If an image fails to load, the card automatically switches to a styled panel showing the project code.

### Add music

1. Copy audio you have the right to use into `assets/audio/` (MP3 or OGG/Opus).
2. List it in `TRACKS` at the top of `js/audio.js`:

```js
var TRACKS = [
  { title: 'Track title', artist: 'Artist name', src: 'assets/audio/track-01.mp3' },
];
```

With an empty list the player shows "Audio unavailable" and the rest of the site is unaffected. Details and licensing notes: `assets/audio/README.md`.

### Text and translations — `js/i18n.js` and `index.html`

Static text carries `data-i18n="key"`; the dictionary has matching `en` and `id` entries. When you add a key, add it to **both** languages. Text with brand names or numbers uses `{placeholders}` (e.g. the footer year is generated, not typed).

### Colours and design tokens

The Stitch palette is the dark theme. Tokens live in `css/style.css` as CSS variables (`:root[data-theme="dark"]` / `[data-theme="light"]`) and `tailwind.config.js` maps every Tailwind colour to them, so `bg-surface`, `text-primary`, etc. work in both themes.

---

## Rebuild the CSS

`css/tailwind.css` is committed, so you only rebuild it after adding or removing Tailwind classes in `index.html` or `js/*.js`:

```bash
npm install
npm run build:css        # one-off
npm run watch:css        # while editing
```

(`css/style.css` is hand-written and never needs a build.)

---

## Before you publish

1. **Site URL** — social platforms need absolute URLs for link previews:
   ```bash
   node tools/set-site-url.mjs https://your-domain.tld
   ```
   Adds `og:url`, `canonical`, and makes `og:image` / `twitter:image` absolute. Safe to re-run.
2. Replace the project images and `github` / `demo` links (above).
3. Add your own audio, or leave the player in its "unavailable" state.
4. Optional: add an e-mail address in `js/core.js`.
5. Review the About / Skills wording in `index.html` and `js/i18n.js`: it is written from the brief, so edit anything that isn't true for you.

---

## Deploy

It is a plain static folder — no build command, output directory is the repository root.

**Vercel** — import the repo, Framework Preset **Other**, leave Build Command and Output Directory empty. `vercel.json` only adds a few security headers.
**GitHub Pages** — Settings → Pages → deploy from branch, root folder. It also works under a sub-path (`https://user.github.io/repo/`) because every asset path is relative. `set-site-url.mjs` only understands a bare origin, so when hosting under a sub-path set the `og:image`, `twitter:image` and canonical URLs by hand.
**Netlify / Cloudflare Pages** — publish directory `.`, no build command.

`vercel.json` deliberately does **not** set a Content-Security-Policy: the page uses a small inline script in `<head>` (theme, language and intro flags must be applied before first paint) and Google Fonts. If you want a CSP, add a hash for that inline script and allow `fonts.googleapis.com` / `fonts.gstatic.com` and the image host you use.

---

## Browser support and honesty notes

* Written for current evergreen browsers (Chrome/Edge, Firefox, Safari incl. iOS). Uses `inert`, `IntersectionObserver`, `:focus-visible`, CSS custom properties and `scrollend` (with a timeout fallback).
* Nothing on the site is simulated: there are no fake download counts, uptime, performance scores or audio waveforms. The visualizer moves only when Web Audio is really delivering frequency data, and stays still under `prefers-reduced-motion`.
* One line of the original Stitch copy ("…powering 1,500+ active guild members…" for the bot suite) was removed because it was an unverified number. Re-add it in `js/projects.js` if it is accurate.
* The theme toggle exposes its state through `aria-pressed` on a button whose label stays "Dark mode"; the icon shows the *current* theme.

---

## Credits and licences

* **Icons** — path data from [Material Design Icons](https://pictogrammers.com/library/mdi/) (Apache-2.0) and [Simple Icons](https://simpleicons.org/) (CC0), inlined as an SVG sprite in `index.html`. GitHub, TikTok, Instagram and Telegram are trademarks of their respective owners; the marks are used only to link to those profiles.
* **Fonts** — [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) and [Inter](https://fonts.google.com/specimen/Inter), SIL Open Font License, loaded from Google Fonts.
* **Tailwind CSS** — MIT. The compiled output was generated with the standalone Tailwind CLI v3.4.17.
* Design direction and project copy originate from the supplied Stitch export; the code in this repository is yours to use and modify.
