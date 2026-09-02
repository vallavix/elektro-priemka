/* Отчёт по обходу для прораба: HTML-файл и PDF-альбом.
   Зачем отдельно от xlsx.js: в Excel фото прибито к ячейке — при зуме режется по её
   границе, а строки разной высоты дают рывковую прокрутку. Здесь одно замечание —
   один экран (или одна страница), поэтому листать и приближать нечему мешать. */
(function (g) {
  'use strict';

  /* ---------- общее ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  /* «Корпус 1 · Этаж 5 · Кв. 123» — то, что прораб ищет глазами в первую очередь */
  function addr(it) {
    return it.b + ' · Этаж ' + it.f + ' · Кв. ' + it.n;
  }

  /* ---------- HTML ---------- */
  /* items: [{b,f,n,crit,miss,left,idx,photos:[dataUrl]}] */
  function html(items, meta) {
    var corps = [], crit = 0;
    items.forEach(function (it) {
      if (corps.indexOf(it.b) < 0) corps.push(it.b);
      if (it.crit) crit++;
    });

    var cards = items.map(function (it, i) {
      var ph = (it.photos || []).map(function (u, k) {
        return '<img src="' + u + '" alt="фото ' + (k + 1) + '" loading="lazy">';
      }).join('');
      return '<article class="c" data-corp="' + esc(it.b) + '" data-crit="' + (it.crit ? 1 : 0) + '" ' +
        'data-s="' + esc((addr(it) + ' ' + (it.miss || '') + ' ' + (it.left || '')).toLowerCase()) + '">' +
        '<header><h2>' + esc(addr(it)) + '</h2>' +
        (it.crit ? '<span class="crit">Критично</span>' : '') +
        '<span class="no">' + (i + 1) + ' из ' + items.length + '</span></header>' +
        (it.miss ? '<p class="miss"><b>Не выполнено:</b> ' + esc(it.miss) + '</p>' : '') +
        (it.left ? '<p class="left"><b>Осталось:</b> ' + esc(it.left) + '</p>' : '') +
        (ph ? '<div class="ph">' + ph + '</div>' : '<p class="nophoto">Фото нет</p>') +
        '</article>';
    }).join('');

    return '<!doctype html><html lang="ru"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>Замечания · ' + esc(meta.label) + ' · ' + esc(meta.object) + '</title><style>' +
      ':root{--bg:#f4f6f9;--fg:#111827;--mut:#6b7280;--line:#d7dee8;--bad:#dc2626}' +
      '*{box-sizing:border-box}' +
      'body{margin:0;background:var(--bg);color:var(--fg);' +
      'font:16px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif}' +
      '.wrap{max-width:900px;margin:0 auto;padding:0 16px 60px}' +
      'h1{font-size:22px;margin:20px 0 4px}.sub{color:var(--mut);margin:0 0 16px}' +
      '.bar{position:sticky;top:0;z-index:5;background:var(--bg);padding:10px 0;' +
      'border-bottom:1px solid var(--line);display:flex;gap:8px;flex-wrap:wrap;align-items:center}' +
      '.bar input{flex:1;min-width:180px;padding:9px 12px;border:1px solid var(--line);' +
      'border-radius:9px;font-size:16px;background:#fff}' +
      '.bar button{padding:8px 13px;border:1px solid var(--line);border-radius:9px;' +
      'background:#fff;font-size:15px;cursor:pointer}' +
      '.bar button.on{background:var(--fg);color:#fff;border-color:var(--fg)}' +
      '.c{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px;margin-top:16px}' +
      '.c header{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}' +
      '.c h2{font-size:21px;margin:0}' +
      '.crit{background:var(--bad);color:#fff;font-size:13px;font-weight:700;' +
      'padding:3px 9px;border-radius:999px}' +
      '.no{margin-left:auto;color:var(--mut);font-size:14px}' +
      '.c p{margin:5px 0}.left{color:#1f2937}.nophoto{color:var(--mut)}' +
      '.ph{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}' +
      /* фото занимает всю ширину карточки и никуда не обрезается */
      '.ph img{width:100%;max-width:520px;border-radius:10px;border:1px solid var(--line);cursor:zoom-in}' +
      '.lb{position:fixed;inset:0;background:rgba(0,0,0,.92);display:none;' +
      'align-items:center;justify-content:center;z-index:50;cursor:zoom-out}' +
      '.lb img{max-width:100%;max-height:100%}' +
      '.empty{padding:40px 0;text-align:center;color:var(--mut)}' +
      '@media print{body{background:#fff}.bar,.no{display:none}' +
      '.c{page-break-inside:avoid;break-inside:avoid;border-radius:0;margin-top:0;' +
      'page-break-after:always;break-after:page;border:0;padding:0 0 10px}' +
      '.ph img{max-width:100%}}' +
      '</style></head><body><div class="wrap">' +
      '<h1>Замечания · ' + esc(meta.label) + '</h1>' +
      '<p class="sub">' + esc(meta.object) + ' · выгружено ' + esc(meta.date) +
      ' · всего ' + items.length + ', критичных ' + crit + '</p>' +
      '<div class="bar"><input id="q" placeholder="Поиск: номер квартиры, этаж, замечание">' +
      '<button data-f="all" class="on">Все</button>' +
      '<button data-f="crit">Только критичные</button>' +
      corps.map(function (c) { return '<button data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') +
      '<button onclick="print()">Печать / PDF</button></div>' +
      cards + '<div class="empty" id="none" style="display:none">Ничего не найдено</div>' +
      '</div><div class="lb" id="lb"><img alt=""></div><script>' +
      'var cs=[].slice.call(document.querySelectorAll(".c")),f="all",c="",q="";' +
      'function apply(){var v=0;cs.forEach(function(e){' +
      'var ok=(f!=="crit"||e.dataset.crit==="1")&&(!c||e.dataset.corp===c)&&' +
      '(!q||e.dataset.s.indexOf(q)>=0);e.style.display=ok?"":"none";if(ok)v++;});' +
      'document.getElementById("none").style.display=v?"none":"";}' +
      'document.querySelector(".bar").addEventListener("click",function(e){' +
      'var b=e.target.closest("button[data-f],button[data-c]");if(!b)return;' +
      'if(b.dataset.f){f=b.dataset.f;c="";}else{c=c===b.dataset.c?"":b.dataset.c;f="all";}' +
      '[].forEach.call(this.querySelectorAll("button[data-f],button[data-c]"),function(x){' +
      'x.classList.toggle("on",(x.dataset.f&&x.dataset.f===f&&!c)||(x.dataset.c&&x.dataset.c===c));});' +
      'apply();});' +
      'document.getElementById("q").addEventListener("input",function(){q=this.value.trim().toLowerCase();apply();});' +
      'var lb=document.getElementById("lb");' +
      'document.addEventListener("click",function(e){if(e.target.matches(".ph img")){' +
      'lb.firstChild.src=e.target.src;lb.style.display="flex";}else if(e.target.closest(".lb")){lb.style.display="none";}});' +
      'document.addEventListener("keydown",function(e){if(e.key==="Escape")lb.style.display="none";});' +
      '<\/script></body></html>';
  }

  /* ---------- PDF ---------- */
  /* Страница собирается на canvas и кладётся в PDF одной картинкой. Так кириллица
     не требует встроенного шрифта, а вёрстка гарантированно совпадает с экраном. */
  var PW = 595, PH = 842;            // A4 в пунктах
  var SC = 2;                        // рисуем в 2× — на печати не мылит

  function wrap(ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], cur = '';
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; }
      else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }

  /* one = {addr, crit, miss, left, img(Image|null), cap} */
  function pageCanvas(one, foot) {
    var cv = document.createElement('canvas');
    cv.width = PW * SC; cv.height = PH * SC;
    var x = cv.getContext('2d');
    x.setTransform(SC, 0, 0, SC, 0, 0);
    x.fillStyle = '#fff'; x.fillRect(0, 0, PW, PH);

    var M = 38, y = M + 8, W = PW - M * 2;
    x.textBaseline = 'alphabetic';

    x.fillStyle = '#111827';
    x.font = 'bold 24px Arial, sans-serif';
    x.fillText(one.addr, M, y + 20);
    y += 34;

    if (one.crit) {
      x.font = 'bold 13px Arial, sans-serif';
      var w = x.measureText('КРИТИЧНО').width + 18;
      x.fillStyle = '#dc2626';
      x.beginPath(); x.roundRect ? x.roundRect(M, y - 2, w, 22, 11) : x.rect(M, y - 2, w, 22);
      x.fill();
      x.fillStyle = '#fff'; x.fillText('КРИТИЧНО', M + 9, y + 13);
      y += 30;
    }

    function block(label, text) {
      if (!text) return;
      x.fillStyle = '#6b7280'; x.font = 'bold 13px Arial, sans-serif';
      x.fillText(label, M, y + 11); y += 18;
      x.fillStyle = '#111827'; x.font = '15px Arial, sans-serif';
      wrap(x, text, W).forEach(function (ln) { x.fillText(ln, M, y + 12); y += 20; });
      y += 8;
    }
    block('НЕ ВЫПОЛНЕНО', one.miss);
    block('ЧТО ОСТАЛОСЬ', one.left);

    /* фото — всё оставшееся место, целиком, без обрезки */
    var top = y + 6, botY = PH - M - 16, boxH = botY - top;
    if (one.img && boxH > 60) {
      var im = one.img;
      var s = Math.min(W / im.width, boxH / im.height);
      var iw = im.width * s, ih = im.height * s;
      var ix = M + (W - iw) / 2, iy = top;
      x.drawImage(im, ix, iy, iw, ih);
      x.strokeStyle = '#d7dee8'; x.lineWidth = 0.7;
      x.strokeRect(ix + 0.35, iy + 0.35, iw - 0.7, ih - 0.7);
    }

    x.fillStyle = '#9ca3af'; x.font = '11px Arial, sans-serif';
    x.fillText(foot, M, PH - M + 4);
    var cap = one.cap || '';
    x.fillText(cap, PW - M - x.measureText(cap).width, PH - M + 4);
    return cv;
  }

  function b64ToBytes(b64) {
    var s = atob(b64), u = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return u;
  }
  var te = new TextEncoder();

  /* ones: [{addr,crit,miss,left,img,cap}] -> Blob(application/pdf) */
  function pdf(ones, foot) {
    var jpegs = ones.map(function (one) {
      var cv = pageCanvas(one, foot);
      return b64ToBytes(cv.toDataURL('image/jpeg', 0.82).split(',')[1]);
    });

    var parts = [], len = 0, offs = [];
    function put(x) { var b = typeof x === 'string' ? te.encode(x) : x; parts.push(b); len += b.length; }
    function obj(n, body, stream) {
      offs[n] = len;
      put(n + ' 0 obj\n' + body + '\n');
      if (stream) { put('stream\n'); put(stream); put('\nendstream\n'); }
      put('endobj\n');
    }

    var n = ones.length;
    var kids = [], first = 3;
    for (var i = 0; i < n; i++) kids.push((first + i * 3) + ' 0 R');

    put('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Count ' + n + ' /Kids [' + kids.join(' ') + '] >>');
    for (var j = 0; j < n; j++) {
      var p = first + j * 3, cnt = p + 1, img = p + 2;
      obj(p, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] ' +
        '/Resources << /XObject << /Im0 ' + img + ' 0 R >> >> /Contents ' + cnt + ' 0 R >>');
      var cs = 'q ' + PW + ' 0 0 ' + PH + ' 0 0 cm /Im0 Do Q';
      obj(cnt, '<< /Length ' + cs.length + ' >>', cs);
      obj(img, '<< /Type /XObject /Subtype /Image /Width ' + (PW * SC) + ' /Height ' + (PH * SC) +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpegs[j].length + ' >>',
        jpegs[j]);
    }

    var total = 3 + n * 3, xref = len;
    var x = 'xref\n0 ' + total + '\n0000000000 65535 f \n';
    for (var k = 1; k < total; k++) {
      x += ('0000000000' + (offs[k] || 0)).slice(-10) + ' 00000 n \n';
    }
    x += 'trailer\n<< /Size ' + total + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
    put(x);

    return new Blob(parts, { type: 'application/pdf' });
  }

  g.REPORT = { html: html, pdf: pdf, addr: addr };
})(window);
