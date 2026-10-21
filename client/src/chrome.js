// Chrome display text for PDF export.
// CSS `background-clip:text` breaks in macOS Preview, so headings are rebuilt
// as SVG text with a repeating per-line gradient. Text stays vector and selectable.
// Targets: h1, h2, .k and any [data-chrome]. data-chrome="dark|light|brass|steel"
// forces a finish; otherwise dark-background ancestors get "dark", else "light".
(function () {
  var FINISHES = {
    dark:  [[0, '#FFFFFF'], [.36, '#E8EBEF'], [.49, '#9DA3AD'], [.51, '#3B3F46'], [.74, '#C9CED5'], [1, '#F4F6F8']],
    light: [[0, '#6B717B'], [.46, '#22262C'], [.50, '#07080A'], [.70, '#4A4F57'], [1, '#8A9099']],
    brass: [[0, '#F6E3A8'], [.45, '#D9B35C'], [.52, '#7A5424'], [.75, '#B0793E'], [1, '#EFD28A']],
    steel: [[0, '#F2F3F5'], [.46, '#C9CCD3'], [.52, '#5A5E66'], [1, '#9EA2AA']]
  };
  var DARK = '.dark,.cover,.card.rec,.pk.rec,.scr,.ad .top,.lockup';
  var SVGNS = 'http://www.w3.org/2000/svg';
  var uid = 0;

  function wrapWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    var spans = [];
    nodes.forEach(function (t) {
      var parts = t.nodeValue.split(/(\s+)/), frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span');
        s.textContent = p;
        frag.appendChild(s);
        spans.push(s);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return spans;
  }

  function convert(el) {
    var cs = getComputedStyle(el);
    var finish = el.dataset.chrome || (el.closest(DARK) ? 'dark' : 'light');
    var lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15;
    var box = el.getBoundingClientRect();
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var m = ctx.measureText('Hg');
    var asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
    var base = (lh - (asc + desc)) / 2 + asc;

    var words = wrapWords(el).map(function (s) {
      var r = s.getBoundingClientRect(), fill = null, p = s.parentElement;
      while (p && p !== el) { if (p.dataset.fill) { fill = p.dataset.fill; break; } p = p.parentElement; }
      return { text: s.textContent, x: r.left - box.left, line: Math.round((r.top - box.top) / lh), fill: fill };
    });
    var lines = words.reduce(function (a, w) { return Math.max(a, w.line + 1); }, 1);

    var id = 'chr' + (uid++);
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', Math.ceil(box.width));
    svg.setAttribute('height', Math.ceil(lines * lh));
    svg.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    svg.style.cssText = 'display:block;overflow:visible';
    var grad = '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + lh + '" spreadMethod="repeat">' +
      FINISHES[finish].map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('') + '</linearGradient>';
    var font = 'font-family:' + cs.fontFamily.replace(/"/g, "'") + ';font-size:' + cs.fontSize + ';font-weight:' + cs.fontWeight + ';letter-spacing:' + cs.letterSpacing;
    svg.innerHTML = '<defs>' + grad + '</defs>' + words.map(function (w) {
      return '<text x="' + w.x.toFixed(2) + '" y="' + (w.line * lh + base).toFixed(2) + '" fill="' + (w.fill || 'url(#' + id + ')') + '" style="' + font + '">' +
        w.text.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>';
    }).join(' ');

    el.textContent = '';
    el.appendChild(svg);
    if (cs.display === 'inline') el.style.display = 'inline-block';
  }

  function run() {
    var els = Array.prototype.slice.call(document.querySelectorAll('h1,h2,.k,[data-chrome]'));
    els.forEach(convert);
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(run);
})();
