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
    user: s('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>')
  };
})();
var POS_ICONS = ['panel', 'swtch', 'socket', 'box', 'lamp', 'ceil', 'socket', 'shield', 'bolt'];

/* ============ конфигурация по умолчанию ============ */
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
function load() {
  try { CFG = JSON.parse(localStorage.getItem('shm_cfg')) || null; } catch (e) { CFG = null; }
  if (!CFG || !CFG.buildings) CFG = JSON.parse(JSON.stringify(DEFAULT_CFG));
  try { DATA = JSON.parse(localStorage.getItem('shm_data')) || {}; } catch (e) { DATA = {}; }
  try { UI = JSON.parse(localStorage.getItem('shm_ui')) || {}; } catch (e) { UI = {}; }
  if (!UI.b) UI.b = CFG.buildings[0].id;
  if (UI.floor == null) UI.floor = CFG.buildings[0].from;
  UI.tab = UI.tab || 'obj';
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
var PH = {}; // кэш фото в памяти: id -> dataURL

/* ============ вспомогательное ============ */
function bld(id) { return CFG.buildings.filter(function (b) { return b.id === (id || UI.b); })[0] || CFG.buildings[0]; }
function floors(b) { var a = []; for (var f = b.from; f <= b.to; f++) a.push(f); return a; }
function flatsOf(b, f) {
  var a = [], start = b.first + (f - b.from) * b.per;
  for (var i = 0; i < b.per; i++) a.push(start + i);
  return a;
}
function allFlats(b) {
  var a = [];
  floors(b).forEach(function (f) { flatsOf(b, f).forEach(function (n) { a.push({ f: f, n: n }); }); });
  return a;
}
function rec(bid, n, create) {
  DATA[bid] = DATA[bid] || {};
  if (!DATA[bid][n] && create) DATA[bid][n] = { st: {}, left: '', note: '', crit: false, ph: [], ts: 0 };
  return DATA[bid][n];
}
function status(r) {
  if (!r) return 'new';
  var vals = CFG.positions.map(function (p) { return r.st[p.id]; });
  var filled = vals.filter(function (v) { return v != null; }).length;
  var bad = vals.filter(function (v) { return v === 0; }).length;
  if (bad) return r.crit ? 'bad' : 'warn';
  if (filled === 0) return (r.left || r.note) ? 'part' : 'new';
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
  if (name === 'obj' || name === 'issues' || name === 'export' || name === 'settings') UI.tab = name;
  save();
  render();
  window.scrollTo(0, 0);
}

/* ============ рендер ============ */
var app;
function render() {
  var f = { obj: viewObject, flat: viewFlat, issues: viewIssues, export: viewExport, settings: viewSettings, mergeview: viewMerge }[VIEW.name];
  app.innerHTML = f();
  bind();
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
        return '<div class="item"><span class="item-ico">' + I[POS_ICONS[it.idx % POS_ICONS.length]] + '</span>' +
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
    '<textarea id="left" rows="2" maxlength="200" placeholder="Например: выключатель в спальне не работает">' + h(r.left) + '</textarea>' +
    '<div class="cnt"><span id="leftc">' + (r.left || '').length + '</span>/200</div>' +
    '<div class="crit"><b>Критичное замечание</b><span class="sw' + (r.crit ? ' on' : '') + '" data-act="crit"></span></div>' +
    '<label class="fld">Фото</label><div class="photos" id="photos">' + photosHtml(r) + '</div>' +
    '<label class="fld">Примечание</label>' +
    '<textarea id="note" rows="2" placeholder="Необязательно">' + h(r.note) + '</textarea>' +
    '</div>' + navbar(prev, next);
}
function photosHtml(r) {
  return (r.ph || []).map(function (id) {
    return '<span class="photo-wrap"><img class="photo" src="' + (PH[id] || '') + '" alt="Фото замечания">' +
      '<button class="photo-del" data-delph="' + id + '" aria-label="Удалить фото">' + I.x + '</button></span>';
  }).join('') +
    '<button class="photo-add" data-act="addph" aria-label="Добавить фото">' + I.cam + '</button>';
}
function navbar(prev, next) {
  return '<div class="navbar">' +
    '<button class="btn btn-ghost" data-nav="' + (prev ? prev.n : '') + '"' + (prev ? '' : ' disabled') + '>' +
    I.left + '<span class="lb"><i>Предыдущая</i>Кв. ' + (prev ? prev.n : '—') + '</span></button>' +
    '<button class="btn btn-primary" data-nav="' + (next ? next.n : '') + '"' + (next ? '' : ' disabled') + '>' +
    '<span class="lb"><i>Следующая</i>Кв. ' + (next ? next.n : '—') + '</span>' + I.right + '</button>' +
    '</div>';
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
        ((x.r.ph || []).length ? '<img src="' + (PH[x.r.ph[0]] || '') + '" alt="Фото">' : '') +
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
  return topbar({ left: '<span style="width:44px"></span>', title: 'Выгрузка', right: '<span style="width:44px"></span>' }) +
    '<div class="screen">' +
    '<button class="btn btn-primary btn-lg" data-act="xlsx">' + I.file + ' Скачать шахматку (.xlsx)</button>' +
    '<div class="hint">Файл по форме начальника: лист на каждый корпус + лист «Замечания». Открывается в Excel и Numbers.</div>' +
    '<button class="btn btn-ghost" data-act="photozip">' + I.cam + ' Скачать фото (.zip)</button>' +
    '<div class="hint">Имена файлов — Корпус_Этаж_Кв.jpg, совпадают с колонкой «Фото» в листе замечаний.</div>' +
    '<div class="sec" style="margin-top:26px">Напарник</div>' +
    '<button class="btn btn-ghost" data-act="share" style="margin-bottom:10px">' + I.share + ' Передать напарнику</button>' +
    '<button class="btn btn-ghost" data-act="merge">' + I.merge + ' Принять от напарника</button>' +
    '<div class="hint">Файл кидаете друг другу в Telegram. При загрузке квартиры <b>сливаются</b>, а не затираются: чужие проверенные добавятся к твоим. Если одну квартиру проверили оба и по-разному — приложение спросит, чью версию оставить.</div>' +
    '<div class="sec" style="margin-top:26px">Страховка</div>' +
    '<button class="btn btn-ghost" data-act="backup">' + I.file + ' Резервная копия (.json)</button>' +
    '<div class="hint">Сохрани раз в пару дней на случай потери телефона. Восстановить: Настройки → Загрузить копию (заменит всё целиком).</div>' +
    '<div class="sec" style="margin-top:26px">Предпросмотр · ' + h(b.name) + '</div>' +
    '<div class="tabs"><button class="tab ' + (mode === 'sh' ? 'on' : '') + '" data-pv="sh">Шахматка</button>' +
    '<button class="tab ' + (mode === 'is' ? 'on' : '') + '" data-pv="is">Замечания</button></div>' +
    (mode === 'sh' ? previewTable(b) : previewIssues(b)) +
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
      (CFG.buildings.length > 1 ? '<div class="row"><b style="color:var(--bad)">Удалить корпус</b><button class="iconbtn" data-delb="' + i + '" style="color:var(--bad)">' + I.trash + '</button></div>' : '') +
      '</div>';
  }).join('');

  var ps = CFG.positions.map(function (p, i) {
    return '<div class="drag"><span class="item-ico">' + I[POS_ICONS[i % POS_ICONS.length]] + '</span>' +
      '<input type="text" data-p="' + i + '|n" value="' + h(p.n) + '">' +
      '<input type="text" data-p="' + i + '|g" value="' + h(p.g || '') + '" placeholder="группа" style="max-width:110px;font-size:13px;color:var(--muted-fg)">' +
      '<button class="iconbtn" data-delp="' + i + '" style="width:36px;height:36px;color:var(--bad)">' + I.trash + '</button></div>';
  }).join('');

  return topbar({ left: '<span style="width:44px"></span>', title: 'Настройки', right: '<span style="width:44px"></span>' }) +
    '<div class="screen">' +
    '<div class="sec">Объект</div>' +
    '<div class="card"><div class="row"><b>Название</b><input type="text" style="width:170px" id="objname" value="' + h(CFG.object) + '"></div></div>' +
    '<div class="sec" style="margin-top:22px">Корпуса</div>' + bs +
    '<button class="btn btn-ghost" data-act="addb">' + I.plus + ' Добавить корпус</button>' +
    '<div class="sec" style="margin-top:24px">Позиции проверки</div>' +
    '<div class="card">' + ps + '</div>' +
    '<div class="hint">Порядок и названия — ровно как в шахматке начальника. «Группа» — это объединяющая шапка в Excel (например «Санузел, коридор»); оставь пустой, если колонка отдельная.</div>' +
    '<button class="btn btn-ghost" data-act="addp">' + I.plus + ' Добавить позицию</button>' +
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
    t('export', I.file, 'Выгрузка') + t('settings', I.gear, 'Настройки') + '</div>';
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
  app.querySelectorAll('[data-pv]').forEach(function (el) {
    el.onclick = function () { VIEW.pv = el.dataset.pv; render(); };
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
      r.ts = Date.now(); vibr(8); save(); render();
    };
  });
  app.querySelectorAll('[data-delph]').forEach(function (el) {
    el.onclick = function () {
      var id = el.dataset.delph, r = rec(UI.b, VIEW.flat, true);
      r.ph = r.ph.filter(function (x) { return x !== id; });
      idb.del(id); delete PH[id]; save(); render();
    };
  });
  app.querySelectorAll('[data-b]').forEach(function (el) {
    el.onchange = function () {
      var p = el.dataset.b.split('|'), b = CFG.buildings[+p[0]];
      b[p[1]] = p[1] === 'name' ? el.value : Math.max(p[1] === 'first' ? 1 : 1, +el.value || 1);
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

  var left = document.getElementById('left');
  if (left) left.oninput = function () {
    var r = rec(UI.b, VIEW.flat, true); r.left = left.value; r.ts = Date.now();
    document.getElementById('leftc').textContent = left.value.length; save();
  };
  var note = document.getElementById('note');
  if (note) note.oninput = function () { var r = rec(UI.b, VIEW.flat, true); r.note = note.value; save(); };
  var on = document.getElementById('objname');
  if (on) on.onchange = function () { CFG.object = on.value; save(); };

  app.querySelectorAll('[data-act]').forEach(function (el) { el.onclick = function () { act(el.dataset.act, el); }; });

  /* свайп между квартирами */
  var sw = document.getElementById('swipe');
  if (sw) {
    var x0 = 0, y0 = 0;
    sw.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    sw.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) < 80 || Math.abs(dy) > 60) return;
      var list = seq(), i = list.findIndex(function (t) { return t.n === VIEW.flat; });
      var t = dx < 0 ? list[i + 1] : list[i - 1];
      if (t) { vibr(6); go('flat', { flat: t.n }); }
    }, { passive: true });
  }

  /* активный этаж — в центр полосы */
  var fr = document.getElementById('floors');
  if (fr) { var a = fr.querySelector('.on'); if (a) fr.scrollLeft = a.offsetLeft - fr.clientWidth / 2 + a.clientWidth / 2; }
}

function act(a, el) {
  var r;
  switch (a) {
    case 'back': go('obj'); break;
    case 'settings': go('settings'); break;
    case 'pickb': pickBuilding(); break;

    case 'allok':
      r = rec(UI.b, VIEW.flat, true);
      CFG.positions.forEach(function (p) { r.st[p.id] = 1; });
      r.ts = Date.now(); vibr(18); save();
      nextFlat();
      break;
    case 'restok':
      r = rec(UI.b, VIEW.flat, true);
      CFG.positions.forEach(function (p) { if (r.st[p.id] == null) r.st[p.id] = 1; });
      r.ts = Date.now(); vibr(14); save(); render();
      break;
    case 'clear':
      if (!confirm('Сбросить отметки по кв. ' + VIEW.flat + '?')) return;
      (DATA[UI.b] || {})[VIEW.flat] = undefined; delete (DATA[UI.b] || {})[VIEW.flat];
      save(); render();
      break;
    case 'crit':
      r = rec(UI.b, VIEW.flat, true); r.crit = !r.crit; vibr(10); save(); render();
      break;
    case 'addph': pickPhoto(); break;
    case 'gonext': continueWalk(); break;

    case 'addb':
      CFG.buildings.push({ id: 'b' + Date.now(), name: 'Корпус ' + (CFG.buildings.length + 1), from: 1, to: 12, per: 8, first: 1 });
      save(); render(); break;
    case 'addp':
      CFG.positions.push({ id: 'p' + Date.now(), n: 'Новая позиция' }); save(); render(); break;
    case 'wipe':
      if (!confirm('Стереть ВСЕ отметки по всем квартирам? Отменить нельзя.')) return;
      DATA = {}; save(); toast('Отметки стёрты'); render(); break;
    case 'restore': restore(); break;

    case 'share': shareExport(); break;
    case 'merge': shareImport(); break;
    case 'applymerge': applyMerge(); break;
    case 'cancelmerge': PENDING = null; go('export'); break;

    case 'xlsx': exportXlsx(); break;
    case 'photozip': exportPhotos(); break;
    case 'backup': backup(); break;
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
function pickPhoto() {
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
        PH[id] = url;
        idb.put(id, url);
        var r = rec(UI.b, VIEW.flat, true);
        r.ph = r.ph || []; r.ph.push(id); r.ts = Date.now();
        save(); render();
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(f);
  };
  inp.click();
}

/* ---------- сохранение файла ---------- */
function download(blob, name) {
  var url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 3000);
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

/* ---------- Excel ---------- */
function exportXlsx() {
  var C = window.colName;
  var sheets = CFG.buildings.map(function (b) {
    var d = DATA[b.id] || {};
    var cols = [], merges = [], rows = [];
    var nPos = CFG.positions.length, OFF = 3, total = OFF + nPos + 2;

    cols.push({ w: 7 }, { w: 8 }, { w: 9 });
    CFG.positions.forEach(function () { cols.push({ w: 11 }); });
    cols.push({ w: 34 }, { w: 22 });

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
    var cLeft = OFF + nPos, cNote = cLeft + 1;
    r2[cLeft] = { v: 'Что осталось', s: 1 }; r3[cLeft] = { v: '', s: 1 };
    merges.push(C(cLeft) + '2:' + C(cLeft) + '3');
    r2[cNote] = { v: 'Примечание', s: 1 }; r3[cNote] = { v: '', s: 1 };
    merges.push(C(cNote) + '2:' + C(cNote) + '3');
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
        row[cNote] = { v: (r && r.note) || '', s: 3 };
        rows.push(row); rowNo++;
      });
      if (fs.length > 1) merges.push('A' + startRow + ':A' + (rowNo - 1));
    });
    return { name: b.name, cols: cols, rows: rows, merges: merges };
  });

  /* лист замечаний — с настоящими фото, встроенными в ячейки */
  var PHCOL = 8, MAXPH = 3;          // с какой колонки идут фото и сколько их влезает
  var ir = [[{ v: 'Корпус', s: 1 }, { v: 'Этаж', s: 1 }, { v: '№ кв.', s: 1 }, { v: '№ на эт.', s: 1 },
  { v: 'Тип', s: 1 }, { v: 'Не выполнено', s: 1 }, { v: 'Что осталось', s: 1 }, { v: 'Примечание', s: 1 },
  { v: 'Фото 1', s: 1 }, { v: 'Фото 2', s: 1 }, { v: 'Фото 3', s: 1 }]];
  var images = [], rowHeights = {};
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    allFlats(b).forEach(function (x, gi) {
      var r = d[x.n], s = status(r);
      if (s !== 'bad' && s !== 'warn') return;
      var miss = CFG.positions.filter(function (p) { return r.st[p.id] === 0; }).map(function (p) { return p.n; }).join(', ');
      var idx = flatsOf(b, x.f).indexOf(x.n) + 1;
      var row = [{ v: b.name, s: 3 }, { v: x.f, s: 2, n: true }, { v: x.n, s: 2, n: true },
      { v: idx, s: 2, n: true }, { v: r.crit ? 'Критично' : 'Обычное', s: 2 },
      { v: miss, s: 3 }, { v: r.left || '', s: 3 }, { v: r.note || '', s: 3 }];
      for (var c = 0; c < MAXPH; c++) row[PHCOL + c] = { v: '', s: 2 };
      var rowIdx = ir.length;
      ir.push(row);

      (r.ph || []).slice(0, MAXPH).forEach(function (id, k) {
        var u8 = dataUrlToBytes(PH[id]);
        if (!u8) return;
        images.push({ col: PHCOL + k, row: rowIdx, data: u8, name: photoName(b, x, k) });
        rowHeights[rowIdx] = 100;
      });
    });
  });
  sheets.push({
    name: 'Замечания',
    cols: [{ w: 14 }, { w: 7 }, { w: 8 }, { w: 9 }, { w: 12 }, { w: 28 }, { w: 32 }, { w: 20 },
    { w: 20 }, { w: 20 }, { w: 20 }],
    rows: ir, merges: [], rowHeights: rowHeights, images: images
  });

  try {
    download(window.XLS.workbook(sheets), 'Шахматка_' + CFG.object.replace(/\s+/g, '_') + '_' + dateStamp() + '.xlsx');
    toast('Шахматка выгружена');
  } catch (e) { alert('Не удалось собрать файл: ' + e.message); }
}
function photoName(b, x, i) {
  return b.name.replace(/\s+/g, '') + '_эт' + x.f + '_кв' + x.n + (i ? '_' + (i + 1) : '') + '.jpg';
}

function exportPhotos() {
  var files = [];
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    allFlats(b).forEach(function (x) {
      var r = d[x.n]; if (!r || !r.ph || !r.ph.length) return;
      r.ph.forEach(function (id, i) {
        var u8 = dataUrlToBytes(PH[id]);
        if (u8) files.push({ name: photoName(b, x, i), data: u8 });
      });
    });
  });
  if (!files.length) { toast('Фото пока нет'); return; }
  download(window.XLS.zip(files), 'Фото_' + dateStamp() + '.zip');
  toast(files.length + ' фото выгружено');
}

/* ================= обмен с напарником ================= */
/* Подпись записи: если совпала — расхождения нет, сливать нечего. */
function sig(r) {
  if (!r) return '';
  var st = CFG.positions.map(function (p) { return p.id + ':' + (r.st[p.id] == null ? '-' : r.st[p.id]); }).join(',');
  return st + '|' + (r.left || '') + '|' + (r.note || '') + '|' + (r.crit ? 1 : 0) + '|' + ((r.ph || []).length);
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
  var used = {};
  CFG.buildings.forEach(function (b) {
    var d = DATA[b.id] || {};
    Object.keys(d).forEach(function (n) { (d[n].ph || []).forEach(function (id) { if (PH[id]) used[id] = PH[id]; }); });
  });
  var blob = new Blob([JSON.stringify({ v: 1, from: CFG.me, at: Date.now(), cfg: CFG, data: DATA, ph: used })],
    { type: 'application/json' });
  download(blob, 'Обход_' + CFG.me.replace(/\s+/g, '_') + '_' + dateStamp() + '.json');
  toast('Файл готов — отправь напарнику');
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
  Object.keys(P.src.ph || {}).forEach(function (id) {
    if (!PH[id]) { PH[id] = P.src.ph[id]; idb.put(id, P.src.ph[id]); }
  });
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

function backup() {
  var blob = new Blob([JSON.stringify({ cfg: CFG, data: DATA, ph: PH }, null, 0)], { type: 'application/json' });
  download(blob, 'Шахматка_копия_' + dateStamp() + '.json');
  toast('Копия сохранена');
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
        CFG = o.cfg; DATA = o.data; PH = o.ph || {};
        Object.keys(PH).forEach(function (k) { idb.put(k, PH[k]); });
        UI.b = CFG.buildings[0].id; UI.floor = CFG.buildings[0].from;
        save(); toast('Данные восстановлены'); go('obj');
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
  idb.all().then(function (o) { PH = o; render(); }).catch(function () { render(); });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () { });
  go(UI.tab === 'flat' ? 'obj' : UI.tab);
});
