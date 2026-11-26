/* Menú lateral y barra de demo compartidos por todos los mockups.
   Uso:  Tema.shell({ nav:'stock', badges:{usuarios:2}, handlers:{inicio:fn}, demo:{...} })  */
(function () {
  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/[^\/]*$/, '') : '';
  var LINKS = { inicio: 'inicio.html', usuarios: 'listado-pacientes.html', pedidos: 'pagos.html', stock: 'stock-tests.html' };
  var NAV = [
    ['inicio', 'Inicio'], ['usuarios', 'Usuarios'], ['pedidos', 'Pedidos'], ['stock', 'Stock'],
    ['venta', 'Venta online'], ['investigacion', 'Investigación']
  ];
  var toastEl, toastT;
  var area = 'todo';   // qué test ver (menú lateral): todo | int | vag; se recuerda entre páginas
  try { area = sessionStorage.getItem('tema-area') || 'todo'; } catch (e) {}
  var modo = 'hibrido';   // tipo de consulta del profesional: presencial | online | hibrido; se recuerda entre páginas
  try { modo = sessionStorage.getItem('tema-modo') || 'hibrido'; } catch (e) {}
  function aplicarModo() {
    var st = document.querySelector('#side .nav-it[data-nav="stock"]'), vo = document.querySelector('#side .nav-it[data-nav="venta"]');
    if (st) st.hidden = modo === 'online';        // sin consulta física no hay stock de tests
    if (vo) vo.hidden = modo === 'presencial';    // solo presencial: no vende online
  }

  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  function renderSide(o) {
    var el = document.getElementById('side'); if (!el) return;
    var badges = o.badges || {};
    var html = '<img class="logo" src="' + base + 'assets/logo.svg" alt="Biotasmart">' +
      '<div class="centro-wrap"><button class="centro-sel" type="button" aria-haspopup="menu" aria-expanded="false"><b>Centro Demo · Valencia</b><small>Grupo Demo · cambiar de centro</small></button>' +
      '<div class="centro-menu" role="menu" hidden><button type="button" role="menuitem" data-m="cuenta">Editar cuenta</button><button type="button" role="menuitem" data-m="ajustes">Ajustes</button></div></div>' +
      '<div class="area-sel" role="group" aria-label="Qué test ver"><button type="button" data-a="todo" class="' + (area === 'todo' ? 'on' : '') + '">Todo</button>' +
      '<button type="button" data-a="int" class="' + (area === 'int' ? 'on' : '') + '"><i style="background:#396a7f"></i>Intestinal</button><button type="button" data-a="vag" class="' + (area === 'vag' ? 'on' : '') + '"><i style="background:#D49A8E"></i>Vaginal</button></div>';
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
    aplicarModo();
    var cs = el.querySelector('.centro-sel'), cm = el.querySelector('.centro-menu');
    function menu(abrir) { cm.hidden = !abrir; cs.setAttribute('aria-expanded', String(abrir)); cs.classList.toggle('abierto', abrir); }
    cs.addEventListener('click', function (e) { e.stopPropagation(); menu(cm.hidden); });
    cm.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; menu(false);
      var h = o.handlers && o.handlers[b.dataset.m]; if (h) h(); else toast('«' + b.textContent + '» no está en este mockup.');
    });
    document.addEventListener('click', function () { menu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });
    el.querySelectorAll('.area-sel button').forEach(function (b) {
      b.addEventListener('click', function () {
        area = b.dataset.a; try { sessionStorage.setItem('tema-area', area); } catch (e) {}
        el.querySelectorAll('.area-sel button').forEach(function (x) { x.classList.toggle('on', x === b); });
        document.dispatchEvent(new CustomEvent('tema-area', { detail: area }));
      });
    });
  }

  function renderDemo(d) {
    var el = document.getElementById('demobar'); if (!el || !d) return;
    document.body.classList.add('has-demobar');
    var html = '<b>' + d.title + '</b>' + (d.label ? '<span class="k">' + d.label + '</span>' : '');
    (d.steps || []).forEach(function (s) {
      html += '<button type="button" data-step="' + s[0] + '"' + (s[0] === d.current ? ' class="on"' : '') + '>' + s[1] + '</button>';
    });
    (d.extra || []).forEach(function (x) { html += x.text ? '<span class="k">' + x.label + '</span>' : '<button type="button" class="' + (x.cls || '') + '" id="' + x.id + '">' + x.label + '</button>'; });
    el.className = 'demobar'; el.innerHTML = html;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]'); if (!b) return;
      if (d.onStep) d.onStep(b.dataset.step);
    });
  }

  window.Tema = {
    base: base,
    area: function () { return area; },
    modo: function () { return modo; },
    setModo: function (m) { modo = m; try { sessionStorage.setItem('tema-modo', m); } catch (e) {} aplicarModo(); document.dispatchEvent(new CustomEvent('tema-modo', { detail: m })); },
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
