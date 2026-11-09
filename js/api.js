// [IA] inicio · ia/2026-11-07_tilin67-67_capa-api.md
const LATENCIA = 500;
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function cargarDatosIniciales() {
  if (!localStorage.getItem('peliculas')) {
    const res = await fetch('/mocks/peliculas.json');
    const data = await res.json();
    localStorage.setItem('peliculas', JSON.stringify(data));
  }

  if (!localStorage.getItem('resenas')) {
    const res = await fetch('/mocks/resenas.json');
    const data = await res.json();
    localStorage.setItem('resenas', JSON.stringify(data));
  }
}

cargarDatosIniciales();

export async function obtenerPeliculas({ busqueda = '', genero = '', orden = '', forzarError = false } = {}) {
  await esperar(LATENCIA);

  if (forzarError) {
    return { ok: false, status: 500, error: 'No se pudo conectar con el servidor.' };
  }

  await cargarDatosIniciales();
  let peliculas = JSON.parse(localStorage.getItem('peliculas') || '[]');

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
}

export async function obtenerPelicula(id) {
  await esperar(LATENCIA);
  await cargarDatosIniciales();
  const peliculas = JSON.parse(localStorage.getItem('peliculas') || '[]');
  const pelicula = peliculas.find((p) => p.id === Number(id));

  if (!pelicula) {
    return { ok: false, status: 404, error: 'Pelicula no encontrada' };
  }
  return { ok: true, status: 200, data: pelicula };
}

export async function obtenerResenas(peliculaId = null) {
  await esperar(LATENCIA);
  await cargarDatosIniciales();
  const resenas = JSON.parse(localStorage.getItem('resenas') || '[]');

  if (peliculaId) {
    return { ok: true, status: 200, data: resenas.filter((r) => r.peliculaId === Number(peliculaId)) };
  }
  return { ok: true, status: 200, data: resenas };
}

export async function crearResena(datos) {
  await esperar(LATENCIA);
  await cargarDatosIniciales();
  const resenas = JSON.parse(localStorage.getItem('resenas') || '[]');

  const nueva = {
    id: Date.now(),
    peliculaId: Number(datos.peliculaId),
    autor: datos.autor || 'Usuario',
    calificacion: Number(datos.calificacion),
    comentario: datos.comentario,
    fecha: new Date().toISOString().slice(0, 10)
  };

  resenas.unshift(nueva);
  localStorage.setItem('resenas', JSON.stringify(resenas));

  return { ok: true, status: 201, data: nueva };
}

export async function eliminarResena(id) {
  await esperar(LATENCIA);
  await cargarDatosIniciales();
  let resenas = JSON.parse(localStorage.getItem('resenas') || '[]');
  
  const existe = resenas.some((r) => r.id === Number(id));
  if (!existe) {
    return { ok: false, status: 404, error: 'Reseña no encontrada' };
  }

  resenas = resenas.filter((r) => r.id !== Number(id));
  localStorage.setItem('resenas', JSON.stringify(resenas));

  return { ok: true, status: 200, data: { mensaje: 'Eliminada correctamente' } };
}

export async function login(correo, clave) {
  await esperar(LATENCIA);
  try {
    const res = await fetch('/mocks/usuarios.json');
    const usuarios = await res.json();
    const usuario = usuarios.find((u) => u.correo === correo && u.clave === clave);

    if (!usuario) {
      return { ok: false, status: 401, error: 'Correo o clave incorrecta' };
    }

    const sesion = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
    localStorage.setItem('usuario_activo', JSON.stringify(sesion));
    return { ok: true, status: 200, data: sesion };
  } catch (error) {
    return { ok: false, status: 500, error: 'Error al iniciar sesion' };
  }
}

export function obtenerUsuario() {
  const sesion = localStorage.getItem('usuario_activo');
  return sesion ? JSON.parse(sesion) : null;
}

export function logout() {
  localStorage.removeItem('usuario_activo');
}
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
  await esperar(LATENCIA);
  await cargarDatosIniciales();
  const peliculas = JSON.parse(localStorage.getItem('peliculas') || '[]');
  const vistos = new Map();
  peliculas.forEach((p) => {
    const clave = normalizarGenero(p.genero);
    if (clave && !vistos.has(clave)) {
      vistos.set(clave, String(p.genero).trim().replace(/[.\s]+$/, ''));
    }
  });
  const data = [...vistos.values()].sort((x, y) => x.localeCompare(y, 'es'));
  return { ok: true, status: 200, data };
}
// [IA] fin