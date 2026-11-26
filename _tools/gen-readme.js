// Regenera README.md (la portada de la web) con la lista de mockups y su fecha de última actualización.
// Uso: node _tools/gen-readme.js   (desde la raíz del repo, antes de hacer commit)
const fs = require('fs'), cp = require('child_process');
const T = id => `[${id}](https://biotasmart.atlassian.net/browse/${id})`;
const ROWS = [
  ['Inicio', 'inicio.html', T('BTV-14')],
  ['Usuarios (listado)', 'listado-pacientes.html', ''],
  ['Nuevo usuario', 'alta-paciente.html', ''],
  ['Ficha del usuario (con test)', 'ficha-con-test.html', ''],
  ['Ficha del usuario (sin test)', 'ficha-sin-test.html', ''],
  ['Stock', 'stock-tests.html', ''],
  ['Pedidos, factura y cancelar solicitud (F16)', 'pagos.html', T('BTV-39')],
  ['Pedir más tests y revisar la solicitud (F17 / F18)', 'pedir-tests.html', T('BTV-40') + ' · ' + T('BTV-41')],
  ['Entregar un test, con pedir tests si no hay stock', 'activar-test.html', T('BTV-40')],
  ['Aviso al cambiar de sede con recogida solicitada (F19)', 'aviso-cambio-sede.html', T('BTV-42')],
  ['Aviso F19 sobre la ficha completa del usuario (variante)', 'aviso-cambio-sede-ficha.html', T('BTV-42')],
  ['Enlace de pago en 2 clics (F20, la que se desarrolla)', 'enviar-link-rapido.html', T('BTV-43')],
  ['Enlace de pago, versión completa con pop-up (F20, alternativa)', 'enviar-link.html', T('BTV-43')],
  ['Estados vacíos', 'vacios/index.html', ''],
  ['Emails de entrega de la muestra (F13)', 'emails-recordatorio.html', T('BTV-36')]
];
const hoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
const sh = c => cp.execSync(c, { encoding: 'utf8' }).trim();
function fecha(f) {
  const files = f === 'vacios/index.html' ? 'vacios' : f;
  if (sh(`git status --porcelain -- ${files}`)) return hoy;          // cambiado y aún sin commit
  const d = sh(`git log -1 --format=%cd --date=format:%d/%m/%Y -- ${files}`);
  return d || hoy;
}
const filas = ROWS.map(([n, f, t]) => `| ${n} | [${f}](${f}) | ${t || '—'} | ${fecha(f)} |`).join('\n');
const md = `# Mockups plataforma BiotaSmart

Prototipos HTML (datos de ejemplo, anonimizados) de la plataforma para centros, con el **diseño nuevo de la plataforma (v3.18)**.
Abre cualquier mockup desde la tabla. Todos comparten \`tema.css\`, \`tema.js\` y la carpeta \`assets/\` (fuentes, logo e imágenes).

**Última actualización de la página:** ${hoy}

| Módulo / flujo | Mockup | Ticket | Actualizado |
|---|---|---|---|
${filas}

Los nombres de archivo no cambian, para no romper los enlaces de Jira. Si ves una versión antigua, pulsa Ctrl+F5: GitHub guarda la copia anterior hasta 10 minutos.
`;
fs.writeFileSync('README.md', md);
console.log('README.md regenerado (' + ROWS.length + ' mockups)');
