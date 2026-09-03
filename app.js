/* Шахматка — обход квартир. Всё локально, без интернета. */
'use strict';

/* ============ иконки (Lucide, inline SVG) ============ */
var I = (function () {
  function s(p, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + p + '</svg>';
  }
  return {
    check: s('<path d="M20 6 9 17l-5-5"/>'),
    x: s('<path d="M18 6 6 18M6 6l12 12"/>'),
    minus: s('<path d="M5 12h14"/>'),
    left: s('<path d="m15 18-6-6 6-6"/>'),
    right: s('<path d="m9 18 6-6-6-6"/>'),
    home: s('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'),
    msg: s('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
    file: s('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h6"/><path d="M12 11v6"/><path d="m9 14 3 3 3-3"/>'),
    gear: s('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.08A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1"/>'),
    cam: s('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>'),
    plus: s('<path d="M12 5v14M5 12h14"/>'),
    trash: s('<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>'),
    share: s('<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>'),
    smile: s('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>'),
    dots: s('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),
    /* позиции чек-листа */
    panel: s('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h3M8 10h3M8 14h8M8 18h8"/>'),
    swtch: s('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 9h6v4H9z"/>'),
    socket: s('<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/>'),
    box: s('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>'),
    lamp: s('<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>'),
    ceil: s('<path d="M12 2v6"/><path d="M5 18a7 7 0 0 1 14 0z"/><path d="M4 18h16"/>'),
    shield: s('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    bolt: s('<path d="M13 2 3 14h8l-1 8 10-12h-8z"/>'),
    dot: s('<circle cx="12" cy="12" r="8"/>'),
    merge: s('<path d="M7 21V9a4 4 0 0 0 4 4h3"/><circle cx="7" cy="5" r="2.5"/><circle cx="17" cy="13" r="2.5"/>'),
    user: s('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    up: s('<path d="m18 15-6-6-6 6"/>'),
    down: s('<path d="m6 9 6 6 6-6"/>'),
    calc: s('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v4M8 19h4"/>')
  };
})();
/* иконку подбираем по названию, а не по порядку — иначе она едет при добавлении позиции */
var POS_ICONS = [
  [/щит|автомат/i, 'panel'],
  [/выключ/i, 'swtch'],
  [/розет/i, 'socket'],
  [/коробк/i, 'box'],
  [/бра/i, 'lamp'],
  [/люстр|светильник|свет/i, 'ceil'],
  [/куп|заземл/i, 'shield'],
  [/эффект|прозвон|провер/i, 'bolt']
];
function posIcon(name) {
  for (var i = 0; i < POS_ICONS.length; i++) if (POS_ICONS[i][0].test(name)) return I[POS_ICONS[i][1]];
  return I.dot;
}

/* ============ конфигурация по умолчанию ============ */
/* что считаем на сдельщине: штуки по квартире, цена за штуку необязательна */
var DEFAULT_COUNT = [
  { id: 'c1', n: 'Розетки', price: 0, g: 'Квартира' },
  { id: 'c2', n: 'Выключатели', price: 0, g: 'Квартира' },
  { id: 'c5', n: 'Светильники', price: 0, g: 'Квартира' },
  { id: 'c6', n: 'Розетки', price: 0, g: 'Санузел' },
  { id: 'c3', n: 'Светильники', price: 0, g: 'Санузел' },
  { id: 'c4', n: 'Бра', price: 0, g: 'Санузел' }
];

var DEFAULT_CREWS = [{ id: 'w1', n: 'Моя бригада' }];

var DEFAULT_CFG = {
  object: 'ЖК Северный',
  buildings: [
    { id: 'b1', name: 'Корпус 1', from: 1, to: 17, per: 8, first: 1 },
    { id: 'b2', name: 'Корпус 2', from: 1, to: 13, per: 8, first: 1 }
  ],
  positions: [
    { id: 'p1', n: 'Щит эл.' },
    { id: 'p2', n: 'Выключатели' },
    { id: 'p3', n: 'Розетки' },
    { id: 'p4', n: 'Коробка на плиты' },
    { id: 'p5', n: 'Бра' },
    { id: 'p6', n: 'Светильники эл', g: 'Санузел, коридор' },
    { id: 'p7', n: 'Розетки', g: 'Санузел, коридор' },
    { id: 'p8', n: 'КУП', g: 'Санузел, коридор' },
    { id: 'p9', n: 'Проверка на эффект', g: 'Санузел, коридор' }
  ]
};

/* ============ хранилище ============ */
var CFG, DATA, UI;
/* Старая копия может не знать про подсчёт и бригады — дополняем, иначе экраны,
   которые на них опираются, просто не открываются. */
function ensureCfg() {
  if (!CFG || !CFG.buildings || !CFG.buildings.length) CFG = JSON.parse(JSON.stringify(DEFAULT_CFG));
  if (!CFG.positions || !CFG.positions.length) CFG.positions = JSON.parse(JSON.stringify(DEFAULT_CFG.positions));
  if (!CFG.count || !CFG.count.length) CFG.count = JSON.parse(JSON.stringify(DEFAULT_COUNT));
  if (!CFG.crews || !CFG.crews.length) CFG.crews = JSON.parse(JSON.stringify(DEFAULT_CREWS));
  if (!CFG.object) CFG.object = DEFAULT_CFG.object;
}
/* Раньше полей было два — «Что осталось» и «Примечание». Смысла в этом не было:
   писали куда придётся, а читать приходилось оба. Осталось одно, старые
   примечания дописываются к нему при первом запуске новой версии. */
function mergeNotes() {
  var moved = 0;
  Object.keys(DATA || {}).forEach(function (bid) {
    var d = DATA[bid] || {};
    Object.keys(d).forEach(function (n) {
      var r = d[n];
      if (!r || !r.note) return;
      var t = String(r.note).trim();
      if (t) {
        r.left = r.left ? (r.left.trim() + '\n' + t) : t;
        moved++;
      }
      delete r.note;
    });
  });
  return moved;
}

/* Розетки есть и в санузле — в проекте они отдельные, влагозащищённые.
   Если подсчёт уже разбит на разделы, а такой позиции нет, добавляем её сами:
   иначе объёмы по санузлу считать нечем. */
function ensureWcSocket() {
  if (!CFG.count || !CFG.count.length) return false;
  var wc = CFG.count.filter(function (c) { return /санузел|с\/у|ванн/i.test(String(c.g || '')); });
  if (!wc.length) return false;
  if (wc.some(function (c) { return /розетк/i.test(c.n); })) return false;
  var i = CFG.count.indexOf(wc[0]);
  CFG.count.splice(i, 0, { id: 'c' + Date.now(), n: 'Розетки', price: 0, g: wc[0].g });
  return true;
}

function load() {
  try { CFG = JSON.parse(localStorage.getItem('shm_cfg')) || null; } catch (e) { CFG = null; }
  ensureCfg();
  try { DATA = JSON.parse(localStorage.getItem('shm_data')) || {}; } catch (e) { DATA = {}; }
  try { UI = JSON.parse(localStorage.getItem('shm_ui')) || {}; } catch (e) { UI = {}; }
  if (mergeNotes()) save();
  if (ensureWcSocket()) save();
  if (!UI.b) UI.b = CFG.buildings[0].id;
  if (UI.floor == null) UI.floor = CFG.buildings[0].from;
  UI.tab = UI.tab || 'obj';
  if (!UI.crew || !CFG.crews.some(function (w) { return w.id === UI.crew; })) UI.crew = CFG.crews[0].id;
}
var saveT;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(function () {
    localStorage.setItem('shm_cfg', JSON.stringify(CFG));
    localStorage.setItem('shm_data', JSON.stringify(DATA));
    localStorage.setItem('shm_ui', JSON.stringify(UI));
  }, 120);
}

/* фото — в IndexedDB, чтобы не забивать localStorage */
var idb = (function () {
  var p = null;
  function db() {
    if (p) return p;
    p = new Promise(function (res, rej) {
      var r = indexedDB.open('shm_photos', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('ph'); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return p;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var t = d.transaction('ph', mode), st = t.objectStore('ph'), out;
        out = fn(st);
        t.oncomplete = function () { res(out && out.result !== undefined ? out.result : out); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  return {
    put: function (k, v) { return tx('readwrite', function (s) { s.put(v, k); }); },
    get: function (k) { return tx('readonly', function (s) { return s.get(k); }); },
    del: function (k) { return tx('readwrite', function (s) { s.delete(k); }); },
    all: function () {
      return db().then(function (d) {
        return new Promise(function (res) {
          var t = d.transaction('ph', 'readonly'), s = t.objectStore('ph'), out = {};
          s.openCursor().onsuccess = function (e) {
            var c = e.target.result;
            if (c) { out[c.key] = c.value; c.continue(); } else res(out);
          };
        });
      });
    }
  };
})();
/* Фото в памяти держим только те, что сейчас на экране: при паре сотен снимков
   всё разом — это десятки мегабайт, и телефон перестаёт откликаться. */
var PH = {}, PHQ = [], PH_MAX = 24;
function cachePhoto(id, url) {
  if (!PH[id]) PHQ.push(id);
  PH[id] = url;
  while (PHQ.length > PH_MAX) {
    var k = PHQ.shift();
    if (k !== id) delete PH[k];
  }
}
function getPhoto(id) {
  if (PH[id]) return Promise.resolve(PH[id]);
  return idb.get(id).then(function (url) {
    if (url) cachePhoto(id, url);
    return url;
  }).catch(function () { return null; });
}
function dropPhoto(id) {
  [id, 't_' + id].forEach(function (k) {
    delete PH[k];
    var i = PHQ.indexOf(k);
    if (i >= 0) PHQ.splice(i, 1);
    idb.del(k);
  });
}
/* Для списков держим отдельное маленькое превью: полноразмерный снимок в
   развёрнутом виде занимает мегабайты, а на экране он размером с ноготь.
   Превью считается один раз и лежит рядом в базе. */
var THUMB_PX = 240;
function getThumb(id) {
  var key = 't_' + id;
  if (PH[key]) return Promise.resolve(PH[key]);
  return idb.get(key).then(function (u) {
    if (u) { cachePhoto(key, u); return u; }
    return idb.get(id).then(function (full) {
      if (!full) return null;
      return loadImg(full).then(function (img) {
        var f = fit(img.width, img.height, THUMB_PX, THUMB_PX);
        var cv = document.createElement('canvas');
        cv.width = f.w; cv.height = f.h;
        cv.getContext('2d').drawImage(img, 0, 0, f.w, f.h);
        var url = cv.toDataURL('image/jpeg', 0.7);
        idb.put(key, url);
        cachePhoto(key, url);
        return url;
      });
    });
  }).catch(function () { return null; });
}

/* Картинки подставляем только когда они реально видны, и убираем при уходе
   за экран — иначе двести миниатюр разом съедают всю память телефона. */
var phObserver = null;
function hydratePhotos() {
  var imgs = app.querySelectorAll('img[data-ph]');
  if (!imgs.length) return;
  if (!('IntersectionObserver' in window)) {
    imgs.forEach(function (img) { getThumb(img.dataset.ph).then(function (u) { if (u) img.src = u; }); });
    return;
  }
  if (phObserver) phObserver.disconnect();
  phObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var img = e.target;
      if (e.isIntersecting) {
        if (!img.getAttribute('src')) {
          getThumb(img.dataset.ph).then(function (u) { if (u) img.src = u; });
        }
      } else if (img.getAttribute('src')) {
        img.removeAttribute('src');
      }
    });
  }, { root: null, rootMargin: '300px 0px' });
  imgs.forEach(function (img) { phObserver.observe(img); });
}

/* ============ вспомогательное ============ */
function bld(id) { return CFG.buildings.filter(function (b) { return b.id === (id || UI.b); })[0] || CFG.buildings[0]; }
function floors(b) { var a = []; for (var f = b.from; f <= b.to; f++) a.push(f); return a; }
/* сколько квартир на этаже: обычно b.per, но у отдельных этажей бывает своё */
function perOf(b, f) {
  return (b.ex && b.ex[f] != null) ? b.ex[f] : b.per;
}
function flatsOf(b, f) {
  var a = [], start = b.first;
  for (var x = b.from; x < f; x++) start += perOf(b, x);
  for (var i = 0; i < perOf(b, f); i++) a.push(start + i);
  return a;
}
/* «18-20:10, 5:8» <-> {18:10, 19:10, 20:10, 5:8} */
function exToText(ex) {
  if (!ex) return '';
  var ks = Object.keys(ex).map(Number).sort(function (a, z) { return a - z; });
  var out = [], i = 0;
  while (i < ks.length) {
    var j = i;
    while (j + 1 < ks.length && ks[j + 1] === ks[j] + 1 && ex[ks[j + 1]] === ex[ks[i]]) j++;
    out.push((i === j ? ks[i] : ks[i] + '-' + ks[j]) + ':' + ex[ks[i]]);
    i = j + 1;
  }
  return out.join(', ');
}
function textToEx(s) {
  var ex = {};
  String(s || '').split(/[,;]/).forEach(function (part) {
    var m = part.trim().match(/^(\d+)\s*(?:-\s*(\d+))?\s*:\s*(\d+)$/);
    if (!m) return;
    var a = +m[1], z = m[2] ? +m[2] : a, n = +m[3];
    if (n < 1 || z < a) return;
    for (var f = a; f <= z; f++) ex[f] = n;
  });
  return Object.keys(ex).length ? ex : null;
}
function allFlats(b) {
  var a = [];
  floors(b).forEach(function (f) { flatsOf(b, f).forEach(function (n) { a.push({ f: f, n: n }); }); });
  return a;
}
function rec(bid, n, create) {
  DATA[bid] = DATA[bid] || {};
  if (!DATA[bid][n] && create) DATA[bid][n] = { st: {}, q: {}, left: '', note: '', crit: false, ph: [], ts: 0 };
  if (DATA[bid][n] && !DATA[bid][n].q) DATA[bid][n].q = {};
  return DATA[bid][n];
}
/* ---- подсчёт на сдельщине ---- */
function qOf(r, cid) { return (r && r.q && r.q[cid]) || 0; }
/* когда последний раз трогали приёмку этой квартиры (подсчёт сюда не входит) */
function touchIssue(r) { r.sts = Date.now(); r.ts = r.sts; }
function issueTs(r) {
  if (!r) return 0;
  if (r.sts) return r.sts;
  /* Старые записи: до разделения подсчёт двигал то же время. Если оно совпадает
     с последним нажатием в подсчёте — про приёмку оно ничего не говорит. */
  var lastQ = 0;
  (r.lg || []).forEach(function (e) { if (e.t > lastQ) lastQ = e.t; });
  if (r.qts && r.qts > lastQ) lastQ = r.qts;
  if (lastQ && Math.abs(lastQ - (r.ts || 0)) < 120000) return 0;
  return r.ts || 0;
}
function qTotal(r) {
  var s = 0;
  CFG.count.forEach(function (c) { s += qOf(r, c.id); });
  return s;
}
function qMoney(r) {
  var s = 0;
  CFG.count.forEach(function (c) { s += qOf(r, c.id) * (+c.price || 0); });
  return s;
}
function hasPrices() {
  return CFG.count.some(function (c) { return +c.price > 0; });
}
/* Кто сколько сделал в этой квартире — из журнала нажатий.
   Если журнала нет (записи из старых версий), всё уходит в «без бригады». */
function byCrew(r) {
  var out = {};
  if (!r) return out;
  if (r.lg && r.lg.length) {
    r.lg.forEach(function (e) {
      var w = e.w || '?';
      out[w] = out[w] || { per: {}, total: 0 };
      out[w].per[e.c] = (out[w].per[e.c] || 0) + e.d;   /* минус тоже считается */
    });
    Object.keys(out).forEach(function (w) {
      var t = 0;
      Object.keys(out[w].per).forEach(function (c) {
        if (out[w].per[c] < 0) out[w].per[c] = 0;       /* в минус не уходим */
        if (!out[w].per[c]) delete out[w].per[c]; else t += out[w].per[c];
      });
      out[w].total = t;
      if (!t) delete out[w];
    });
    return out;
  }
  var t = qTotal(r);
  if (t) {
    out['?'] = { per: {}, total: t };
    CFG.count.forEach(function (c) { if (qOf(r, c.id)) out['?'].per[c.id] = qOf(r, c.id); });
  }
  return out;
}
function crewQ(r, crew) {
  var bc = byCrew(r);
  return (bc[crew] && bc[crew].total) || 0;
}
function otherQ(r, crew) {
  var bc = byCrew(r), s = 0;
  Object.keys(bc).forEach(function (w) { if (w !== crew) s += bc[w].total; });
  return s;
}
/* итоги по корпусу или этажу в разрезе бригады */
/* сколько записей journal попадёт под переназначение (или само переназначение) */
function countReassign(ra, apply) {
  var n = 0, from = ra.from || (CFG.crews[0] && CFG.crews[0].id), to = ra.to;
  if (apply && (!to || to === from)) return 0;
  CFG.buildings.forEach(function (b) {
    if (ra.b && ra.b !== 'all' && ra.b !== b.id) return;
    var d = DATA[b.id] || {};
    Object.keys(d).forEach(function (k) {
      var r = d[k];
      if (!r) return;
      /* записи из старых версий журнала не имеют — заводим его из количеств */
      if (!r.lg || !r.lg.length) {
        if (from !== '?' || !qTotal(r)) return;
        if (!apply) { CFG.count.forEach(function (c) { if ((!ra.c || ra.c === 'all' || ra.c === c.id) && qOf(r, c.id)) n += qOf(r, c.id); }); return; }
        r.lg = [];
        CFG.count.forEach(function (c) {
          var v = qOf(r, c.id);
          if (v) r.lg.push({ c: c.id, d: v, t: r.ts || Date.now(), w: '?' });
        });
      }
      r.lg.forEach(function (e) {
        if (ra.c && ra.c !== 'all' && ra.c !== e.c) return;
        if ((e.w || '?') !== from) return;
        n += e.d;
        if (apply) e.w = to;
      });
    });
  });
  return n;
}
function qSumCrew(b, floorOnly, crew) {
  var d = DATA[b.id] || {}, per = {}, total = 0, other = 0, money2 = 0, flats = 0;
  var list = floorOnly == null ? allFlats(b) : flatsOf(b, floorOnly).map(function (n) { return { n: n }; });
  list.forEach(function (x) {
    var r = d[x.n];
    if (!r) return;
    var bc = byCrew(r), mine = bc[crew];
    Object.keys(bc).forEach(function (w) { if (w !== crew) other += bc[w].total; });
    if (!mine) return;
    flats++;
    total += mine.total;
    CFG.count.forEach(function (c) {
      var v = mine.per[c.id] || 0;
      per[c.id] = (per[c.id] || 0) + v;
      money2 += v * (+c.price || 0);
    });
  });
  return { per: per, total: total, other: other, money: money2, flats: flats };
}
function qSum(b, floorOnly) {
  var d = DATA[b.id] || {}, per = {}, total = 0, money = 0, flats = 0;
  var list = floorOnly == null ? allFlats(b) : flatsOf(b, floorOnly).map(function (n) { return { n: n }; });
  list.forEach(function (x) {
    var r = d[x.n];
    if (!r) return;
    var t = qTotal(r);
    if (t) flats++;
    total += t; money += qMoney(r);
    CFG.count.forEach(function (c) { per[c.id] = (per[c.id] || 0) + qOf(r, c.id); });
  });
  return { per: per, total: total, money: money, flats: flats };
}
/* какие корпуса уходят в выгрузку: все или один выбранный */
function expBuildings() {
  if (!UI.expB || UI.expB === 'all') return CFG.buildings;
  var one = CFG.buildings.filter(function (b) { return b.id === UI.expB; });
  return one.length ? one : CFG.buildings;
}
function expSuffix() {
  var bs = expBuildings();
  return bs.length === CFG.buildings.length ? '' : '_' + bs[0].name.replace(/\s+/g, '');
}
/* ---- наряд по обходу: что сделано за период и какой бригадой ---- */
function crewName(id) {
  var w = CFG.crews.filter(function (x) { return x.id === id; })[0];
  return w ? w.n : 'без бригады';
}
function dayStart(shiftDays) {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (shiftDays || 0));
  return d.getTime();
}
var PERIODS = {
  today: { n: 'Сегодня', from: function () { return dayStart(0); }, to: function () { return Infinity; } },
  yest: { n: 'Вчера', from: function () { return dayStart(1); }, to: function () { return dayStart(0); } },
  week: { n: '7 дней', from: function () { return dayStart(6); }, to: function () { return Infinity; } },
  all: { n: 'Всё время', from: function () { return 0; }, to: function () { return Infinity; } }
};
/* Собираем строки наряда: квартира -> сколько сделано за период этой бригадой */
function naryad(period, crew) {
  var P = PERIODS[period] || PERIODS.today, from = P.from(), to = P.to();
  var out = [], totals = {}, grand = 0, gmoney = 0;
  expBuildings().forEach(function (b) {
    var d = DATA[b.id] || {};
    allFlats(b).forEach(function (x) {
      var r = d[x.n];
      if (!r || !r.lg || !r.lg.length) return;
      var per = {}, sum = 0, money2 = 0, last = 0, crews = {};
      r.lg.forEach(function (e) {
        if (e.t < from || e.t >= to) return;
        if (crew !== 'all' && e.w !== crew) return;
        per[e.c] = (per[e.c] || 0) + e.d;        /* отменённое вычитается */
        crews[e.w] = 1;
        if (e.t > last) last = e.t;
      });
      Object.keys(per).forEach(function (c) {
        if (per[c] <= 0) delete per[c]; else sum += per[c];
      });
      if (!sum) return;
      CFG.count.forEach(function (c) {
        var price = +c.price || 0;
        money2 += (per[c.id] || 0) * price;
        totals[c.id] = (totals[c.id] || 0) + (per[c.id] || 0);
      });
      grand += sum; gmoney += money2;
      out.push({
        b: b, f: x.f, n: x.n, per: per, sum: sum, money: money2, last: last,
        crews: Object.keys(crews).map(crewName).join(', '), r: r,
        fixph: photosInRange(r.fixph, from, to)
      });
    });
  });
  return { rows: out, totals: totals, grand: grand, money: gmoney, period: P.n, crew: crew === 'all' ? 'все бригады' : crewName(crew) };
}
function money(v) {
  return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

/* ---- замечания приёмки за период или за конкретный день ---- */
function periodRange(period, day) {
  if (day) {
    var d = new Date(day + 'T00:00:00');
    if (!isNaN(d)) return { from: d.getTime(), to: d.getTime() + 86400000, n: dayLabel(day) };
  }
  var P = PERIODS[period] || PERIODS.today;
  return { from: P.from(), to: P.to(), n: P.n };
}
function dayLabel(day) {
  var p = String(day).split('-');
  return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : day;
}
/* дни, в которые вообще что-то отмечали — чтобы было из чего выбирать */
function issueDays() {
  var set = {};
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    Object.keys(d).forEach(function (n) {
      var t = issueTs(d[n]);
      if (!t) return;
      var dt = new Date(t);
      set[dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2)] = 1;
    });
  });
  return Object.keys(set).sort().reverse();
}
function issueSuffix() {
  var bs = expBuildings();
  return bs.length === CFG.buildings.length ? '' : '_' + bs[0].name.replace(/\s+/g, '');
}
/* В номере снимка зашито время съёмки: ph<13 цифр><случайные буквы>.
   Значит можно взять только те фото, что сняты в выбранный день. */
function phTime(id) {
  var m = /^ph(\d{13})/.exec(String(id || ''));
  return m ? +m[1] : 0;
}
function photosInRange(list, from, to) {
  if (from <= 0 && to === Infinity) return (list || []).slice();
  return (list || []).filter(function (id) {
    var t = phTime(id);
    return t && t >= from && t < to;
  });
}
function issuesInPeriod(period, day) {
  var R = periodRange(period, day), out = [];
  expBuildings().forEach(function (b) {
    var d = DATA[b.id] || {};
    allFlats(b).forEach(function (x) {
      var r = d[x.n], s = status(r);
      if (s !== 'bad' && s !== 'warn') return;
      var t = issueTs(r);
      if (t < R.from || t >= R.to) return;
      var miss = CFG.positions.filter(function (p) { return r.st[p.id] === 0; })
        .map(function (p) { return p.n; }).join(', ');
      out.push({ b: b, f: x.f, n: x.n, r: r, miss: miss, ts: t,
        ph: photosInRange(r.ph, R.from, R.to) });
    });
  });
  out.sort(function (a, z) { return a.b.name.localeCompare(z.b.name) || a.f - z.f || a.n - z.n; });
  return { rows: out, label: R.n, from: R.from, to: R.to };
}
function status(r) {
  if (!r) return 'new';
  var vals = CFG.positions.map(function (p) { return r.st[p.id]; });
  var filled = vals.filter(function (v) { return v != null; }).length;
  var bad = vals.filter(function (v) { return v === 0; }).length;
  if (bad) return r.crit ? 'bad' : 'warn';
  if (filled === 0) return r.left ? 'part' : 'new';
  if (filled === vals.length) return 'ok';
  return 'part';
}
function issueCount() {
  var c = 0;
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    Object.keys(d).forEach(function (n) { var s = status(d[n]); if (s === 'bad' || s === 'warn') c++; });
  });
  return c;
}
function vibr(ms) { if (navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { } }
function h(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function timeStr(ts) { if (!ts) return ''; var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
var toastT;
function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2200);
}

/* ============ роутер ============ */
var VIEW = { name: 'obj' }; // obj | flat | issues | export | settings
function go(name, opt) {
  VIEW = Object.assign({ name: name }, opt || {});
  if (['obj','issues','export','settings','count'].indexOf(name) >= 0) UI.tab = name;
  save();
  render();
  window.scrollTo(0, 0);
}

/* ============ рендер ============ */
var app;
function render() {
  var f = { obj: viewObject, flat: viewFlat, issues: viewIssues, export: viewExport, settings: viewSettings, mergeview: viewMerge, count: viewCount, cflat: viewCountFlat }[VIEW.name];
  app.innerHTML = f();
  bind();
  hydratePhotos();
}

/* ---------- экран «Объект» ---------- */
function viewObject() {
  var b = bld(), all = allFlats(b), d = DATA[b.id] || {};
  var n = { ok: 0, warn: 0, bad: 0, part: 0, new: 0 };
  all.forEach(function (x) { n[status(d[x.n])]++; });
  var done = n.ok + n.warn + n.bad;
  var pct = all.length ? Math.round(done / all.length * 100) : 0;
  var W = all.length || 1;

  var floorsHtml = floors(b).map(function (fl) {
    var fs = flatsOf(b, fl), left = fs.filter(function (x) { return status(d[x]) === 'new'; }).length;
    return '<button class="floor ' + (fl === UI.floor ? 'on' : '') + (left === 0 ? ' done' : '') +
      '" data-floor="' + fl + '">' + fl + '<u>' + (left === 0 ? 'готов' : left + ' ост.') + '</u></button>';
  }).join('');

  var flatsHtml = flatsOf(b, UI.floor).map(function (num, idx) {
    var s = status(d[num]);
    var ico = s === 'ok' ? I.check : s === 'bad' ? I.x : s === 'warn' ? I.minus : s === 'part' ? I.dots : '';
    return '<button class="flat s-' + s + '" data-flat="' + num + '"><b>' + num + '</b>' +
      '<em>№' + (idx + 1) + '</em><span class="dot">' + ico + '</span></button>';
  }).join('');

  return topbar({
    left: '<button class="iconbtn" data-act="pickb">' + I.dots + '</button>',
    title: h(CFG.object), sub: h(b.name),
    right: '<button class="iconbtn" data-act="settings">' + I.gear + '</button>'
  }) +
    '<div class="screen">' +
    (UI.pick ? '<div class="card" style="margin-bottom:16px">' + CFG.buildings.map(function (x) {
      var dd = DATA[x.id] || {}, fl = allFlats(x);
      var dn = fl.filter(function (t) { var s = status(dd[t.n]); return s !== 'new' && s !== 'part'; }).length;
      return '<div class="row" data-pickb="' + x.id + '"><b>' + h(x.name) + '</b>' +
        '<span style="font-size:13px;color:var(--muted-fg)">' + dn + ' / ' + fl.length + '</span>' +
        (x.id === UI.b ? '<span style="color:var(--ok)">' + I.check + '</span>' : '<span style="width:24px"></span>') +
        '</div>';
    }).join('') + '</div>' : '') +
    '<div class="card prog"><div class="prog-top"><div>' +
    '<div class="prog-lbl">Общий прогресс</div><div class="prog-num">' + pct + '%</div></div>' +
    '<div class="prog-cnt">' + done + ' / ' + all.length + ' квартир</div></div>' +
    '<div class="bar">' +
    '<i class="b-ok" style="width:' + (n.ok / W * 100) + '%"></i>' +
    '<i class="b-warn" style="width:' + (n.warn / W * 100) + '%"></i>' +
    '<i class="b-bad" style="width:' + (n.bad / W * 100) + '%"></i>' +
    '</div></div>' +

    '<div class="sec">Этажи</div><div class="floors" id="floors">' + floorsHtml + '</div>' +
    '<div class="flats">' + flatsHtml + '</div>' +

    '<div class="legend">' +
    '<span><i style="background:var(--ok)"></i>Готово</span>' +
    '<span><i style="background:var(--warn)"></i>Есть замечания</span>' +
    '<span><i style="background:var(--bad)"></i>Критично</span>' +
    '<span><i style="background:var(--na-bg)"></i>Начато</span>' +
    '<span><i style="border:2px solid var(--border)"></i>Не проверено</span>' +
    '</div>' +

    '<button class="btn btn-primary btn-lg" data-act="gonext">' + I.right + ' Продолжить обход</button>' +
    '</div>' + tabbar();
}

/* ---------- экран квартиры ---------- */
function seq() { // плоский список квартир текущего корпуса
  var b = bld(); return allFlats(b);
}
function viewFlat() {
  var b = bld(), num = VIEW.flat, r = rec(b.id, num, true);
  var list = seq(), i = list.findIndex(function (x) { return x.n === num; });
  var prev = i > 0 ? list[i - 1] : null, next = i < list.length - 1 ? list[i + 1] : null;

  var vals = CFG.positions.map(function (p) { return r.st[p.id]; });
  var filled = vals.filter(function (v) { return v != null; }).length;
  var bad = vals.filter(function (v) { return v === 0; }).length;

  /* группируем позиции в блоки по подписи «группа» */
  var runs = [];
  CFG.positions.forEach(function (p, idx) {
    var g = p.g || '';
    var last = runs[runs.length - 1];
    if (!last || last.g !== g) runs.push({ g: g, items: [] });
    runs[runs.length - 1].items.push({ p: p, idx: idx });
  });
  var body = runs.map(function (run) {
    return '<div class="grp">' + h(run.g || 'Квартира') + '</div><div class="items">' +
      run.items.map(function (it) {
        var v = r.st[it.p.id];
        return '<div class="item"><span class="item-ico">' + posIcon(it.p.n) + '</span>' +
          '<span class="item-name">' + h(it.p.n) + '</span><span class="seg">' +
          '<button class="y' + (v === 1 ? ' on' : '') + '" data-set="' + it.p.id + '|1" aria-label="есть">' + I.check + '</button>' +
          '<button class="n' + (v === 0 ? ' on' : '') + '" data-set="' + it.p.id + '|0" aria-label="нет">' + I.x + '</button>' +
          '<button class="x' + (v === 2 ? ' on' : '') + '" data-set="' + it.p.id + '|2" aria-label="не предусмотрено">' + I.minus + '</button>' +
          '</span></div>';
      }).join('') + '</div>';
  }).join('');

  var pill = bad
    ? '<div class="pill-wrap"><span class="pill"><i style="width:8px;height:8px;border-radius:99px;background:currentColor;display:inline-block"></i>' +
    bad + ' из ' + CFG.positions.length + ' — замечания</span></div>'
    : filled === CFG.positions.length
      ? '<div class="pill-wrap"><span class="pill all-ok">' + I.check + 'Всё проверено</span></div>'
      : '<div class="pill-wrap"><span class="pill">' + filled + ' из ' + CFG.positions.length + ' отмечено</span></div>';

  /* пустая квартира — «Всё в порядке» сразу над списком, одним нажатием и дальше */
  var allok = filled === 0
    ? '<button class="btn btn-primary" style="margin-bottom:16px" data-act="allok">' +
    I.check + ' Всё в порядке · дальше</button>' : '';

  var rest = filled > 0 && filled < CFG.positions.length
    ? '<button class="btn btn-ghost" style="min-height:44px;font-size:14px;margin-top:10px" data-act="restok">' +
    I.check + ' Остальные ' + (CFG.positions.length - filled) + ' — в порядке</button>' : '';

  return topbar({
    left: '<button class="iconbtn" data-act="back">' + I.left + '</button>',
    title: 'Квартира ' + num,
    sub: 'Этаж ' + list[i].f + ' · №' + (flatsOf(b, list[i].f).indexOf(num) + 1) + ' на этаже',
    right: '<button class="iconbtn" data-act="clear">' + I.trash + '</button>'
  }) +
    '<div class="screen" id="swipe">' + pill + allok + body + rest +
    '<label class="fld">Что осталось</label>' +
    chipsHtml(r.left) +
    '<textarea id="left" rows="2" maxlength="200" placeholder="Например: выключатель в спальне не работает">' + h(r.left) + '</textarea>' +
    '<div class="cnt"><span id="leftc">' + (r.left || '').length + '</span>/200</div>' +
    '<div class="crit"><b>Критичное замечание</b><span class="sw' + (r.crit ? ' on' : '') + '" data-act="crit"></span></div>' +
    '<label class="fld">Фото</label><div class="photos" id="photos">' + photosHtml(r) + '</div>' +
    '</div>' + navbar(prev, next);
}
/* ---------- быстрые заметки ----------
   Собираем фразы из того, что уже написано по всем квартирам: текст режем по
   запятым, считаем повторы и показываем самые ходовые. Тап — вставить/убрать. */
function splitPhrases(s) {
  return String(s || '').split(/[,;]+/).map(function (t) { return t.trim(); })
    .filter(function (t) { return t.length > 1 && t.length < 60; });
}
function quickPhrases() {
  var cnt = {};
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    Object.keys(d).forEach(function (n) {
      splitPhrases(d[n].left).forEach(function (t) {
        var k = t.toLowerCase();
        if (!cnt[k]) cnt[k] = { t: t, c: 0 };
        cnt[k].c++;
      });
    });
  });
  var list = Object.keys(cnt).map(function (k) { return cnt[k]; })
    .filter(function (x) { return x.c > 1; })
    .sort(function (a, z) { return z.c - a.c; })
    .slice(0, 10).map(function (x) { return x.t; });
  (CFG.pinned || []).forEach(function (t) {
    if (list.indexOf(t) < 0) list.unshift(t);
  });
  return list.slice(0, 12);
}
function chipsHtml(cur) {
  var have = splitPhrases(cur).map(function (t) { return t.toLowerCase(); });
  var list = quickPhrases();
  if (!list.length) return '';
  return '<div class="chips">' + list.map(function (t, i) {
    var on = have.indexOf(t.toLowerCase()) >= 0;
    return '<button class="chip' + (on ? ' on' : '') + '" data-chip="' + i + '">' +
      (on ? I.check : I.plus) + h(t) + '</button>';
  }).join('') + '</div>';
}
function togglePhrase(cur, phrase) {
  var parts = splitPhrases(cur);
  var i = parts.map(function (t) { return t.toLowerCase(); }).indexOf(phrase.toLowerCase());
  if (i >= 0) parts.splice(i, 1); else parts.push(phrase);
  return parts.join(', ');
}

function photosHtml(r) {
  return (r.ph || []).map(function (id) {
    return '<span class="photo-wrap"><img class="photo" data-ph="' + id + '" alt="Фото замечания">' +
      '<button class="photo-del" data-delph="' + id + '" aria-label="Удалить фото">' + I.x + '</button></span>';
  }).join('') +
    '<button class="photo-add" data-act="addph" aria-label="Добавить фото">' + I.cam + '</button>';
}
function navbar(prev, next, kind) {
  var attr = kind === 'cflat' ? 'data-cnav' : 'data-nav';
  return '<div class="navbar">' +
    '<button class="btn btn-ghost" ' + attr + '="' + (prev ? prev.n : '') + '"' + (prev ? '' : ' disabled') + '>' +
    I.left + '<span class="lb"><i>Предыдущая</i>Кв. ' + (prev ? prev.n : '—') + '</span></button>' +
    '<button class="btn btn-primary" ' + attr + '="' + (next ? next.n : '') + '"' + (next ? '' : ' disabled') + '>' +
    '<span class="lb"><i>Следующая</i>Кв. ' + (next ? next.n : '—') + '</span>' + I.right + '</button>' +
    '</div>';
}

/* ---------- режим подсчёта: объект ---------- */
function viewCount() {
  var b = bld(), d = DATA[b.id] || {}, crew = UI.crew;
  var all = qSumCrew(b, null, crew), fl = qSumCrew(b, UI.floor, crew);

  var floorsHtml = floors(b).map(function (f) {
    var s = qSumCrew(b, f, crew);
    return '<button class="floor ' + (f === UI.floor ? 'on' : '') + (s.total ? ' done' : '') +
      '" data-floor="' + f + '">' + f + '<u>' + (s.total || (s.other ? '·' + s.other : '—')) + '</u></button>';
  }).join('');

  var flatsHtml = flatsOf(b, UI.floor).map(function (num, idx) {
    var r = d[num], mine = crewQ(r, crew), other = otherQ(r, crew);
    var badge = mine
      ? '<span class="qbadge on">' + mine + '</span>'
      : other ? '<span class="qbadge alien">' + other + '</span>'
        : '<span class="qbadge">·</span>';
    return '<button class="flat ' + (mine ? 's-ok' : other ? 's-alien' : 's-new') + '" data-cflat="' + num + '">' +
      '<b>' + num + '</b><em>№' + (idx + 1) + '</em>' + badge + '</button>';
  }).join('');

  var crews = CFG.crews.length > 1 || CFG.crews[0].n !== DEFAULT_CREWS[0].n
    ? '<div class="sec">Кто работает</div><div class="tabs">' + CFG.crews.map(function (w) {
      return '<button class="tab ' + (crew === w.id ? 'on' : '') + '" data-crew="' + w.id + '">' +
        I.user + h(w.n) + '</button>';
    }).join('') + '</div>' : '';

  return topbar({
    left: '<button class="iconbtn" data-act="pickb">' + I.dots + '</button>',
    title: 'Подсчёт', sub: h(b.name) + ' · ' + h(crewName(crew)),
    right: '<button class="iconbtn" data-act="settings">' + I.gear + '</button>'
  }) +
    '<div class="screen">' + crews +
    '<div class="card prog"><div class="prog-top"><div>' +
    '<div class="prog-lbl">Сделала ' + h(crewName(crew)) + '</div>' +
    '<div class="prog-num">' + all.total + ' <span style="font-size:18px;font-weight:600">шт.</span></div></div>' +
    '<div style="text-align:right">' +
    (hasPrices() ? '<div style="font-size:19px;font-weight:700;color:var(--ok)">' + money(all.money) + '</div>' : '') +
    '<div class="prog-cnt">квартир: ' + all.flats +
    (all.other ? '<br><span style="color:var(--na)">другие бригады: ' + all.other + ' шт.</span>' : '') +
    '</div></div></div>' +
    '<div class="qrow">' + CFG.count.map(function (c) {
      return '<span class="qchip"><b>' + (all.per[c.id] || 0) + '</b>' + h(c.n) + '</span>';
    }).join('') + '</div></div>' +

    '<div class="sec">Этажи · на этаже ' + fl.total + ' шт.</div>' +
    '<div class="floors" id="floors">' + floorsHtml + '</div>' +
    '<div class="flats">' + flatsHtml + '</div>' +
    '<div class="legend">' +
    '<span><i style="background:var(--ok)"></i>Считала ' + h(crewName(crew)) + '</span>' +
    '<span><i style="background:var(--na)"></i>Другая бригада</span>' +
    '<span><i style="border:2px solid var(--border)"></i>Пусто</span>' +
    '</div>' +
    '</div>' + tabbar();
}

/* ---------- режим подсчёта: квартира ---------- */
function viewCountFlat() {
  var b = bld(), num = VIEW.flat, r = rec(b.id, num, true), crew = UI.crew;
  var list = seq(), i = list.findIndex(function (x) { return x.n === num; });
  var prev = i > 0 ? list[i - 1] : null, next = i < list.length - 1 ? list[i + 1] : null;
  var bc = byCrew(r);

  /* позиции подсчёта разбиты на разделы так же, как в приёмке */
  var runs = [];
  CFG.count.forEach(function (c) {
    var g = c.g || '', last = runs[runs.length - 1];
    if (!last || last.g !== g) runs.push({ g: g, items: [] });
    runs[runs.length - 1].items.push(c);
  });

  var body = runs.map(function (run) {
    return '<div class="grp">' + h(run.g || 'Квартира') + '</div><div class="items">' +
      run.items.map(function (c) {
        var v = qOf(r, c.id);
        var mine = (bc[crew] && bc[crew].per[c.id]) || 0;
        var others = Object.keys(bc).filter(function (w) { return w !== crew && bc[w].per[c.id]; })
          .map(function (w) { return (w === '?' ? 'раньше' : crewName(w)) + ' ' + bc[w].per[c.id]; }).join(', ');
        return '<div class="qitem"><span class="item-ico">' + posIcon(c.n) + '</span>' +
          '<span class="qname">' + h(c.n) +
          (others ? '<i class="alien">' + h(others) + '</i>' : '') +
          (+c.price > 0 && mine ? '<i>' + money(mine * (+c.price)) + '</i>' : '') + '</span>' +
          '<span class="qctl">' +
          '<button class="qbtn" data-q="' + c.id + '|-1"' + (v ? '' : ' disabled') + ' aria-label="минус">' + I.minus + '</button>' +
          '<b class="qval' + (v ? ' on' : '') + '">' + v + '</b>' +
          '<button class="qbtn plus" data-q="' + c.id + '|1" aria-label="плюс">' + I.plus + '</button>' +
          '</span></div>';
      }).join('') + '</div>';
  }).join('');

  var mineTotal = crewQ(r, crew), other = otherQ(r, crew);
  return topbar({
    left: '<button class="iconbtn" data-act="backcount">' + I.left + '</button>',
    title: 'Кв. ' + num + ' · подсчёт',
    sub: 'Этаж ' + list[i].f + ' · ' + h(crewName(crew)) + ': ' + mineTotal + ' шт.' +
      (other ? ' · чужих ' + other : ''),
    right: '<button class="iconbtn" data-act="clearq">' + I.trash + '</button>'
  }) +
    '<div class="screen">' + body +
    '<label class="fld">Что переделать бригаде</label>' +
    '<textarea id="fix" rows="2" maxlength="200" placeholder="Например: две рамки битые, розетка криво">' + h(r.fix || '') + '</textarea>' +
    '<label class="fld">Фото косяка</label><div class="photos">' +
    (r.fixph || []).map(function (id) {
      return '<span class="photo-wrap"><img class="photo" data-ph="' + id + '" alt="Фото косяка">' +
        '<button class="photo-del" data-delfix="' + id + '" aria-label="Удалить фото">' + I.x + '</button></span>';
    }).join('') +
    '<button class="photo-add" data-act="addfixph" aria-label="Добавить фото">' + I.cam + '</button></div>' +
    '<div class="hint">Крупная цифра — сколько всего в квартире, серым подписано, что насчитала другая бригада. ' +
    'Плюс и минус записываются на выбранную сейчас бригаду. «Что переделать» и фото уходят в наряд этой бригады ' +
    'отдельно от замечаний приёмки.</div>' +
    '</div>' + navbar(prev, next, 'cflat');
}

/* ---------- экран «Замечания» ---------- */
function viewIssues() {
  var filter = VIEW.filter || 'all', items = [];
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    allFlats(b).forEach(function (x) {
      var r = d[x.n], s = status(r);
      if (s !== 'bad' && s !== 'warn') return;
      var missing = CFG.positions.filter(function (p) { return r.st[p.id] === 0; }).map(function (p) { return p.n; });
      items.push({ b: b, f: x.f, n: x.n, r: r, crit: s === 'bad', missing: missing });
    });
  });
  var crit = items.filter(function (x) { return x.crit; }).length;
  var shown = items.filter(function (x) { return filter === 'all' || (filter === 'crit') === x.crit; });

  var body = shown.length ? '' : '<div class="empty">' + I.smile + '<div>Замечаний нет</div></div>';
  var lastKey = null;
  shown.sort(function (a, z) { return a.b.name.localeCompare(z.b.name) || a.f - z.f || a.n - z.n; })
    .forEach(function (x) {
      var key = x.b.name + ' · этаж ' + x.f;
      if (key !== lastKey) { body += '<div class="sec" style="margin-top:16px">' + h(key) + '</div>'; lastKey = key; }
      var txt = x.r.left || x.missing.join(', ') || 'Есть невыполненные пункты';
      body += '<button class="iss ' + (x.crit ? '' : 'normal') + '" data-open="' + x.b.id + '|' + x.n + '" style="width:100%;text-align:left">' +
        '<span class="iss-b"><span class="iss-h"><b>Кв. ' + x.n + '</b>' +
        '<span class="badge ' + (x.crit ? '' : 'normal') + '">' + (x.crit ? 'Критично' : 'Обычное') + '</span></span>' +
        '<p>' + h(txt) + '</p>' +
        (x.missing.length ? '<div class="tm">Не сделано: ' + h(x.missing.join(', ')) + '</div>' : '') +
        '<div class="tm">' + timeStr(x.r.ts) + '</div></span>' +
        ((x.r.ph || []).length ? '<img data-ph="' + x.r.ph[0] + '" alt="Фото">' : '') +
        '</button>';
    });

  return topbar({ left: '<span style="width:44px"></span>', title: 'Замечания', right: '<span style="width:44px"></span>' }) +
    '<div class="screen"><div class="tabs">' +
    tabBtn('all', 'Все', items.length, filter) +
    tabBtn('crit', 'Критичные', crit, filter) +
    tabBtn('norm', 'Обычные', items.length - crit, filter) +
    '</div>' + body + '</div>' + tabbar();
}
function tabBtn(id, label, n, cur) {
  return '<button class="tab ' + (cur === id ? 'on' : '') + '" data-filter="' + id + '">' + label + ' <u>' + n + '</u></button>';
}

/* ---------- экран выгрузки ---------- */
function viewExport() {
  var b = bld(), mode = VIEW.pv || 'sh';
  var cur = UI.expB || 'all';
  var bs = expBuildings();
  var whole = bs.length === CFG.buildings.length;
  var where = whole ? 'весь объект' : bs[0].name;

  /* Один выбор корпуса на весь экран. Раньше их было три в разных местах —
     и было не видно, к какой кнопке относится какой. */
  var scope = '<div class="scope"><div class="scope-lbl">Выгружаем: ' + h(where) + '</div>' +
    '<div class="tabs">' +
    '<button class="tab ' + (cur === 'all' ? 'on' : '') + '" data-expb="all">Весь объект</button>' +
    CFG.buildings.map(function (x) {
      return '<button class="tab ' + (cur === x.id ? 'on' : '') + '" data-expb="' + x.id + '">' + h(x.name) + '</button>';
    }).join('') + '</div></div>';

  function grp(title, sub, body) {
    return '<div class="xp"><h2 class="xp-h">' + title + '</h2>' +
      (sub ? '<div class="xp-sub">' + sub + '</div>' : '') + body + '</div>';
  }
  function pills(attr, list, cur2) {
    return '<div class="tabs">' + list.map(function (o) {
      return '<button class="tab ' + (cur2 === o.v ? 'on' : '') + '" data-' + attr + '="' + o.v + '">' + h(o.n) + '</button>';
    }).join('') + '</div>';
  }
  var perList = Object.keys(PERIODS).map(function (k) { return { v: k, n: PERIODS[k].n }; });

  return topbar({ left: '<span style="width:44px"></span>', title: 'Выгрузка', right: '<span style="width:44px"></span>' }) +
    '<div class="screen">' + scope +

    grp('Шахматка и фото', 'Весь ' + (whole ? 'объект' : 'корпус') + ' целиком, без деления на дни и бригады.',
      '<button class="btn btn-primary btn-lg" data-act="xlsx">' + I.file + ' Скачать шахматку (.xlsx)</button>' +
      '<div class="hint">Файл по форме начальника: лист на каждый корпус + лист «Замечания». Открывается в Excel и Numbers.</div>' +
      '<button class="btn btn-ghost" data-act="photozip">' + I.cam + ' Скачать фото (.zip)</button>' +
      '<div class="hint">Имена файлов — Корпус_Этаж_Кв.jpg, совпадают с колонкой «Фото» в листе замечаний.</div>') +

    /* ---- замечания приёмки за период ---- */
    (function () {
      var ip = UI.iper || 'today', day = UI.iday || '';
      var res = issuesInPeriod(ip, day);
      var days = issueDays().slice(0, 14);
      var n = res.rows.length;
      return grp('Замечания за обход', 'Что не принято — прорабу и на переделку.',
        '<div class="xp-fl">Период</div>' +
        '<div class="tabs">' + perList.map(function (o) {
          return '<button class="tab ' + (!day && ip === o.v ? 'on' : '') + '" data-iper="' + o.v + '">' + h(o.n) + '</button>';
        }).join('') + '</div>' +
        (days.length > 1 ? '<div class="xp-fl">Или конкретный день</div><div class="tabs">' + days.map(function (dd) {
          return '<button class="tab ' + (day === dd ? 'on' : '') + '" data-iday="' + dd + '">' + dayLabel(dd) + '</button>';
        }).join('') + '</div>' : '') +
        '<div class="card prog"><div class="prog-top"><div>' +
        '<div class="prog-lbl">' + h(where) + ' · ' + h(res.label) + '</div>' +
        '<div class="prog-num">' + n + ' <span style="font-size:17px;font-weight:600">замечаний</span></div></div>' +
        '<div class="prog-cnt">критичных: ' +
        res.rows.filter(function (x) { return x.r.crit; }).length + '</div></div></div>' +
        (n ? '' : '<div class="empty-note">За этот период тут пусто — выбери другой период или корпус выше.</div>') +
        '<button class="btn btn-primary" data-act="issueshtml"' + (n ? '' : ' disabled') + '>' +
        I.msg + ' Замечания с фото (.html)</button>' +
        '<div class="hint">Чтобы прораб смотрел на компе. Одно замечание — один блок: сверху корпус, ' +
        'этаж и номер квартиры, под ними фото целиком. Есть поиск по номеру и кнопки «только критичные» ' +
        'и по корпусам, клик по фото — во весь экран. Интернет не нужен, снимки лежат внутри файла.</div>' +
        '<button class="btn btn-ghost" data-act="issuespdf"' + (n ? '' : ' disabled') + '>' +
        I.file + ' Замечания с фото (.pdf)</button>' +
        '<div class="hint">То же самое, но на печать: одно фото — одна страница А4 с шапкой ' +
        '«Корпус · Этаж · Кв.». Отдать бригаде на бумаге.</div>' +
        '<button class="btn btn-ghost" data-act="issuesx"' + (n ? '' : ' disabled') + '>' +
        I.file + ' Замечания списком (.xlsx)</button>' +
        '<div class="hint">Таблица без фотографий — для стройконтроля и для тех, кому надо править. ' +
        'В колонке «Фото, шт.» видно, по каким квартирам снимки есть в двух файлах выше.</div>');
    })() +

    /* ---- наряд по обходу ---- */
    (function () {
      var per = UI.nper || 'today', nc = UI.ncrew || 'all';
      var nd = naryad(per, nc);
      /* Пусто — почти всегда потому, что бригада работала в другом корпусе или
         в другой день. Считаем это сразу и пишем прямо здесь. */
      var hintEmpty = '';
      if (!nd.grand) {
        var wide = null;
        if (!whole) {
          var keepB = UI.expB; UI.expB = 'all';
          wide = naryad(per, nc); UI.expB = keepB;
        }
        if (wide && wide.grand) {
          hintEmpty = 'В «' + h(where) + '» за этот период у бригады пусто, а по всему объекту — <b>' +
            wide.grand + ' шт.</b> Переключи корпус наверху на «Весь объект».';
        } else if (per !== 'all') {
          var far = naryad('all', nc);
          hintEmpty = far.grand
            ? 'За «' + h(PERIODS[per].n) + '» тут пусто, а за всё время — <b>' + far.grand +
              ' шт.</b> Возьми период «Всё время».'
            : 'У этой бригады тут пока ничего не отмечено на вкладке «Подсчёт».';
        } else {
          hintEmpty = 'У этой бригады тут пока ничего не отмечено на вкладке «Подсчёт».';
        }
      }
      return grp('Наряд по обходу', 'Что бригада сделала на подсчёте — ей же на закрытие.',
        '<div class="xp-fl">Период</div>' + pills('per', perList, per) +
        (CFG.crews.length > 1 ? '<div class="xp-fl">Бригада</div>' +
          pills('ncrew', [{ v: 'all', n: 'Все бригады' }].concat(CFG.crews.map(function (w) {
            return { v: w.id, n: w.n };
          })), nc) : '') +
        '<div class="card prog"><div class="prog-top"><div>' +
        '<div class="prog-lbl">' + h(where) + ' · ' + h(nd.crew) + '</div>' +
        '<div class="prog-num">' + nd.grand + ' <span style="font-size:17px;font-weight:600">шт.</span></div></div>' +
        '<div style="text-align:right">' +
        (hasPrices() ? '<div style="font-size:18px;font-weight:700;color:var(--ok)">' + money(nd.money) + '</div>' : '') +
        '<div class="prog-cnt">квартир: ' + nd.rows.length + '</div></div></div>' +
        (nd.grand ? '<div class="qrow">' + CFG.count.map(function (c) {
          return nd.totals[c.id] ? '<span class="qchip"><b>' + nd.totals[c.id] + '</b>' + h(c.n) + '</span>' : '';
        }).join('') + '</div>' : '') +
        (hintEmpty ? '<div class="empty-note">' + hintEmpty + '</div>' : '') +
        '<button class="btn btn-primary" data-act="naryad"' + (nd.grand ? '' : ' disabled') + '>' +
        I.file + ' Скачать наряд</button>' +
        '<div class="hint">Только то, что отмечено на вкладке «Подсчёт» за выбранный период — чтобы отдать бригаде именно её обход, а не весь дом. ' +
        'Замечания и фото за этот же период идут вторым листом.</div>');
    })() +

    grp('Начальнику участка', '',
      '<button class="btn btn-ghost" data-act="bossexp">' + I.share + ' Выгрузка для начальника</button>' +
      '<div class="hint">Маленький файл только с итогами: что принято, замечания и сколько чего '
      + 'насчитала каждая бригада. <b>Без фотографий</b> — уходит в мессенджер мгновенно, '
      + 'в отличие от резервной копии. Начальник открывает его в приложении «Участок».</div>') +

    grp('Напарник', 'Обход вдвоём: квартиры сливаются, а не затираются.',
      '<button class="btn btn-ghost" data-act="share" style="margin-bottom:10px">' + I.share + ' Передать напарнику</button>' +
      '<button class="btn btn-ghost" data-act="merge">' + I.merge + ' Принять от напарника</button>' +
      '<div class="hint">Файл кидаете друг другу в Telegram. Если одну квартиру проверили оба и по-разному — приложение спросит, чью версию оставить.</div>') +

    grp('Страховка', '',
      '<button class="btn btn-ghost" data-act="backup">' + I.file + ' Резервная копия (.json)</button>' +
      '<div class="hint">Сохрани раз в пару дней на случай потери телефона. Восстановить: Настройки → Загрузить копию (заменит всё целиком).</div>') +

    grp('Предпросмотр · ' + h(b.name), 'Так это выглядит в файле.',
      '<div class="tabs"><button class="tab ' + (mode === 'sh' ? 'on' : '') + '" data-pv="sh">Шахматка</button>' +
      '<button class="tab ' + (mode === 'is' ? 'on' : '') + '" data-pv="is">Замечания</button></div>' +
      (mode === 'sh' ? previewTable(b) : previewIssues(b))) +
    '</div>' + tabbar();
}
function previewTable(b) {
  var d = DATA[b.id] || {};
  var head = '<tr><th class="k">№ кв.</th><th>№ на эт.</th>' + CFG.positions.map(function (p) {
    return '<th>' + h(p.g ? p.n + ' (СУ)' : p.n) + '</th>';
  }).join('') + '<th>Что осталось</th></tr>';
  var rows = allFlats(b).map(function (x) {
    var r = d[x.n], idx = flatsOf(b, x.f).indexOf(x.n) + 1;
    return '<tr><td class="k">' + x.n + '</td><td style="color:var(--muted-fg)">' + idx + '</td>' + CFG.positions.map(function (p) {
      var v = r && r.st[p.id];
      return '<td class="' + (v === 1 ? 'v-ok' : v === 0 ? 'v-bad' : 'v-na') + '">' +
        (v === 1 ? '✓' : v === 0 ? '✗' : v === 2 ? '—' : '') + '</td>';
    }).join('') + '<td style="text-align:left;max-width:200px;white-space:normal">' + h(r && r.left || '') + '</td></tr>';
  }).join('');
  return '<div class="tblwrap"><table>' + head + rows + '</table></div>';
}
function previewIssues(b) {
  var d = DATA[b.id] || {};
  var rows = allFlats(b).filter(function (x) { var s = status(d[x.n]); return s === 'bad' || s === 'warn'; })
    .map(function (x) {
      var r = d[x.n];
      return '<tr><td>' + x.f + '</td><td>' + x.n + '</td><td>' + (r.crit ? 'Критично' : 'Обычное') + '</td>' +
        '<td style="text-align:left;white-space:normal;max-width:240px">' + h(r.left || CFG.positions.filter(function (p) { return r.st[p.id] === 0; }).map(function (p) { return p.n; }).join(', ')) + '</td></tr>';
    }).join('');
  if (!rows) return '<div class="empty">' + I.smile + '<div>Замечаний по корпусу нет</div></div>';
  return '<div class="tblwrap"><table><tr><th>Этаж</th><th>№ кв.</th><th>Тип</th><th>Описание</th></tr>' + rows + '</table></div>';
}

/* ---------- настройки ---------- */
function viewSettings() {
  var bs = CFG.buildings.map(function (b, i) {
    return '<div class="card" style="margin-bottom:12px">' +
      '<div class="row"><b>Название</b><input type="text" style="width:150px" data-b="' + i + '|name" value="' + h(b.name) + '"></div>' +
      '<div class="row"><b>Этажи с</b><input type="number" data-b="' + i + '|from" value="' + b.from + '"></div>' +
      '<div class="row"><b>Этажи по</b><input type="number" data-b="' + i + '|to" value="' + b.to + '"></div>' +
      '<div class="row"><b>Квартир на этаже</b><input type="number" data-b="' + i + '|per" value="' + b.per + '"></div>' +
      '<div class="row"><b>Первая квартира</b><input type="number" data-b="' + i + '|first" value="' + b.first + '"></div>' +
      '<div class="row"><b>Этажи-исключения</b><input type="text" style="width:130px" data-b="' + i + '|ex" ' +
      'placeholder="18-20:10" value="' + h(exToText(b.ex)) + '"></div>' +
      (CFG.buildings.length > 1 ? '<div class="row"><b style="color:var(--bad)">Удалить корпус</b><button class="iconbtn" data-delb="' + i + '" style="color:var(--bad)">' + I.trash + '</button></div>' : '') +
      '</div>';
  }).join('');

  /* позиции показываем разделами: группа = раздел чек-листа и шапка в Excel */
  var runs = [], ps = '';
  CFG.positions.forEach(function (p, i) {
    var g = p.g || '';
    var last = runs[runs.length - 1];
    if (!last || last.g !== g) runs.push({ g: g, items: [] });
    runs[runs.length - 1].items.push({ p: p, i: i });
  });
  ps = runs.map(function (run, ri) {
    var rows = run.items.map(function (it, k) {
      return '<div class="drag"><span class="item-ico">' + posIcon(it.p.n) + '</span>' +
        '<input type="text" data-p="' + it.i + '|n" value="' + h(it.p.n) + '">' +
        '<button class="iconbtn mini" data-move="' + it.i + '|-1"' + (it.i === 0 ? ' disabled' : '') + ' aria-label="выше">' + I.up + '</button>' +
        '<button class="iconbtn mini" data-move="' + it.i + '|1"' + (it.i === CFG.positions.length - 1 ? ' disabled' : '') + ' aria-label="ниже">' + I.down + '</button>' +
        '<button class="iconbtn mini" data-delp="' + it.i + '" style="color:var(--bad)" aria-label="удалить">' + I.trash + '</button></div>';
    }).join('');
    return '<div class="grpbox">' +
      '<div class="grphead"><input type="text" data-grp="' + ri + '" value="' + h(run.g) + '" placeholder="Квартира">' +
      (runs.length > 1 ? '<button class="iconbtn mini" data-delg="' + ri + '" style="color:var(--bad)" aria-label="удалить раздел">' + I.trash + '</button>' : '') +
      '</div>' +
      '<div class="card">' + rows + '</div>' +
      '<button class="btn btn-ghost mini-btn" data-addp="' + ri + '">' + I.plus + ' Позиция в этот раздел</button>' +
      '</div>';
  }).join('');

  return topbar({ left: '<span style="width:44px"></span>', title: 'Настройки', right: '<span style="width:44px"></span>' }) +
    '<div class="screen">' +
    '<div class="sec">Объект</div>' +
    '<div class="card"><div class="row"><b>Название</b><input type="text" style="width:170px" id="objname" value="' + h(CFG.object) + '"></div></div>' +
    '<div class="sec" style="margin-top:22px">Корпуса</div>' + bs +
    '<button class="btn btn-ghost" data-act="addb">' + I.plus + ' Добавить корпус</button>' +
    '<div class="hint">«Этажи-исключения» — если на части этажей квартир меньше или больше обычного. ' +
    'Пиши <b>18-20:10</b> (с 18 по 20 этаж по 10 квартир). Несколько диапазонов — через запятую. ' +
    'Нумерация дальше пересчитается сама.</div>' +
    '<div class="sec" style="margin-top:24px">Позиции проверки</div>' + ps +
    '<button class="btn btn-ghost" data-act="addg">' + I.plus + ' Добавить раздел</button>' +
    '<div class="hint">Раздел — это заголовок в чек-листе и объединённая шапка в Excel. ' +
    'Порядок разделов и позиций внутри — такой же, как будет в шахматке. ' +
    'У первого раздела название можно не писать, тогда колонки идут в Excel по отдельности.</div>' +
    '<div class="sec" style="margin-top:26px">Подсчёт на сдельщине</div>' +
    (function () {
      var runs = [];
      CFG.count.forEach(function (c, i) {
        var g = c.g || '', last = runs[runs.length - 1];
        if (!last || last.g !== g) runs.push({ g: g, items: [] });
        runs[runs.length - 1].items.push({ c: c, i: i });
      });
      return runs.map(function (run, ri) {
        var rows = run.items.map(function (it, k) {
          return '<div class="drag"><span class="item-ico">' + posIcon(it.c.n) + '</span>' +
            '<input type="text" data-c="' + it.i + '|n" value="' + h(it.c.n) + '">' +
            '<input type="number" inputmode="decimal" data-c="' + it.i + '|price" value="' + (+it.c.price || 0) +
            '" style="width:66px;text-align:right;font-size:14px" aria-label="цена за штуку">' +
            '<span style="color:var(--muted-fg);font-size:12px">₽</span>' +
            '<button class="iconbtn mini" data-cmove="' + it.i + '|-1"' + (it.i === 0 ? ' disabled' : '') + ' aria-label="выше">' + I.up + '</button>' +
            '<button class="iconbtn mini" data-cmove="' + it.i + '|1"' + (it.i === CFG.count.length - 1 ? ' disabled' : '') + ' aria-label="ниже">' + I.down + '</button>' +
            '<button class="iconbtn mini" data-delc="' + it.i + '" style="color:var(--bad)" aria-label="убрать">' + I.trash + '</button></div>';
        }).join('');
        return '<div class="grpbox">' +
          '<div class="grphead"><input type="text" data-cgrp="' + ri + '" value="' + h(run.g) + '" placeholder="Квартира">' +
          (runs.length > 1 ? '<button class="iconbtn mini" data-delcg="' + ri + '" style="color:var(--bad)" aria-label="удалить раздел">' + I.trash + '</button>' : '') +
          '</div><div class="card">' + rows + '</div>' +
          '<button class="btn btn-ghost mini-btn" data-addcp="' + ri + '">' + I.plus + ' Позиция в этот раздел</button>' +
          '</div>';
      }).join('');
    })() +
    '<button class="btn btn-ghost mini-btn" data-act="addcg">' + I.plus + ' Добавить раздел подсчёта</button>' +
    '<div class="hint">Разделы здесь такие же, как в приёмке: «Квартира», «Санузел». Цену можно оставить нулём — тогда будут только штуки, без сумм.</div>' +


    '<div class="sec" style="margin-top:26px">Бригады</div>' +
    '<div class="card">' + CFG.crews.map(function (w, i) {
      return '<div class="drag"><span class="item-ico">' + I.user + '</span>' +
        '<input type="text" data-w="' + i + '" value="' + h(w.n) + '">' +
        (CFG.crews.length > 1 ? '<button class="iconbtn mini" data-delw="' + i + '" style="color:var(--bad)" aria-label="убрать">' + I.trash + '</button>' : '') +
        '</div>';
    }).join('') + '</div>' +
    '<button class="btn btn-ghost mini-btn" data-act="addw">' + I.plus + ' Добавить бригаду</button>' +
    '<div class="hint">Перед обходом выбери на вкладке «Подсчёт», кто работает. Тогда наряд можно будет выгрузить отдельно по каждой бригаде.</div>' +

    /* ---- переназначение: кто на самом деле это делал ---- */
    (function () {
      var ra = UI.ra || {};
      function sel(name, cur, opts) {
        return '<select data-ra="' + name + '">' + opts.map(function (o) {
          return '<option value="' + o.v + '"' + (String(cur) === String(o.v) ? ' selected' : '') + '>' + h(o.n) + '</option>';
        }).join('') + '</select>';
      }
      var crewOpts = CFG.crews.map(function (w) { return { v: w.id, n: w.n }; });
      var n = countReassign(ra);
      return '<div class="sec" style="margin-top:26px">Переназначить подсчёт</div>' +
        '<div class="card">' +
        '<div class="row"><b>Корпус</b>' + sel('b', ra.b || 'all',
          [{ v: 'all', n: 'все' }].concat(CFG.buildings.map(function (x) { return { v: x.id, n: x.name }; }))) + '</div>' +
        '<div class="row"><b>Позиция</b>' + sel('c', ra.c || 'all',
          [{ v: 'all', n: 'все' }].concat(CFG.count.map(function (x) { return { v: x.id, n: x.n }; }))) + '</div>' +
        '<div class="row"><b>Записано на</b>' + sel('from', ra.from || (CFG.crews[0] && CFG.crews[0].id),
          crewOpts.concat([{ v: '?', n: 'без бригады' }])) + '</div>' +
        '<div class="row"><b>Отдать</b>' + sel('to', ra.to || (CFG.crews[0] && CFG.crews[0].id), crewOpts) + '</div>' +
        '</div>' +
        '<button class="btn btn-ghost mini-btn" data-act="doreassign"' + (n ? '' : ' disabled') + '>' +
        I.user + (n ? ' Переназначить ' + n + ' шт.' : ' Нечего переназначать') + '</button>' +
        '<div class="hint">Если работу записали не на ту бригаду — например, светильники ставили повременщики, ' +
        'а в подсчёт они попали на тебя. Меняется только авторство, количество остаётся как есть.</div>';
    })() +

    '<div class="sec" style="margin-top:24px">Данные</div>' +
    '<button class="btn btn-ghost" data-act="restore" style="margin-bottom:10px">Загрузить резервную копию</button>' +
    '<button class="btn btn-ghost" data-act="wipe" style="color:var(--bad)">Стереть все отметки</button>' +
    '<div class="hint">Стирание удаляет только отметки по квартирам, настройки останутся.</div>' +
    '</div>' + tabbar();
}

/* ---------- каркас ---------- */
function topbar(o) {
  return '<div class="topbar"><div class="topbar-row">' + o.left +
    '<h1>' + o.title + (o.sub ? '<small>' + o.sub + '</small>' : '') + '</h1>' + o.right + '</div></div>';
}
function tabbar() {
  var n = issueCount();
  function t(id, ico, label) {
    return '<button data-tab="' + id + '" class="' + (UI.tab === id ? 'on' : '') + '">' + ico +
      (id === 'issues' && n ? '<span class="cnt-b">' + n + '</span>' : '') +
      '<span>' + label + '</span></button>';
  }
  return '<div class="tabbar">' + t('obj', I.home, 'Объект') + t('issues', I.msg, 'Замечания') +
    t('count', I.calc, 'Подсчёт') + t('export', I.file, 'Выгрузка') + t('settings', I.gear, 'Настройки') + '</div>';
}

/* Стрелка на краю раздела не переставляет позицию, а переносит её в соседний
   раздел — иначе разложить готовый список по разделам просто нечем. */
function moveInList(list, i, dir) {
  var j = i + dir;
  if (j < 0 || j >= list.length) return;
  var g = list[i].g || '', ng = list[j].g || '';
  if (g !== ng) {
    if (ng) list[i].g = ng; else delete list[i].g;
  } else {
    var t = list[i]; list[i] = list[j]; list[j] = t;
  }
  vibr(6); save(); render();
}

/* ============ события ============ */
function bind() {
  app.querySelectorAll('[data-tab]').forEach(function (el) {
    el.onclick = function () { go(el.dataset.tab); };
  });
  app.querySelectorAll('[data-pickb]').forEach(function (el) {
    el.style.cursor = 'pointer';
    el.onclick = function () {
      UI.b = el.dataset.pickb; UI.floor = bld(UI.b).from; UI.pick = false; save(); render();
    };
  });
  app.querySelectorAll('[data-floor]').forEach(function (el) {
    el.onclick = function () { UI.floor = +el.dataset.floor; save(); render(); };
  });
  app.querySelectorAll('[data-flat]').forEach(function (el) {
    el.onclick = function () { go('flat', { flat: +el.dataset.flat }); };
  });
  app.querySelectorAll('[data-open]').forEach(function (el) {
    el.onclick = function () {
      var p = el.dataset.open.split('|');
      UI.b = p[0]; go('flat', { flat: +p[1] });
    };
  });
  app.querySelectorAll('[data-filter]').forEach(function (el) {
    el.onclick = function () { VIEW.filter = el.dataset.filter; render(); };
  });
  app.querySelectorAll('[data-ra]').forEach(function (el) {
    el.onchange = function () {
      UI.ra = UI.ra || {};
      UI.ra[el.dataset.ra] = el.value;
      save(); render();
    };
  });
  app.querySelectorAll('[data-crew]').forEach(function (el) {
    el.onclick = function () { UI.crew = el.dataset.crew; vibr(6); save(); render(); };
  });
  app.querySelectorAll('[data-iper]').forEach(function (el) {
    el.onclick = function () { UI.iper = el.dataset.iper; UI.iday = ''; save(); render(); };
  });
  app.querySelectorAll('[data-iday]').forEach(function (el) {
    el.onclick = function () {
      UI.iday = UI.iday === el.dataset.iday ? '' : el.dataset.iday;
      save(); render();
    };
  });
  app.querySelectorAll('[data-per]').forEach(function (el) {
    el.onclick = function () { UI.nper = el.dataset.per; save(); render(); };
  });
  app.querySelectorAll('[data-ncrew]').forEach(function (el) {
    el.onclick = function () { UI.ncrew = el.dataset.ncrew; save(); render(); };
  });
  app.querySelectorAll('[data-w]').forEach(function (el) {
    el.onchange = function () { CFG.crews[+el.dataset.w].n = el.value; save(); };
  });
  app.querySelectorAll('[data-delw]').forEach(function (el) {
    el.onclick = function () {
      if (CFG.crews.length <= 1) return;
      if (!confirm('Убрать «' + CFG.crews[+el.dataset.delw].n + '»? Уже записанные обходы останутся.')) return;
      CFG.crews.splice(+el.dataset.delw, 1); save(); render();
    };
  });
  app.querySelectorAll('[data-expb]').forEach(function (el) {
    el.onclick = function () { UI.expB = el.dataset.expb; save(); render(); };
  });
  app.querySelectorAll('[data-pv]').forEach(function (el) {
    el.onclick = function () { VIEW.pv = el.dataset.pv; render(); };
  });
  app.querySelectorAll('[data-cflat]').forEach(function (el) {
    el.onclick = function () { go('cflat', { flat: +el.dataset.cflat }); };
  });
  app.querySelectorAll('[data-cnav]').forEach(function (el) {
    el.onclick = function () { if (el.dataset.cnav) go('cflat', { flat: +el.dataset.cnav }); };
  });
  app.querySelectorAll('[data-q]').forEach(function (el) {
    el.onclick = function () {
      var p = el.dataset.q.split('|'), r = rec(UI.b, VIEW.flat, true);
      var was = qOf(r, p[0]), v = was + (+p[1]);
      if (v < 0) v = 0;
      if (v === was) return;
      if (v) r.q[p[0]] = v; else delete r.q[p[0]];
      /* журнал: кто и когда — из него собирается наряд по обходу */
      r.lg = r.lg || [];
      r.lg.push({ c: p[0], d: v - was, t: Date.now(), w: UI.crew });
      r.qts = Date.now(); vibr(8); save(); render();
    };
  });
  app.querySelectorAll('[data-c]').forEach(function (el) {
    el.onchange = function () {
      var p = el.dataset.c.split('|'), c = CFG.count[+p[0]];
      if (p[1] === 'n') c.n = el.value; else c.price = Math.max(0, +el.value || 0);
      save(); if (p[1] !== 'n') render();
    };
  });
  /* разделы подсчёта */
  function countRuns() {
    var runs = [];
    CFG.count.forEach(function (c, i) {
      var g = c.g || '', last = runs[runs.length - 1];
      if (!last || last.g !== g) runs.push({ g: g, from: i, to: i });
      else last.to = i;
    });
    return runs;
  }
  app.querySelectorAll('[data-cgrp]').forEach(function (el) {
    el.onchange = function () {
      var run = countRuns()[+el.dataset.cgrp], v = el.value.trim();
      for (var i = run.from; i <= run.to; i++) {
        if (v) CFG.count[i].g = v; else delete CFG.count[i].g;
      }
      save(); render();
    };
  });
  app.querySelectorAll('[data-cmove]').forEach(function (el) {
    el.onclick = function () {
      var p = el.dataset.cmove.split('|');
      moveInList(CFG.count, +p[0], +p[1]);
    };
  });
  app.querySelectorAll('[data-addcp]').forEach(function (el) {
    el.onclick = function () {
      var run = countRuns()[+el.dataset.addcp];
      var np = { id: 'c' + Date.now(), n: 'Новая позиция', price: 0 };
      if (run.g) np.g = run.g;
      CFG.count.splice(run.to + 1, 0, np);
      save(); render();
    };
  });
  app.querySelectorAll('[data-delcg]').forEach(function (el) {
    var run = countRuns()[+el.dataset.delcg];
    el.onclick = function () {
      var n = run.to - run.from + 1;
      if (CFG.count.length - n < 1) { toast('Должна остаться хотя бы одна позиция'); return; }
      if (!confirm('Удалить раздел «' + (run.g || 'без названия') + '» и ' + n + ' позиц.? Посчитанное останется в базе.')) return;
      CFG.count.splice(run.from, n);
      save(); render();
    };
  });
  app.querySelectorAll('[data-delc]').forEach(function (el) {
    el.onclick = function () {
      if (CFG.count.length <= 1) return;
      if (!confirm('Убрать «' + CFG.count[+el.dataset.delc].n + '» из подсчёта? Посчитанные штуки останутся в базе.')) return;
      CFG.count.splice(+el.dataset.delc, 1); save(); render();
    };
  });
  app.querySelectorAll('[data-chip]').forEach(function (el) {
    el.onclick = function () {
      var phrase = quickPhrases()[+el.dataset.chip];
      var r = rec(UI.b, VIEW.flat, true);
      r.left = togglePhrase(r.left, phrase);
      touchIssue(r); vibr(8); save(); render();
    };
  });
  app.querySelectorAll('[data-pick]').forEach(function (el) {
    el.onclick = function () {
      var p = el.dataset.pick.split('|');
      PENDING.conflicts[+p[0]].pick = p[1]; vibr(6); render();
    };
  });
  app.querySelectorAll('[data-pickall]').forEach(function (el) {
    el.onclick = function () {
      PENDING.conflicts.forEach(function (c) { c.pick = el.dataset.pickall; });
      vibr(10); render();
    };
  });
  app.querySelectorAll('[data-nav]').forEach(function (el) {
    el.onclick = function () { if (el.dataset.nav) go('flat', { flat: +el.dataset.nav }); };
  });
  app.querySelectorAll('[data-set]').forEach(function (el) {
    el.onclick = function () {
      var p = el.dataset.set.split('|'), r = rec(UI.b, VIEW.flat, true), v = +p[1];
      r.st[p[0]] = r.st[p[0]] === v ? undefined : v;
      if (r.st[p[0]] === undefined) delete r.st[p[0]];
      touchIssue(r); vibr(8); save(); render();
    };
  });
  app.querySelectorAll('[data-delph]').forEach(function (el) {
    el.onclick = function () {
      var id = el.dataset.delph, r = rec(UI.b, VIEW.flat, true);
      r.ph = r.ph.filter(function (x) { return x !== id; });
      dropPhoto(id); save(); render();
    };
  });
  app.querySelectorAll('[data-b]').forEach(function (el) {
    el.onchange = function () {
      var p = el.dataset.b.split('|'), b = CFG.buildings[+p[0]];
      if (p[1] === 'name') b.name = el.value;
      else if (p[1] === 'ex') { var ex = textToEx(el.value); if (ex) b.ex = ex; else delete b.ex; }
      else b[p[1]] = Math.max(1, +el.value || 1);
      if (b.to < b.from) b.to = b.from;
      save(); if (p[1] !== 'name') render();
    };
  });
  app.querySelectorAll('[data-p]').forEach(function (el) {
    el.onchange = function () {
      var p = el.dataset.p.split('|'), pos = CFG.positions[+p[0]];
      if (p[1] === 'g') { if (el.value.trim()) pos.g = el.value.trim(); else delete pos.g; }
      else pos.n = el.value;
      save();
    };
  });
  /* разделы позиций */
  function groupRuns() {
    var runs = [];
    CFG.positions.forEach(function (p, i) {
      var g = p.g || '', last = runs[runs.length - 1];
      if (!last || last.g !== g) runs.push({ g: g, from: i, to: i });
      else last.to = i;
    });
    return runs;
  }
  app.querySelectorAll('[data-grp]').forEach(function (el) {
    el.onchange = function () {
      var run = groupRuns()[+el.dataset.grp], v = el.value.trim();
      for (var i = run.from; i <= run.to; i++) {
        if (v) CFG.positions[i].g = v; else delete CFG.positions[i].g;
      }
      save(); render();
    };
  });
  app.querySelectorAll('[data-move]').forEach(function (el) {
    el.onclick = function () {
      var p = el.dataset.move.split('|');
      moveInList(CFG.positions, +p[0], +p[1]);
    };
  });
  app.querySelectorAll('[data-addp]').forEach(function (el) {
    el.onclick = function () {
      var run = groupRuns()[+el.dataset.addp];
      var np = { id: 'p' + Date.now(), n: 'Новая позиция' };
      if (run.g) np.g = run.g;
      CFG.positions.splice(run.to + 1, 0, np);
      save(); render();
    };
  });
  app.querySelectorAll('[data-delg]').forEach(function (el) {
    var run = groupRuns()[+el.dataset.delg];
    el.onclick = function () {
      var n = run.to - run.from + 1;
      if (CFG.positions.length - n < 1) { toast('Должна остаться хотя бы одна позиция'); return; }
      if (!confirm('Удалить раздел «' + (run.g || 'без названия') + '» и ' + n + ' позиц. вместе с отметками?')) return;
      CFG.positions.splice(run.from, n);
      save(); render();
    };
  });
  app.querySelectorAll('[data-delp]').forEach(function (el) {
    el.onclick = function () {
      if (CFG.positions.length <= 1) return;
      if (!confirm('Удалить позицию «' + CFG.positions[+el.dataset.delp].n + '»?')) return;
      CFG.positions.splice(+el.dataset.delp, 1); save(); render();
    };
  });
  app.querySelectorAll('[data-delb]').forEach(function (el) {
    el.onclick = function () {
      var b = CFG.buildings[+el.dataset.delb];
      if (!confirm('Удалить «' + b.name + '» вместе с отметками?')) return;
      delete DATA[b.id]; CFG.buildings.splice(+el.dataset.delb, 1);
      if (UI.b === b.id) { UI.b = CFG.buildings[0].id; UI.floor = CFG.buildings[0].from; }
      save(); render();
    };
  });

  app.querySelectorAll('[data-delfix]').forEach(function (el) {
    el.onclick = function () {
      var id = el.dataset.delfix, r = rec(UI.b, VIEW.flat, true);
      r.fixph = (r.fixph || []).filter(function (x) { return x !== id; });
      dropPhoto(id); save(); render();
    };
  });
  var fix = document.getElementById('fix');
  if (fix) fix.oninput = function () {
    var r = rec(UI.b, VIEW.flat, true);
    r.fix = fix.value; r.fixw = UI.crew; r.fixts = Date.now(); r.qts = Date.now(); save();
  };

  var left = document.getElementById('left');
  if (left) left.oninput = function () {
    var r = rec(UI.b, VIEW.flat, true); r.left = left.value; touchIssue(r);
    document.getElementById('leftc').textContent = left.value.length; save();
  };
  var note = document.getElementById('note');
  var on = document.getElementById('objname');
  if (on) on.onchange = function () { CFG.object = on.value; save(); };

  app.querySelectorAll('[data-act]').forEach(function (el) { el.onclick = function () { act(el.dataset.act, el); }; });

  /* свайпа между квартирами нет: он срабатывал при выделении текста в заметке.
     Переключение — только кнопками внизу. */

  /* активный этаж — в центр полосы */
  var fr = document.getElementById('floors');
  if (fr) { var a = fr.querySelector('.on'); if (a) fr.scrollLeft = a.offsetLeft - fr.clientWidth / 2 + a.clientWidth / 2; }
}

function act(a, el) {
  var r;
  switch (a) {
    case 'back': go('obj'); break;
    case 'backcount': go('count'); break;
    case 'addw':
      CFG.crews.push({ id: 'w' + Date.now(), n: 'Бригада ' + (CFG.crews.length + 1) });
      save(); render(); break;
    case 'doreassign':
      var ra = UI.ra || {};
      var from = ra.from || (CFG.crews[0] && CFG.crews[0].id), to = ra.to || from;
      if (from === to) { toast('Выбери разные бригады'); return; }
      var cnt = countReassign(ra, true);
      save(); render();
      toast(cnt ? 'Переназначено ' + cnt + ' шт.' : 'Нечего переназначать');
      break;
    case 'addcg':
      CFG.count.push({ id: 'c' + Date.now(), n: 'Новая позиция', price: 0, g: 'Новый раздел' });
      save(); render(); break;
    case 'clearq':
      if (!confirm('Обнулить подсчёт по кв. ' + VIEW.flat + '?')) return;
      r = rec(UI.b, VIEW.flat, true); r.q = {}; r.qts = Date.now(); save(); render();
      break;
    case 'settings': go('settings'); break;
    case 'pickb': pickBuilding(); break;

    case 'allok':
      r = rec(UI.b, VIEW.flat, true);
      CFG.positions.forEach(function (p) { r.st[p.id] = 1; });
      touchIssue(r); vibr(18); save();
      nextFlat();
      break;
    case 'restok':
      r = rec(UI.b, VIEW.flat, true);
      CFG.positions.forEach(function (p) { if (r.st[p.id] == null) r.st[p.id] = 1; });
      touchIssue(r); vibr(14); save(); render();
      break;
    case 'clear':
      if (!confirm('Сбросить отметки по кв. ' + VIEW.flat + '?')) return;
      (DATA[UI.b] || {})[VIEW.flat] = undefined; delete (DATA[UI.b] || {})[VIEW.flat];
      save(); render();
      break;
    case 'crit':
      r = rec(UI.b, VIEW.flat, true); r.crit = !r.crit; touchIssue(r); vibr(10); save(); render();
      break;
    case 'addph': pickPhoto('ph'); break;
    case 'addfixph': pickPhoto('fixph'); break;
    case 'gonext': continueWalk(); break;

    case 'addb':
      CFG.buildings.push({ id: 'b' + Date.now(), name: 'Корпус ' + (CFG.buildings.length + 1), from: 1, to: 12, per: 8, first: 1 });
      save(); render(); break;
    case 'addg':
      CFG.positions.push({ id: 'p' + Date.now(), n: 'Новая позиция', g: 'Новый раздел' });
      save(); render(); break;
    case 'wipe':
      if (!confirm('Стереть ВСЕ отметки по всем квартирам? Отменить нельзя.')) return;
      DATA = {}; save(); toast('Отметки стёрты'); render(); break;
    case 'restore': restore(); break;

    case 'share': shareExport(); break;
    case 'merge': shareImport(); break;
    case 'applymerge': applyMerge(); break;
    case 'cancelmerge': PENDING = null; go('export'); break;

    case 'naryad': exportNaryad(); break;
    case 'issuesx': exportIssuesPeriod(); break;
    case 'issueshtml': exportReport('html'); break;
    case 'issuespdf': exportReport('pdf'); break;
    case 'xlsx': exportXlsx(); break;
    case 'photozip': exportPhotos(); break;
    case 'backup': backup(); break;
    case 'bossexp': bossExport(); break;
  }
}

function nextFlat() {
  var list = seq(), i = list.findIndex(function (x) { return x.n === VIEW.flat; });
  if (i < list.length - 1) { UI.floor = list[i + 1].f; go('flat', { flat: list[i + 1].n }); }
  else { toast('Корпус пройден'); go('obj'); }
}
function continueWalk() {
  var b = bld(), d = DATA[b.id] || {}, list = allFlats(b);
  var t = list.filter(function (x) { return status(d[x.n]) === 'new' || status(d[x.n]) === 'part'; })[0];
  if (!t) { toast('Все квартиры пройдены'); return; }
  UI.floor = t.f; go('flat', { flat: t.n });
}
function pickBuilding() { UI.pick = !UI.pick; save(); render(); }

/* ---------- фото ---------- */
function pickPhoto(field) {
  var inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*'; inp.capture = 'environment';
  inp.onchange = function () {
    var f = inp.files[0]; if (!f) return;
    var img = new Image(), fr = new FileReader();
    fr.onload = function () {
      img.onload = function () {
        var max = 1280, s = Math.min(1, max / Math.max(img.width, img.height));
        var cv = document.createElement('canvas');
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        var url = cv.toDataURL('image/jpeg', 0.72);
        var id = 'ph' + Date.now() + Math.random().toString(36).slice(2, 7);
        cachePhoto(id, url);
        idb.put(id, url);
        var r = rec(UI.b, VIEW.flat, true), key = field || 'ph';
        r[key] = r[key] || []; r[key].push(id);
        if (key === 'fixph') { r.fixw = UI.crew; r.fixts = Date.now(); r.qts = Date.now(); }
        else touchIssue(r);
        save(); render();
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(f);
  };
  inp.click();
}

/* ---------- сохранение файла ----------
   На айфоне <a download> не сохраняет файл, а открывает его во вкладке, и «Поделиться»
   отдаёт бесполезную ссылку blob:… Поэтому на телефоне сначала пробуем системный
   «Поделиться» с настоящим файлом — оттуда он уходит в Telegram, почту и «Файлы». */
function canShareFiles(file) {
  try {
    return !!(navigator.canShare && navigator.share && navigator.canShare({ files: [file] }));
  } catch (e) { return false; }
}
function saveAs(blob, name) {
  var url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 3000);
}
function download(blob, name) {
  var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (touch) {
    var file = null;
    try { file = new File([blob], name, { type: blob.type || 'application/octet-stream' }); }
    catch (e) { file = null; }
    if (file && canShareFiles(file)) {
      navigator.share({ files: [file], title: name }).catch(function (err) {
        /* «Отмена» — это не сбой, второй раз файл не навязываем */
        if (err && err.name === 'AbortError') return;
        saveAs(blob, name);
      });
      return;
    }
  }
  saveAs(blob, name);
}
function dataUrlToBytes(url) {
  if (!url || url.indexOf(',') < 0) return null;
  try {
    var bin = atob(url.split(',')[1]), u8 = new Uint8Array(bin.length);
    for (var k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k);
    return u8;
  } catch (e) { return null; }
}
function dateStamp() {
  var d = new Date();
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

/* ---------- подготовка снимков к выгрузке ---------- */
/* Для «Замечаний» делаем лёгкую копию (там картинка мелкая — незачем тащить оригинал),
   для листа «Фото» берём оригинал. Заодно узнаём настоящие размеры в пикселях. */
var THUMB_BOX = 165;   // px — сторона миниатюры в «Замечаниях»
var BIG_W = 540;       // px — ширина снимка на листе «Фото»
var BIG_H = 700;       // px — потолок по высоте для вертикальных кадров
var FULL_MAX = 800;    // px — в файл кладём снимок такого размера, а не оригинал:
                       // показывается он всё равно мельче, а вес падает вдвое

function loadImg(url) {
  return new Promise(function (res, rej) {
    var i = new Image();
    i.onload = function () { res(i); };
    i.onerror = function () { rej(new Error('снимок не читается')); };
    i.src = url;
  });
}
function fit(w, h, maxW, maxH) {
  var s = Math.min(maxW / w, maxH / h, 1);
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
}
function reencode(img, size, q) {
  var cv = document.createElement('canvas');
  cv.width = size.w; cv.height = size.h;
  var g = cv.getContext('2d');
  g.imageSmoothingQuality = 'high';
  g.drawImage(img, 0, 0, size.w, size.h);
  return dataUrlToBytes(cv.toDataURL('image/jpeg', q));
}
function preparePhotos(ids) {
  var out = {}, i = 0;
  function step() {
    if (i >= ids.length) return Promise.resolve(out);
    var id = ids[i++];
    return getPhoto(id).then(function (url) {
      if (!url) return step();
      return loadImg(url).then(function (img) {
      var big = fit(img.width, img.height, BIG_W, BIG_H);
      var t = fit(img.width, img.height, THUMB_BOX, THUMB_BOX);
      out[id] = {
        full: reencode(img, fit(img.width, img.height, FULL_MAX, FULL_MAX), 0.75),
        fw: big.w, fh: big.h,
        /* миниатюра рисуется с двойным запасом, чтобы на печати не мылила */
        thumb: reencode(img, { w: t.w * 2, h: t.h * 2 }, 0.62), tw: t.w, th: t.h
      };
        return step();
      });
    }).catch(function () { return step(); });
  }
  return step();
}

/* ---------- Excel ---------- */
function exportXlsx() {
  var ids = [];
  expBuildings().forEach(function (b) {
    var d = DATA[b.id] || {};
    Object.keys(d).forEach(function (n) {
      (d[n].ph || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    });
  });
  if (ids.length) toast('Готовлю снимки…');
  preparePhotos(ids).then(function (IMG) { buildXlsx(IMG); })
    .catch(function (e) { alert('Не удалось подготовить снимки: ' + e.message); });
}

function buildXlsx(IMG) {
  var C = window.colName;
  var sheets = expBuildings().map(function (b) {
    var d = DATA[b.id] || {};
    var cols = [], merges = [], rows = [];
    var nPos = CFG.positions.length, OFF = 3, total = OFF + nPos + 2;

    cols.push({ w: 7 }, { w: 8 }, { w: 9 });
    CFG.positions.forEach(function () { cols.push({ w: 11 }); });
    cols.push({ w: 40 });

    /* строка 1 — заголовок корпуса */
    var r1 = [{ v: b.name.toUpperCase(), s: 6 }];
    rows.push(r1);
    merges.push('A1:' + C(total - 1) + '1');

    /* строки 2-3 — шапка */
    var r2 = [], r3 = [];
    r2[0] = { v: 'Этаж', s: 1 }; r3[0] = { v: '', s: 1 }; merges.push('A2:A3');
    r2[1] = { v: '№ кв.', s: 1 }; r3[1] = { v: '', s: 1 }; merges.push('B2:B3');
    r2[2] = { v: '№ на эт.', s: 1 }; r3[2] = { v: '', s: 1 }; merges.push('C2:C3');
    var i = 0;
    while (i < nPos) {
      var p = CFG.positions[i], col = OFF + i;
      if (!p.g) {
        r2[col] = { v: p.n, s: 1 }; r3[col] = { v: '', s: 1 };
        merges.push(C(col) + '2:' + C(col) + '3');
        i++;
      } else {
        var j = i;
        while (j < nPos && CFG.positions[j].g === p.g) j++;
        r2[col] = { v: p.g, s: 1 };
        for (var k = i + 1; k < j; k++) r2[OFF + k] = { v: '', s: 1 };
        for (var k2 = i; k2 < j; k2++) r3[OFF + k2] = { v: CFG.positions[k2].n, s: 1 };
        merges.push(C(col) + '2:' + C(OFF + j - 1) + '2');
        i = j;
      }
    }
    var cLeft = OFF + nPos;
    r2[cLeft] = { v: 'Что осталось', s: 1 }; r3[cLeft] = { v: '', s: 1 };
    merges.push(C(cLeft) + '2:' + C(cLeft) + '3');
    rows.push(r2, r3);

    /* данные */
    var rowNo = 4;
    floors(b).forEach(function (fl) {
      var fs = flatsOf(b, fl), startRow = rowNo;
      fs.forEach(function (num, idx) {
        var r = d[num], row = [];
        row[0] = idx === 0 ? { v: fl, s: 2, n: true } : { v: '', s: 2 };
        row[1] = { v: num, s: 2, n: true };
        row[2] = { v: idx + 1, s: 2, n: true };
        CFG.positions.forEach(function (p, pi) {
          var v = r && r.st[p.id];
          row[OFF + pi] = v === 1 ? { v: '✓', s: 4 } : v === 0 ? { v: '✗', s: 5 } : v === 2 ? { v: '—', s: 7 } : { v: '', s: 2 };
        });
        row[cLeft] = { v: (r && r.left) || '', s: 3 };
        rows.push(row); rowNo++;
      });
      if (fs.length > 1) merges.push('A' + startRow + ':A' + (rowNo - 1));
    });
    return {
      name: b.name, cols: cols, rows: rows, merges: merges, freeze: 3,
      print: { landscape: true, titles: '$2:$3', center: true, foot: CFG.object + ' · ' + b.name }
    };
  });

  /* ---- листы «В работу»: наряд электрикам, по одному на корпус ---- */
  expBuildings().forEach(function (b) {
    var d = DATA[b.id] || {}, rows = [], merges = [], rowNo = 3, any = false;
    rows.push([{ v: b.name.toUpperCase() + ' — ЧТО ДОДЕЛАТЬ', s: 6 }]);
    rows.push([{ v: 'Этаж', s: 1 }, { v: '№ кв.', s: 1 }, { v: 'Что сделать', s: 1 }, { v: 'Готово', s: 1 }]);
    merges.push('A1:D1');

    floors(b).forEach(function (fl) {
      var list = flatsOf(b, fl).filter(function (n) {
        var s = status(d[n]); return s === 'bad' || s === 'warn';
      });
      if (!list.length) return;
      any = true;
      var startRow = rowNo;
      list.forEach(function (n, i) {
        var r = d[n];
        var miss = CFG.positions.filter(function (p) { return r.st[p.id] === 0; })
          .map(function (p) { return p.n; }).join(', ');
        var task = miss;
        if (r.left) task += (task ? ' — ' : '') + r.left;
        if (r.crit) task = '⚠ ' + task;
        rows.push([
          i === 0 ? { v: fl, s: 2, n: true } : { v: '', s: 2 },
          { v: n, s: 2, n: true },
          { v: task || 'есть незакрытые пункты', s: 3 },
          { v: '', s: 2 }
        ]);
        rowNo++;
      });
      if (list.length > 1) merges.push('A' + startRow + ':A' + (rowNo - 1));
    });

    if (!any) return;
    sheets.push({
      name: ('В работу — ' + b.name).slice(0, 31),
      cols: [{ w: 7 }, { w: 8 }, { w: 74 }, { w: 10 }],
      rows: rows, merges: merges, freeze: 2,
      print: {
        titles: '$2:$2', center: true,
        foot: CFG.object + ' · ' + b.name + ' · ' + dateStamp()
      }
    });
  });

  /* ---- листы «Подсчёт»: сдельщина, штуки по квартирам ---- */
  expBuildings().forEach(function (b) {
    var d = DATA[b.id] || {}, rows = [], merges = [], any = false;
    var withPrice = hasPrices(), nC = CFG.count.length;
    var lastCol = 2 + nC + (withPrice ? 1 : 0);

    rows.push([{ v: b.name.toUpperCase() + ' — ПОДСЧЁТ', s: 6 }]);
    merges.push('A1:' + C(lastCol) + '1');
    var hdr = [{ v: 'Этаж', s: 1 }, { v: '№ кв.', s: 1 }];
    CFG.count.forEach(function (c) { hdr.push({ v: c.n, s: 1 }); });
    hdr.push({ v: 'Всего шт.', s: 1 });
    if (withPrice) hdr.push({ v: 'Сумма, ₽', s: 1 });
    rows.push(hdr);

    var rowNo = 3, tot = {}, grand = 0, gmoney = 0;
    floors(b).forEach(function (fl) {
      var list = flatsOf(b, fl).filter(function (n) { return qTotal(d[n]); });
      if (!list.length) return;
      any = true;
      var startRow = rowNo;
      list.forEach(function (n, i) {
        var r = d[n], row = [i === 0 ? { v: fl, s: 2, n: true } : { v: '', s: 2 }, { v: n, s: 2, n: true }];
        CFG.count.forEach(function (c) {
          var v = qOf(r, c.id);
          tot[c.id] = (tot[c.id] || 0) + v;
          row.push(v ? { v: v, s: 2, n: true } : { v: '', s: 2 });
        });
        var t = qTotal(r); grand += t;
        row.push({ v: t, s: 2, n: true });
        if (withPrice) { var m = qMoney(r); gmoney += m; row.push({ v: Math.round(m), s: 2, n: true }); }
        rows.push(row); rowNo++;
      });
      if (list.length > 1) merges.push('A' + startRow + ':A' + (rowNo - 1));
    });
    if (!any) return;

    var trow = [{ v: 'ИТОГО', s: 1 }, { v: '', s: 1 }];
    CFG.count.forEach(function (c) { trow.push({ v: tot[c.id] || 0, s: 1, n: true }); });
    trow.push({ v: grand, s: 1, n: true });
    if (withPrice) trow.push({ v: Math.round(gmoney), s: 1, n: true });
    rows.push(trow);
    merges.push('A' + rowNo + ':B' + rowNo);

    var cols = [{ w: 7 }, { w: 8 }];
    CFG.count.forEach(function () { cols.push({ w: 13 }); });
    cols.push({ w: 11 });
    if (withPrice) cols.push({ w: 13 });

    sheets.push({
      name: ('Подсчёт — ' + b.name).slice(0, 31),
      cols: cols, rows: rows, merges: merges, freeze: 2,
      print: { titles: '$2:$2', center: true, foot: CFG.object + ' · ' + b.name + ' · подсчёт · ' + dateStamp() }
    });
  });

  /* лист замечаний — с настоящими фото, встроенными в ячейки */
  var PHCOL = 7, MAXPH = 3;          // с какой колонки идут фото и сколько их влезает
  var ir = [[{ v: 'Корпус', s: 1 }, { v: 'Этаж', s: 1 }, { v: '№ кв.', s: 1 }, { v: '№ на эт.', s: 1 },
  { v: 'Тип', s: 1 }, { v: 'Не выполнено', s: 1 }, { v: 'Что осталось', s: 1 },
  { v: 'Фото 1', s: 1 }, { v: 'Фото 2', s: 1 }, { v: 'Фото 3', s: 1 }]];
  var images = [], rowHeights = {}, big = [];
  expBuildings().forEach(function (b) {
    var d = DATA[b.id] || {};
    allFlats(b).forEach(function (x, gi) {
      var r = d[x.n], s = status(r);
      if (s !== 'bad' && s !== 'warn') return;
      var miss = CFG.positions.filter(function (p) { return r.st[p.id] === 0; }).map(function (p) { return p.n; }).join(', ');
      var idx = flatsOf(b, x.f).indexOf(x.n) + 1;
      var row = [{ v: b.name, s: 3 }, { v: x.f, s: 2, n: true }, { v: x.n, s: 2, n: true },
      { v: idx, s: 2, n: true }, { v: r.crit ? 'Критично' : 'Обычное', s: 2 },
      { v: miss, s: 3 }, { v: r.left || '', s: 3 }];
      for (var c = 0; c < MAXPH; c++) row[PHCOL + c] = { v: '', s: 2 };
      var rowIdx = ir.length;
      ir.push(row);

      (r.ph || []).slice(0, MAXPH).forEach(function (id, k) {
        var im = IMG[id];
        if (!im || !im.thumb) return;
        images.push({ col: PHCOL + k, row: rowIdx, data: im.thumb, wpx: im.tw, hpx: im.th, name: photoName(b, x, k) });
        rowHeights[rowIdx] = Math.max(rowHeights[rowIdx] || 0, window.XLS.rowHeightPx(im.th + 6));
      });
    });
  });
  /* на лист «Фото» идут все снимки — в том числе с квартир без замечаний */
  expBuildings().forEach(function (b) {
    var d = DATA[b.id] || {};
    allFlats(b).forEach(function (x) {
      var r = d[x.n];
      if (!r || !(r.ph || []).length) return;
      var miss = CFG.positions.filter(function (p) { return r.st[p.id] === 0; }).map(function (p) { return p.n; }).join(', ');
      r.ph.forEach(function (id, k) {
        var im = IMG[id];
        if (im && im.full) big.push({ b: b, x: x, r: r, k: k, im: im, miss: miss });
      });
    });
  });
  sheets.push({
    name: 'Замечания',
    cols: [{ w: 14 }, { w: 7 }, { w: 8 }, { w: 9 }, { w: 12 }, { w: 28 }, { w: 40 },
    { w: window.XLS.colWidthPx(THUMB_BOX + 8) }, { w: window.XLS.colWidthPx(THUMB_BOX + 8) },
    { w: window.XLS.colWidthPx(THUMB_BOX + 8) }],
    rows: ir, merges: [], rowHeights: rowHeights, images: images, freeze: 1,
    print: { landscape: true, titles: '$1:$1', foot: CFG.object + ' · замечания' }
  });

  /* отдельный лист «Фото» — крупно, чтобы прорабу было видно без возни */
  if (big.length) {
    var pr = [[{ v: 'Квартира', s: 1 }, { v: 'Замечание', s: 1 }, { v: 'Фото', s: 1 }]];
    var pimg = [], ph2 = {};
    big.forEach(function (it) {
      var idx = flatsOf(it.b, it.x.f).indexOf(it.x.n) + 1;
      var rowIdx = pr.length;
      pr.push([
        { v: it.b.name + '\nЭтаж ' + it.x.f + '\nКв. ' + it.x.n + ' (№' + idx + ')' +
          (it.r.crit ? '\n⚠ Критично' : ''), s: 3 },
        { v: it.r.left || it.miss || '', s: 3 },
        { v: '', s: 2 }
      ]);
      pimg.push({ col: 2, row: rowIdx, data: it.im.full, wpx: it.im.fw, hpx: it.im.fh,
        name: photoName(it.b, it.x, it.k) });
      ph2[rowIdx] = window.XLS.rowHeightPx(it.im.fh + 8);
    });
    sheets.push({
      name: 'Фото',
      cols: [{ w: 22 }, { w: 40 }, { w: window.XLS.colWidthPx(BIG_W + 10) }],
      rows: pr, merges: [], rowHeights: ph2, images: pimg, freeze: 1,
      print: { titles: '$1:$1', foot: CFG.object + ' · фото замечаний' }
    });
  }

  try {
    download(window.XLS.workbook(sheets), 'Шахматка_' + CFG.object.replace(/\s+/g, '_') + expSuffix() + '_' + dateStamp() + '.xlsx');
    toast('Шахматка выгружена');
  } catch (e) { alert('Не удалось собрать файл: ' + e.message); }
}
/* ---------- замечания одного обхода: таблица без фото ----------
   Снимки сюда не кладём: в ячейке фото обрезается по её границе, а строки разной
   высоты дёргают прокрутку. Смотреть замечания с фото — отчёт .html и альбом .pdf,
   эта таблица нужна для стройконтроля и правок. */
function exportIssuesPeriod() {
  var res = issuesInPeriod(UI.iper || 'today', UI.iday || '');
  if (!res.rows.length) { toast('За этот день замечаний нет'); return; }
  buildIssuesPeriod(res);
}
function buildIssuesPeriod(res) {
  var C = window.colName;
  var rows = [], merges = [], lastCol = 7;

  rows.push([{ v: 'ЗАМЕЧАНИЯ — ' + res.label.toUpperCase(), s: 6 }]);
  merges.push('A1:' + C(lastCol) + '1');
  rows.push([{ v: CFG.object + ' · выгружено ' + dateStamp(), s: 3 }]);
  merges.push('A2:' + C(lastCol) + '2');
  rows.push([{ v: 'Корпус', s: 1 }, { v: 'Этаж', s: 1 }, { v: '№ кв.', s: 1 }, { v: '№ на эт.', s: 1 },
  { v: 'Тип', s: 1 }, { v: 'Не выполнено', s: 1 }, { v: 'Что осталось', s: 1 },
  { v: 'Фото, шт.', s: 1 }]);

  res.rows.forEach(function (x) {
    var r = x.r;
    rows.push([{ v: x.b.name, s: 3 }, { v: x.f, s: 2, n: true }, { v: x.n, s: 2, n: true },
    { v: flatsOf(x.b, x.f).indexOf(x.n) + 1, s: 2, n: true },
    { v: r.crit ? 'Критично' : 'Обычное', s: 2 }, { v: x.miss, s: 3 },
    { v: r.left || '', s: 3 },
    { v: (x.ph || []).length || '', s: 2, n: !!(x.ph || []).length }]);
  });

  var sheet = {
    name: 'Замечания', freeze: 3,
    cols: [{ w: 13 }, { w: 7 }, { w: 8 }, { w: 9 }, { w: 12 }, { w: 30 }, { w: 46 }, { w: 10 }],
    rows: rows, merges: merges,
    print: { landscape: true, titles: '$3:$3', foot: CFG.object + ' · замечания · ' + res.label }
  };
  try {
    download(window.XLS.workbook([sheet]),
      'Замечания_' + res.label.replace(/\s+/g, '_') + issueSuffix() + '_' + dateStamp() + '.xlsx');
    toast('Готово: ' + res.rows.length + ' замечаний');
  } catch (e) { alert('Не удалось собрать файл: ' + e.message); }
}

/* ---------- отчёт по обходу: смотреть, а не сводить ----------
   Excel годится, чтобы отдать список в стройконтроль, но смотреть по нему фото
   нельзя: снимок обрезается границей ячейки, а строки разной высоты дёргают
   прокрутку. Поэтому те же данные отдаём вторым видом — одно замечание на экран
   (HTML) или на страницу А4 (PDF). */
var REP_MAX = 1200;   // px — снимок в отчёте: хватает, чтобы приблизить, и не раздувает файл

function prepareReportPhotos(ids) {
  var out = {}, i = 0;
  function step() {
    if (i >= ids.length) return Promise.resolve(out);
    var id = ids[i++];
    return getPhoto(id).then(function (url) {
      if (!url) return step();
      return loadImg(url).then(function (img) {
        var cv = document.createElement('canvas');
        var s = fit(img.width, img.height, REP_MAX, REP_MAX);
        cv.width = s.w; cv.height = s.h;
        var g2 = cv.getContext('2d');
        g2.imageSmoothingQuality = 'high';
        g2.drawImage(img, 0, 0, s.w, s.h);
        var durl = cv.toDataURL('image/jpeg', 0.78);
        /* для PDF нужен уже декодированный кадр — рисуем его на страницу */
        return loadImg(durl).then(function (ready) {
          out[id] = { url: durl, img: ready };
          return step();
        });
      });
    }).catch(function () { return step(); });
  }
  return step();
}

function reportItems(res, PH) {
  return res.rows.map(function (x) {
    var ph = (x.ph || []).map(function (id) { return PH[id]; }).filter(Boolean);
    return {
      b: x.b.name, f: x.f, n: x.n, crit: !!x.r.crit,
      miss: x.miss, left: x.r.left || '', photos: ph
    };
  });
}

function exportReport(kind) {
  var res = issuesInPeriod(UI.iper || 'today', UI.iday || '');
  if (!res.rows.length) { toast('За этот день замечаний нет'); return; }
  var ids = [];
  res.rows.forEach(function (x) {
    (x.ph || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
  });
  toast(ids.length ? 'Готовлю ' + ids.length + ' фото…' : 'Собираю отчёт…');
  prepareReportPhotos(ids).then(function (PH) {
    var items = reportItems(res, PH);
    var base = 'Замечания_' + res.label.replace(/\s+/g, '_') + issueSuffix() + '_' + dateStamp();
    if (kind === 'html') {
      var doc = window.REPORT.html(items.map(function (it) {
        return {
          b: it.b, f: it.f, n: it.n, crit: it.crit, miss: it.miss, left: it.left,
          photos: it.photos.map(function (p) { return p.url; })
        };
      }), { object: CFG.object, label: res.label, date: dateStamp() });
      download(new Blob([doc], { type: 'text/html;charset=utf-8' }), base + '.html');
      toast('Отчёт готов: ' + items.length + ' замечаний');
      return;
    }
    /* PDF: квартира с тремя фото даёт три страницы — на каждой свой снимок целиком */
    var pages = [];
    items.forEach(function (it) {
      var a = window.REPORT.addr(it);
      if (!it.photos.length) {
        pages.push({ addr: a, crit: it.crit, miss: it.miss, left: it.left, img: null, cap: 'без фото' });
        return;
      }
      it.photos.forEach(function (p, k) {
        pages.push({
          addr: a, crit: it.crit, miss: it.miss, left: it.left, img: p.img,
          cap: it.photos.length > 1 ? 'фото ' + (k + 1) + ' из ' + it.photos.length : ''
        });
      });
    });
    download(window.REPORT.pdf(pages, CFG.object + ' · ' + res.label + ' · ' + dateStamp()),
      base + '.pdf');
    toast('Альбом готов: ' + pages.length + ' стр.');
  }).catch(function (e) { alert('Не удалось собрать отчёт: ' + e.message); });
}

/* ---------- наряд бригаде: только этот обход ---------- */
function exportNaryad() {
  var per = UI.nper || 'today', sel = UI.ncrew || 'all';
  /* «Все бригады» — это не сводная каша, а лист на каждую бригаду отдельно */
  var crews = sel === 'all' ? CFG.crews.map(function (w) { return w.id; }) : [sel];
  var sets = crews.map(function (w) { return naryad(per, w); })
    .filter(function (nd) { return nd.grand > 0; });
  if (!sets.length) { toast('За этот период ничего не отмечено'); return; }

  var ids = [];
  sets.forEach(function (nd) {
    nd.rows.forEach(function (x) {
      (x.fixph || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    });
  });
  if (ids.length) toast('Готовлю наряд…');
  preparePhotos(ids).then(function (IMG) { buildNaryad(sets, IMG); })
    .catch(function () { buildNaryad(sets, {}); });
}

function buildNaryad(sets, IMG) {
  var C = window.colName, withPrice = hasPrices(), nC = CFG.count.length;
  var sheets = [];

  sets.forEach(function (nd) {
    var OFFN = 4;                                   /* Корпус, Этаж, № кв., № на эт. */
    var lastCol = OFFN + nC + (withPrice ? 1 : 0);
    var rows = [], merges = [];

    rows.push([{ v: 'НАРЯД — ' + nd.crew.toUpperCase(), s: 6 }]);
    merges.push('A1:' + C(lastCol) + '1');
    rows.push([{ v: CFG.object + ' · ' + nd.period + ' · выгружено ' + dateStamp(), s: 3 }]);
    merges.push('A2:' + C(lastCol) + '2');

    /* строки 3-4: разделы подсчёта над названиями позиций */
    var r3 = [{ v: 'Корпус', s: 1 }, { v: 'Этаж', s: 1 }, { v: '№ кв.', s: 1 }, { v: '№ на эт.', s: 1 }];
    var r4 = [{ v: '', s: 1 }, { v: '', s: 1 }, { v: '', s: 1 }, { v: '', s: 1 }];
    ['A', 'B', 'C', 'D'].forEach(function (col) { merges.push(col + '3:' + col + '4'); });
    var i = 0;
    while (i < nC) {
      var c = CFG.count[i], col = OFFN + i;
      if (!c.g) {
        r3[col] = { v: c.n, s: 1 }; r4[col] = { v: '', s: 1 };
        merges.push(C(col) + '3:' + C(col) + '4');
        i++;
      } else {
        var j = i;
        while (j < nC && CFG.count[j].g === c.g) j++;
        r3[col] = { v: c.g, s: 1 };
        for (var k = i + 1; k < j; k++) r3[OFFN + k] = { v: '', s: 1 };
        for (var k2 = i; k2 < j; k2++) r4[OFFN + k2] = { v: CFG.count[k2].n, s: 1 };
        merges.push(C(col) + '3:' + C(OFFN + j - 1) + '3');
        i = j;
      }
    }
    var cTot = OFFN + nC;
    r3[cTot] = { v: 'Всего шт.', s: 1 }; r4[cTot] = { v: '', s: 1 };
    merges.push(C(cTot) + '3:' + C(cTot) + '4');
    if (withPrice) {
      r3[cTot + 1] = { v: 'Сумма, ₽', s: 1 }; r4[cTot + 1] = { v: '', s: 1 };
      merges.push(C(cTot + 1) + '3:' + C(cTot + 1) + '4');
    }
    rows.push(r3, r4);

    nd.rows.sort(function (a, z) {
      return a.b.name.localeCompare(z.b.name) || a.f - z.f || a.n - z.n;
    }).forEach(function (x) {
      var row = [{ v: x.b.name, s: 3 }, { v: x.f, s: 2, n: true }, { v: x.n, s: 2, n: true },
      { v: flatsOf(x.b, x.f).indexOf(x.n) + 1, s: 2, n: true }];
      CFG.count.forEach(function (c) {
        row.push(x.per[c.id] ? { v: x.per[c.id], s: 2, n: true } : { v: '', s: 2 });
      });
      row.push({ v: x.sum, s: 2, n: true });
      if (withPrice) row.push({ v: Math.round(x.money), s: 2, n: true });
      rows.push(row);
    });

    var trow = [{ v: 'ИТОГО', s: 1 }, { v: '', s: 1 }, { v: '', s: 1 }, { v: '', s: 1 }];
    CFG.count.forEach(function (c) { trow.push({ v: nd.totals[c.id] || 0, s: 1, n: true }); });
    trow.push({ v: nd.grand, s: 1, n: true });
    if (withPrice) trow.push({ v: Math.round(nd.money), s: 1, n: true });
    rows.push(trow);
    merges.push('A' + rows.length + ':D' + rows.length);

    var cols = [{ w: 13 }, { w: 7 }, { w: 8 }, { w: 9 }];
    CFG.count.forEach(function () { cols.push({ w: 13 }); });
    cols.push({ w: 11 });
    if (withPrice) cols.push({ w: 13 });

    sheets.push({
      name: ('Наряд — ' + nd.crew).slice(0, 31), cols: cols, rows: rows, merges: merges, freeze: 4,
      print: { titles: '$3:$4', center: true, foot: CFG.object + ' · ' + nd.crew + ' · ' + nd.period }
    });
  });

  /* лист «Что переделать»: то, что отмечено в подсчёте, со своими фото */
  var MAXF = 3;
  var ir = [[{ v: 'Бригада', s: 1 }, { v: 'Корпус', s: 1 }, { v: 'Этаж', s: 1 }, { v: '№ кв.', s: 1 },
  { v: '№ на эт.', s: 1 }, { v: 'Что переделать', s: 1 },
  { v: 'Фото 1', s: 1 }, { v: 'Фото 2', s: 1 }, { v: 'Фото 3', s: 1 }]];
  var images = [], rh = {}, seen = {};
  sets.forEach(function (nd) {
    nd.rows.forEach(function (x) {
      var key = x.b.id + '_' + x.n;
      if (seen[key]) return;
      var r = x.r, ph = (x.fixph || []).slice(0, MAXF);
      if (!r.fix && !ph.length) return;
      seen[key] = 1;
      var rowIdx = ir.length;
      var row = [{ v: nd.crew, s: 3 }, { v: x.b.name, s: 3 }, { v: x.f, s: 2, n: true },
      { v: x.n, s: 2, n: true }, { v: flatsOf(x.b, x.f).indexOf(x.n) + 1, s: 2, n: true },
      { v: r.fix || '', s: 3 }];
      for (var c = 0; c < MAXF; c++) row.push({ v: '', s: 2 });
      ir.push(row);
      ph.forEach(function (id, k) {
        var im = IMG[id];
        if (!im || !im.full) return;
        images.push({ col: 6 + k, row: rowIdx, data: im.full, wpx: im.fw, hpx: im.fh,
          name: photoName(x.b, x, k) });
        rh[rowIdx] = Math.max(rh[rowIdx] || 0, window.XLS.rowHeightPx(im.fh + 8));
      });
    });
  });
  if (ir.length > 1) {
    var pw = window.XLS.colWidthPx(BIG_W + 10);
    sheets.push({
      name: 'Что переделать',
      cols: [{ w: 15 }, { w: 13 }, { w: 7 }, { w: 8 }, { w: 9 }, { w: 40 }, { w: pw }, { w: pw }, { w: pw }],
      rows: ir, merges: [], rowHeights: rh, images: images, freeze: 1,
      print: { landscape: true, titles: '$1:$1', foot: CFG.object + ' · что переделать' }
    });
  }

  var nm = sets.length === 1 ? sets[0].crew.replace(/\s+/g, '_') : 'бригады';
  try {
    download(window.XLS.workbook(sheets), 'Наряд_' + nm + '_' + dateStamp() + '.xlsx');
    toast('Наряд готов: листов ' + sheets.length);
  } catch (e) { alert('Не удалось собрать наряд: ' + e.message); }
}

function photoName(b, x, i) {
  return b.name.replace(/\s+/g, '') + '_эт' + x.f + '_кв' + x.n + (i ? '_' + (i + 1) : '') + '.jpg';
}

function exportPhotos() {
  var want = [];
  expBuildings().forEach(function (b) {
    var d = DATA[b.id] || {};
    allFlats(b).forEach(function (x) {
      var r = d[x.n]; if (!r || !r.ph || !r.ph.length) return;
      r.ph.forEach(function (id, i) { want.push({ id: id, name: photoName(b, x, i) }); });
    });
  });
  if (!want.length) { toast('Фото пока нет'); return; }
  toast('Собираю ' + want.length + ' фото…');
  var files = [], i = 0;
  function step() {
    if (i >= want.length) {
      if (!files.length) { toast('Фото пока нет'); return; }
      download(window.XLS.zip(files), 'Фото' + expSuffix() + '_' + dateStamp() + '.zip');
      toast(files.length + ' фото выгружено');
      return;
    }
    var w = want[i++];
    return getPhoto(w.id).then(function (url) {
      var u8 = url && dataUrlToBytes(url);
      if (u8) files.push({ name: w.name, data: u8 });
      return step();
    });
  }
  step();
}

/* ================= обмен с напарником ================= */
/* Подпись записи: если совпала — расхождения нет, сливать нечего. */
function sig(r) {
  if (!r) return '';
  var st = CFG.positions.map(function (p) { return p.id + ':' + (r.st[p.id] == null ? '-' : r.st[p.id]); }).join(',');
  var q = CFG.count.map(function (c) { return c.id + ':' + qOf(r, c.id); }).join(',');
  return st + '|' + q + '|' + (r.left || '') + '|' + (r.crit ? 1 : 0) + '|' + ((r.ph || []).length);
}
function summarize(r) {
  if (!r) return 'ничего не отмечено';
  var ok = 0, bad = 0, na = 0;
  CFG.positions.forEach(function (p) {
    var v = r.st[p.id];
    if (v === 1) ok++; else if (v === 0) bad++; else if (v === 2) na++;
  });
  var t = [];
  if (ok) t.push(ok + ' ✓');
  if (bad) t.push(bad + ' ✗');
  if (na) t.push(na + ' —');
  if (!t.length) t.push('пусто');
  if (r.left) t.push('«' + r.left.slice(0, 40) + (r.left.length > 40 ? '…' : '') + '»');
  if ((r.ph || []).length) t.push((r.ph || []).length + ' фото');
  return t.join(' · ');
}

function shareExport() {
  if (!CFG.me) {
    var nm = prompt('Как тебя подписать в файле? (чтобы напарник понял, чьи это отметки)', 'Прораб');
    if (nm === null) return;
    CFG.me = nm.trim() || 'Прораб'; save();
  }
  var ids = [];
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    Object.keys(d).forEach(function (n) {
      (d[n].ph || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    });
  });
  toast('Собираю файл…');
  jsonWithPhotos({ v: 1, from: CFG.me, at: Date.now(), cfg: CFG, data: DATA }, ids).then(function (blob) {
    download(blob, 'Обход_' + CFG.me.replace(/\s+/g, '_') + '_' + dateStamp() + '.json');
    toast('Файл готов — отправь напарнику');
  });
}

/* Копию собираем по кускам: склеивать 60+ МБ в одну строку телефон не тянет. */
function jsonWithPhotos(head, ids) {
  var parts = [JSON.stringify(head).slice(0, -1) + ',"ph":{'], i = 0, first = true;
  function step() {
    if (i >= ids.length) {
      parts.push('}}');
      return Promise.resolve(new Blob(parts, { type: 'application/json' }));
    }
    var id = ids[i++];
    return idb.get(id).then(function (url) {
      if (url) {
        parts.push((first ? '' : ',') + JSON.stringify(id) + ':' + JSON.stringify(url));
        first = false;
      }
      return step();
    }).catch(function () { return step(); });
  }
  return step();
}

var PENDING = null;
function shareImport() {
  var inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = function () {
    var f = inp.files[0]; if (!f) return;
    var fr = new FileReader();
    fr.onload = function () {
      var o;
      try { o = JSON.parse(fr.result); } catch (e) { alert('Файл не читается: ' + e.message); return; }
      if (!o || !o.data || !o.cfg) { alert('Это не файл обхода.'); return; }
      buildMerge(o);
    };
    fr.readAsText(f);
  };
  inp.click();
}

function buildMerge(o) {
  var auto = [], conflicts = [], newBuildings = [];
  var localIds = CFG.buildings.map(function (b) { return b.id; });

  (o.cfg.buildings || []).forEach(function (nb) {
    if (localIds.indexOf(nb.id) < 0) newBuildings.push(nb);
  });

  Object.keys(o.data || {}).forEach(function (bid) {
    var theirD = o.data[bid] || {}, myD = DATA[bid] || {};
    Object.keys(theirD).forEach(function (n) {
      var theirs = theirD[n], mine = myD[n];
      if (!theirs) return;
      if (!mine) { auto.push({ bid: bid, n: n, theirs: theirs }); return; }
      if (sig(mine) === sig(theirs)) return;
      conflicts.push({
        bid: bid, n: n, mine: mine, theirs: theirs,
        pick: (theirs.ts || 0) > (mine.ts || 0) ? 'theirs' : 'mine'
      });
    });
  });

  PENDING = { src: o, auto: auto, conflicts: conflicts, newBuildings: newBuildings };

  if (!conflicts.length) {
    applyMerge();
    return;
  }
  go('mergeview');
}

function applyMerge() {
  var P = PENDING; if (!P) return;
  /* фото напарника кладём к себе */
  var incoming = P.src.ph || {};
  Object.keys(incoming).forEach(function (id) { idb.put(id, incoming[id]); });
  /* корпуса, которых у меня нет */
  P.newBuildings.forEach(function (nb) {
    if (!CFG.buildings.some(function (b) { return b.id === nb.id; })) CFG.buildings.push(nb);
  });
  var took = 0;
  P.auto.forEach(function (it) {
    DATA[it.bid] = DATA[it.bid] || {};
    DATA[it.bid][it.n] = it.theirs; took++;
  });
  var kept = 0;
  P.conflicts.forEach(function (c) {
    if (c.pick === 'theirs') { DATA[c.bid][c.n] = c.theirs; took++; } else kept++;
  });
  PENDING = null;
  ensureCfg();
  save();
  toast('Принято квартир: ' + took + (kept ? ', оставлено своих: ' + kept : ''));
  go('obj');
}

function viewMerge() {
  var P = PENDING;
  if (!P) return viewExport();
  var from = h(P.src.from || 'напарник');
  var body = P.conflicts.map(function (c, i) {
    var b = bld(c.bid), fl = allFlats(b).filter(function (x) { return String(x.n) === String(c.n); })[0];
    return '<div class="card" style="padding:12px;margin-bottom:10px">' +
      '<div style="font-weight:650;margin-bottom:8px">Кв. ' + c.n +
      (fl ? ' <span style="font-weight:500;color:var(--muted-fg)">· этаж ' + fl.f + '</span>' : '') + '</div>' +
      '<button class="pickrow ' + (c.pick === 'mine' ? 'on' : '') + '" data-pick="' + i + '|mine">' +
      '<b>Моя</b><span>' + h(summarize(c.mine)) + '</span><u>' + timeStr(c.mine.ts) + '</u></button>' +
      '<button class="pickrow ' + (c.pick === 'theirs' ? 'on' : '') + '" data-pick="' + i + '|theirs">' +
      '<b>' + from + '</b><span>' + h(summarize(c.theirs)) + '</span><u>' + timeStr(c.theirs.ts) + '</u></button>' +
      '</div>';
  }).join('');

  return topbar({
    left: '<button class="iconbtn" data-act="cancelmerge">' + I.left + '</button>',
    title: 'Что оставить?',
    sub: 'от ' + from,
    right: '<span style="width:44px"></span>'
  }) +
    '<div class="screen">' +
    '<div class="hint" style="margin-top:0">Без вопросов добавится квартир: <b>' + P.auto.length +
    '</b>. Ниже — ' + P.conflicts.length + ', где вы разошлись. По умолчанию выбрана более свежая проверка.</div>' +
    '<div style="display:flex;gap:8px;margin-bottom:14px">' +
    '<button class="tab" data-pickall="mine">Везде мои</button>' +
    '<button class="tab" data-pickall="theirs">Везде ' + from + '</button></div>' +
    body +
    '</div>' +
    '<div class="navbar"><button class="btn btn-ghost" data-act="cancelmerge">Отмена</button>' +
    '<button class="btn btn-primary" data-act="applymerge">' + I.check + ' Применить</button></div>';
}

/* Выгрузка начальнику: только итоги, без фото и без служебного журнала нажатий.
   Резервная копия с фотографиями весит десятки мегабайт и в мессенджер идёт долго,
   а начальнику нужны цифры, а не снимки. */
function bossExport() {
  var out = {
    t: 'uch-export', v: 1, obj: CFG.object, at: Date.now(),
    crews: CFG.crews.map(function (w) { return { id: w.id, n: w.n }; }),
    /* раздел обязателен: по нему начальник делит квартиру и санузел */
    count: CFG.count.map(function (c) { return { id: c.id, n: c.n, g: c.g || '' }; }),
    positions: CFG.positions.map(function (p) { return { id: p.id, n: p.n, g: p.g || '' }; }),
    buildings: CFG.buildings.map(function (b) {
      return { id: b.id, name: b.name, from: b.from, to: b.to, per: b.per, first: b.first, ex: b.ex || null };
    }),
    flats: {}
  };
  var n = 0;
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {}, o = {};
    allFlats(b).forEach(function (x) {
      var r = d[x.n];
      if (!r) return;
      var st = status(r), rec2 = {};
      if (st === 'ok') rec2.c = 1;
      else if (st === 'warn' || st === 'bad') rec2.c = 2;
      var miss = CFG.positions.filter(function (p) { return r.st[p.id] === 0; })
        .map(function (p) { return p.n; });
      if (miss.length) rec2.miss = miss.join(', ');
      if (r.left) rec2.left = r.left;
      if (r.crit) rec2.crit = 1;
      if (r.fix) rec2.fix = r.fix;
      if (qTotal(r)) rec2.q = r.q;
      /* по бригадам — ради этого начальник и смотрит подсчёт */
      var bc = byCrew(r), w = {};
      Object.keys(bc).forEach(function (k) { w[k] = bc[k].per; });
      if (Object.keys(w).length) rec2.w = w;
      if (Object.keys(rec2).length) { o[x.n] = rec2; n++; }
    });
    if (Object.keys(o).length) out.flats[b.id] = o;
  });
  if (!n) { toast('Пока нечего выгружать'); return; }
  download(new Blob([JSON.stringify(out)], { type: 'application/json' }),
    'Начальнику_' + dateStamp() + '.json');
  toast('Готово: квартир ' + n);
}

function backup() {
  var ids = [];
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    Object.keys(d).forEach(function (n) {
      (d[n].ph || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    });
  });
  toast('Собираю копию…');
  jsonWithPhotos({ cfg: CFG, data: DATA }, ids).then(function (blob) {
    download(blob, 'Шахматка_копия_' + dateStamp() + '.json');
    toast('Копия сохранена');
  });
}
function restore() {
  var inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = function () {
    var f = inp.files[0]; if (!f) return;
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var o = JSON.parse(fr.result);
        if (!o.cfg || !o.data) throw new Error('не тот файл');
        if (!confirm('Заменить текущие данные данными из копии?')) return;
        CFG = o.cfg; DATA = o.data; ensureCfg();
        PH = {}; PHQ = [];
        var ph = o.ph || {}, keys = Object.keys(ph), k = 0;
        toast('Переношу ' + keys.length + ' фото…');
        (function put() {
          if (k >= keys.length) {
            o = null; ph = null;
            UI.b = CFG.buildings[0].id; UI.floor = CFG.buildings[0].from;
            save(); toast('Данные восстановлены'); go('obj');
            return;
          }
          var id = keys[k++];
          idb.put(id, ph[id]).then(put).catch(put);
        })();
      } catch (e) { alert('Файл не подошёл: ' + e.message); }
    };
    fr.readAsText(f);
  };
  inp.click();
}

/* ============ старт ============ */
window.addEventListener('DOMContentLoaded', function () {
  app = document.getElementById('app');
  load();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () { });
  go(UI.tab === 'flat' ? 'obj' : UI.tab);
});
