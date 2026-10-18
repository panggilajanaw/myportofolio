/**
 * fx.js — visual layer: cinematic intro, background starfield, hero effects, scroll reveal.
 *
 * Everything here is optional polish. If this file fails to load, the content stays visible and
 * every interaction keeps working. Animation is paused while the tab is hidden, scaled down on
 * low-end devices, and replaced by static frames when "prefers-reduced-motion" is set.
 */
(function () {
  'use strict';

  var KZ = (window.KZ = window.KZ || {});
  var util = KZ.util;
  var html = document.documentElement;

  function T(key, vars) { return KZ.i18n.t(key, vars); }

  /* ================================================================== *
   * Canvas particle field (shared by the intro and the page background)
   * ================================================================== */
  function createField(canvas, opts) {
    var ctx = canvas.getContext('2d');
    var dpr = 1;
    var w = 0;
    var h = 0;
    var stars = [];
    var raf = 0;
    var last = 0;
    var running = false;
    var color = opts.color || [229, 225, 230];
    var accent = opts.accent || [76, 215, 246];
    var accent2 = opts.accent2 || [208, 188, 255];
    var px = 0;
    var py = 0;
    var tx = 0;
    var ty = 0;
    var frameGap = opts.frameGap || 0;
    var still = !!opts.still;

    function resize() {
      var cap = util.isLowEnd() ? 1 : 1.5;
      dpr = Math.min(window.devicePixelRatio || 1, cap);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round((w * h) / opts.density);
      count = Math.max(opts.min, Math.min(opts.max, count));
      if (util.isLowEnd()) count = Math.round(count * 0.55);
      stars = [];
      for (var i = 0; i < count; i++) {
        var depth = 0.25 + Math.random() * 0.75;
        var roll = Math.random();
        stars.push({
          x: Math.random(),
          y: Math.random(),
          z: depth,
          r: 0.4 + depth * 1.1,
          a: 0.25 + depth * 0.65,
          tw: Math.random() * Math.PI * 2,
          sp: 0.4 + Math.random() * 1.2,
          c: roll > 0.93 ? accent : roll > 0.86 ? accent2 : color,
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      var drift = still ? 0 : t * 0.000012;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var x = (((s.x - drift * s.z * (opts.driftX || 1)) % 1) + 1) % 1;
        var y = (((s.y - drift * s.z * (opts.driftY || 0.4)) % 1) + 1) % 1;
        var sx = x * w + px * s.z * 14;
        var sy = y * h + py * s.z * 14;
        var tw = still ? 1 : 0.65 + 0.35 * Math.sin(s.tw + t * 0.0009 * s.sp);
        ctx.globalAlpha = Math.min(1, s.a * tw * (opts.alpha || 1));
        ctx.fillStyle = 'rgb(' + s.c[0] + ',' + s.c[1] + ',' + s.c[2] + ')';
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) {
      raf = 0;
      if (!running) return;
      if (!frameGap || t - last >= frameGap) {
        last = t;
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      if (still) { draw(0); return; }
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function setColors(c, a1, a2) {
      color = c; accent = a1; accent2 = a2;
      stars.forEach(function (s, i) {
        var roll = (i * 0.6180339) % 1;
        s.c = roll > 0.93 ? accent : roll > 0.86 ? accent2 : color;
      });
      if (running && still) draw(0);
    }

    function pointer(nx, ny) { tx = nx * (opts.parallax || 1); ty = ny * (opts.parallax || 1); }

    var onResize = util.debounce(function () { resize(); if (running && still) draw(0); }, 150);
    resize();
    window.addEventListener('resize', onResize);

    function setAlpha(a) {
      opts.alpha = a;
      if (running && still) draw(0);
    }

    function destroy() {
      stop();
      window.removeEventListener('resize', onResize);
    }

    return { start: start, stop: stop, destroy: destroy, resize: resize, setColors: setColors, setAlpha: setAlpha, pointer: pointer, isRunning: function () { return running; } };
  }

  /* ================================================================== *
   * Background starfield
   * ================================================================== */
  var stars = {
    field: null,
    paused: false,
    init: function () {
      var canvas = document.getElementById('bg-stars');
      if (!canvas || !canvas.getContext) return;
      var reduce = util.prefersReducedMotion();
      this.field = createField(canvas, {
        density: 12000,
        min: 36,
        max: 110,
        still: reduce,
        frameGap: util.isLowEnd() || !util.finePointer() ? 40 : 0,
        parallax: 1,
        driftX: 1,
        driftY: 0.4,
        alpha: 1,
      });
      this.syncTheme();
      if (!this.paused) this.field.start();

      var self = this;
      document.addEventListener('visibilitychange', function () {
        if (!self.field) return;
        if (document.hidden) self.field.stop();
        else if (!self.paused) self.field.start();
      });
      document.addEventListener('kz:theme', function () { self.syncTheme(); });

      if (!reduce && util.finePointer()) {
        window.addEventListener('pointermove', function (e) {
          if (e.pointerType !== 'mouse' || !self.field) return;
          self.field.pointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
        }, { passive: true });
      }
    },
    syncTheme: function () {
      if (!this.field) return;
      var cs = getComputedStyle(html);
      function triple(name, fallback) {
        var v = cs.getPropertyValue(name).trim().split(/\s+/).map(Number);
        return v.length === 3 && v.every(isFinite) ? v : fallback;
      }
      var light = html.getAttribute('data-theme') === 'light';
      this.field.setColors(
        triple('--star', [229, 225, 230]),
        triple('--star-accent', [76, 215, 246]),
        triple('--star-accent-2', [208, 188, 255])
      );
      // Light mode keeps the field as a very quiet texture.
      this.field.setAlpha(light ? 0.55 : 1);
    },
    setPaused: function (paused) {
      this.paused = paused;
      if (!this.field) return;
      if (paused) this.field.stop();
      else if (!document.hidden) this.field.start();
    },
  };

  /* ================================================================== *
   * Scroll reveal
   * ================================================================== */
  var reveal = {
    io: null,
    init: function () {
      if (util.prefersReducedMotion() || !('IntersectionObserver' in window)) return;
      this.io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            reveal.io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      // Anything already on screen stays visible: hiding it now would flash it out and back in.
      util.$$('[data-reveal]').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.94 && r.bottom > 0) el.classList.add('is-visible');
      });
      html.classList.add('reveal-on');
      this.observe(document);
      var self = this;
      document.addEventListener('kz:render', function (e) { self.observe(e.detail && e.detail.root); });
    },
    observe: function (root) {
      if (!this.io) return;
      util.$$('[data-reveal]:not(.is-visible)', root || document).forEach(function (el) { reveal.io.observe(el); });
    },
  };

  /* ================================================================== *
   * Hero: pointer-reactive glow + HUD tilt, magnetic buttons, Jakarta clock
   * ================================================================== */
  var hero = {
    init: function () {
      this.clock();
      var fine = util.finePointer();
      var reduce = util.prefersReducedMotion();
      if (!fine || reduce) return;

      var section = document.getElementById('home');
      var hud = document.getElementById('hero-hud');
      if (section) {
        var pending = null;
        section.addEventListener('pointermove', function (e) {
          if (e.pointerType !== 'mouse') return;
          pending = e;
          if (section._raf) return;
          section._raf = requestAnimationFrame(function () {
            section._raf = 0;
            var r = section.getBoundingClientRect();
            var nx = (pending.clientX - r.left) / r.width;
            var ny = (pending.clientY - r.top) / r.height;
            section.style.setProperty('--mx', (nx * 100).toFixed(1) + '%');
            section.style.setProperty('--my', (ny * 100).toFixed(1) + '%');
            var glow = section.querySelector('.hero-glow');
            if (glow) {
              glow.style.setProperty('--mx', (nx * 100).toFixed(1) + '%');
              glow.style.setProperty('--my', (ny * 100).toFixed(1) + '%');
            }
            if (hud) {
              hud.style.setProperty('--rx', ((0.5 - ny) * 6).toFixed(2) + 'deg');
              hud.style.setProperty('--ry', ((nx - 0.5) * 8).toFixed(2) + 'deg');
            }
          });
        }, { passive: true });
        section.addEventListener('pointerleave', function () {
          if (hud) { hud.style.setProperty('--rx', '0deg'); hud.style.setProperty('--ry', '0deg'); }
        });
      }

      util.$$('[data-magnetic]').forEach(function (el) {
        el.addEventListener('pointermove', function (e) {
          if (e.pointerType !== 'mouse') return;
          var r = el.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
          var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
          el.style.transform = 'translate(' + Math.max(-6, Math.min(6, dx)).toFixed(1) + 'px,' + Math.max(-5, Math.min(5, dy)).toFixed(1) + 'px)';
        });
        el.addEventListener('pointerleave', function () { el.style.transform = ''; });
      });
    },
    clock: function () {
      var targets = [document.getElementById('hero-time'), document.getElementById('intro-clock')].filter(Boolean);
      if (!targets.length) return;
      var fmt;
      try {
        fmt = new Intl.DateTimeFormat('en-GB', { timeZone: KZ.config.timezone, hour: '2-digit', minute: '2-digit', hour12: false });
      } catch (e) { return; }
      function tick() {
        var text = fmt.format(new Date()) + ' WIB';
        targets.forEach(function (el) { el.textContent = text; });
      }
      tick();
      setInterval(function () { if (!document.hidden) tick(); }, 15000);
    },
  };

  /* ================================================================== *
   * Cinematic intro
   * ================================================================== */
  var intro = (function () {
    var STEP_IDS = ['ui', 'fonts', 'data', 'audio'];
    var MIN_MS = 2200;
    var MAX_MS = 6000;

    var el = null;
    var field = null;
    var untrap = null;
    var active = false;
    var startedAt = 0;
    var results = {};
    var timers = [];
    var onKey = null;

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function updateProgress() {
      var done = STEP_IDS.filter(function (id) { return results[id]; }).length;
      var bar = document.getElementById('intro-progress');
      if (bar) bar.style.setProperty('--p', String(done / STEP_IDS.length));
    }

    function maybeFinish() {
      if (!active) return;
      var all = STEP_IDS.every(function (id) { return results[id]; });
      if (!all) return;
      var min = util.prefersReducedMotion() ? 500 : MIN_MS;
      var wait = Math.max(0, min - (performance.now() - startedAt));
      timers.push(setTimeout(leave, wait));
    }

    /** Mark an initialisation step as finished. outcome: 'ready' | 'fallback' | 'none'. */
    function mark(id, outcome) {
      if (!active || results[id]) return;
      results[id] = outcome || 'ready';
      var li = el.querySelector('[data-step="' + id + '"]');
      if (li) {
        li.setAttribute('data-state', outcome === 'none' || outcome === 'fallback' ? 'skipped' : 'done');
        var st = li.querySelector('.st');
        if (st) {
          var key = outcome === 'none' ? 'intro.st.none' : outcome === 'fallback' ? 'intro.st.fallback' : 'intro.st.ready';
          st.setAttribute('data-i18n', key);
          st.textContent = T(key);
        }
      }
      updateProgress();
      maybeFinish();
    }

    function finish() {
      if (!el) return;
      html.classList.remove('intro-active');
      el.classList.remove('intro-run', 'intro-leaving');
      if (field) { field.destroy(); field = null; }
      if (untrap) { untrap(); untrap = null; }
      if (onKey) { document.removeEventListener('keydown', onKey, true); onKey = null; }
      util.setBackgroundInert(false);
      stars.setPaused(false);
      var main = document.getElementById('main');
      if (main) main.focus({ preventScroll: true });
    }

    function leave() {
      if (!active) return;
      active = false;
      clearTimers();
      el.classList.add('intro-leaving');
      var wait = util.prefersReducedMotion() ? 0 : 760;
      timers.push(setTimeout(finish, wait));
    }

    function play() {
      el = document.getElementById('intro');
      if (!el || active) return;
      active = true;
      results = {};
      startedAt = performance.now();
      util.session.set('kz-intro-seen', '1');
      html.classList.add('intro-active');
      el.classList.remove('intro-run', 'intro-leaving');
      util.$$('#intro-steps li', el).forEach(function (li) {
        li.setAttribute('data-state', 'pending');
        var st = li.querySelector('.st');
        st.setAttribute('data-i18n', 'intro.st.wait');
        st.textContent = T('intro.st.wait');
      });
      updateProgress();

      util.setBackgroundInert(true);
      untrap = util.trapFocus(el);
      stars.setPaused(true);
      onKey = function (e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); leave(); }
      };
      document.addEventListener('keydown', onKey, true);

      var canvas = document.getElementById('intro-canvas');
      if (canvas && canvas.getContext) {
        field = createField(canvas, {
          density: 11000, min: 30, max: 90, still: util.prefersReducedMotion(),
          frameGap: util.isLowEnd() ? 40 : 0, driftX: -2, driftY: 1.2, parallax: 0, alpha: 1,
        });
        field.start();
      }

      void el.offsetWidth; // restart CSS animations on replay
      el.classList.add('intro-run');
      var skip = document.getElementById('intro-skip');
      if (skip) skip.focus({ preventScroll: true });

      // Hard cap: the intro can never hold the site hostage.
      timers.push(setTimeout(leave, MAX_MS));

      // Real initialisation signals ------------------------------------------------
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mark('ui'); });
      else if (KZ.ready) mark('ui');

      var fontsTimeout = setTimeout(function () { mark('fonts', 'fallback'); }, 2500);
      timers.push(fontsTimeout);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          var loaded = document.fonts.size > 0 && document.fonts.check('600 16px "Space Grotesk"') && document.fonts.check('400 16px Inter');
          mark('fonts', loaded ? 'ready' : 'fallback');
        });
      } else {
        mark('fonts', 'fallback');
      }

      if (KZ.projects && KZ.projects.data && KZ.projects.data.length) mark('data');

      if (KZ.audio && KZ.audio.ready) {
        KZ.audio.ready.then(function (result) {
          mark('audio', result === 'ready' ? 'ready' : result === 'none' ? 'none' : 'fallback');
        });
      } else {
        mark('audio', 'none');
      }
    }

    return {
      play: play,
      skip: leave,
      mark: mark,
      get active() { return active; },
      init: function () {
        el = document.getElementById('intro');
        if (!el) return;
        var skip = document.getElementById('intro-skip');
        if (skip) skip.addEventListener('click', leave);
      },
    };
  })();

  /* ================================================================== */
  KZ.fx = {
    intro: intro,
    stars: stars,
    reveal: reveal,
    hero: hero,
    init: function () {
      intro.init();
      stars.init();
      reveal.init();
      hero.init();
    },
  };
})();
