/**
 * audio.js — the "Audio Telemetry" player.
 *
 * Nothing here is simulated: the UI is driven by the media element's real events, the progress
 * and duration come from the loaded file, and the visualizer only moves when the Web Audio
 * AnalyserNode is actually delivering frequency data.
 *
 * ┌─ HOW TO ADD MUSIC ──────────────────────────────────────────────────────────┐
 * │ 1. Copy royalty-free audio files you have the right to use into             │
 * │    assets/audio/ (MP3 or OGG/Opus work in every modern browser).            │
 * │ 2. List them in TRACKS below.                                               │
 * │ With an empty list the player shows an "Audio unavailable" state and the    │
 * │ rest of the site is unaffected. Music never autoplays.                      │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
(function () {
  'use strict';

  var KZ = (window.KZ = window.KZ || {});
  var util = KZ.util;

  /** Edit me. `src` is relative to index.html. Example entry:
   *  { title: 'Track title', artist: 'Artist name', src: 'assets/audio/track-01.mp3' }
   */
  var TRACKS = [];

  var els = {};
  var root = null;
  var audio = null;
 var TRACKS = [
  { title: 'Sempurna', artist: 'Andra and the Backbone', src: 'assets/audio/sempurna.mp3' },
];
  var index = 0;
  var failed = {};
  var state = 'unavailable'; // unavailable | loading | idle | playing | paused | ended | error
  var wantPlay = false; // user intent: keep playing across track changes
  var messageKey = null;
  var volumeSettable = true;

  var actx = null;
  var analyser = null;
  var freq = null;
  var raf = 0;
  var bars = [];

  var settled = false;
  var resolveReady;
  var readyPromise = new Promise(function (resolve) { resolveReady = resolve; });
  function settle(result) {
    if (settled) return;
    settled = true;
    resolveReady(result);
  }

  function T(key, vars) { return KZ.i18n.t(key, vars); }

  function fmt(s) {
    if (!isFinite(s) || s < 0) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function sameOriginHttp(src) {
    try {
      var u = new URL(src, location.href);
      return /^https?:$/.test(location.protocol) && u.origin === location.origin;
    } catch (e) { return false; }
  }

  /* ------------------------------------------------------------------ *
   * UI
   * ------------------------------------------------------------------ */
  function setFill(input) {
    var min = Number(input.min) || 0;
    var max = Number(input.max) || 100;
    var pct = max > min ? ((Number(input.value) - min) / (max - min)) * 100 : 0;
    input.style.setProperty('--fill', pct + '%');
  }

  function updateProgress() {
    var dur = audio ? audio.duration : NaN;
    var cur = audio ? audio.currentTime : 0;
    var finite = isFinite(dur) && dur > 0;
    els.cur.textContent = fmt(cur);
    els.dur.textContent = finite ? fmt(dur) : '0:00';
    els.seek.disabled = !finite || state === 'unavailable' || state === 'error';
    els.seek.value = finite ? String(Math.round((cur / dur) * 1000)) : '0';
    els.seek.setAttribute('aria-valuetext', finite ? fmt(cur) + ' / ' + fmt(dur) : '0:00');
    setFill(els.seek);
  }

  function updateVolumeUi() {
    if (!audio) return;
    var muted = audio.muted || audio.volume === 0;
    els.muteIcon.setAttribute('href', muted ? '#i-volume-off' : '#i-volume');
    els.mute.setAttribute('aria-label', muted ? T('audio.unmute') : T('audio.mute'));
    els.mute.setAttribute('aria-pressed', muted ? 'true' : 'false');
    els.volume.value = String(Math.round((audio.muted ? 0 : audio.volume) * 100));
    setFill(els.volume);
  }

  function render() {
    var tr = tracks[index];
    var unavailable = state === 'unavailable';
    root.setAttribute('data-state', state);
    els.state.textContent = T('audio.state.' + state);

    els.title.textContent = unavailable ? T('audio.none') : tr ? tr.title : '—';
    els.sub.textContent = unavailable || !tr
      ? ''
      : (tr.artist ? tr.artist + ' · ' : '') + T('audio.track', { n: index + 1, total: tracks.length });

    var active = !!audio && !audio.paused && state !== 'ended' && state !== 'error';
    var icon = state === 'ended' || state === 'error' ? 'replay' : active ? 'pause' : 'play';
    var label = state === 'error' ? T('audio.retry')
      : state === 'ended' ? T('audio.replay')
      : active ? T('audio.pause') : T('audio.play');
    els.playIcon.setAttribute('href', '#i-' + icon);
    els.play.setAttribute('aria-label', label);
    els.play.disabled = unavailable;
    els.prev.disabled = unavailable || state === 'error' || tracks.length < 2;
    els.next.disabled = unavailable || state === 'error' || tracks.length < 2;
    els.mute.disabled = unavailable;
    els.volume.disabled = unavailable || !volumeSettable;
    els.volume.hidden = !volumeSettable;

    els.fabIcon.setAttribute('href', unavailable || state === 'error' ? '#i-music-off' : '#i-music');

    var msg = unavailable && !messageKey ? 'audio.none.text' : messageKey;
    els.message.hidden = !msg;
    els.message.textContent = msg ? T(msg) : '';

    updateProgress();
    updateVolumeUi();
  }

  function announce(text) {
    els.live.textContent = '';
    // Re-set on the next tick so identical consecutive messages are still announced.
    setTimeout(function () { els.live.textContent = text; }, 30);
  }

  function setState(next) {
    if (state === next) { render(); return; }
    var prev = state;
    state = next;
    render();
    if (next === 'playing') {
      startViz();
      if (prev !== 'playing') announce(T('audio.live.playing', { title: tracks[index] ? tracks[index].title : '' }));
    } else {
      stopViz();
      if (next === 'paused' && prev === 'playing') announce(T('audio.live.paused'));
    }
  }

  function setMessage(key) {
    messageKey = key;
    render();
  }

  function setCollapsed(collapsed, opts) {
    root.setAttribute('data-collapsed', collapsed ? 'true' : 'false');
    els.fab.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    util.session.set('kz-audio-collapsed', collapsed ? '1' : '0');
    if (collapsed) stopViz(); else startViz();
    if (opts && opts.focus) {
      // A disabled button cannot take focus (that would silently drop it onto <body>), so fall back to "collapse".
      (collapsed ? els.fab : els.play.disabled ? els.collapse : els.play).focus({ preventScroll: true });
    }
  }

  /* ------------------------------------------------------------------ *
   * Visualizer (real data only)
   * ------------------------------------------------------------------ */
  function resetBars() {
    bars.forEach(function (b) { b.style.height = '12%'; });
  }

  function ensureAnalyser() {
    if (analyser || !tracks[index] || util.prefersReducedMotion()) return;
    if (!sameOriginHttp(tracks[index].src)) return; // cross-origin or file:// audio would be silenced by the graph
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      actx = new Ctx();
      var source = actx.createMediaElementSource(audio);
      analyser = actx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(actx.destination);
      freq = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      analyser = null;
    }
  }

  function frame() {
    raf = 0;
    if (state !== 'playing' || !analyser || document.hidden || root.getAttribute('data-collapsed') === 'true') return;
    analyser.getByteFrequencyData(freq);
    var n = bars.length;
    var usable = freq.length - 2;
    for (var i = 0; i < n; i++) {
      var from = 1 + Math.floor((i * usable) / n);
      var to = Math.max(from + 1, 1 + Math.floor(((i + 1) * usable) / n));
      var sum = 0;
      for (var k = from; k < to; k++) sum += freq[k];
      var avg = sum / (to - from);
      bars[i].style.height = Math.max(12, Math.round((avg / 255) * 100)) + '%';
    }
    raf = requestAnimationFrame(frame);
  }

  function startViz() {
    if (!analyser || raf || state !== 'playing' || document.hidden) return;
    if (root.getAttribute('data-collapsed') === 'true') return;
    raf = requestAnimationFrame(frame);
  }

  function stopViz() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    resetBars();
  }

  /* ------------------------------------------------------------------ *
   * Playback
   * ------------------------------------------------------------------ */
  function tryPlay() {
    ensureAnalyser();
    if (actx && actx.state === 'suspended') actx.resume();
    var p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function (err) {
        if (err && err.name === 'NotAllowedError') {
          wantPlay = false;
          setState(audio.currentTime > 0 ? 'paused' : 'idle');
          setMessage('audio.blocked');
        }
        // AbortError: a newer load/pause superseded this request. Real failures arrive via the 'error' event.
      });
    }
  }

  function loadTrack(i, autoplay) {
    index = i;
    wantPlay = !!autoplay;
    messageKey = null;
    setState('loading');
    audio.src = tracks[i].src;
    audio.load();
    updateProgress();
    if (autoplay) tryPlay();
  }

  function nextPlayable(from, dir) {
    var n = tracks.length;
    for (var step = 1; step <= n; step++) {
      var i = (((from + dir * step) % n) + n) % n;
      if (!failed[i]) return i;
    }
    return from;
  }

  function step(dir) {
    if (!audio || tracks.length < 2) return;
    if (dir < 0 && audio.currentTime > 3) { audio.currentTime = 0; return; }
    var target = nextPlayable(index, dir);
    if (target === index) return;
    loadTrack(target, wantPlay || !audio.paused);
  }

  function togglePlay() {
    if (!audio || state === 'unavailable') return;
    messageKey = null;
    if (state === 'error') { failed = {}; loadTrack(index, true); return; }
    if (state === 'ended') audio.currentTime = 0;
    if (audio.paused) { wantPlay = true; tryPlay(); }
    else { wantPlay = false; audio.pause(); }
    render();
  }

  function handleError() {
    failed[index] = true;
    var remaining = tracks.filter(function (t, i) { return !failed[i]; });
    if (!remaining.length) {
      // Nothing playable. Keep the play button alive as "try again" instead of leaving a dead widget.
      wantPlay = false;
      setState('error');
      setMessage('audio.err.all');
      settle('failed');
      return;
    }
    // At least one other track hasn't failed (so there are 2+ tracks): move on and say so.
    loadTrack(nextPlayable(index, 1), wantPlay);
    setMessage('audio.err');
  }

  function bindAudio() {
    audio.addEventListener('loadedmetadata', function () {
      if (state === 'loading' && audio.paused) setState('idle');
      settle('ready');
      updateProgress();
    });
    audio.addEventListener('durationchange', updateProgress);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('canplay', function () {
      if (!audio.paused && state === 'loading') setState('playing');
    });
    audio.addEventListener('playing', function () {
      messageKey = null;
      setState('playing');
    });
    audio.addEventListener('waiting', function () {
      if (!audio.paused && state === 'playing') setState('loading');
    });
    audio.addEventListener('pause', function () {
      if (audio.ended || state === 'error' || state === 'unavailable' || state === 'loading') return;
      setState(audio.currentTime > 0 ? 'paused' : 'idle');
    });
    audio.addEventListener('ended', function () {
      if (tracks.length > 1) loadTrack(nextPlayable(index, 1), true);
      else setState('ended');
    });
    audio.addEventListener('error', handleError);
    audio.addEventListener('volumechange', updateVolumeUi);
  }

  function setVolume(v) {
    audio.volume = Math.min(1, Math.max(0, v));
    if (audio.volume > 0) audio.muted = false;
    util.local.set('kz-volume', String(audio.volume));
  }

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  function init() {
    root = document.getElementById('audio');
    if (!root) { settle('none'); return; }

    els = {
      fab: document.getElementById('audio-fab'),
      fabIcon: document.getElementById('audio-fab-icon'),
      collapse: document.getElementById('audio-collapse'),
      state: document.getElementById('audio-state'),
      title: document.getElementById('audio-title'),
      sub: document.getElementById('audio-sub'),
      cur: document.getElementById('audio-cur'),
      dur: document.getElementById('audio-dur'),
      seek: document.getElementById('audio-seek'),
      prev: document.getElementById('audio-prev'),
      play: document.getElementById('audio-play'),
      playIcon: document.getElementById('audio-play-icon'),
      next: document.getElementById('audio-next'),
      mute: document.getElementById('audio-mute'),
      muteIcon: document.getElementById('audio-mute-icon'),
      volume: document.getElementById('audio-volume'),
      message: document.getElementById('audio-message'),
      live: document.getElementById('audio-live'),
    };
    bars = util.$$('#audio-bars span');

    tracks = TRACKS.filter(function (t) { return t && t.src && t.title; });

    els.fab.addEventListener('click', function () { setCollapsed(false, { focus: true }); });
    els.collapse.addEventListener('click', function () { setCollapsed(true, { focus: true }); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.getAttribute('data-collapsed') === 'false' && root.contains(document.activeElement)) {
        setCollapsed(true, { focus: true });
      }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopViz(); else startViz();
    });
    KZ.i18n.onChange(render);

    if (!tracks.length) {
      state = 'unavailable';
      render();
      setCollapsed(true);
      settle('none');
      return;
    }

    audio = new Audio();
    audio.preload = 'metadata';
    bindAudio();

    // Some platforms (iOS Safari) ignore programmatic volume. Detect it and hide the slider there.
    var saved = parseFloat(util.local.get('kz-volume'));
    var initial = isFinite(saved) ? Math.min(1, Math.max(0, saved)) : 0.7;
    audio.volume = 0.5;
    volumeSettable = Math.abs(audio.volume - 0.5) < 0.01;
    audio.volume = initial;

    els.play.addEventListener('click', togglePlay);
    els.prev.addEventListener('click', function () { step(-1); });
    els.next.addEventListener('click', function () { step(1); });
    els.mute.addEventListener('click', function () {
      var silent = audio.muted || audio.volume === 0; // what the icon / aria-pressed currently say
      if (silent) {
        audio.muted = false;
        if (audio.volume === 0) setVolume(0.5);
      } else {
        audio.muted = true;
      }
    });
    els.volume.addEventListener('input', function () { setVolume(Number(els.volume.value) / 100); });
    els.seek.addEventListener('input', function () {
      if (isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (Number(els.seek.value) / 1000) * audio.duration;
        updateProgress();
      }
    });

    var stored = util.session.get('kz-audio-collapsed');
    var openByDefault = window.matchMedia && window.matchMedia('(min-width: 1360px)').matches;
    setCollapsed(stored === null ? !openByDefault : stored === '1');

    loadTrack(0, false);
    // Never leave the intro waiting on a slow or silent network.
    setTimeout(function () { settle('ready'); }, 4000);
  }

  KZ.audio = {
    tracks: TRACKS,
    init: init,
    ready: readyPromise,
    get state() { return state; },
    get index() { return index; },
    get element() { return audio; },
    togglePlay: togglePlay,
    next: function () { step(1); },
    prev: function () { step(-1); },
    setCollapsed: setCollapsed,
  };
})();
