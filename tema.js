/* Menú lateral y barra de demo compartidos por todos los mockups.
   Uso:  Tema.shell({ nav:'stock', badges:{usuarios:2}, handlers:{inicio:fn}, demo:{...} })  */
(function () {
  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/[^\/]*$/, '') : '';
  var LINKS = { inicio: 'inicio.html', usuarios: 'listado-pacientes.html', pedidos: 'pagos.html', stock: 'stock-tests.html' };
  var NAV = [
    ['inicio', 'Inicio'], ['usuarios', 'Usuarios'], ['pedidos', 'Pedidos'], ['stock', 'Stock'],
    ['venta', 'Venta online'], ['investigacion', 'Investigación'], ['ajustes', 'Ajustes del centro']
  ];
  var toastEl, toastT;

  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  function renderSide(o) {
    var el = document.getElementById('side'); if (!el) return;
    var badges = o.badges || {};
    var html = '<img class="logo" src="' + base + 'assets/logo.svg" alt="Biotasmart">' +
      '<button class="centro-sel" type="button"><b>Centro Demo · Valencia</b><small>Grupo Demo · cambiar de centro</small></button>' +
      '<div class="area-sel" role="group" aria-label="Qué test ver"><button type="button" class="on">Todo</button>' +
      '<button type="button"><i style="background:#396a7f"></i>Intestinal</button><button type="button"><i style="background:#D49A8E"></i>Vaginal</button></div>';
    NAV.forEach(function (n) {
      var k = n[0], href = o.links && o.links[k] ? o.links[k] : (LINKS[k] ? base + LINKS[k] : '#');
      html += '<a class="nav-it' + (o.nav === k ? ' on' : '') + '" data-nav="' + k + '" href="' + href + '">' + n[1] +
        (badges[k] ? '<span class="cuenta">' + badges[k] + '</span>' : '') + (k === 'investigacion' ? '<span class="punto" title="Hallazgo nuevo"></span>' : '') + '</a>';
    });
    html += '<div class="sep aparte"></div><a class="nav-it aparte" data-nav="tutorial" href="#">Ver el tutorial</a><a class="nav-it aparte" data-nav="ia" href="#">Asistente IA</a>';
    el.innerHTML = html;
    el.addEventListener('click', function (e) {
      var a = e.target.closest('.nav-it'); if (!a) return;
      var k = a.dataset.nav, h = o.handlers && o.handlers[k];
      if (h) { e.preventDefault(); h(); return; }
      if (o.nav === k) { e.preventDefault(); return; }
      if (!LINKS[k] && !(o.links && o.links[k])) { e.preventDefault(); toast('Esta sección no está en este mockup.'); }
    });
    el.querySelectorAll('.area-sel button').forEach(function (b) {
      b.addEventListener('click', function () { el.querySelectorAll('.area-sel button').forEach(function (x) { x.classList.toggle('on', x === b); }); });
    });
  }

  function renderDemo(d) {
    var el = document.getElementById('demobar'); if (!el || !d) return;
    document.body.classList.add('has-demobar');
    var html = '<b>' + d.title + '</b>' + (d.label ? '<span class="k">' + d.label + '</span>' : '');
    (d.steps || []).forEach(function (s) {
      html += '<button type="button" data-step="' + s[0] + '"' + (s[0] === d.current ? ' class="on"' : '') + '>' + s[1] + '</button>';
    });
    (d.extra || []).forEach(function (x) { html += '<button type="button" class="' + (x.cls || '') + '" id="' + x.id + '">' + x.label + '</button>'; });
    el.className = 'demobar'; el.innerHTML = html;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]'); if (!b) return;
      if (d.onStep) d.onStep(b.dataset.step);
    });
  }

  window.Tema = {
    base: base,
    toast: toast,
    shell: function (o) { o = o || {}; renderSide(o); renderDemo(o.demo); },
    setStep: function (id) {
      document.querySelectorAll('#demobar [data-step]').forEach(function (b) { b.classList.toggle('on', b.dataset.step === id); });
    },
    setNav: function (k) {
      document.querySelectorAll('#side .nav-it[data-nav]').forEach(function (a) { a.classList.toggle('on', a.dataset.nav === k); });
    },
    setBadge: function (k, n) {
      var a = document.querySelector('#side .nav-it[data-nav="' + k + '"]'); if (!a) return;
      var c = a.querySelector('.cuenta'); if (c) c.remove();
      if (n) { var s = document.createElement('span'); s.className = 'cuenta'; s.textContent = n; a.appendChild(s); }
    }
  };
})();
