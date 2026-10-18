/**
 * core.js — shared configuration and small utilities.
 * Loaded first. Everything hangs off the single global `KZ` namespace so the
 * site also works when opened straight from disk (no ES modules, no bundler).
 */
(function () {
  'use strict';

  var KZ = (window.KZ = window.KZ || {});

  /* ------------------------------------------------------------------ *
   * SITE CONFIGURATION — edit these values to customise the portfolio.
   * ------------------------------------------------------------------ */
  KZ.config = {
    brand: 'KUROZ4PH',
    owner: 'Muhammad Nawal Fajar Riyadi',
    role: 'Frontend Developer',
    community: 'Deraclas Community',
    timezone: 'Asia/Jakarta',

    // Social profiles (also hard-coded in index.html so the links work without JavaScript).
    github: 'https://github.com/nawwtech',
    tiktok: 'https://www.tiktok.com/@rainoneday',
    instagram: 'https://www.instagram.com/rainonedayy',
    telegram: 'https://t.me/kuroz4ph',

    // Public e-mail address. Leave empty until you have a real one: an empty value
    // means NO e-mail card or command is shown (nothing is invented).
    // Example: email: 'you@your-domain.tld'
    email: '',
  };

  /* ------------------------------------------------------------------ *
   * UTILITIES
   * ------------------------------------------------------------------ */
  var util = (KZ.util = {});

  /** localStorage / sessionStorage that never throws (private mode, blocked storage, ...). */
  function safeStore(kind) {
    return {
      get: function (key) {
        try { return window[kind].getItem(key); } catch (e) { return null; }
      },
      set: function (key, value) {
        try { window[kind].setItem(key, value); return true; } catch (e) { return false; }
      },
      remove: function (key) {
        try { window[kind].removeItem(key); } catch (e) { /* ignore */ }
      },
    };
  }
  util.local = safeStore('localStorage');
  util.session = safeStore('sessionStorage');

  util.$ = function (sel, root) { return (root || document).querySelector(sel); };
  util.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  util.escapeHtml = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  util.prefersReducedMotion = function () {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  util.finePointer = function () {
    return !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  };

  /** Rough "low-end device" heuristic used to scale down particle counts. */
  util.isLowEnd = function () {
    var cores = navigator.hardwareConcurrency || 4;
    var mem = navigator.deviceMemory || 4;
    var saveData = navigator.connection && navigator.connection.saveData;
    return cores <= 4 || mem <= 2 || !!saveData;
  };

  util.isMac = function () {
    var p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    return /mac|iphone|ipad|ipod/i.test(p);
  };

  util.debounce = function (fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  };

  util.pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  /** Elements that are made inert while a modal layer (intro, project modal, palette) is open. */
  util.backgroundSelectors = ['#site-header', '#main', '#site-footer', '#floating-nav', '#audio'];

  var inertCount = 0;
  util.setBackgroundInert = function (on) {
    inertCount = Math.max(0, inertCount + (on ? 1 : -1));
    var makeInert = inertCount > 0;
    util.backgroundSelectors.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      if (makeInert) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
  };

  var lockCount = 0;
  util.lockScroll = function (on) {
    lockCount = Math.max(0, lockCount + (on ? 1 : -1));
    document.documentElement.classList.toggle('scroll-locked', lockCount > 0);
  };

  var FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])',
    'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  util.focusable = function (root) {
    return util.$$(FOCUSABLE, root).filter(function (el) {
      return !el.hidden && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    });
  };

  /** Keeps Tab / Shift+Tab inside `root`. Returns a function that removes the trap. */
  util.trapFocus = function (root) {
    function onKey(e) {
      if (e.key !== 'Tab') return;
      var items = util.focusable(root);
      if (!items.length) { e.preventDefault(); root.focus(); return; }
      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !root.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey, true);
    return function () { document.removeEventListener('keydown', onKey, true); };
  };

  /**
   * Generic modal layer controller (used by the project modal and the command palette).
   *   overlay  – full-screen wrapper (gets the `hidden` attribute toggled)
   *   panel    – the role="dialog" element (receives focus / traps Tab)
   *   onOpen / onClose – optional hooks
   */
  util.createLayer = function (opts) {
    var overlay = opts.overlay;
    var panel = opts.panel;
    var untrap = null;
    var opener = null;
    var isOpen = false;
    var downOnBackdrop = false;

    function open(returnFocusTo) {
      if (isOpen) return;
      isOpen = true;
      opener = returnFocusTo || document.activeElement;
      overlay.hidden = false;
      util.lockScroll(true);
      util.setBackgroundInert(true);
      untrap = util.trapFocus(panel);
      if (opts.onOpen) opts.onOpen();
      if (!panel.contains(document.activeElement)) {
        (opts.initialFocus ? opts.initialFocus() : panel).focus({ preventScroll: true });
      }
    }

    function close(opts2) {
      if (!isOpen) return;
      isOpen = false;
      overlay.hidden = true;
      if (untrap) { untrap(); untrap = null; }
      util.lockScroll(false);
      util.setBackgroundInert(false);
      if (opts.onClose) opts.onClose();
      var skipFocus = opts2 && opts2.restoreFocus === false;
      if (!skipFocus && opener && document.contains(opener) && typeof opener.focus === 'function') {
        opener.focus({ preventScroll: true });
      }
      opener = null;
    }

    // Close on backdrop click — but only if the press AND the release both happened on the backdrop,
    // so selecting text inside the panel and releasing outside never closes it by accident.
    overlay.addEventListener('pointerdown', function (e) { downOnBackdrop = e.target === overlay; });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay && downOnBackdrop) close();
      downOnBackdrop = false;
    });
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    });

    return {
      open: open,
      close: close,
      isOpen: function () { return isOpen; },
    };
  };

  /* ------------------------------------------------------------------ *
   * TOAST (polite live-region message)
   * ------------------------------------------------------------------ */
  var toastTimer = null;
  util.toast = function (message) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2600);
  };
})();
