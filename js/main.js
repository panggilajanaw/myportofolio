/**
 * main.js — boots the site and owns: theme, language buttons, floating navigation with
 * IntersectionObserver, the command palette, and the optional e-mail contact card.
 *
 * Each module is initialised inside its own try/catch so a failure in one enhancement can never
 * take the rest of the page down.
 */
(function () {
  'use strict';

  var KZ = (window.KZ = window.KZ || {});
  var util = KZ.util;
  var html = document.documentElement;

  function T(key, vars) { return KZ.i18n.t(key, vars); }
  function guard(name, fn) {
    try { fn(); } catch (err) { if (window.console) console.error('[KUROZ4PH] ' + name + ' failed:', err); }
  }

  /* ================================================================== *
   * THEME
   * ================================================================== */
  var theme = {
    current: function () { return html.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; },

    syncUi: function () {
      var mode = theme.current();
      var btn = document.getElementById('theme-toggle');
      var icon = document.getElementById('theme-icon');
      if (btn) {
        btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
        btn.setAttribute('title', T(mode === 'dark' ? 'theme.to.light' : 'theme.to.dark'));
      }
      if (icon) icon.setAttribute('href', mode === 'dark' ? '#i-moon' : '#i-sun');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', mode === 'light' ? '#fbf8ff' : '#131317');
    },

    apply: function (mode, persist) {
      html.setAttribute('data-theme', mode);
      html.classList.toggle('dark', mode === 'dark');
      if (persist) util.local.set('kz-theme', mode);
      theme.syncUi();
      document.dispatchEvent(new CustomEvent('kz:theme', { detail: { theme: mode } }));
    },

    toggle: function () {
      var next = theme.current() === 'dark' ? 'light' : 'dark';
      theme.apply(next, true);
      util.toast(T(next === 'dark' ? 'toast.theme.dark' : 'toast.theme.light'));
    },

    init: function () {
      theme.syncUi();
      var btn = document.getElementById('theme-toggle');
      if (btn) btn.addEventListener('click', theme.toggle);

      // Follow the OS setting until the visitor makes an explicit choice.
      if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: light)');
        var onChange = function (e) {
          if (util.local.get('kz-theme') === null) theme.apply(e.matches ? 'light' : 'dark', false);
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
      }
      KZ.i18n.onChange(theme.syncUi);
    },
  };

  /* ================================================================== *
   * LANGUAGE BUTTONS
   * ================================================================== */
  function initLanguageButtons() {
    util.$$('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (lang === KZ.i18n.lang) return;
        KZ.i18n.setLang(lang);
        util.toast(T('toast.lang'));
      });
    });
  }

  /* ================================================================== *
   * FLOATING NAVIGATION (active section via IntersectionObserver)
   * ================================================================== */
  var nav = {
    links: [],
    sections: [],
    track: null,
    indicator: null,
    current: null,
    locked: false,
    lockTimer: 0,
    visible: {},

    init: function () {
      nav.links = util.$$('#nav-list .nav-link');
      nav.track = document.querySelector('#floating-nav .nav-track');
      nav.indicator = document.getElementById('nav-indicator');
      nav.sections = nav.links.map(function (a) { return document.getElementById(a.getAttribute('data-section')); });
      if (!nav.links.length) return;

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { nav.visible[e.target.id] = e.isIntersecting; });
          if (!nav.locked) nav.pick();
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        nav.sections.forEach(function (s) { if (s) io.observe(s); });
      } else {
        window.addEventListener('scroll', util.debounce(nav.compute, 80), { passive: true });
      }

      // Page edges: the first/last sections may never cross the middle line.
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking || nav.locked) return;
        ticking = true;
        requestAnimationFrame(function () { ticking = false; nav.edges(); });
      }, { passive: true });

      // Clicking a link highlights it immediately and ignores intermediate sections while the smooth scroll runs.
      nav.links.forEach(function (a) {
        a.addEventListener('click', function () {
          nav.setActive(a.getAttribute('data-section'));
          nav.lock();
        });
      });
      if ('onscrollend' in window) window.addEventListener('scrollend', nav.unlock);

      window.addEventListener('resize', util.debounce(nav.moveIndicator, 100));
      window.addEventListener('load', nav.moveIndicator);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(nav.moveIndicator);
      KZ.i18n.onChange(function () { requestAnimationFrame(nav.moveIndicator); });

      nav.compute();
    },

    lock: function () {
      nav.locked = true;
      clearTimeout(nav.lockTimer);
      nav.lockTimer = setTimeout(nav.unlock, 1300);
    },

    unlock: function () {
      if (!nav.locked) return;
      nav.locked = false;
      clearTimeout(nav.lockTimer);
      nav.compute();
    },

    pick: function () {
      for (var i = 0; i < nav.sections.length; i++) {
        var s = nav.sections[i];
        if (s && nav.visible[s.id]) { nav.setActive(s.id); return; }
      }
      nav.edges();
    },

    edges: function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (y < 40) { nav.setActive('home'); return; }
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 8) nav.setActive('contact');
    },

    /** Position-based fallback: the last section whose top has passed ~45% of the viewport. */
    compute: function () {
      var line = window.innerHeight * 0.45;
      var found = 'home';
      nav.sections.forEach(function (s) {
        if (s && s.getBoundingClientRect().top <= line) found = s.id;
      });
      nav.setActive(found);
      nav.edges();
    },

    setActive: function (id) {
      if (id === nav.current && nav.indicator && nav.indicator.classList.contains('is-ready')) return;
      nav.current = id;
      nav.links.forEach(function (a) {
        if (a.getAttribute('data-section') === id) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
      nav.moveIndicator();
    },

    moveIndicator: function () {
      if (!nav.indicator || !nav.track) return;
      var active = nav.links.filter(function (a) { return a.getAttribute('aria-current') === 'location'; })[0];
      if (!active) { nav.indicator.classList.remove('is-ready'); return; }
      var t = nav.track.getBoundingClientRect();
      var r = active.getBoundingClientRect();
      nav.indicator.style.width = r.width + 'px';
      nav.indicator.style.transform = 'translateX(' + (r.left - t.left) + 'px)';
      nav.indicator.classList.add('is-ready');
      // Keep the active item visible if the pill ever needs to scroll on a very narrow screen.
      if (active.scrollIntoView && nav.track.scrollWidth > nav.track.clientWidth + 1) {
        active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    },
  };

  /* ================================================================== *
   * COMMAND PALETTE
   * ================================================================== */
  var palette = {
    layer: null,
    input: null,
    list: null,
    empty: null,
    status: null,
    all: [],
    shown: [],
    active: 0,
    statusTimer: 0,

    sections: [
      { id: 'home', icon: 'home' },
      { id: 'about', icon: 'user' },
      { id: 'skills', icon: 'skills' },
      { id: 'projects', icon: 'projects' },
      { id: 'socials', icon: 'group' },
      { id: 'contact', icon: 'message' },
    ],

    build: function () {
      var cmds = [];
      var g = {
        nav: T('pal.g.navigate'),
        look: T('pal.g.appearance'),
        lang: T('pal.g.language'),
        links: T('pal.g.links'),
        sys: T('pal.g.system'),
      };

      palette.sections.forEach(function (s) {
        var en = KZ.i18n.dict.en['nav.' + s.id];
        var id = KZ.i18n.dict.id['nav.' + s.id];
        cmds.push({
          id: 'go-' + s.id, group: g.nav, icon: s.icon,
          label: T('pal.go', { name: T('nav.' + s.id) }),
          keywords: 'go navigate jump section buka ke ' + en + ' ' + id,
          run: function () { palette.goTo(s.id); },
        });
      });

      cmds.push({
        id: 'theme', group: g.look, icon: theme.current() === 'dark' ? 'sun' : 'moon',
        label: T('pal.theme'),
        keywords: 'theme dark light mode appearance tema gelap terang mode',
        run: theme.toggle,
      });

      cmds.push({
        id: 'lang-en', group: g.lang, icon: 'translate',
        label: T('pal.lang.en'),
        keywords: 'language english inggris en bahasa',
        run: function () { KZ.i18n.setLang('en'); util.toast(T('toast.lang')); },
      });
      cmds.push({
        id: 'lang-id', group: g.lang, icon: 'translate',
        label: T('pal.lang.id'),
        keywords: 'language indonesian indonesia bahasa id',
        run: function () { KZ.i18n.setLang('id'); util.toast(T('toast.lang')); },
      });

      cmds.push({
        id: 'github', group: g.links, icon: 'github',
        label: T('pal.github'),
        keywords: 'github code repository profile source kode profil',
        run: function () { window.open(KZ.config.github, '_blank', 'noopener,noreferrer'); },
      });

      if (palette.hasEmail()) {
        cmds.push({
          id: 'email', group: g.links, icon: 'mail',
          label: T('contact.email'),
          keywords: 'email mail contact write kontak surel',
          run: function () { window.location.href = 'mailto:' + KZ.config.email; },
        });
      }

      cmds.push({
        id: 'intro', group: g.sys, icon: 'replay',
        label: T('pal.intro'),
        keywords: 'intro replay animation opening ulang pembukaan',
        run: function () { window.scrollTo(0, 0); KZ.fx.intro.play(); },
      });

      return cmds;
    },

    hasEmail: function () {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(KZ.config.email || '');
    },

    goTo: function (id) {
      var target = document.getElementById(id);
      if (!target) return;
      if (window.location.hash === '#' + id) {
        target.scrollIntoView({ behavior: util.prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      } else {
        window.location.hash = id;
      }
    },

    rank: function (cmd, tokens) {
      var label = cmd.label.toLowerCase();
      var hay = label + ' ' + cmd.keywords.toLowerCase() + ' ' + cmd.group.toLowerCase();
      var score = 0;
      for (var i = 0; i < tokens.length; i++) {
        var tk = tokens[i];
        if (hay.indexOf(tk) === -1) return -1;
        score += label.indexOf(tk) === 0 ? 0 : label.indexOf(tk) > -1 ? 1 : 2;
      }
      return score;
    },

    filter: function (query) {
      var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
      var scored = [];
      palette.all.forEach(function (cmd, i) {
        var s = tokens.length ? palette.rank(cmd, tokens) : 0;
        if (s >= 0) scored.push({ cmd: cmd, s: s, i: i });
      });
      scored.sort(function (a, b) { return a.s - b.s || a.i - b.i; });
      palette.shown = scored.map(function (x) { return x.cmd; });
      palette.active = 0;
      palette.render();
    },

    render: function () {
      var html_ = palette.shown.map(function (cmd, i) {
        return '<li role="option" id="cmd-' + i + '" data-index="' + i + '" aria-selected="' + (i === palette.active ? 'true' : 'false') +
          '" class="flex min-h-[44px] cursor-pointer items-center gap-space-sm rounded-lg px-space-sm py-2 font-body-md text-body-md text-on-surface">' +
          '<svg class="icon h-5 w-5 flex-none" aria-hidden="true"><use href="#i-' + cmd.icon + '"/></svg>' +
          '<span class="min-w-0 flex-1 truncate">' + util.escapeHtml(cmd.label) + '</span>' +
          '<span class="cmd-hint flex-none font-label-caps text-label-caps uppercase text-outline">' + util.escapeHtml(cmd.group) + '</span></li>';
      }).join('');
      palette.list.innerHTML = html_;
      var has = palette.shown.length > 0;
      palette.empty.hidden = has;
      palette.list.hidden = !has;
      palette.input.setAttribute('aria-expanded', has ? 'true' : 'false');
      palette.syncActive(false);
      clearTimeout(palette.statusTimer);
      palette.statusTimer = setTimeout(function () {
        palette.status.textContent = has ? T('pal.results', { n: palette.shown.length }) : T('pal.empty');
      }, 250);
    },

    syncActive: function (scroll) {
      var opts = util.$$('[role="option"]', palette.list);
      opts.forEach(function (o, i) { o.setAttribute('aria-selected', i === palette.active ? 'true' : 'false'); });
      var cur = opts[palette.active];
      palette.input.setAttribute('aria-activedescendant', cur ? cur.id : '');
      if (cur && scroll) cur.scrollIntoView({ block: 'nearest' });
    },

    move: function (delta) {
      var n = palette.shown.length;
      if (!n) return;
      palette.active = (palette.active + delta + n) % n;
      palette.syncActive(true);
    },

    run: function (cmd) {
      if (!cmd) return;
      palette.layer.close();
      // Let focus return to the opener before the command moves things around.
      setTimeout(function () { cmd.run(); }, 0);
    },

    open: function (opener) {
      if (palette.layer.isOpen()) return;
      palette.all = palette.build();
      palette.input.value = '';
      palette.filter('');
      palette.layer.open(opener || document.activeElement);
    },

    toggle: function (opener) {
      if (palette.layer.isOpen()) palette.layer.close();
      else palette.open(opener);
    },

    blockedByOtherLayer: function () {
      return (KZ.fx && KZ.fx.intro && KZ.fx.intro.active) || (KZ.projects && KZ.projects.openId);
    },

    init: function () {
      var overlay = document.getElementById('palette');
      var dialog = document.getElementById('palette-dialog');
      palette.input = document.getElementById('palette-input');
      palette.list = document.getElementById('palette-list');
      palette.empty = document.getElementById('palette-empty');
      palette.status = document.getElementById('palette-status');
      if (!overlay || !dialog || !palette.input || !palette.list) return;

      palette.layer = util.createLayer({
        overlay: overlay,
        panel: dialog,
        initialFocus: function () { return palette.input; },
        onClose: function () { palette.input.value = ''; },
      });

      // Platform-appropriate shortcut hint on the header button.
      var openBtn = document.getElementById('palette-open');
      var hint = document.getElementById('palette-hint');
      if (hint) hint.textContent = util.isMac() ? '⌘K' : 'Ctrl K';
      if (openBtn) {
        openBtn.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
        openBtn.addEventListener('click', function () {
          if (!palette.blockedByOtherLayer()) palette.open(openBtn);
        });
      }

      // Ctrl/Cmd + K — never steals the shortcut from text fields outside the palette.
      document.addEventListener('keydown', function (e) {
        if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
        if (String(e.key).toLowerCase() !== 'k') return;
        var t = e.target;
        var insidePalette = dialog.contains(t);
        var editable = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
        if (editable && !insidePalette) return;
        if (!insidePalette && palette.blockedByOtherLayer()) return;
        e.preventDefault();
        palette.toggle();
      });

      palette.input.addEventListener('input', function () { palette.filter(palette.input.value); });
      palette.input.addEventListener('keydown', function (e) {
        if (e.isComposing) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); palette.move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); palette.move(-1); }
        else if (e.key === 'Home' && palette.shown.length) { e.preventDefault(); palette.active = 0; palette.syncActive(true); }
        else if (e.key === 'End' && palette.shown.length) { e.preventDefault(); palette.active = palette.shown.length - 1; palette.syncActive(true); }
        else if (e.key === 'Enter') { e.preventDefault(); palette.run(palette.shown[palette.active]); }
      });

      palette.list.addEventListener('click', function (e) {
        var li = e.target.closest && e.target.closest('[role="option"]');
        if (li) palette.run(palette.shown[Number(li.getAttribute('data-index'))]);
      });
      palette.list.addEventListener('pointermove', function (e) {
        var li = e.target.closest && e.target.closest('[role="option"]');
        if (!li) return;
        var i = Number(li.getAttribute('data-index'));
        if (i !== palette.active) { palette.active = i; palette.syncActive(false); }
      });

      // Keep labels in step with the language if it changes while the palette is open.
      KZ.i18n.onChange(function () {
        if (!palette.layer.isOpen()) return;
        var q = palette.input.value;
        palette.all = palette.build();
        palette.filter(q);
      });
    },
  };

  /* ================================================================== *
   * OPTIONAL E-MAIL CARD (only when a real address is configured)
   * ================================================================== */
  function initEmail() {
    var holder = document.getElementById('contact-actions');
    if (!holder || !palette.hasEmail()) return;
    var a = document.createElement('a');
    a.className = 'btn btn-ghost w-full py-3';
    a.href = 'mailto:' + KZ.config.email;
    a.innerHTML = '<svg class="icon h-5 w-5" aria-hidden="true"><use href="#i-mail"/></svg><span data-i18n="contact.email"></span>';
    holder.appendChild(a);
    KZ.i18n.apply(a);
  }

  /* ================================================================== *
   * BOOT
   * ================================================================== */
  function boot() {
    guard('projects', function () { KZ.projects.init(); });
    guard('audio', function () { KZ.audio.init(); });
    guard('i18n', function () { KZ.i18n.init(); });
    guard('theme', theme.init);
    guard('language buttons', initLanguageButtons);
    guard('email', initEmail);
    guard('navigation', nav.init);
    guard('palette', palette.init);
    guard('effects', function () { KZ.fx.init(); });

    html.classList.add('js-ready');
    KZ.ready = true;

    if (html.classList.contains('intro-active')) {
      guard('intro', function () { KZ.fx.intro.play(); KZ.fx.intro.mark('ui'); });
    }
  }

  KZ.nav = nav;
  KZ.theme = theme;
  KZ.palette = palette;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
