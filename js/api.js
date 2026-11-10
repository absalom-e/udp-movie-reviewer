// [IA] inicio · ia/2026-11-07_tilin67-67_capa-api.md
// [IA] inicio · ia/2026-11-10_tilin67-67_capa-servicios.md
const LATENCIA = 500;            // ms (la pauta pide entre 300 y 800)
const PROBABILIDAD_FALLA = 0;    // 0 = nunca falla; 0.2 = falla 1 de cada 5 llamadas
const VERSION_MOCKS = '1';       // súbela cada vez que cambies algo dentro de mocks/

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- Utilidades internas (no se exportan) ----------
function leer(clave) {
  return JSON.parse(localStorage.getItem(clave) || '[]');
}

function guardar(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

async function sembrar(clave, ruta) {
  if (localStorage.getItem(clave)) return;
  const res = await fetch(ruta);
  if (!res.ok) throw new Error('No se pudo cargar ' + ruta);
  guardar(clave, await res.json());
}

async function cargarDatosIniciales() {
  if (localStorage.getItem('mocks_version') !== VERSION_MOCKS) {
    ['peliculas', 'resenas', 'usuarios'].forEach((c) => localStorage.removeItem(c));
    localStorage.setItem('mocks_version', VERSION_MOCKS);
  }
  await Promise.all([
    sembrar('peliculas', '/mocks/peliculas.json'),
    sembrar('resenas', '/mocks/resenas.json'),
    sembrar('usuarios', '/mocks/usuarios.json')
  ]);
}

function simularFalla(forzarError) {
  const forzada =
    forzarError ||
    localStorage.getItem('forzar_error') === '1' ||
    new URLSearchParams(location.search).get('error') === '1';
  if (forzada || Math.random() < PROBABILIDAD_FALLA) {
    return { ok: false, status: 500, error: 'No se pudo conectar con el servidor.' };
  }
  return null;
}

// Toda función pública pasa por aquí: latencia, error simulado, carga de mocks y captura de fallos.
async function llamar(forzarError, accion) {
  await esperar(LATENCIA);
  const falla = simularFalla(forzarError);
  if (falla) return falla;
  try {
    await cargarDatosIniciales();
    return await accion();
  } catch (error) {
    return { ok: false, status: 500, error: 'No se pudo conectar con el servidor.' };
  }
}

function validarResena({ calificacion, comentario }) {
  if (!String(comentario || '').trim()) return 'El comentario es obligatorio.';
  const nota = Number(calificacion);
  if (calificacion === '' || calificacion === null || Number.isNaN(nota) || nota < 0 || nota > 10) {
    return 'La calificación debe estar entre 0 y 10.';
  }
  return null;
}

// ---------- Películas ----------
export async function obtenerPeliculas({ busqueda = '', genero = '', orden = '', forzarError = false } = {}) {
  return llamar(forzarError, () => {
    let peliculas = leer('peliculas');

    if (busqueda.trim() !== '') {
      const termino = busqueda.toLowerCase().trim();
      peliculas = peliculas.filter((p) =>
        p.titulo.toLowerCase().includes(termino) || p.director.toLowerCase().includes(termino)
      );
    }

    if (genero !== '') {
      // [IA] inicio · ia/2026-11-08_tilin67-67_filtro-genero.md
      peliculas = peliculas.filter((p) => normalizarGenero(p.genero) === normalizarGenero(genero));
      // [IA] fin
    }

    if (orden === 'rating_desc') {
      peliculas.sort((a, b) => b.calificacion - a.calificacion);
    } else if (orden === 'rating_asc') {
      peliculas.sort((a, b) => a.calificacion - b.calificacion);
    } else if (orden === 'anio_desc') {
      peliculas.sort((a, b) => b.anio - a.anio);
    } else if (orden === 'az') {
      peliculas.sort((a, b) => a.titulo.localeCompare(b.titulo));
    }

    return { ok: true, status: 200, data: peliculas };
  });
}

export async function obtenerPelicula(id) {
  return llamar(false, () => {
    const pelicula = leer('peliculas').find((p) => p.id === Number(id));
    if (!pelicula) {
      return { ok: false, status: 404, error: 'Película no encontrada' };
    }
    return { ok: true, status: 200, data: pelicula };
  });
}

// ---------- Reseñas ----------
export async function obtenerResenas(peliculaId = null) {
  return llamar(false, () => {
    const resenas = leer('resenas');
    if (peliculaId) {
      return { ok: true, status: 200, data: resenas.filter((r) => r.peliculaId === Number(peliculaId)) };
    }
    return { ok: true, status: 200, data: resenas };
  });
}

export async function crearResena(datos) {
  return llamar(false, () => {
    const error = validarResena(datos);
    if (error) return { ok: false, status: 400, error };

    if (!leer('peliculas').some((p) => p.id === Number(datos.peliculaId))) {
      return { ok: false, status: 404, error: 'Película no encontrada' };
    }

    const resenas = leer('resenas');
    const nueva = {
      id: Date.now(),
      peliculaId: Number(datos.peliculaId),
      autor: datos.autor || 'Usuario',
      calificacion: Number(datos.calificacion),
      comentario: datos.comentario.trim(),
      fecha: new Date().toISOString().slice(0, 10)
    };
    resenas.unshift(nueva);
    guardar('resenas', resenas);

    return { ok: true, status: 201, data: nueva };
  });
}

// [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md
export async function actualizarResena(id, cambios) {
  return llamar(false, () => {
    const error = validarResena(cambios);
    if (error) return { ok: false, status: 400, error };

    const resenas = leer('resenas');
    const indice = resenas.findIndex((r) => r.id === Number(id));
    if (indice === -1) {
      return { ok: false, status: 404, error: 'Reseña no encontrada' };
    }

    resenas[indice] = {
      ...resenas[indice],
      calificacion: Number(cambios.calificacion),
      comentario: cambios.comentario.trim()
    };
    guardar('resenas', resenas);

    return { ok: true, status: 200, data: resenas[indice] };
  });
}
// [IA] fin

export async function eliminarResena(id) {
  return llamar(false, () => {
    const resenas = leer('resenas');
    if (!resenas.some((r) => r.id === Number(id))) {
      return { ok: false, status: 404, error: 'Reseña no encontrada' };
    }
    guardar('resenas', resenas.filter((r) => r.id !== Number(id)));
    return { ok: true, status: 200, data: { mensaje: 'Eliminada correctamente' } };
  });
}

// ---------- Usuarios y sesión ----------
export async function registrarUsuario({ nombre = '', correo = '', clave = '' } = {}) {
  return llamar(false, () => {
    const email = String(correo).trim();
    if (!String(nombre).trim() || !email || String(clave).length < 8) {
      return {
        ok: false,
        status: 400,
        error: 'Completa todos los campos (la contraseña debe tener al menos 8 caracteres).'
      };
    }

    const usuarios = leer('usuarios');
    if (usuarios.some((u) => u.correo.toLowerCase() === email.toLowerCase())) {
      return { ok: false, status: 409, error: 'Este correo ya tiene una cuenta registrada.' };
    }

    const nuevo = {
      id: Date.now(),
      nombre: String(nombre).trim(),
      correo: email,
      clave,
      rol: 'usuario',
      reputacion: 10
    };
    usuarios.push(nuevo);
    guardar('usuarios', usuarios);

    return {
      ok: true,
      status: 201,
      data: { id: nuevo.id, nombre: nuevo.nombre, correo: nuevo.correo, rol: nuevo.rol }
    };
  });
}

export async function login(correo, clave) {
  return llamar(false, () => {
    const email = String(correo || '').trim().toLowerCase();
    const usuario = leer('usuarios').find((u) => u.correo.toLowerCase() === email && u.clave === clave);

    if (!usuario) {
      return { ok: false, status: 401, error: 'Correo o clave incorrecta' };
    }

    const sesion = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
    guardar('usuario_activo', sesion);
    return { ok: true, status: 200, data: sesion };
  });
}

// La sesión vive en el navegador: estas dos no son endpoints, por eso son síncronas.
export function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuario_activo'));
  } catch (error) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('usuario_activo');
}
// [IA] fin
// [IA] fin
// [IA] inicio · ia/2026-11-08_tilin67-67_filtro-genero.md
// Deja el género en minúsculas, sin tildes, sin espacios sobrantes y sin punto final.
function normalizarGenero(texto) {
  return String(texto || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[.\s]+$/, '');
}

// Devuelve los géneros que existen en los datos, sin repetir y ordenados.
export async function obtenerGeneros() {
  return llamar(false, () => {
    const vistos = new Map();
    leer('peliculas').forEach((p) => {
      const clave = normalizarGenero(p.genero);
      if (clave && !vistos.has(clave)) {
        vistos.set(clave, String(p.genero).trim().replace(/[.\s]+$/, ''));
      }
    });
    const data = [...vistos.values()].sort((x, y) => x.localeCompare(y, 'es'));
    return { ok: true, status: 200, data };
  });
}
// [IA] fin