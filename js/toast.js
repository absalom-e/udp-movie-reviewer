// [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md
let contenedor = null;

function obtenerContenedor() {
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.setAttribute('role', 'status');
    contenedor.setAttribute('aria-live', 'polite');
    contenedor.style.cssText =
      'position:fixed;right:20px;bottom:20px;display:flex;flex-direction:column;gap:8px;z-index:9999;';
    document.body.appendChild(contenedor);
  }
  return contenedor;
}

export function mostrarToast(mensaje, tipo = 'exito') {
  const colores = { exito: '#2e7d32', error: '#c62828', info: 'rgb(0,140,255)' };
  const toast = document.createElement('div');
  toast.textContent = mensaje;
  toast.style.cssText =
    `background:${colores[tipo] || colores.info};color:#fff;padding:10px 16px;` +
    'border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.25);font-size:14px;max-width:300px;';
  obtenerContenedor().appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
// [IA] fin