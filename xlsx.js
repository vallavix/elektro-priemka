/* Мини-генератор .xlsx и .zip без внешних библиотек.
   ZIP пишется методом "store" (без сжатия) — Excel и Проводник такое открывают. */
(function (g) {
  'use strict';

  /* ---------- CRC32 ---------- */
  var T = (function () {
    var t = new Uint32Array(256), c, n, k;
    for (n = 0; n < 256; n++) {
      c = n;
      for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(buf) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < buf.length; i++) c = T[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  var enc = new TextEncoder();
  function bytes(x) { return typeof x === 'string' ? enc.encode(x) : x; }

  function dosTime(d) {
    return ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() / 2)) & 0xFFFF;
  }
  function dosDate(d) {
    return (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;
  }

  /* files: [{name, data}] -> Blob */
  function zip(files, mime) {
    var now = new Date(), tm = dosTime(now), dt = dosDate(now);
    var parts = [], central = [], offset = 0;

    files.forEach(function (f) {
      var name = enc.encode(f.name), data = bytes(f.data), crc = crc32(data);
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true);
      lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); // UTF-8 имена
      lh.setUint16(8, 0, true);
      lh.setUint16(10, tm, true); lh.setUint16(12, dt, true);
      lh.setUint32(14, crc, true);
      lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true);
      lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
      parts.push(new Uint8Array(lh.buffer), name, data);

      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true);
      ch.setUint16(4, 20, true); ch.setUint16(6, 20, true);
      ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
      ch.setUint16(12, tm, true); ch.setUint16(14, dt, true);
      ch.setUint32(16, crc, true);
      ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true);
      ch.setUint16(28, name.length, true);
      ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), name);
      offset += 30 + name.length + data.length;
    });

    var cSize = central.reduce(function (s, p) { return s + p.length; }, 0);
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, cSize, true); end.setUint32(16, offset, true);

    return new Blob(parts.concat(central, [new Uint8Array(end.buffer)]),
      { type: mime || 'application/zip' });
  }

  /* ---------- XML ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/\x00-\x08|\x0b|\x0c|\x0e-\x1f/g, '');
  }
  function colName(i) { // 0 -> A
    var s = '';
    i++;
    while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = (i - m - 1) / 26; }
    return s;
  }
  g.colName = colName;

  /* Стили: 0 обычный | 1 шапка | 2 центр | 3 текст слева | 4 галка | 5 крест | 6 заголовок корпуса | 7 прочерк */
  var STYLES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="5">' +
    '<font><sz val="11"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="11"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="12"/><color rgb="FF15803D"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="12"/><color rgb="FFDC2626"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="14"/><name val="Calibri"/></font>' +
    '</fonts>' +
    '<fills count="3"><fill><patternFill patternType="none"/></fill>' +
    '<fill><patternFill patternType="gray125"/></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FFEFF3F8"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>' +
    '<border><left style="thin"><color rgb="FF8FA0B5"/></left><right style="thin"><color rgb="FF8FA0B5"/></right>' +
    '<top style="thin"><color rgb="FF8FA0B5"/></top><bottom style="thin"><color rgb="FF8FA0B5"/></bottom><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="8">' +
    '<xf xfId="0" numFmtId="0" fontId="0" fillId="0" borderId="0"/>' +
    '<xf xfId="0" numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
    '<xf xfId="0" numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf xfId="0" numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>' +
    '<xf xfId="0" numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf xfId="0" numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf xfId="0" numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf xfId="0" numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '</cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>';

  /* ---------- размеры JPEG/PNG из байтов ---------- */
  function imgSize(u8) {
    // PNG
    if (u8[0] === 0x89 && u8[1] === 0x50) {
      var dv = new DataView(u8.buffer, u8.byteOffset);
      return { w: dv.getUint32(16), h: dv.getUint32(20) };
    }
    // JPEG: ищем маркер SOF0..SOF15 (кроме DHT/DAC/RST)
    var i = 2;
    while (i < u8.length - 9) {
      if (u8[i] !== 0xFF) { i++; continue; }
      var m = u8[i + 1];
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
        return { h: (u8[i + 5] << 8) | u8[i + 6], w: (u8[i + 7] << 8) | u8[i + 8] };
      }
      i += 2 + ((u8[i + 2] << 8) | u8[i + 3]);
    }
    return { w: 400, h: 300 };
  }

  var EMU = 12700; // EMU в одном пункте

  /* images: [{col, row, data:Uint8Array, maxH}] — картинка ставится в ячейку,
     пропорции сохраняются (oneCellAnchor с явным размером). */
  function drawingXml(images) {
    var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" ' +
      'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">';
    images.forEach(function (im, i) {
      var sz = imgSize(im.data), maxH = im.maxH || 92;
      var s = maxH / sz.h, w = Math.round(sz.w * s), hh = maxH;
      if (w > (im.maxW || 130)) { var s2 = (im.maxW || 130) / w; w = Math.round(w * s2); hh = Math.round(hh * s2); }
      x += '<xdr:oneCellAnchor>' +
        '<xdr:from><xdr:col>' + im.col + '</xdr:col><xdr:colOff>' + (3 * EMU) + '</xdr:colOff>' +
        '<xdr:row>' + im.row + '</xdr:row><xdr:rowOff>' + (3 * EMU) + '</xdr:rowOff></xdr:from>' +
        '<xdr:ext cx="' + Math.round(w * EMU) + '" cy="' + Math.round(hh * EMU) + '"/>' +
        '<xdr:pic><xdr:nvPicPr>' +
        '<xdr:cNvPr id="' + (i + 2) + '" name="' + esc(im.name || ('Фото ' + (i + 1))) + '"/>' +
        '<xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr>' +
        '<xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
        'r:embed="rId' + (i + 1) + '"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>' +
        '<xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + Math.round(w * EMU) + '" cy="' + Math.round(hh * EMU) + '"/></a:xfrm>' +
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr>' +
        '</xdr:pic><xdr:clientData/></xdr:oneCellAnchor>';
    });
    return x + '</xdr:wsDr>';
  }

  /* sheet = {name, cols:[{w}], rows:[[cell|null,...]], merges:['A1:C1'], images:[...]}
     cell = {v, s, n:true(число)} либо строка */
  function sheetXml(sh, drawingId) {
    var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
    if (sh.print) x += '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>';
    if (sh.freeze) {
      x += '<sheetViews><sheetView workbookViewId="0">' +
        '<pane ySplit="' + sh.freeze + '" topLeftCell="A' + (sh.freeze + 1) + '" activePane="bottomLeft" state="frozen"/>' +
        '</sheetView></sheetViews>';
    }
    if (sh.cols && sh.cols.length) {
      x += '<cols>';
      sh.cols.forEach(function (c, i) {
        x += '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + c.w + '" customWidth="1"/>';
      });
      x += '</cols>';
    }
    x += '<sheetData>';
    sh.rows.forEach(function (row, r) {
      var h = sh.rowHeights && sh.rowHeights[r];
      x += '<row r="' + (r + 1) + '"' + (h ? ' ht="' + h + '" customHeight="1"' : '') + '>';
      row.forEach(function (c, ci) {
        if (c == null) return;
        if (typeof c !== 'object') c = { v: c, s: 2 };
        var ref = colName(ci) + (r + 1);
        if (c.v === '' || c.v == null) { x += '<c r="' + ref + '" s="' + (c.s || 0) + '"/>'; return; }
        if (c.n) x += '<c r="' + ref + '" s="' + (c.s || 0) + '"><v>' + c.v + '</v></c>';
        else x += '<c r="' + ref + '" s="' + (c.s || 0) + '" t="inlineStr"><is><t xml:space="preserve">' + esc(c.v) + '</t></is></c>';
      });
      x += '</row>';
    });
    x += '</sheetData>';
    if (sh.merges && sh.merges.length) {
      x += '<mergeCells count="' + sh.merges.length + '">';
      sh.merges.forEach(function (m) { x += '<mergeCell ref="' + m + '"/>'; });
      x += '</mergeCells>';
    }
    var pr = sh.print;
    if (pr && pr.center) x += '<printOptions horizontalCentered="1"/>';
    x += '<pageMargins left="' + (pr ? 0.3 : 0.4) + '" right="' + (pr ? 0.3 : 0.4) +
      '" top="0.4" bottom="0.5" header="0.2" footer="0.2"/>';
    if (pr) {
      x += '<pageSetup paperSize="9" orientation="' + (pr.landscape ? 'landscape' : 'portrait') +
        '" fitToWidth="1" fitToHeight="0" horizontalDpi="300" verticalDpi="300"/>' +
        '<headerFooter><oddFooter>&amp;L' + esc(pr.foot || '') + '&amp;RСтр. &amp;P из &amp;N</oddFooter></headerFooter>';
    }
    if (drawingId) x += '<drawing xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId1"/>';
    x += '</worksheet>';
    return x;
  }

  /* Одна и та же картинка на разных листах должна лежать в файле один раз. */
  function mediaKey(u8) {
    var a = 5381, b = 52711, n = u8.length, step = Math.max(1, n >> 10);
    for (var i = 0; i < n; i += step) { a = (a * 33 + u8[i]) >>> 0; b = (b * 31 + u8[i]) >>> 0; }
    return n + '_' + a.toString(36) + b.toString(36);
  }

  function sheetName(s) {
    return s.name.slice(0, 31).replace(/[\\\/\?\*\[\]:]/g, '-');
  }
  /* «шапка повторяется на каждой странице» живёт в workbook.xml, а не в листе */
  function definedNames(sheets) {
    var out = sheets.map(function (s, i) {
      if (!(s.print && s.print.titles)) return '';
      var nm = "'" + sheetName(s).replace(/'/g, "''") + "'";
      return '<definedName name="_xlnm.Print_Titles" localSheetId="' + i + '">' +
        esc(nm + '!' + s.print.titles) + '</definedName>';
    }).join('');
    return out ? '<definedNames>' + out + '</definedNames>' : '';
  }

  function workbook(sheets) {
    var files = [], drawings = [], media = [], byKey = {};
    /* нумеруем рисунки: лист -> номер drawing; картинки складываем в общий пул */
    sheets.forEach(function (s) {
      if (!(s.images && s.images.length)) return;
      drawings.push(s); s._dw = drawings.length;
      s.images.forEach(function (im) {
        var k = mediaKey(im.data);
        if (byKey[k] == null) { media.push(im.data); byKey[k] = media.length; }
        im._mi = byKey[k];
      });
    });

    files.push({
      name: '[Content_Types].xml',
      data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Default Extension="jpeg" ContentType="image/jpeg"/>' +
        '<Default Extension="png" ContentType="image/png"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        sheets.map(function (s, i) {
          return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
        }).join('') +
        drawings.map(function (s) {
          return '<Override PartName="/xl/drawings/drawing' + s._dw + '.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>';
        }).join('') +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        '</Types>'
    });
    files.push({
      name: '_rels/.rels',
      data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        '</Relationships>'
    });
    files.push({
      name: 'xl/workbook.xml',
      data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
        sheets.map(function (s, i) {
          return '<sheet name="' + esc(sheetName(s)) +
            '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>';
        }).join('') + '</sheets>' + definedNames(sheets) + '</workbook>'
    });
    files.push({
      name: 'xl/_rels/workbook.xml.rels',
      data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        sheets.map(function (s, i) {
          return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>';
        }).join('') +
        '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '</Relationships>'
    });
    files.push({ name: 'xl/styles.xml', data: STYLES });
    sheets.forEach(function (s, i) {
      files.push({ name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: sheetXml(s, s._dw) });
      if (!s._dw) return;
      files.push({
        name: 'xl/worksheets/_rels/sheet' + (i + 1) + '.xml.rels',
        data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
          '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing' + s._dw + '.xml"/>' +
          '</Relationships>'
      });
      files.push({ name: 'xl/drawings/drawing' + s._dw + '.xml', data: drawingXml(s.images) });
      files.push({
        name: 'xl/drawings/_rels/drawing' + s._dw + '.xml.rels',
        data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
          '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
          s.images.map(function (im, k) {
            return '<Relationship Id="rId' + (k + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/img' + im._mi + '.jpeg"/>';
          }).join('') + '</Relationships>'
      });
    });
    media.forEach(function (data, i) {
      files.push({ name: 'xl/media/img' + (i + 1) + '.jpeg', data: data });
    });
    return zip(files, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  g.XLS = { workbook: workbook, zip: zip, colName: colName };
})(window);
