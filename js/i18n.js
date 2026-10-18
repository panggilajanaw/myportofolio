/**
 * i18n.js — EN / ID translation dictionary and switcher.
 *
 * Static HTML carries the English text inline (so the page reads correctly with no JavaScript)
 * and tags every translatable node:
 *   data-i18n="key"                         -> replaces textContent
 *   data-i18n-attr="aria-label:key;title:k" -> sets attributes
 * Dynamic UI (project cards, modal, palette, audio status) calls KZ.i18n.t(key, vars) and
 * re-renders from KZ.i18n.onChange().
 *
 * Brand names, handles, URLs and technology names are intentionally left untranslated.
 * Project copy lives with the project data in js/projects.js.
 */
(function () {
  'use strict';

  var KZ = (window.KZ = window.KZ || {});
  var util = KZ.util;

  var dict = {
    en: {
      'meta.title': 'KUROZ4PH — Muhammad Nawal Fajar Riyadi | Frontend Developer',
      'meta.description': 'Portfolio of Muhammad Nawal Fajar Riyadi (KUROZ4PH), a frontend developer building responsive interfaces and creative web experiments. Founder of Deraclas Community.',

      'a11y.skip': 'Skip to content',
      'a11y.newtab': '(opens in a new tab)',

      'intro.aria': 'Introduction',
      'intro.tag': 'Cinematic frontend portfolio',
      'intro.step.ui': 'Interface',
      'intro.step.fonts': 'Typography',
      'intro.step.data': 'Project data',
      'intro.step.audio': 'Audio engine',
      'intro.st.wait': 'Loading',
      'intro.st.ready': 'Ready',
      'intro.st.fallback': 'Fallback',
      'intro.st.none': 'No tracks',
      'intro.skip': 'Skip intro',

      'hdr.founder': 'Founder @ Deraclas Community',
      'hdr.available': 'Available for Creative Frontend & WebGL',
      'hdr.palette': 'Open command palette',
      'hdr.lang': 'Language',
      'hdr.theme': 'Dark mode',
      'hdr.github': 'GitHub profile (opens in a new tab)',
      'theme.to.light': 'Switch to light mode',
      'theme.to.dark': 'Switch to dark mode',
      'toast.theme.dark': 'Dark theme on',
      'toast.theme.light': 'Light theme on',
      'toast.lang': 'Language: English',

      'nav.label': 'Primary',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'nav.projects': 'Projects',
      'nav.socials': 'Socials',
      'nav.contact': 'Contact',

      'hero.kicker': '01 // HOME',
      'hero.eyebrow': 'Frontend Developer // Jakarta',
      'hero.title.1': 'Building Digital',
      'hero.title.2': 'Experiences',
      'hero.title.3': 'Beyond the Ordinary.',
      'hero.lead': "I'm Muhammad Nawal Fajar Riyadi, building under the name KUROZ4PH. I craft responsive interfaces and creative web experiences with HTML, CSS and JavaScript, with a soft spot for details that move.",
      'hero.cta.projects': 'Explore Projects',
      'hero.cta.contact': 'Contact Me',
      'hero.scroll': 'Scroll',

      'hud.title': 'Operator profile',
      'hud.name': 'Name',
      'hud.role': 'Role',
      'hud.role.v': 'Frontend Developer',
      'hud.community': 'Community',
      'hud.community.v': 'Founder, Deraclas Community',
      'hud.base': 'Base',
      'hud.time': 'Local time',
      'hud.f1': 'Interactive UI',
      'hud.f2': 'Responsive sites',
      'hud.f3': 'Creative frontend',

      'about.kicker': '02 // ABOUT',
      'about.title': 'Frontend developer with a taste for interactive details.',
      'about.p1': "I'm Muhammad Nawal Fajar Riyadi, a frontend developer who works under the name KUROZ4PH. I enjoy turning ideas into interfaces people can explore: responsive websites, creative frontend experiments and digital tools.",
      'about.p2': "I'm the founder of Deraclas Community, and several of the projects below were built for it. I like to keep things hands-on: build it, try a new technique, then refine it.",
      'about.focus': 'Focus areas',
      'about.f1.t': 'Interactive interfaces',
      'about.f1.d': 'UI that responds to the person using it, with motion, feedback and thoughtful states.',
      'about.f2.t': 'Responsive websites',
      'about.f2.d': 'Layouts that hold up from small Android screens to large desktop displays.',
      'about.f3.t': 'Creative experiments',
      'about.f3.d': 'Canvas, animation and shader-flavoured ideas explored in small prototypes.',
      'about.f4.t': 'Digital tools',
      'about.f4.d': 'Practical web apps and community utilities, from catalogs to bots.',

      'skills.kicker': '03 // SKILLS',
      'skills.title': 'Tools I work with',
      'skills.lead': 'Skill labels grouped by area: a snapshot of what I use, not a list of certifications.',
      'skills.c1': 'Frontend',
      'skills.c2': 'Styling',
      'skills.c3': 'Creative development',
      'skills.c4': 'Tools & platforms',
      'skills.s.responsive': 'Responsive UI design',
      'skills.s.animation': 'Animation',
      'skills.note': 'WebGL / GLSL is used where a project calls for it.',

      'projects.kicker': '04 // ARCHIVE & DEPLOYMENTS',
      'projects.index': 'SYS.INDEX // {n} ENTRIES',
      'projects.title': 'Curated Works & Digital Experiments',
      'projects.lead': 'Production applications, creative frontend systems, and community tools engineered with relentless technical precision and cinematic immersion.',
      'projects.stat.total': 'Projects',
      'projects.stat.demos': 'Public demos',
      'projects.filters': 'Project categories',
      'projects.sort': 'Sorted By: Release Matrix',
      'projects.status': 'Showing {n} of {total} projects',
      'filter.all': 'All Projects',
      'filter.web-apps': 'Web Apps',
      'filter.creative-tech': 'Creative Tech',
      'filter.community': 'Community Platforms',

      'card.inspect': 'Inspect Spec',
      'card.inspect.aria': 'Inspect spec: {title}',
      'card.github': 'GitHub',
      'card.github.aria': '{title} on GitHub (opens in a new tab)',
      'card.demo': 'Live demo',
      'card.demo.aria': '{title} live demo (opens in a new tab)',
      'card.nodemo': 'No public demo',

      'modal.blueprint': 'Project Blueprint',
      'modal.suffix': 'Architecture Spec',
      'modal.close': 'Close',
      'modal.dismiss': 'Dismiss View',
      'modal.stack': 'Stack',
      'modal.categories': 'Categories',
      'modal.palette': 'Subsystem Palette Manifest',
      'modal.notes': 'Project notes are supplied by the author and have not been independently verified.',
      'modal.github': 'Inspect GitHub',
      'modal.demo': 'Open live demo',

      'cta.title': 'Need a Bespoke Architecture?',
      'cta.text': 'Open to projects involving interactive frontend interfaces, WebGL visualizers and web platforms.',
      'cta.button': 'Initialize Comms',

      'socials.kicker': '05 // SOCIALS',
      'socials.title': 'Find me around the web',
      'socials.lead': "Follow the work, say hi, or see what I'm experimenting with.",
      'socials.github.d': 'Code and repositories',
      'socials.tiktok.d': 'Videos',
      'socials.instagram.d': 'Photos and updates',
      'socials.telegram.d': 'Chat directly',

      'contact.kicker': '06 // CONTACT',
      'contact.title': "Let's build something together.",
      'contact.lead': 'Have an idea, a collaboration or a question? Send a message. Telegram is the easiest way to reach me right now.',
      'contact.telegram': 'Message on Telegram',
      'contact.github': 'Browse my GitHub',
      'contact.email': 'Send an email',

      'footer.tagline': 'Cinematic frontend experiments by Muhammad Nawal Fajar Riyadi.',
      'footer.nav': 'Sections',
      'footer.social': 'Social links',
      'footer.l.github': 'GitHub (opens in a new tab)',
      'footer.l.tiktok': 'TikTok (opens in a new tab)',
      'footer.l.instagram': 'Instagram (opens in a new tab)',
      'footer.l.telegram': 'Telegram (opens in a new tab)',
      'footer.rights': '© {year} Muhammad Nawal Fajar Riyadi.',
      'footer.built': 'Built with HTML, Tailwind CSS and vanilla JavaScript.',
      'footer.top': 'Back to top',

      'audio.region': 'Audio player',
      'audio.title': 'Audio Telemetry',
      'audio.open': 'Open audio player',
      'audio.collapse': 'Collapse audio player',
      'audio.seek': 'Seek',
      'audio.prev': 'Previous track',
      'audio.play': 'Play',
      'audio.pause': 'Pause',
      'audio.replay': 'Replay',
      'audio.retry': 'Try again',
      'audio.next': 'Next track',
      'audio.mute': 'Mute',
      'audio.unmute': 'Unmute',
      'audio.volume': 'Volume',
      'audio.state.loading': 'Loading',
      'audio.state.playing': 'Playing',
      'audio.state.paused': 'Paused',
      'audio.state.idle': 'Ready',
      'audio.state.ended': 'Ended',
      'audio.state.error': 'Error',
      'audio.state.unavailable': 'Offline',
      'audio.none': 'Audio unavailable',
      'audio.none.text': 'No audio tracks have been added yet.',
      'audio.track': 'Track {n} of {total}',
      'audio.err': "This track couldn't be loaded.",
      'audio.err.all': 'None of the listed tracks could be loaded.',
      'audio.blocked': 'Playback was blocked by the browser. Press play to try again.',
      'audio.live.playing': 'Playing {title}',
      'audio.live.paused': 'Paused',

      'pal.title': 'Command palette',
      'pal.placeholder': 'Type a command or search…',
      'pal.search': 'Command search',
      'pal.list': 'Commands',
      'pal.empty': 'No matching commands',
      'pal.hint.nav': 'navigate',
      'pal.hint.select': 'select',
      'pal.hint.close': 'close',
      'pal.results': '{n} commands available',
      'pal.g.navigate': 'Navigate',
      'pal.g.appearance': 'Appearance',
      'pal.g.language': 'Language',
      'pal.g.links': 'Links',
      'pal.g.system': 'System',
      'pal.go': 'Go to {name}',
      'pal.theme': 'Toggle theme',
      'pal.lang.en': 'Switch language to English',
      'pal.lang.id': 'Switch language to Bahasa Indonesia',
      'pal.github': 'Open GitHub profile',
      'pal.intro': 'Replay intro',
    },

    id: {
      'meta.title': 'KUROZ4PH — Muhammad Nawal Fajar Riyadi | Frontend Developer',
      'meta.description': 'Portofolio Muhammad Nawal Fajar Riyadi (KUROZ4PH), frontend developer yang membangun antarmuka responsif dan eksperimen web kreatif. Pendiri Deraclas Community.',

      'a11y.skip': 'Lompat ke konten',
      'a11y.newtab': '(dibuka di tab baru)',

      'intro.aria': 'Pembukaan',
      'intro.tag': 'Portofolio frontend sinematik',
      'intro.step.ui': 'Antarmuka',
      'intro.step.fonts': 'Tipografi',
      'intro.step.data': 'Data proyek',
      'intro.step.audio': 'Mesin audio',
      'intro.st.wait': 'Memuat',
      'intro.st.ready': 'Siap',
      'intro.st.fallback': 'Cadangan',
      'intro.st.none': 'Tanpa lagu',
      'intro.skip': 'Lewati intro',

      'hdr.founder': 'Pendiri @ Deraclas Community',
      'hdr.available': 'Tersedia untuk Frontend Kreatif & WebGL',
      'hdr.palette': 'Buka palet perintah',
      'hdr.lang': 'Bahasa',
      'hdr.theme': 'Mode gelap',
      'hdr.github': 'Profil GitHub (dibuka di tab baru)',
      'theme.to.light': 'Ganti ke mode terang',
      'theme.to.dark': 'Ganti ke mode gelap',
      'toast.theme.dark': 'Tema gelap aktif',
      'toast.theme.light': 'Tema terang aktif',
      'toast.lang': 'Bahasa: Indonesia',

      'nav.label': 'Utama',
      'nav.home': 'Beranda',
      'nav.about': 'Tentang',
      'nav.skills': 'Keahlian',
      'nav.projects': 'Proyek',
      'nav.socials': 'Sosial',
      'nav.contact': 'Kontak',

      'hero.kicker': '01 // BERANDA',
      'hero.eyebrow': 'Frontend Developer // Jakarta',
      'hero.title.1': 'Membangun',
      'hero.title.2': 'Pengalaman Digital',
      'hero.title.3': 'Melampaui yang Biasa.',
      'hero.lead': 'Saya Muhammad Nawal Fajar Riyadi, berkarya dengan nama KUROZ4PH. Saya membuat antarmuka responsif dan pengalaman web kreatif dengan HTML, CSS, dan JavaScript, dengan perhatian khusus pada detail yang bergerak.',
      'hero.cta.projects': 'Jelajahi Proyek',
      'hero.cta.contact': 'Hubungi Saya',
      'hero.scroll': 'Gulir',

      'hud.title': 'Profil operator',
      'hud.name': 'Nama',
      'hud.role': 'Peran',
      'hud.role.v': 'Frontend Developer',
      'hud.community': 'Komunitas',
      'hud.community.v': 'Pendiri, Deraclas Community',
      'hud.base': 'Domisili',
      'hud.time': 'Waktu lokal',
      'hud.f1': 'UI interaktif',
      'hud.f2': 'Situs responsif',
      'hud.f3': 'Frontend kreatif',

      'about.kicker': '02 // TENTANG',
      'about.title': 'Frontend developer yang suka detail interaktif.',
      'about.p1': 'Saya Muhammad Nawal Fajar Riyadi, seorang frontend developer yang berkarya dengan nama KUROZ4PH. Saya senang mengubah ide menjadi antarmuka yang bisa dijelajahi: situs web responsif, eksperimen frontend kreatif, dan alat digital.',
      'about.p2': 'Saya adalah pendiri Deraclas Community, dan beberapa proyek di bawah ini dibuat untuknya. Saya suka langsung mencoba: membangunnya, menjajal teknik baru, lalu menyempurnakannya.',
      'about.focus': 'Area fokus',
      'about.f1.t': 'Antarmuka interaktif',
      'about.f1.d': 'UI yang merespons penggunanya, lengkap dengan gerak, umpan balik, dan state yang dipikirkan matang.',
      'about.f2.t': 'Situs web responsif',
      'about.f2.d': 'Tata letak yang tetap rapi dari layar Android kecil hingga layar desktop besar.',
      'about.f3.t': 'Eksperimen kreatif',
      'about.f3.d': 'Canvas, animasi, dan ide bernuansa shader yang dijelajahi lewat prototipe kecil.',
      'about.f4.t': 'Alat digital',
      'about.f4.d': 'Aplikasi web praktis dan utilitas komunitas, dari katalog hingga bot.',

      'skills.kicker': '03 // KEAHLIAN',
      'skills.title': 'Alat yang saya gunakan',
      'skills.lead': 'Label keahlian yang dikelompokkan per area: gambaran dari apa yang saya pakai, bukan daftar sertifikasi.',
      'skills.c1': 'Frontend',
      'skills.c2': 'Styling',
      'skills.c3': 'Pengembangan kreatif',
      'skills.c4': 'Alat & platform',
      'skills.s.responsive': 'Desain UI responsif',
      'skills.s.animation': 'Animasi',
      'skills.note': 'WebGL / GLSL dipakai ketika proyek membutuhkannya.',

      'projects.kicker': '04 // ARSIP & DEPLOYMENT',
      'projects.index': 'SYS.INDEX // {n} ENTRI',
      'projects.title': 'Karya Pilihan & Eksperimen Digital',
      'projects.lead': 'Aplikasi produksi, sistem frontend kreatif, dan alat komunitas yang dibangun dengan presisi teknis tinggi dan imersi sinematik.',
      'projects.stat.total': 'Proyek',
      'projects.stat.demos': 'Demo publik',
      'projects.filters': 'Kategori proyek',
      'projects.sort': 'Urutan: Release Matrix',
      'projects.status': 'Menampilkan {n} dari {total} proyek',
      'filter.all': 'Semua Proyek',
      'filter.web-apps': 'Aplikasi Web',
      'filter.creative-tech': 'Teknologi Kreatif',
      'filter.community': 'Platform Komunitas',

      'card.inspect': 'Lihat Spesifikasi',
      'card.inspect.aria': 'Lihat spesifikasi: {title}',
      'card.github': 'GitHub',
      'card.github.aria': '{title} di GitHub (dibuka di tab baru)',
      'card.demo': 'Demo langsung',
      'card.demo.aria': 'Demo langsung {title} (dibuka di tab baru)',
      'card.nodemo': 'Belum ada demo publik',

      'modal.blueprint': 'Cetak Biru Proyek',
      'modal.suffix': 'Spesifikasi Arsitektur',
      'modal.close': 'Tutup',
      'modal.dismiss': 'Tutup Tampilan',
      'modal.stack': 'Stack',
      'modal.categories': 'Kategori',
      'modal.palette': 'Manifest Palet Subsistem',
      'modal.notes': 'Catatan proyek ditulis oleh pemilik situs dan belum diverifikasi secara independen.',
      'modal.github': 'Lihat GitHub',
      'modal.demo': 'Buka demo langsung',

      'cta.title': 'Butuh Arsitektur yang Dirancang Khusus?',
      'cta.text': 'Terbuka untuk proyek antarmuka frontend interaktif, visualizer WebGL, dan platform web.',
      'cta.button': 'Mulai Komunikasi',

      'socials.kicker': '05 // SOSIAL',
      'socials.title': 'Temui saya di web',
      'socials.lead': 'Ikuti karya saya, sapa saya, atau lihat apa yang sedang saya eksperimenkan.',
      'socials.github.d': 'Kode dan repositori',
      'socials.tiktok.d': 'Video',
      'socials.instagram.d': 'Foto dan pembaruan',
      'socials.telegram.d': 'Ngobrol langsung',

      'contact.kicker': '06 // KONTAK',
      'contact.title': 'Mari membangun sesuatu bersama.',
      'contact.lead': 'Punya ide, kolaborasi, atau pertanyaan? Kirim pesan. Saat ini Telegram adalah cara termudah untuk menghubungi saya.',
      'contact.telegram': 'Kirim pesan di Telegram',
      'contact.github': 'Lihat GitHub saya',
      'contact.email': 'Kirim email',

      'footer.tagline': 'Eksperimen frontend sinematik oleh Muhammad Nawal Fajar Riyadi.',
      'footer.nav': 'Bagian',
      'footer.social': 'Tautan sosial',
      'footer.l.github': 'GitHub (dibuka di tab baru)',
      'footer.l.tiktok': 'TikTok (dibuka di tab baru)',
      'footer.l.instagram': 'Instagram (dibuka di tab baru)',
      'footer.l.telegram': 'Telegram (dibuka di tab baru)',
      'footer.rights': '© {year} Muhammad Nawal Fajar Riyadi.',
      'footer.built': 'Dibangun dengan HTML, Tailwind CSS, dan JavaScript murni.',
      'footer.top': 'Kembali ke atas',

      'audio.region': 'Pemutar audio',
      'audio.title': 'Audio Telemetry',
      'audio.open': 'Buka pemutar audio',
      'audio.collapse': 'Ciutkan pemutar audio',
      'audio.seek': 'Geser posisi',
      'audio.prev': 'Lagu sebelumnya',
      'audio.play': 'Putar',
      'audio.pause': 'Jeda',
      'audio.replay': 'Putar ulang',
      'audio.retry': 'Coba lagi',
      'audio.next': 'Lagu berikutnya',
      'audio.mute': 'Bisukan',
      'audio.unmute': 'Bunyikan',
      'audio.volume': 'Volume',
      'audio.state.loading': 'Memuat',
      'audio.state.playing': 'Diputar',
      'audio.state.paused': 'Dijeda',
      'audio.state.idle': 'Siap',
      'audio.state.ended': 'Selesai',
      'audio.state.error': 'Galat',
      'audio.state.unavailable': 'Offline',
      'audio.none': 'Audio tidak tersedia',
      'audio.none.text': 'Belum ada lagu yang ditambahkan.',
      'audio.track': 'Lagu {n} dari {total}',
      'audio.err': 'Lagu ini tidak dapat dimuat.',
      'audio.err.all': 'Tidak ada lagu dalam daftar yang dapat dimuat.',
      'audio.blocked': 'Pemutaran diblokir oleh browser. Tekan putar untuk mencoba lagi.',
      'audio.live.playing': 'Memutar {title}',
      'audio.live.paused': 'Dijeda',

      'pal.title': 'Palet perintah',
      'pal.placeholder': 'Ketik perintah atau cari…',
      'pal.search': 'Cari perintah',
      'pal.list': 'Perintah',
      'pal.empty': 'Tidak ada perintah yang cocok',
      'pal.hint.nav': 'navigasi',
      'pal.hint.select': 'pilih',
      'pal.hint.close': 'tutup',
      'pal.results': '{n} perintah tersedia',
      'pal.g.navigate': 'Navigasi',
      'pal.g.appearance': 'Tampilan',
      'pal.g.language': 'Bahasa',
      'pal.g.links': 'Tautan',
      'pal.g.system': 'Sistem',
      'pal.go': 'Ke {name}',
      'pal.theme': 'Ganti tema',
      'pal.lang.en': 'Ganti bahasa ke English',
      'pal.lang.id': 'Ganti bahasa ke Bahasa Indonesia',
      'pal.github': 'Buka profil GitHub',
      'pal.intro': 'Putar ulang intro',
    },
  };

  var LANGS = ['en', 'id'];
  var lang = 'en';
  var listeners = [];

  function interpolate(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
    });
  }

  /** Translate a key. Falls back to English, then to the key itself. */
  function t(key, vars) {
    var table = dict[lang] || dict.en;
    var str = table[key];
    if (str == null) str = dict.en[key];
    if (str == null) return key;
    return interpolate(str, vars);
  }

  /** Pick the current language from a { en: '…', id: '…' } object (used by project data). */
  function pick(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] != null ? obj[lang] : obj.en != null ? obj.en : '';
  }

  function apply(root) {
    root = root || document;
    var vars = { year: new Date().getFullYear() };

    util.$$('[data-i18n]', root).forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'), vars);
    });

    util.$$('[data-i18n-attr]', root).forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i < 1) return;
        el.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim(), vars));
      });
    });

    if (root === document) {
      document.title = t('meta.title');
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', t('meta.description'));
    }
  }

  function markButtons() {
    util.$$('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
  }

  function setLang(next, opts) {
    if (LANGS.indexOf(next) === -1) return;
    var changed = next !== lang;
    lang = next;
    document.documentElement.lang = lang;
    if (!(opts && opts.persist === false)) util.local.set('kz-lang', lang);
    apply(document);
    markButtons();
    if (changed || (opts && opts.force)) {
      listeners.forEach(function (fn) {
        try { fn(lang); } catch (e) { if (window.console) console.error(e); }
      });
    }
  }

  function init() {
    var saved = util.local.get('kz-lang');
    var initial = LANGS.indexOf(saved) !== -1 ? saved : 'en';
    lang = 'en';
    setLang(initial, { persist: false, force: true });
  }

  KZ.i18n = {
    dict: dict,
    languages: LANGS,
    t: t,
    pick: pick,
    apply: apply,
    setLang: setLang,
    get lang() { return lang; },
    onChange: function (fn) { listeners.push(fn); },
    init: init,
  };
})();
