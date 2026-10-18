/**
 * projects.js — project data, gallery rendering, category filters and the detail modal.
 *
 * ┌─ HOW TO EDIT ───────────────────────────────────────────────────────────────┐
 * │ • Add, remove or reorder projects in the PROJECTS array below. Counts, the  │
 * │   filter buttons and the header stats are generated from this data.         │
 * │ • `links.github`: URL of the project's repository. It currently points at   │
 * │   the GitHub profile because no per-project repo URLs were supplied.        │
 * │ • `links.demo`: URL of a public live demo. Leave it as `null` and the card  │
 * │   shows "No public demo" instead of a dead button. Never guess a URL.       │
 * │ • Text fields are { en, id } pairs. Brand and technology names stay as is.  │
 * │ • Preview images are the original Stitch illustrations (remote URLs). Put   │
 * │   your own files in assets/images/ and point `image.src` at them, e.g.      │
 * │   'assets/images/deraclas-hub.webp'. See README.md.                         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
(function () {
  'use strict';

  var KZ = (window.KZ = window.KZ || {});
  var util = KZ.util;

  var GITHUB = 'https://github.com/nawwtech';

  /** Filter categories, in display order. Labels come from i18n (`filter.<id>`). */
  var CATEGORIES = ['web-apps', 'creative-tech', 'community'];

  var PROJECTS = [
    {
      id: 'deraclas-hub',
      code: '001',
      categories: ['community', 'web-apps'],
      featured: true,
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTuDZsZN4QWnicYoIZm0QdWkf5eAaDqVqD0B61JdrmF8jnhX5HgURZZpN3jf3l3Suv9z7ILGTpsCTVt43NlxUa8BNnC4tOk3D9M1ke6zi1JYANgRoqAC4Qz6HkzZvP1v1r2JsOBcznVT4Univwfc44zhdvAV30sgB2kXwdJwQe2r0h4FHwW9fcLVoo3eNd9iBpAgmRO-oXch5sMcVvdTGG_FLvDupvo5380GtwcOec',
        alt: {
          en: 'Illustration of a dark community dashboard with purple neon data lines',
          id: 'Ilustrasi dasbor komunitas gelap dengan garis data neon ungu',
        },
      },
      modalImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmImgTgw9Xniw5-bD0c08U4eXGQbd3zKp4j2CqZImWkuJEx1XmMBOwi-zhY4O0MSgxIIXRV7GawV_Y-XvPlHn4VWmQHIORMUJPK98G2Uuwz3pGRZ-UsUKqXZGcXfcW-FALMeJZBUaoT2sTybYb3CUiflZL4RH5BqxfdJcCiSdJ6x6_JDBDvy77N2mxAULQvr35fh7sOWzPS4MtqegrW-QEF7KGjadVD3Q1ZVCMDifX',
      badge: { en: 'Flagship Release', id: 'Rilis Utama' },
      badgeTone: 'secondary',
      badgePulse: true,
      stamp: 'NODE // DERACLAS-HUB',
      kind: { en: 'SYSTEM PLATFORM', id: 'PLATFORM SISTEM' },
      meta: { en: 'Deraclas', id: 'Deraclas' },
      metaTone: 'outline',
      accent: 'primary',
      hover: 'hover:shadow-[0_12px_48px_-12px_rgba(124,58,237,0.35)]',
      title: { en: 'Deraclas Community Hub', id: 'Deraclas Community Hub' },
      description: {
        en: 'The centralized nexus for developers, designers, and creative technologist guilds. Features unified authentication, real-time telemetry, collaborative repository showcases, and a streamlined event broadcast matrix.',
        id: 'Pusat terpadu bagi developer, desainer, dan guild teknolog kreatif. Menampilkan autentikasi terpadu, telemetri real-time, etalase repositori kolaboratif, dan matriks siaran acara yang efisien.',
      },
      stack: [
        { label: 'React 18' },
        { label: 'Tailwind CSS' },
        { label: 'Supabase DB' },
        { label: 'Node.js Engine' },
        { label: 'WebSocket Live', accent: true },
      ],
      specs: [
        {
          label: { en: 'Rendering Strategy', id: 'Strategi Rendering' },
          value: { en: 'Hybrid SSR / SPA', id: 'Hybrid SSR / SPA' },
          text: {
            en: 'Instant cached static generation paired with edge hydration for live user streams.',
            id: 'Static generation ter-cache yang instan, dipadukan dengan edge hydration untuk aliran pengguna langsung.',
          },
        },
        {
          label: { en: 'State Engine', id: 'Mesin State' },
          value: { en: 'Zustand + SWR', id: 'Zustand + SWR' },
          tone: 'secondary',
          text: {
            en: 'Deterministic local mutations with optimistic UI updates over WebSocket pipelines.',
            id: 'Mutasi lokal yang deterministik dengan pembaruan UI optimistis lewat pipeline WebSocket.',
          },
        },
        {
          label: { en: 'Security Protocol', id: 'Protokol Keamanan' },
          value: { en: 'Row Level Security', id: 'Row Level Security' },
          tone: 'primary',
          text: {
            en: 'PostgreSQL-level policies enforced on every payload via Supabase Auth tokens.',
            id: 'Kebijakan tingkat PostgreSQL diterapkan pada setiap payload melalui token Supabase Auth.',
          },
        },
      ],
      palette: [
        { name: { en: 'Primary', id: 'Primer' }, hex: '#D0BCFF', ink: '#3C0091' },
        { name: { en: 'Cyan Node', id: 'Node Cyan' }, hex: '#4CD7F6', ink: '#003640' },
        { name: { en: 'Surface High', id: 'Permukaan Tinggi' }, hex: '#2A292D', ink: '#E5E1E6' },
        { name: { en: 'Void Base', id: 'Dasar Void' }, hex: '#0E0E11', ink: '#E5E1E6' },
      ],
      links: { github: GITHUB, demo: null },
    },

    {
      id: 'cybernetic-audio-engine',
      code: '002',
      categories: ['creative-tech'],
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiwOOdiapEvRqQO3EEBizFPPDgivNcw8HLYUbZibpBVsZvbC1d65mpJhUNjzVtINwpRb2hTTm9w4WEwVfrWinSa0rgkFk65hWTFKrH1KmAMH9-kIZuU7onf9SXsIXV70qlg5OzWto8YauUCabFW_oX9tfjCc3PcKttkxF6JohJ8wfICWnzOOfobgAbRwjRYGzn-7AsWeRpunc8iUrSPsHGOZW1kVEG3z-vPXw2siNS',
        alt: {
          en: 'Illustration of a neon cyan and violet audio spectrum visualizer on a dark floor',
          id: 'Ilustrasi visualizer spektrum audio neon cyan dan ungu di atas lantai gelap',
        },
      },
      badge: { en: 'AUDIO // GLSL EXPERIMENT', id: 'AUDIO // EKSPERIMEN GLSL' },
      badgeTone: 'secondary',
      stamp: 'REALTIME CANVAS',
      stampPulse: true,
      kind: { en: 'SOUND MATRIX', id: 'MATRIKS SUARA' },
      meta: { en: 'Web Audio API', id: 'Web Audio API' },
      metaTone: 'primary',
      accent: 'secondary',
      hover: 'hover:shadow-[0_8px_32px_-8px_rgba(76,215,246,0.25)]',
      title: { en: 'Cybernetic Audio Engine', id: 'Cybernetic Audio Engine' },
      description: {
        en: 'Low-latency sound synthesis and procedural spectral visualization engine. Translates micro-frequencies into responsive vector orbitals using WebGL custom fragment shaders.',
        id: 'Mesin sintesis suara berlatensi rendah dan visualisasi spektral prosedural. Menerjemahkan mikro-frekuensi menjadi orbital vektor responsif menggunakan fragment shader WebGL kustom.',
      },
      stack: [{ label: 'Next.js' }, { label: 'GLSL Canvas' }, { label: 'Tone.js' }],
      specs: [
        {
          label: { en: 'Audio engine', id: 'Mesin audio' },
          value: { en: 'Web Audio API + Tone.js', id: 'Web Audio API + Tone.js' },
        },
        {
          label: { en: 'Visual layer', id: 'Lapisan visual' },
          value: { en: 'WebGL fragment shaders (GLSL)', id: 'Fragment shader WebGL (GLSL)' },
          tone: 'secondary',
        },
        {
          label: { en: 'Framework', id: 'Framework' },
          value: { en: 'Next.js', id: 'Next.js' },
          tone: 'primary',
        },
      ],
      links: { github: GITHUB, demo: null },
    },

    {
      id: 'kuro-portfolio-iterations',
      code: '003',
      categories: ['creative-tech'],
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm5T7PLfIw3yqcC8IxPPQbn1tHaWcBYc_FQHQjTwxywKsT7gZWJLMrHidrDvhSmH1QHqfvUQYJNKFYGEbhIhpd7cLQc3XrSUBUqqHWZ7gKAcFxoXERH5anMe6UGVD8dSxumMMdRlSQXNVI-d2Of7uhrbzplwvCv5atG5antKqaRAx6ohk0lRxULnyQdKG3-89UoyC2uYmIX0A7szke524K-dGemh_iFho2VUzN2yrU',
        alt: {
          en: 'Illustration of a minimalist dark interface with glowing violet cursor trails and a coordinate HUD',
          id: 'Ilustrasi antarmuka gelap minimalis dengan jejak kursor ungu bercahaya dan HUD koordinat',
        },
      },
      badge: { en: 'REPRESENTATIONAL HUD', id: 'HUD REPRESENTASI' },
      badgeTone: 'primary',
      kind: { en: 'IDENTITY', id: 'IDENTITAS' },
      meta: { en: 'v1.0 & v2.6', id: 'v1.0 & v2.6' },
      metaTone: 'tertiary',
      accent: 'primary',
      hover: 'hover:shadow-[0_8px_32px_-8px_rgba(208,188,255,0.25)]',
      title: { en: 'KURO Portfolio Iterations', id: 'Iterasi Portofolio KURO' },
      description: {
        en: 'Generative personal interface exploring aerospace telemetry, magnetic cursor interactions, and responsive modular micro-grids with dark cosmic typography.',
        id: 'Antarmuka personal generatif yang mengeksplorasi telemetri kedirgantaraan, interaksi kursor magnetik, dan micro-grid modular responsif dengan tipografi kosmik gelap.',
      },
      stack: [{ label: 'Vite' }, { label: 'Tailwind' }],
      specs: [
        {
          label: { en: 'Versions', id: 'Versi' },
          value: { en: 'v1.0 & v2.6', id: 'v1.0 & v2.6' },
        },
        {
          label: { en: 'Interaction', id: 'Interaksi' },
          value: { en: 'Magnetic cursor + micro-grids', id: 'Kursor magnetik + micro-grid' },
          tone: 'secondary',
        },
        {
          label: { en: 'Tooling', id: 'Tooling' },
          value: { en: 'Vite + Tailwind', id: 'Vite + Tailwind' },
          tone: 'primary',
        },
      ],
      links: { github: GITHUB, demo: null },
    },

    {
      id: 'anime-manga-tracker',
      code: '004',
      categories: ['web-apps'],
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvzkjfrX5idZVQrPC0VYsZTpUMCQ4DnPgBl5hwaPTzSw5t8FL9yeZgH1i1hWylA4849pnXOeI1lfFEmjtYFzb7tLL936h-fctvJTuBFOSV8HuS7FwyYP8MRIiZadDzDVsakk20JLqLvNgs6CqsJ4NSeuC5-D_U3bjqyEguLQaLOYl1ThmSmch2ultW6vXm3I-lLSlXh_2tHuHXosZdBmdT6uedPL1levqlxefT4rcL',
        alt: {
          en: 'Illustration of a dark anime catalog interface with cyan and magenta backlit cards',
          id: 'Ilustrasi antarmuka katalog anime gelap dengan kartu berlampu belakang cyan dan magenta',
        },
      },
      badge: { en: 'MEDIA CLIENT', id: 'KLIEN MEDIA' },
      badgeTone: 'secondary',
      kind: { en: 'CATALOG', id: 'KATALOG' },
      meta: { en: 'GraphQL API', id: 'GraphQL API' },
      metaTone: 'outline',
      accent: 'primary',
      hover: 'hover:shadow-[0_8px_32px_-8px_rgba(160,120,255,0.25)]',
      title: { en: 'Anime & Manga Tracker Suite', id: 'Anime & Manga Tracker Suite' },
      description: {
        en: 'Real-time media discovery engine with debounced fuzzy search, custom progress journals, dynamic episode notifications, and personalized watchlist synchronization.',
        id: 'Mesin penemuan media real-time dengan fuzzy search ber-debounce, jurnal progres kustom, notifikasi episode dinamis, dan sinkronisasi watchlist yang dipersonalisasi.',
      },
      stack: [{ label: 'React' }, { label: 'Anilist API' }, { label: 'IndexedDB' }],
      specs: [
        {
          label: { en: 'Data source', id: 'Sumber data' },
          value: { en: 'Anilist API (GraphQL)', id: 'Anilist API (GraphQL)' },
        },
        {
          label: { en: 'Local storage', id: 'Penyimpanan lokal' },
          value: { en: 'IndexedDB', id: 'IndexedDB' },
          tone: 'secondary',
        },
        {
          label: { en: 'Search', id: 'Pencarian' },
          value: { en: 'Debounced fuzzy search', id: 'Fuzzy search ber-debounce' },
          tone: 'primary',
        },
      ],
      links: { github: GITHUB, demo: null },
    },

    {
      id: 'deraclas-bot-suite',
      code: '005',
      categories: ['community'],
      image: {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGYXv2VmQIUy4MW-olNnhXFGVrWB-6Pijv1qS68-muyT-0hRfdnnDptvXuaCBYWulTirmos0BWVwph8enHIvZ6_MxabxxaOTaznmF5SLDSx6XeVG96Mj98B9uWADz4ieJ4EzIHxQNbbrOMqwx_rput60H3KuAxfrCH9SqjBVbGBRbjI-MoWZCzYgPCgWwm1fTciehAqUz14GMl71FOsz7Bh-BLELJmgNjoSKmp_cg1',
        alt: {
          en: 'Illustration of a bot admin console with a server status graph and violet terminal logs',
          id: 'Ilustrasi konsol admin bot dengan grafik status server dan log terminal ungu',
        },
      },
      badge: { en: 'AUTOMATION NODE', id: 'NODE OTOMASI' },
      badgeTone: 'tertiary',
      kind: { en: 'BACKEND BOT', id: 'BOT BACKEND' },
      meta: { en: 'Discord.js v14', id: 'Discord.js v14' },
      metaTone: 'secondary',
      accent: 'secondary',
      hover: 'hover:shadow-[0_8px_32px_-8px_rgba(76,215,246,0.25)]',
      title: { en: 'Deraclas Automated Bot Suite', id: 'Deraclas Automated Bot Suite' },
      // The original Stitch copy said "powering 1,500+ active guild members". That is a user count that has
      // not been verified, so it is left out. Restore it here only if you can back it up.
      description: {
        en: 'Multi-purpose bot infrastructure for community guilds, with algorithmic moderation, dynamic voice channels, web player streams, and custom role gamification.',
        id: 'Infrastruktur bot serbaguna untuk guild komunitas, dengan moderasi algoritmik, voice channel dinamis, streaming web player, dan gamifikasi role kustom.',
      },
      stack: [{ label: 'Node.js' }, { label: 'Redis' }, { label: 'Lavalink' }],
      specs: [
        {
          label: { en: 'Runtime', id: 'Runtime' },
          value: { en: 'Node.js + Discord.js v14', id: 'Node.js + Discord.js v14' },
        },
        {
          label: { en: 'Data layer', id: 'Lapisan data' },
          value: { en: 'Redis', id: 'Redis' },
          tone: 'secondary',
        },
        {
          label: { en: 'Audio streaming', id: 'Streaming audio' },
          value: { en: 'Lavalink', id: 'Lavalink' },
          tone: 'primary',
        },
      ],
      links: { github: GITHUB, demo: null },
    },
  ];

  /* ------------------------------------------------------------------ *
   * Class maps. Full class names are written out so Tailwind can see them.
   * ------------------------------------------------------------------ */
  var SPAN = {
    12: 'lg:col-span-12',
    7: 'lg:col-span-7',
    6: 'lg:col-span-6',
    5: 'lg:col-span-5',
  };
  var TONE = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
    outline: 'text-outline',
  };
  var TITLE_HOVER = {
    primary: 'group-hover:text-primary',
    secondary: 'group-hover:text-secondary',
  };

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  function T(key, vars) { return KZ.i18n.t(key, vars); }
  function P(obj) { return KZ.i18n.pick(obj); }
  var esc = util.escapeHtml;

  function icon(name, cls) {
    return '<svg class="icon ' + (cls || 'h-[18px] w-[18px]') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }

  function categoryCount(id) {
    if (id === 'all') return PROJECTS.length;
    return PROJECTS.filter(function (p) { return p.categories.indexOf(id) !== -1; }).length;
  }

  function demoCount() {
    return PROJECTS.filter(function (p) { return !!(p.links && p.links.demo); }).length;
  }

  function findProject(id) {
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].id === id) return PROJECTS[i];
    return null;
  }

  function visibleProjects(filter) {
    if (!filter || filter === 'all') return PROJECTS.slice();
    return PROJECTS.filter(function (p) { return p.categories.indexOf(filter) !== -1; });
  }

  /**
   * Asymmetric gallery layout. A featured project leads on a full row; the rest run in
   * alternating 7/5 and 6/6 rows; a lone leftover card takes a full row.
   */
  function computeLayout(list) {
    var spans = [];
    var i = 0;
    if (list.length && list[0].featured) { spans.push(12); i = 1; }
    var row = 0;
    while (i < list.length) {
      if (list.length - i === 1) { spans.push(12); i += 1; break; }
      var pair = row % 2 === 0 ? [7, 5] : [6, 6];
      spans.push(pair[0], pair[1]);
      i += 2;
      row += 1;
    }
    return spans;
  }

  /* ------------------------------------------------------------------ *
   * Rendering
   * ------------------------------------------------------------------ */
  function imageHtml(src, alt) {
    return '<img class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" src="' +
      esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">';
  }

  function linksHtml(p, title) {
    var out = '';
    var gh = p.links && p.links.github;
    var demo = p.links && p.links.demo;
    if (gh) {
      out += '<a class="btn btn-ghost shadow-sm" href="' + esc(gh) + '" target="_blank" rel="noopener noreferrer" aria-label="' +
        esc(T('card.github.aria', { title: title })) + '">' + icon('code') + '<span>' + esc(T('card.github')) + '</span></a>';
    }
    if (demo) {
      out += '<a class="btn btn-ghost shadow-sm" href="' + esc(demo) + '" target="_blank" rel="noopener noreferrer" aria-label="' +
        esc(T('card.demo.aria', { title: title })) + '">' + icon('external') + '<span>' + esc(T('card.demo')) + '</span></a>';
    } else {
      out += '<span class="inline-flex min-h-[44px] items-center gap-space-xs px-space-xs font-label-tech text-label-tech text-outline">' +
        icon('link', 'h-4 w-4') + '<span>' + esc(T('card.nodemo')) + '</span></span>';
    }
    return out;
  }

  function cardHtml(p, span, index) {
    var title = P(p.title);
    var wide = span === 12;
    var featured = !!(p.featured && wide);
    var delay = Math.min(index, 4) * 70;

    var badge =
      '<div class="absolute left-space-md top-space-md flex max-w-[calc(100%-2rem)] items-center gap-space-xs rounded-pill bg-surface-container-lowest/90 px-space-sm py-1 shadow-md backdrop-blur-md">' +
      (p.badgePulse ? '<span class="h-2 w-2 flex-none animate-pulse rounded-full bg-secondary" aria-hidden="true"></span>' : '') +
      '<span class="truncate font-label-caps text-label-caps uppercase ' + TONE[p.badgeTone || 'secondary'] + '">' + esc(P(p.badge)) + '</span></div>';

    var stamp = '';
    if (p.stamp) {
      stamp = '<div class="absolute bottom-space-md ' + (featured ? 'left-space-md' : 'right-space-md') +
        ' flex items-center gap-1.5 rounded bg-surface-container-lowest/90 px-space-sm py-1 font-label-tech text-label-tech text-on-surface-variant backdrop-blur">' +
        (p.stampPulse ? '<span class="h-2 w-2 animate-pulse rounded-full bg-secondary" aria-hidden="true"></span>' : icon('layers', 'h-3.5 w-3.5')) +
        '<span>' + esc(p.stamp) + '</span></div>';
    }

    var media =
      '<div class="pc-media" data-fallback="PRJ.' + esc(p.code) + '">' +
      imageHtml(p.image.src, P(p.image.alt)) +
      '<div class="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/25 to-transparent" aria-hidden="true"></div>' +
      badge + stamp + '</div>';

    var chips = p.stack.map(function (s) {
      return '<li class="chip' + (s.accent ? ' bg-surface-container-high text-secondary' : '') + '">' + esc(s.label) + '</li>';
    }).join('');

    var titleCls = wide
      ? 'font-headline-md-mobile text-headline-md-mobile sm:font-headline-md sm:text-headline-md'
      : 'font-headline-sm text-headline-sm';

    var body =
      '<div class="pc-body">' +
      '<div class="flex flex-col gap-space-md">' +
      '<div class="flex items-center justify-between gap-space-sm">' +
      '<span class="font-label-caps text-label-caps ' + (wide ? 'text-tertiary' : 'text-outline') + '">PRJ. ' + esc(p.code) + ' // ' + esc(P(p.kind)) + '</span>' +
      '<span class="font-label-tech text-label-tech ' + TONE[p.metaTone || 'outline'] + '">' + esc(P(p.meta)) + '</span></div>' +
      '<h3 class="' + titleCls + ' text-on-surface transition-colors ' + TITLE_HOVER[p.accent || 'primary'] + '">' + esc(title) + '</h3>' +
      '<p class="font-body-md text-body-md text-on-surface-variant">' + esc(P(p.description)) + '</p>' +
      '<ul class="flex flex-wrap gap-1.5 pt-space-xs">' + chips + '</ul></div>' +
      '<div class="flex flex-col gap-space-sm pt-space-sm sm:flex-row sm:flex-wrap sm:items-center">' +
      '<button type="button" class="btn btn-tonal needs-js shadow-lg sm:flex-1" data-action="inspect" data-id="' + esc(p.id) + '" aria-haspopup="dialog" aria-label="' +
      esc(T('card.inspect.aria', { title: title })) + '">' + icon('eye') + '<span>' + esc(T('card.inspect')) + '</span></button>' +
      linksHtml(p, title) + '</div></div>';

    return '<article class="project-item pc panel group overflow-hidden shadow-lg transition-all duration-300 ' + SPAN[span] + ' ' + (p.hover || '') +
      '" data-reveal style="--d:' + delay + 'ms" data-project="' + esc(p.id) + '" data-layout="' + (wide ? 'wide' : 'stack') + '" data-featured="' + featured + '">' +
      media + body + '</article>';
  }

  /** HTML for the gallery cards of a filter. Pure function (also used by tools/prerender.mjs). */
  function renderCards(filter) {
    var list = visibleProjects(filter);
    var spans = computeLayout(list);
    return list.map(function (p, i) { return cardHtml(p, spans[i], i); }).join('\n');
  }

  function filterButtonsHtml(active) {
    return ['all'].concat(CATEGORIES).map(function (id) {
      var label = T('filter.' + id) + ' [' + categoryCount(id) + ']';
      return '<button type="button" class="filter-btn" data-filter="' + id + '" aria-pressed="' + (id === active ? 'true' : 'false') + '">' + esc(label) + '</button>';
    }).join('');
  }

  function modalHtml(p) {
    var title = P(p.title);
    var chips = p.stack.map(function (s) {
      return '<li class="chip' + (s.accent ? ' bg-surface-container-high text-secondary' : '') + '">' + esc(s.label) + '</li>';
    }).join('');

    var cats = p.categories.map(function (c) { return '<li class="chip text-on-surface-variant">' + esc(T('filter.' + c)) + '</li>'; }).join('');

    var specs = (p.specs || []).map(function (s) {
      return '<div class="flex flex-col gap-space-xs rounded-lg bg-surface-container p-space-md">' +
        '<dt class="font-label-caps text-label-caps uppercase text-outline">' + esc(P(s.label)) + '</dt>' +
        '<dd class="m-0 flex flex-col gap-space-xs"><span class="font-headline-sm text-headline-sm ' + (s.tone ? TONE[s.tone] : 'text-on-surface') + '">' + esc(P(s.value)) + '</span>' +
        (s.text ? '<span class="font-body-sm text-body-sm text-on-surface-variant">' + esc(P(s.text)) + '</span>' : '') + '</dd></div>';
    }).join('');

    var palette = '';
    if (p.palette && p.palette.length) {
      palette = '<div class="flex flex-col gap-space-xs"><h3 class="font-label-caps text-label-caps uppercase text-outline">' + esc(T('modal.palette')) + '</h3>' +
        '<ul class="grid grid-cols-2 gap-space-xs sm:grid-cols-4">' +
        p.palette.map(function (c) {
          return '<li class="flex items-center justify-between gap-space-xs rounded p-space-sm font-label-tech text-label-tech ring-1 ring-outline-variant/50" style="background:' +
            esc(c.hex) + ';color:' + esc(c.ink) + '"><span>' + esc(P(c.name)) + '</span><span>' + esc(c.hex) + '</span></li>';
        }).join('') + '</ul></div>';
    }

    var gh = p.links && p.links.github;
    var demo = p.links && p.links.demo;
    var actions =
      (gh ? '<a class="btn btn-ghost" href="' + esc(gh) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(T('card.github.aria', { title: title })) + '">' + icon('code') + '<span>' + esc(T('modal.github')) + '</span></a>' : '') +
      (demo
        ? '<a class="btn btn-ghost" href="' + esc(demo) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(T('card.demo.aria', { title: title })) + '">' + icon('external') + '<span>' + esc(T('modal.demo')) + '</span></a>'
        : '<span class="inline-flex min-h-[44px] items-center gap-space-xs px-space-xs font-label-tech text-label-tech text-outline">' + icon('link', 'h-4 w-4') + '<span>' + esc(T('card.nodemo')) + '</span></span>') +
      '<button type="button" class="btn btn-primary" data-modal-close>' + esc(T('modal.dismiss')) + '</button>';

    return '' +
      '<div class="flex items-start justify-between gap-space-md">' +
      '<div class="flex min-w-0 flex-col gap-1">' +
      '<div class="flex items-center gap-space-xs"><span class="h-2 w-2 flex-none rounded-full bg-secondary" aria-hidden="true"></span>' +
      '<span class="font-label-caps text-label-caps uppercase text-secondary">' + esc(T('modal.blueprint')) + ' • PRJ.' + esc(p.code) + '</span></div>' +
      '<h2 id="modal-title" class="font-headline-md-mobile text-headline-md-mobile text-on-surface sm:font-headline-md sm:text-headline-md">' + esc(title) + ' • ' + esc(T('modal.suffix')) + '</h2></div>' +
      '<button type="button" class="icon-btn h-11 w-11 flex-none" data-modal-close aria-label="' + esc(T('modal.close')) + '">' + icon('close', 'h-5 w-5') + '</button></div>' +

      '<div class="modal-media relative h-48 w-full overflow-hidden rounded-lg bg-surface-container-lowest sm:h-80" data-fallback="PRJ.' + esc(p.code) + '">' +
      '<img class="absolute inset-0 h-full w-full object-cover" src="' + esc(p.modalImage || p.image.src) + '" alt="' + esc(P(p.image.alt)) + '" decoding="async">' +
      '<div class="absolute bottom-3 left-3 rounded bg-surface-container-lowest/90 px-space-sm py-1 font-label-tech text-label-tech text-on-surface backdrop-blur">PRJ.' + esc(p.code) + ' // SPEC</div></div>' +

      '<p id="modal-desc" class="font-body-md text-body-md text-on-surface-variant">' + esc(P(p.description)) + '</p>' +

      '<div class="grid gap-space-md sm:grid-cols-2">' +
      '<div class="flex flex-col gap-space-xs"><h3 class="font-label-caps text-label-caps uppercase text-outline">' + esc(T('modal.stack')) + '</h3><ul class="flex flex-wrap gap-1.5">' + chips + '</ul></div>' +
      '<div class="flex flex-col gap-space-xs"><h3 class="font-label-caps text-label-caps uppercase text-outline">' + esc(T('modal.categories')) + '</h3><ul class="flex flex-wrap gap-1.5">' + cats + '</ul></div></div>' +

      (specs ? '<dl class="m-0 grid grid-cols-1 gap-space-md md:grid-cols-3">' + specs + '</dl>' : '') +
      palette +

      '<div class="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">' +
      '<p class="flex max-w-md items-start gap-space-sm font-label-tech text-label-tech text-outline">' + icon('alert', 'mt-0.5 h-4 w-4 flex-none') + '<span>' + esc(T('modal.notes')) + '</span></p>' +
      '<div class="flex flex-wrap items-center gap-space-sm">' + actions + '</div></div>';
  }

  /* ------------------------------------------------------------------ *
   * Behaviour (browser only)
   * ------------------------------------------------------------------ */
  var state = { filter: 'all', openId: null };
  var els = {};
  var layer = null;

  function announce(msg) {
    if (els.status) els.status.textContent = msg;
  }

  function markImageFailures(root) {
    util.$$('.pc-media img, .modal-media img', root).forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
        img.parentNode.classList.add('img-failed');
      }
    });
  }

  function renderStats() {
    var total = PROJECTS.length;
    if (els.statTotal) els.statTotal.textContent = String(total);
    if (els.statDemos) els.statDemos.textContent = demoCount() + ' / ' + total;
    if (els.index) els.index.textContent = T('projects.index', { n: util.pad2(total) });
  }

  function renderFilters() {
    els.filters.innerHTML = filterButtonsHtml(state.filter);
  }

  /** Re-derive the counts from the data without replacing the buttons (keeps keyboard focus intact). */
  function refreshCounts() {
    util.$$('[data-filter]', els.filters).forEach(function (btn) {
      var id = btn.getAttribute('data-filter');
      btn.textContent = T('filter.' + id) + ' [' + categoryCount(id) + ']';
    });
    renderStats();
  }

  function renderGrid(opts) {
    refreshCounts();
    els.grid.innerHTML = renderCards(state.filter);
    document.dispatchEvent(new CustomEvent('kz:render', { detail: { root: els.grid } }));
    if (!(opts && opts.silent)) {
      announce(T('projects.status', { n: visibleProjects(state.filter).length, total: PROJECTS.length }));
    }
  }

  function setFilter(id) {
    if (id !== 'all' && CATEGORIES.indexOf(id) === -1) id = 'all';
    state.filter = id;
    util.$$('[data-filter]', els.filters).forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-filter') === id ? 'true' : 'false');
    });
    renderGrid();
  }

  function renderModal() {
    var p = findProject(state.openId);
    if (!p) return;
    els.dialog.innerHTML = modalHtml(p);
    els.dialog.setAttribute('aria-describedby', 'modal-desc');
    markImageFailures(els.dialog);
  }

  function openModal(id, opener) {
    var p = findProject(id);
    if (!p || !layer) return false;
    state.openId = id;
    renderModal();
    layer.open(opener);
    els.dialog.scrollTop = 0;
    return true;
  }

  function closeModal() {
    if (layer) layer.close();
  }

  function init() {
    els.grid = document.getElementById('projects-grid');
    els.filters = document.getElementById('project-filters');
    els.status = document.getElementById('projects-status');
    els.statTotal = document.getElementById('stat-total');
    els.statDemos = document.getElementById('stat-demos');
    els.index = document.getElementById('projects-index');
    els.modal = document.getElementById('project-modal');
    els.dialog = document.getElementById('project-dialog');
    if (!els.grid || !els.filters || !els.modal || !els.dialog) return;

    layer = util.createLayer({
      overlay: els.modal,
      panel: els.dialog,
      initialFocus: function () { return util.$('[data-modal-close]', els.dialog) || els.dialog; },
      onClose: function () { state.openId = null; },
    });

    // Open / filter via delegated listeners so re-rendering never loses behaviour.
    els.grid.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-action="inspect"]');
      if (btn) openModal(btn.getAttribute('data-id'), btn);
    });
    els.filters.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-filter]');
      if (btn) setFilter(btn.getAttribute('data-filter'));
    });
    els.dialog.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-modal-close]')) closeModal();
    });

    // Remote preview images can fail (offline, expired URL). Swap in a neutral panel instead of a broken icon.
    function onImgError(e) {
      var img = e.target;
      if (img && img.tagName === 'IMG' && img.parentNode && img.parentNode.classList) img.parentNode.classList.add('img-failed');
    }
    els.grid.addEventListener('error', onImgError, true);
    els.dialog.addEventListener('error', onImgError, true);

    renderStats();
    renderFilters();
    renderGrid({ silent: true });
    markImageFailures(els.grid);

    KZ.i18n.onChange(function () {
      renderStats();
      renderFilters();
      renderGrid({ silent: true });
      if (state.openId) {
        var hadFocus = els.dialog.contains(document.activeElement);
        renderModal();
        if (hadFocus) (util.$('[data-modal-close]', els.dialog) || els.dialog).focus({ preventScroll: true });
      }
    });
  }

  KZ.projects = {
    data: PROJECTS,
    categories: CATEGORIES,
    renderCards: renderCards,
    computeLayout: computeLayout,
    categoryCount: categoryCount,
    demoCount: demoCount,
    visible: visibleProjects,
    init: init,
    setFilter: setFilter,
    openModal: openModal,
    closeModal: closeModal,
    get filter() { return state.filter; },
    get openId() { return state.openId; },
  };
})();
