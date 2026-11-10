# Reseñas con CRUD, modal, pestañas, acordeón, toasts y carga incremental

- **Fecha:** 2026-11-10
- **Integrante:** Moises Collarte (@tilin67-67)
- **Herramienta y modelo:** Claude
- **Enlace a la conversación:** (no disponible)
- **Archivos afectados:** js/toast.js (archivo nuevo), js/api.js (función `actualizarResena`), htmls/catalogo.html (completo), htmls/Reseña.html (completo)

## Objetivo
Necesitaba un CRUD de reseñas, ver las reseñas de cada película al pinchar en ella, y que al elegir "Escribir reseña" la página de reseña recibiera la película. También quería saber qué componentes de interfaz de la rúbrica ya cumplía y cuáles agregar (modal, pestañas, menú desplegable, toasts, paginación o carga incremental, acordeón). La misma consulta generó el menú desplegable, que se documenta aparte en `2026-11-10_tilin67-67_menu-desplegable.md`.

## Conversación (texto completo, sin editar)

### Prompt 1
ayudame a hacer reseñas con crud, tambien que al pinchar la pelicula me salgan sus reseñas y una opcion de reseñar, y que al pinchar para reseñar, al redirigirme, que se mande el nombre de la pelicula, ademas revisa mi menu, dime con que Componentes de interfaz de la rubrica ya cumplo y cuales deberia poner para obtener todo el puntaje (modal, pestañas, menú desplegable, notificaciones (toasts), paginación o carga incremental, acordeón)

recuerda explicarme como funciona todo y asegurate de que funcione en base a mi codigo, sin contener errores en lo que me des

aqui te adjuntare mi codigo 

catalogo:
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catalogo de peliculas</title>
  <link rel="stylesheet" href="/styles/catalogo_style.css">
  
  

   <!-- [IA] inicio · ia/2026-11-07_tilin67-67_tailwind-alpine.md -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      corePlugins: {
        preflight: false
      }
    }
  </script>

  <!-- [IA] fin -->
</head>

<!-- [IA] inicio · ia/2026-11-07_tilin67-67_catalogo.md -->
<body style="padding-top: 20px;" x-data="catalogoApp()" x-init="cargar()">

<!-- [IA] inicio · ia/2026-11-06_absalom-e_semantica-html.md -->
  <!-- [IA] inicio · ia/2026-11-09_tilin67-67_menu-estatico.md -->
<header
  x-data
  x-init="fetch('/index.html')
    .then(r => r.text())
    .then(t => $el.replaceWith(new DOMParser().parseFromString(t, 'text/html').getElementById('menu-principal')))"
></header>
<!-- [IA] fin -->

  <main style="text-align: center; max-width: 1100px; margin: 0 auto; padding: 20px;">

    <section id="catalogo-info">
      <h1>Catálogo de Películas</h1>
      <p style="color: #666; margin-bottom: 25px;">
        Explora las películas disponibles, busca por título o director y filtra por categoría.
      </p>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; align-items: center; margin-bottom: 30px;">
        <input 
          type="text" 
          x-model="busqueda" 
          @keydown.enter="cargar()"
          placeholder="Buscar por título o director..."
          style="padding: 7px 12px; border: 1px solid rgb(0,160,255); border-radius: 3px; width: 240px; font-size: 14px; height: 35px; box-sizing: border-box;"
        >

       
        <button class="index" @click="cargar()">
          Buscar
        </button>

        <select 
          x-model="genero" 
          @change="cargar()"
          style="padding: 7px 10px; border: 1px solid rgb(0,160,255); border-radius: 3px; background: white; font-size: 14px; height: 35px; box-sizing: border-box;"
        >
          <option value="">Todos los géneros</option>
          <!-- [IA] inicio · ia/2026-11-08_tilin67-67_filtro-genero.md -->
          <template x-for="g in generos" :key="g">
            <option :value="g" x-text="g"></option>
          </template>
          <!-- [IA] fin -->
        </select>

        <select 
          x-model="orden" 
          @change="cargar()"
          style="padding: 7px 10px; border: 1px solid rgb(0,160,255); border-radius: 3px; background: white; font-size: 14px; height: 35px; box-sizing: border-box;"
        >
          <option value="rating_desc">Mejor calificación</option>
          <option value="rating_asc">Menor calificación</option>
          <option value="anio_desc">Más recientes</option>
          <option value="az">Título (A-Z)</option>
        </select>
      </div>
    </section>

<!-- [IA] fin -->

    <div x-show="cargando" style="padding: 30px;">
      <p>Cargando películas...</p>
    </div>

    <div x-show="!cargando && error" style="margin: 20px auto; padding: 15px; max-width: 400px; border: 1px solid #e57373; border-radius: 4px; background-color: #ffebee;">
      <p style="color: #c62828; margin-bottom: 12px;" x-text="error"></p>
      <button class="index" @click="cargar()">
        Reintentar
      </button>
    </div>

    <div x-show="!cargando && !error && peliculas.length === 0" style="padding: 30px; border: 1px dashed #ccc; border-radius: 4px;">
      <p>No se encontraron películas con los filtros seleccionados.</p>
    </div>

    <div x-show="!cargando && !error && peliculas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" style="margin-top: 25px; text-align: left;">
      <template x-for="p in peliculas" :key="p.id">
        <div style="border: 1px solid #ccc; border-radius: 4px; padding: 12px; background: white; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <img :src="p.poster" :alt="p.titulo" style="width: 100%; height: 200px; object-fit: cover; border-radius: 3px; margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px;" x-text="p.titulo"></h3>
            <p style="margin: 0 0 5px 0; font-size: 13px; color: #555;">
              <span x-text="p.director"></span> (<span x-text="p.anio"></span>)
            </p>
            <p style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold; color: rgb(0,140,255);">
              Calificación: <span x-text="p.calificacion"></span> / 10
            </p>
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #666;" x-text="p.sinopsis"></p>
          </div>
          <a href="Reseña.html" style="text-align: center;">
            <button class="Reseña" style="width: 100%;">Escribir reseña</button>
          </a>
        </div>
      </template>
    </div>

  </main>

  <script type="module">
    // [IA] inicio · ia/2026-11-08_tilin67-67_filtro-genero.md
    import { obtenerPeliculas, obtenerGeneros } from '/js/api.js';
    // [IA] fin
    window.catalogoApp = function() {
      return {
        peliculas: [],
        cargando: true,
        error: null,
        busqueda: '',
        genero: '',
        orden: 'rating_desc',
        // [IA] inicio · ia/2026-11-08_tilin67-67_filtro-genero.md
        generos: [],

        init() {
          this.cargarGeneros();
        },

        async cargarGeneros() {
          const res = await obtenerGeneros();
          if (res.ok) this.generos = res.data;
        },
        // [IA] fin
        async cargar() {
          this.cargando = true;
          this.error = null;

          const res = await obtenerPeliculas({
            busqueda: this.busqueda,
            genero: this.genero,
            orden: this.orden
          });

          if (res.ok) {
            this.peliculas = res.data;
          } else {
            this.error = res.error;
            this.peliculas = [];
          }

          this.cargando = false;
        }
      };
    };
  </script>
  <!-- [IA] inicio · ia/2026-11-08_tilin67-67_alpine-orden-carga.md -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <!-- [IA] fin -->
</body>
<!-- [IA] fin -->
</html>

reseña:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crear Reseña</title>
    <link rel="stylesheet" href="/styles/reseña_style.css">
    <!-- [IA] inicio · ia/2026-11-09_tilin67-67_menu-estatico.md -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = { corePlugins: { preflight: false } }
</script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<!-- [IA] fin -->
  </head>
  <body style = "padding-top: 20px">

  <!-- [IA] inicio · ia/2026-11-06_absalom-e_semantica-html.md -->

    <!-- [IA] inicio · ia/2026-11-09_tilin67-67_menu-estatico.md -->
<header
  x-data
  x-init="fetch('/index.html')
    .then(r => r.text())
    .then(t => $el.replaceWith(new DOMParser().parseFromString(t, 'text/html').getElementById('menu-principal')))"
></header>
<!-- [IA] fin -->


    <main style="text-align: center">
    <section class="form-resena">
    <h1>Crear reseña</h1>

    <form id="form-resena">  
  
   <div class="nombre-pelicula">
     <label for="pelicula">Nombre de la película:</label>
     <input type="text" id="pelicula" name="pelicula" required>
   </div>
  
  <div class="reseña">
    <label for="resena">Tu reseña:</label>
    <textarea 
      id="resena" 
      name="resena" 
      rows="2" 
      cols="10" 
      required placeholder="Escribe aquí tu opinión sobre la película..."></textarea>
  </div>
  
  <button type="submit" class="btn-enviar">Enviar reseña</button>

</form>
</section>

<section style="margin-top: 20px">
  <a href="catalogo.html">  
  <button class = "Catalogo">Ver catalogo</button> 
  </a> 
</section>

<!-- [IA] fin -->
   
    </main>
  </body>
</html>


```


api. js:

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

index:

<!doctype html>
<html lang="es">
  
  <head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>udp-movie-reviewer</title>

 
  <link rel="stylesheet" href="/styles/style.css">

  
    <!-- [IA] inicio · ia/2026-11-07_tilin67-67_tailwind-alpine.md -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      corePlugins: {
        preflight: false, 
      }
    }
  </script>

  
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <!-- [IA] fin -->
</head>
  <body style = "padding-top: 20px">

 <!-- [IA] inicio · ia/2026-11-06_absalom-e_semantica-html.md -->

    <!-- [IA] inicio · ia/2026-11-09_tilin67-67_menu-estatico.md -->
<header
  id="menu-principal"
  class="relative flex flex-wrap items-center justify-between px-8 py-3 border-b border-sky-200"
  x-data="{
    abierto: false,
    actual: decodeURIComponent(location.pathname),
    enlaces: [
      { nombre: 'Inicio',           ruta: '/index.html' },
      { nombre: 'Crear cuenta',     ruta: '/htmls/Cre.html' },
      { nombre: 'Iniciar sesión',   ruta: '/htmls/Se.html' },
      { nombre: 'Ver catálogo',     ruta: '/htmls/catalogo.html' },
      { nombre: 'Hacer una reseña', ruta: '/htmls/Reseña.html' }
    ],
    esActual(ruta) {
      return this.actual === ruta || (ruta === '/index.html' && this.actual === '/');
    }
  }"
>
  <a href="/index.html" class="text-lg font-bold text-sky-600 no-underline">udp-movie-reviewer</a>

  <button
    type="button"
    class="md:hidden px-3 py-1 border border-sky-500 rounded text-sky-600"
    aria-label="Abrir menú"
    aria-controls="menu-lista"
    :aria-expanded="abierto"
    @click="abierto = !abierto"
  >☰</button>

  <nav aria-label="Navegación principal" class="w-full md:w-auto">
    <ul
      id="menu-lista"
      class="list-none m-0 p-0 mt-3 md:mt-0 md:flex flex-col md:flex-row gap-2"
      :class="abierto ? 'flex' : 'hidden'"
    >
      <template x-for="e in enlaces" :key="e.ruta">
        <li>
          <a
            :href="e.ruta"
            x-text="e.nombre"
            class="block px-3 py-1 rounded no-underline"
            :class="esActual(e.ruta) ? 'bg-sky-500 text-white' : 'text-sky-600 hover:bg-sky-100'"
            :aria-current="esActual(e.ruta) ? 'page' : null"
          ></a>
        </li>
      </template>
    </ul>
  </nav>
</header>
<!-- [IA] fin -->
    
     <main style="text-align: center">

     <section id="bienvenida">
     <h1>¡Bienvenido a Cubes!</h1>
     <p> Una herramienta unica y sin igual para la critica de
      peliculas, series, cortometrajes y otros medios audiovisuales </p>
     </section>


    <section id="sobre-nosotros">
    <h2> ¿Quienes somos? </h2>
    <p> Cubes es un proyecto desarrollado por Gabriel Echenique y Moises Collarte
      de la Universidad Diego Portales con el objetivo de permitir
      una divulgacion de reseñas y reflexion de medios audio-visuales 
      con el bonus y plus de permitir y otorgar un sello de credibilidad
      y de coherencia a sus criticos sin la necesidad de que estos sean
      una gran empresa o un canal muy grande, permitiendole a usuarios
      de todo tipo crecer y obtener peso y validez ante sus opioniones
      sobre contenidos cinematograficos.</p>
    </section>

    <section id="catalogo-muestra">
        <h2>Catálogo de películas</h2>
        <p>En el boton a continuacion, podra el acceder al catalogo
           de peliculas con el cual la plataforma cuenta:
        </p>

        <a href="htmls/catalogo.html">
        <button class = "catalogo">Ver Catalogo</button> 
        </a>


      </section>

     <section id="accion-resena">
        <h2>Crea una reseña</h2>
        <p>¡Haz tu reseña aqui!.</p>

        <a href="htmls/Reseña.html">  
        <button class = "Reseña">Hacer una reseña</button> 
        </a>  

        <a href="htmls/prueba_menu_tutorial.html">  
        <button class = "prueba">Ir a prueba</button>
        </a>   

      </section>
    
       </main>
     <footer id="contacto" style="text-align: center">
      <h2>Datos de contacto</h2>
      <p>Email, redes sociales, etc.</p>
     </footer>

  <!-- [IA] fin -->

  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
  </body>
</html>


Reseñas .json:
[
  {
    "id": 1,
    "peliculaId": 1,
    "autor": "Anton Ego",
    "calificacion": 8.9,
    "comentario": "La cuarta cinta protagonizada por el equipo de los superhéroes más grandes del universo Marvel es una montaña rusa de emociones y sorpresas que no deja a nadie indiferente.",
    "fecha": "2019-04-26"
  },
  {
    "id": 2,
    "peliculaId": 2,
    "autor": "Usuario Normal",
    "calificacion": 2.5,
    "comentario": "Carece totalmente de encanto, y tan divertida como un dolor de muelas, eliminar la parte de su llegada a la Tierra, su cortejo a Lois y su evolución como superhéroe no sólo priva al filme de una estructura útil, también de la necesaria humanidad.",
    "fecha": "2025-8-01"
  },
  {
    "id": 3,
    "peliculaId": 3,
    "autor": "Usuario Normal",
    "calificacion": 10,
    "comentario": "Se siente como ver un concierto del artista en vida una vez mas.",
    "fecha": "2026-04-28"
  },
  {
    "id": 4,
    "peliculaId": 4,
    "autor": "Anton Ego",
    "calificacion": 9.5,
    "comentario": "Steel Ball Run es el punto de partida perfecto para una de las historias más alocadas del anime (...) La nueva serie sienta unas bases sólidas para una aventura bizarra.",
    "fecha": "2026-03-19"
  },
  {
    "id": 5,
    "peliculaId": 5,
    "autor": "Usuario Normal",
    "calificacion": 7,
    "comentario": "Odiada injustamente en su tiempo de estreno/emisión, actualmente bien valorada. Así es como podríamos describir a Ben 10: Omniverse, la serie más polémica de la franquicia, para bien y para mal. Para mí, es una serie que superó a Supremacía Alienígena y está casi a la par con Fuerza Alienígena (casi).",
    "fecha": "2020-03-25"
  },
  {
    "id": 6,
    "peliculaId": 6,
    "autor": "Anton Ego",
    "calificacion": 3.5,
    "comentario": "es entretenida, pero esta pelicula no merece las calificaciones exageradamente bajas que le dio la critica. aun asi, esta pelicula puede estar en las peores peliculas animadas de la historia? NO, es mala, pero hay peores peliculas, como las de video briquedo, dingo pictures, etc.",
    "fecha": "2017-12-12"
  },
  {
    "id": 7,
    "peliculaId": 7,
    "autor": "Usuario Normal",
    "calificacion": 6.9,
    "comentario": "Sonic 3: La película' es la mejor de la saga gracias a un genial y desatado Jim Carrey.",
    "fecha": "2024-12-26"
  },
  {
    "id": 8,
    "peliculaId": 8,
    "autor": "Anton Ego",
    "calificacion": 9,
    "comentario": "Es un dulce drama lleno de energía. Muy pronto me encontré completamente absorbido por la simple vitalidad narrativa de esta película y las fantásticas interpretaciones principales de Ryan Gosling y Emma Stone, que están excelentes.",
    "fecha": "2016-8-31"
  },
  {
    "id": 9,
    "peliculaId": 9,
    "autor": "Anton Ego",
    "calificacion": 8.1,
    "comentario": "Una delicia magníficamente dulce. La he disfrutado más que las dos versiones anteriores, con Gene Wilder en 1971 y Johnny Depp en 2005. Aporta las endorfinas del chocolate.",
    "fecha": "2023-12-20"
  },
  {
    "id": 10,
    "peliculaId": 10,
    "autor": "Usuario Normal",
    "calificacion": 1,
    "comentario": "Five Nights at Freddy's 2 no es solo una mala película de terror. Es insolente y cínica en su mediocridad.",
    "fecha": "2025-12-4"
  }
]

### Respuesta 1
``````
Cubro todo en esta respuesta. Cambié una cosa de tu pedido: al botón "Escribir reseña" le paso el **id** de la película en la URL (`Reseña.html?peliculaId=3`), no el nombre. Dos películas pueden compartir título, y la reseña guardada necesita el `peliculaId`. La página de reseña busca el nombre con ese id y lo muestra ya seleccionado.

## Rúbrica: qué cumples y qué falta

Solo veo tu código, no la rúbrica, así que el criterio exacto de cada componente es una suposición mía.

| Componente | Hoy | Con este cambio |
|---|---|---|
| Menú desplegable | Parcial: la hamburguesa solo existe en móvil | Agrego un desplegable "Cuenta ▾" visible también en escritorio |
| Modal | No | Detalle de la película al hacer clic |
| Pestañas | No | "Sinopsis" y "Reseñas" dentro del modal |
| Acordeón | No | Cada reseña se expande para leerla y editarla |
| Toasts | No | Avisos al crear, editar y eliminar |
| Carga incremental | No | Botón "Ver más películas" |

## Qué archivos tocar

1. Archivo nuevo `toast.js`, en la misma carpeta que tu `api.js`.
2. `api.js`: agregar una función, porque te faltaba **Update** para completar el CRUD.
3. `index.html`: reemplazar el `<header id="menu-principal">`. Las otras páginas lo copian solas.
4. `catalogo.html`: reemplazar el archivo completo.
5. `Reseña.html`: reemplazar el archivo completo.

Crea también estos dos archivos en tu carpeta `ia/` para que los marcadores coincidan:
- `2026-11-10_tilin67-67_resenas-crud.md`
- `2026-11-10_tilin67-67_menu-desplegable.md`

### 1) `toast.js` (nuevo)

```js
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
```

- El contenedor se crea una sola vez, fijo abajo a la derecha. Cada aviso se agrega y se borra solo a los 3 segundos.
- Uso `textContent` y no `innerHTML` para que ningún texto se interprete como HTML.
- Los estilos son inline para no depender de Tailwind.
- `role="status"` hace que los lectores de pantalla anuncien el aviso.

### 2) `api.js`: pega esto justo antes de `export async function eliminarResena`

```js
// [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md
export async function actualizarResena(id, cambios) {
  await esperar(LATENCIA);
  await cargarDatosIniciales();
  const resenas = JSON.parse(localStorage.getItem('resenas') || '[]');
  const indice = resenas.findIndex((r) => r.id === Number(id));

  if (indice === -1) {
    return { ok: false, status: 404, error: 'Reseña no encontrada' };
  }

  resenas[indice] = {
    ...resenas[indice],
    calificacion: Number(cambios.calificacion),
    comentario: cambios.comentario
  };
  localStorage.setItem('resenas', JSON.stringify(resenas));

  return { ok: true, status: 200, data: resenas[indice] };
}
// [IA] fin
```

Sigue el mismo patrón que tus otras funciones. Busca la reseña por id y, si no existe, devuelve 404. Si existe, cambia solo calificación y comentario, y deja intactos autor, fecha e id.

### 3) `index.html`: reemplaza el `<header id="menu-principal">` completo

```html
<!-- [IA] inicio · ia/2026-11-10_tilin67-67_menu-desplegable.md -->
<header
  id="menu-principal"
  class="relative flex flex-wrap items-center justify-between px-8 py-3 border-b border-sky-200"
  x-data="{
    abierto: false,
    cuenta: false,
    actual: decodeURIComponent(location.pathname),
    enlaces: [
      { nombre: 'Inicio',           ruta: '/index.html' },
      { nombre: 'Ver catálogo',     ruta: '/htmls/catalogo.html' },
      { nombre: 'Hacer una reseña', ruta: '/htmls/Reseña.html' }
    ],
    enlacesCuenta: [
      { nombre: 'Crear cuenta',   ruta: '/htmls/Cre.html' },
      { nombre: 'Iniciar sesión', ruta: '/htmls/Se.html' }
    ],
    esActual(ruta) {
      return this.actual === ruta || (ruta === '/index.html' && this.actual === '/');
    },
    cuentaActiva() {
      return this.enlacesCuenta.some(e => this.esActual(e.ruta));
    }
  }"
>
  <a href="/index.html" class="text-lg font-bold text-sky-600 no-underline">udp-movie-reviewer</a>

  <button
    type="button"
    class="md:hidden px-3 py-1 border border-sky-500 rounded text-sky-600"
    aria-label="Abrir menú"
    aria-controls="menu-lista"
    :aria-expanded="abierto"
    @click="abierto = !abierto"
  >☰</button>

  <nav aria-label="Navegación principal" class="w-full md:w-auto">
    <ul
      id="menu-lista"
      class="list-none m-0 p-0 mt-3 md:mt-0 md:flex flex-col md:flex-row md:items-center gap-2"
      :class="abierto ? 'flex' : 'hidden'"
    >
      <template x-for="e in enlaces" :key="e.ruta">
        <li>
          <a
            :href="e.ruta"
            x-text="e.nombre"
            class="block px-3 py-1 rounded no-underline"
            :class="esActual(e.ruta) ? 'bg-sky-500 text-white' : 'text-sky-600 hover:bg-sky-100'"
            :aria-current="esActual(e.ruta) ? 'page' : null"
          ></a>
        </li>
      </template>

      <li class="relative" @click.outside="cuenta = false" @keydown.escape.window="cuenta = false">
        <button
          type="button"
          class="block w-full text-left px-3 py-1 rounded border-0 cursor-pointer"
          :class="cuentaActiva() ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-600 hover:bg-sky-100'"
          aria-haspopup="true"
          :aria-expanded="cuenta"
          @click="cuenta = !cuenta"
        >Cuenta <span aria-hidden="true">▾</span></button>

        <ul
          x-show="cuenta"
          x-transition
          style="display: none;"
          class="list-none m-0 p-1 mt-1 bg-white border border-sky-200 rounded shadow-lg md:absolute md:right-0 md:min-w-[11rem] z-20"
        >
          <template x-for="e in enlacesCuenta" :key="e.ruta">
            <li>
              <a
                :href="e.ruta"
                x-text="e.nombre"
                class="block px-3 py-1 rounded no-underline"
                :class="esActual(e.ruta) ? 'bg-sky-500 text-white' : 'text-sky-600 hover:bg-sky-100'"
                :aria-current="esActual(e.ruta) ? 'page' : null"
              ></a>
            </li>
          </template>
        </ul>
      </li>
    </ul>
  </nav>
</header>
<!-- [IA] fin -->
```

- `enlacesCuenta` saca "Crear cuenta" e "Iniciar sesión" de la lista principal y los mete en un grupo.
- El botón "Cuenta ▾" cambia `cuenta` entre abierto y cerrado, y `x-show` muestra u oculta la lista.
- `@click.outside` cierra el desplegable al hacer clic fuera, y `@keydown.escape.window` lo cierra con Esc.
- `cuentaActiva()` pinta "Cuenta" de azul si estás en una de sus dos páginas, para que el menú siga diciendo dónde estás.
- `aria-haspopup` y `aria-expanded` informan del estado a los lectores de pantalla.
- En escritorio la lista flota (`md:absolute`), y en móvil se despliega dentro del menú hamburguesa.

### 4) `catalogo.html` completo

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catalogo de peliculas</title>
  <link rel="stylesheet" href="/styles/catalogo_style.css">

   <!-- [IA] inicio · ia/2026-11-07_tilin67-67_tailwind-alpine.md -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      corePlugins: {
        preflight: false
      }
    }
  </script>
  <!-- [IA] fin -->
</head>

<!-- [IA] inicio · ia/2026-11-07_tilin67-67_catalogo.md -->
<body style="padding-top: 20px;" x-data="catalogoApp()" x-init="cargar()">

<!-- [IA] inicio · ia/2026-11-06_absalom-e_semantica-html.md -->
  <!-- [IA] inicio · ia/2026-11-09_tilin67-67_menu-estatico.md -->
<header
  x-data
  x-init="fetch('/index.html')
    .then(r => r.text())
    .then(t => $el.replaceWith(new DOMParser().parseFromString(t, 'text/html').getElementById('menu-principal')))"
></header>
<!-- [IA] fin -->

  <main style="text-align: center; max-width: 1100px; margin: 0 auto; padding: 20px;">

    <section id="catalogo-info">
      <h1>Catálogo de Películas</h1>
      <p style="color: #666; margin-bottom: 25px;">
        Explora las películas disponibles, busca por título o director y filtra por categoría.
      </p>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; align-items: center; margin-bottom: 30px;">
        <input 
          type="text" 
          x-model="busqueda" 
          @keydown.enter="cargar()"
          placeholder="Buscar por título o director..."
          style="padding: 7px 12px; border: 1px solid rgb(0,160,255); border-radius: 3px; width: 240px; font-size: 14px; height: 35px; box-sizing: border-box;"
        >

        <button class="index" @click="cargar()">
          Buscar
        </button>

        <select 
          x-model="genero" 
          @change="cargar()"
          style="padding: 7px 10px; border: 1px solid rgb(0,160,255); border-radius: 3px; background: white; font-size: 14px; height: 35px; box-sizing: border-box;"
        >
          <option value="">Todos los géneros</option>
          <!-- [IA] inicio · ia/2026-11-08_tilin67-67_filtro-genero.md -->
          <template x-for="g in generos" :key="g">
            <option :value="g" x-text="g"></option>
          </template>
          <!-- [IA] fin -->
        </select>

        <select 
          x-model="orden" 
          @change="cargar()"
          style="padding: 7px 10px; border: 1px solid rgb(0,160,255); border-radius: 3px; background: white; font-size: 14px; height: 35px; box-sizing: border-box;"
        >
          <option value="rating_desc">Mejor calificación</option>
          <option value="rating_asc">Menor calificación</option>
          <option value="anio_desc">Más recientes</option>
          <option value="az">Título (A-Z)</option>
        </select>
      </div>
    </section>

<!-- [IA] fin -->

    <div x-show="cargando" style="padding: 30px;">
      <p>Cargando películas...</p>
    </div>

    <div x-show="!cargando && error" style="margin: 20px auto; padding: 15px; max-width: 400px; border: 1px solid #e57373; border-radius: 4px; background-color: #ffebee;">
      <p style="color: #c62828; margin-bottom: 12px;" x-text="error"></p>
      <button class="index" @click="cargar()">
        Reintentar
      </button>
    </div>

    <div x-show="!cargando && !error && peliculas.length === 0" style="padding: 30px; border: 1px dashed #ccc; border-radius: 4px;">
      <p>No se encontraron películas con los filtros seleccionados.</p>
    </div>

    <!-- [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md -->
    <div x-show="!cargando && !error && peliculas.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" style="margin-top: 25px; text-align: left;">
      <template x-for="p in peliculasVisibles" :key="p.id">
        <div style="border: 1px solid #ccc; border-radius: 4px; padding: 12px; background: white; display: flex; flex-direction: column; justify-content: space-between;">
          <div
            class="cursor-pointer"
            role="button"
            tabindex="0"
            :aria-label="'Ver detalles de ' + p.titulo"
            @click="abrirModal(p)"
            @keydown.enter="abrirModal(p)"
          >
            <img :src="p.poster" :alt="p.titulo" style="width: 100%; height: 200px; object-fit: cover; border-radius: 3px; margin-bottom: 10px;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px;" x-text="p.titulo"></h3>
            <p style="margin: 0 0 5px 0; font-size: 13px; color: #555;">
              <span x-text="p.director"></span> (<span x-text="p.anio"></span>)
            </p>
            <p style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold; color: rgb(0,140,255);">
              Calificación: <span x-text="p.calificacion"></span> / 10
            </p>
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #666;" x-text="p.sinopsis"></p>
          </div>
          <a :href="'Reseña.html?peliculaId=' + p.id" style="text-align: center;">
            <button class="Reseña" style="width: 100%;">Escribir reseña</button>
          </a>
        </div>
      </template>
    </div>

    <div x-show="!cargando && !error && visibles < peliculas.length" style="margin-top: 25px;">
      <button class="index" @click="verMas()">Ver más películas</button>
      <p style="font-size: 13px; color: #666;">
        Mostrando <span x-text="peliculasVisibles.length"></span> de <span x-text="peliculas.length"></span>
      </p>
    </div>
    <!-- [IA] fin -->

  </main>

  <!-- [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md -->
  <template x-if="modalAbierto && peliculaSel">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.55);"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      @click.self="cerrarModal()"
      @keydown.escape.window="cerrarModal()"
    >
      <div class="bg-white rounded w-full max-w-xl overflow-y-auto p-5 text-left" style="max-height: 85vh;">

        <div class="flex justify-between items-start gap-3 mb-3">
          <h2 id="modal-titulo" class="m-0 text-xl" x-text="peliculaSel.titulo"></h2>
          <button type="button" class="px-2 cursor-pointer" aria-label="Cerrar" @click="cerrarModal()">✕</button>
        </div>

        <!-- Pestañas -->
        <div role="tablist" class="flex gap-2 mb-3">
          <button
            type="button" role="tab"
            :aria-selected="pestana === 'sinopsis'"
            @click="pestana = 'sinopsis'"
            class="px-3 py-1 rounded border border-sky-300 cursor-pointer"
            :class="pestana === 'sinopsis' ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-600'"
          >Sinopsis</button>
          <button
            type="button" role="tab"
            :aria-selected="pestana === 'resenas'"
            @click="pestana = 'resenas'"
            class="px-3 py-1 rounded border border-sky-300 cursor-pointer"
            :class="pestana === 'resenas' ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-600'"
          >Reseñas (<span x-text="resenas.length"></span>)</button>
        </div>

        <!-- Pestaña 1: sinopsis -->
        <div x-show="pestana === 'sinopsis'" role="tabpanel">
          <img :src="peliculaSel.poster" :alt="peliculaSel.titulo" class="w-full rounded mb-3" style="height: 220px; object-fit: cover;">
          <p class="m-0 mb-1 text-sm text-gray-600">
            <span x-text="peliculaSel.director"></span> (<span x-text="peliculaSel.anio"></span>) ·
            <span x-text="peliculaSel.genero"></span>
          </p>
          <p class="m-0 mb-2 text-sm font-bold" style="color: rgb(0,140,255);">
            Calificación: <span x-text="peliculaSel.calificacion"></span> / 10
          </p>
          <p class="m-0 text-sm" x-text="peliculaSel.sinopsis"></p>
        </div>

        <!-- Pestaña 2: reseñas (acordeón) -->
        <div x-show="pestana === 'resenas'" role="tabpanel">
          <p x-show="cargandoResenas">Cargando reseñas...</p>
          <p x-show="!cargandoResenas && errorResenas" class="text-red-700" x-text="errorResenas"></p>
          <p x-show="!cargandoResenas && !errorResenas && resenas.length === 0" class="text-sm text-gray-600">
            Esta película aún no tiene reseñas. ¡Escribe la primera!
          </p>

          <div x-show="!cargandoResenas && !errorResenas">
            <template x-for="r in resenas" :key="r.id">
              <div class="border border-sky-200 rounded mb-2">
                <h3 class="m-0 text-base">
                  <button
                    type="button"
                    class="w-full flex justify-between items-center px-3 py-2 text-left bg-transparent border-0 cursor-pointer"
                    :aria-expanded="abiertaId === r.id"
                    @click="abiertaId = (abiertaId === r.id ? null : r.id)"
                  >
                    <span>
                      <strong x-text="r.autor"></strong> ·
                      <span x-text="r.calificacion + ' / 10'"></span>
                    </span>
                    <span aria-hidden="true" x-text="abiertaId === r.id ? '−' : '+'"></span>
                  </button>
                </h3>

                <div x-show="abiertaId === r.id" class="px-3 pb-3 text-sm">

                  <!-- Leer -->
                  <div x-show="editandoId !== r.id">
                    <p class="m-0 mb-1 text-xs text-gray-500" x-text="r.fecha"></p>
                    <p class="m-0 mb-2" x-text="r.comentario"></p>
                    <template x-if="r.autor === autorActual">
                      <div class="flex gap-2">
                        <button type="button" class="index" @click="empezarEdicion(r)">Editar</button>
                        <button type="button" class="index" @click="borrar(r)">Eliminar</button>
                      </div>
                    </template>
                  </div>

                  <!-- Editar -->
                  <form x-show="editandoId === r.id" @submit.prevent="guardarEdicion(r)" class="flex flex-col gap-2">
                    <label class="text-xs" :for="'cal-' + r.id">Calificación (0 a 10)</label>
                    <input :id="'cal-' + r.id" type="number" min="0" max="10" step="0.1" required
                           x-model.number="editCalificacion" class="border border-sky-400 rounded px-2 py-1">
                    <label class="text-xs" :for="'com-' + r.id">Comentario</label>
                    <textarea :id="'com-' + r.id" rows="3" required
                              x-model="editComentario" class="border border-sky-400 rounded px-2 py-1"></textarea>
                    <div class="flex gap-2">
                      <button type="submit" class="index">Guardar</button>
                      <button type="button" class="index" @click="editandoId = null">Cancelar</button>
                    </div>
                  </form>

                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="flex gap-2 justify-end mt-4">
          <a :href="'Reseña.html?peliculaId=' + peliculaSel.id">
            <button type="button" class="Reseña">Escribir reseña</button>
          </a>
          <button type="button" class="index" @click="cerrarModal()">Cerrar</button>
        </div>

      </div>
    </div>
  </template>
  <!-- [IA] fin -->

  <script type="module">
    // [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md
    import {
      obtenerPeliculas, obtenerGeneros,
      obtenerResenas, actualizarResena, eliminarResena, obtenerUsuario
    } from '/js/api.js';
    import { mostrarToast } from '/js/toast.js';

    const POR_PAGINA = 6;
    // [IA] fin

    window.catalogoApp = function() {
      return {
        peliculas: [],
        cargando: true,
        error: null,
        busqueda: '',
        genero: '',
        orden: 'rating_desc',
        // [IA] inicio · ia/2026-11-08_tilin67-67_filtro-genero.md
        generos: [],

        init() {
          this.cargarGeneros();
        },

        async cargarGeneros() {
          const res = await obtenerGeneros();
          if (res.ok) this.generos = res.data;
        },
        // [IA] fin

        // [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md
        // Carga incremental
        visibles: POR_PAGINA,
        get peliculasVisibles() {
          return this.peliculas.slice(0, this.visibles);
        },
        verMas() {
          this.visibles += POR_PAGINA;
        },

        // Modal, pestañas y acordeón
        modalAbierto: false,
        peliculaSel: null,
        pestana: 'sinopsis',
        resenas: [],
        cargandoResenas: false,
        errorResenas: null,
        abiertaId: null,
        editandoId: null,
        editCalificacion: '',
        editComentario: '',
        autorActual: 'Usuario',

        async abrirModal(p) {
          this.peliculaSel = p;
          this.pestana = 'sinopsis';
          this.abiertaId = null;
          this.editandoId = null;
          this.resenas = [];
          this.autorActual = obtenerUsuario()?.nombre || 'Usuario';
          this.modalAbierto = true;
          await this.cargarResenas();
        },

        cerrarModal() {
          this.modalAbierto = false;
        },

        async cargarResenas() {
          const id = this.peliculaSel.id;
          this.cargandoResenas = true;
          this.errorResenas = null;

          const res = await obtenerResenas(id);
          if (!this.peliculaSel || this.peliculaSel.id !== id) return;

          if (res.ok) {
            this.resenas = res.data;
          } else {
            this.errorResenas = res.error;
            this.resenas = [];
          }
          this.cargandoResenas = false;
        },

        empezarEdicion(r) {
          this.editandoId = r.id;
          this.editCalificacion = r.calificacion;
          this.editComentario = r.comentario;
        },

        async guardarEdicion(r) {
          if (this.editComentario.trim() === '') {
            mostrarToast('El comentario no puede estar vacío.', 'error');
            return;
          }
          const res = await actualizarResena(r.id, {
            calificacion: this.editCalificacion,
            comentario: this.editComentario.trim()
          });
          if (res.ok) {
            this.editandoId = null;
            await this.cargarResenas();
            mostrarToast('Reseña actualizada.');
          } else {
            mostrarToast(res.error, 'error');
          }
        },

        async borrar(r) {
          if (!confirm('¿Eliminar esta reseña?')) return;
          const res = await eliminarResena(r.id);
          if (res.ok) {
            await this.cargarResenas();
            mostrarToast('Reseña eliminada.');
          } else {
            mostrarToast(res.error, 'error');
          }
        },
        // [IA] fin

        async cargar() {
          this.cargando = true;
          this.error = null;
          this.visibles = POR_PAGINA;

          const res = await obtenerPeliculas({
            busqueda: this.busqueda,
            genero: this.genero,
            orden: this.orden
          });

          if (res.ok) {
            this.peliculas = res.data;
          } else {
            this.error = res.error;
            this.peliculas = [];
          }

          this.cargando = false;
        }
      };
    };
  </script>
  <!-- [IA] inicio · ia/2026-11-08_tilin67-67_alpine-orden-carga.md -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <!-- [IA] fin -->
</body>
<!-- [IA] fin -->
</html>
```

### 5) `Reseña.html` completo

Quité Alpine del `<head>` y lo puse al final del `<body>`, después del script del módulo. Es el mismo problema de orden que tuviste antes: esta página ahora define `resenaApp()` en un módulo, y Alpine tiene que arrancar después de que esa función exista.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crear Reseña</title>
    <link rel="stylesheet" href="/styles/reseña_style.css">
    <!-- [IA] inicio · ia/2026-11-09_tilin67-67_menu-estatico.md -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = { corePlugins: { preflight: false } }
    </script>
    <!-- [IA] fin -->
  </head>
  <body style="padding-top: 20px" x-data="resenaApp()">

  <!-- [IA] inicio · ia/2026-11-06_absalom-e_semantica-html.md -->

    <!-- [IA] inicio · ia/2026-11-09_tilin67-67_menu-estatico.md -->
<header
  x-data
  x-init="fetch('/index.html')
    .then(r => r.text())
    .then(t => $el.replaceWith(new DOMParser().parseFromString(t, 'text/html').getElementById('menu-principal')))"
></header>
<!-- [IA] fin -->

    <main style="text-align: center">
    <section class="form-resena">
    <h1>Crear reseña</h1>

    <!-- [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md -->
    <form id="form-resena" @submit.prevent="enviar()">

      <div class="nombre-pelicula">
        <label for="pelicula">Película:</label>
        <select id="pelicula" name="pelicula" x-model.number="peliculaId" required>
          <option value="">Selecciona una película</option>
          <template x-for="p in peliculas" :key="p.id">
            <option :value="p.id" x-text="p.titulo"></option>
          </template>
        </select>
      </div>

      <div class="calificacion">
        <label for="calificacion">Calificación (0 a 10):</label>
        <input type="number" id="calificacion" name="calificacion"
               min="0" max="10" step="0.1" x-model.number="calificacion" required>
      </div>

      <div class="reseña">
        <label for="resena">Tu reseña:</label>
        <textarea
          id="resena"
          name="resena"
          rows="2"
          cols="10"
          x-model="comentario"
          required placeholder="Escribe aquí tu opinión sobre la película..."></textarea>
      </div>

      <button type="submit" class="btn-enviar" :disabled="enviando">
        <span x-text="enviando ? 'Enviando...' : 'Enviar reseña'"></span>
      </button>

    </form>
    <!-- [IA] fin -->
    </section>

    <section style="margin-top: 20px">
      <a href="catalogo.html">  
      <button class="Catalogo">Ver catalogo</button> 
      </a> 
    </section>

    <!-- [IA] fin -->

    </main>

    <!-- [IA] inicio · ia/2026-11-10_tilin67-67_resenas-crud.md -->
    <script type="module">
      import { obtenerPeliculas, crearResena, obtenerUsuario } from '/js/api.js';
      import { mostrarToast } from '/js/toast.js';

      window.resenaApp = function () {
        return {
          peliculas: [],
          peliculaId: '',
          calificacion: '',
          comentario: '',
          enviando: false,

          async init() {
            const res = await obtenerPeliculas({ orden: 'az' });
            if (!res.ok) {
              mostrarToast(res.error, 'error');
              return;
            }
            this.peliculas = res.data;

            const idUrl = Number(new URLSearchParams(location.search).get('peliculaId'));
            if (idUrl) {
              await this.$nextTick();
              this.peliculaId = idUrl;
            }
          },

          async enviar() {
            if (this.comentario.trim() === '') {
              mostrarToast('Escribe tu reseña antes de enviar.', 'error');
              return;
            }
            this.enviando = true;
            const usuario = obtenerUsuario();

            const res = await crearResena({
              peliculaId: this.peliculaId,
              autor: usuario ? usuario.nombre : 'Usuario',
              calificacion: this.calificacion,
              comentario: this.comentario.trim()
            });

            this.enviando = false;
            if (res.ok) {
              this.comentario = '';
              this.calificacion = '';
              mostrarToast('¡Reseña publicada!');
            } else {
              mostrarToast(res.error || 'No se pudo enviar la reseña.', 'error');
            }
          }
        };
      };
    </script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <!-- [IA] fin -->
  </body>
</html>
```

## Cómo funciona

**Flujo completo.** En el catálogo haces clic en una película y se abre el modal con sus reseñas. "Escribir reseña" te lleva a `Reseña.html?peliculaId=3`, la página lee ese número de la URL y deja la película seleccionada. Al enviar, se guarda y aparece un toast.

**CRUD:**
- **Create:** `crearResena`, desde `Reseña.html`.
- **Read:** `obtenerResenas(id)`, al abrir el modal del catálogo.
- **Update:** `actualizarResena`, con el botón Editar dentro del acordeón.
- **Delete:** `eliminarResena`, con el botón Eliminar y un `confirm()` previo.

**Carga incremental.**
- `visibles` empieza en 6, y el getter `peliculasVisibles` devuelve solo esas con `slice`.
- "Ver más" suma 6.
- `cargar()` reinicia a 6 cuando cambias filtro u orden, así no quedas con 18 resultados de la búsqueda anterior.

**Modal.**
- `<template x-if>` crea el modal solo mientras está abierto, así no se evalúa `peliculaSel.titulo` cuando vale `null`.
- `@click.self` cierra al hacer clic en el fondo oscuro, y `@keydown.escape.window` cierra con Esc.
- `role="dialog"` y `aria-modal` lo hacen accesible.
- La tarjeta era un contenedor con el enlace "Escribir reseña" dentro. Para no abrir el modal al pulsar ese enlace, puse el `@click` solo en el bloque de texto e imagen.

**Pestañas y acordeón.**
- `pestana` guarda cuál está activa y `x-show` muestra su panel.
- En el acordeón, `abiertaId` guarda la reseña abierta. Al pulsar otra se cierra la anterior, y al pulsar la misma se cierra.

**Carrera entre peticiones.** En `cargarResenas` comparo el id al volver de la petición. Si abriste otra película mientras cargaba la primera, la respuesta vieja se descarta y no pisa a la nueva.

**Select de Reseña.html.** Alpine fija el valor del `<select>` antes de que existan las opciones. Por eso asigno `peliculaId` después de `$nextTick()`, cuando el DOM ya las tiene.

## Cómo probar

1. Entra a `Reseña.html` desde el menú y envía una reseña sin iniciar sesión. Se guarda con autor "Usuario".
2. En el catálogo abre esa película, ve a "Reseñas" y expande tu reseña. Solo ahí aparecen Editar y Eliminar, porque solo se puede tocar lo escrito por el autor activo. Las reseñas de ejemplo ("Anton Ego", "Usuario Normal") solo se editan si inicias sesión con ese nombre. Esto depende de que el campo `nombre` de tu `usuarios.json` coincida con esos autores, algo que no puedo ver.
3. Clic en "Escribir reseña" desde una tarjeta o desde el modal, y revisa que la película llegue preseleccionada.
4. Achica la ventana para ver la hamburguesa, y en pantalla ancha prueba "Cuenta ▾".

## Detalles a tener en cuenta

- **Estilos del select:** si tu `reseña_style.css` da estilo a `.nombre-pelicula input`, agrega también `.nombre-pelicula select`, porque cambié el input de texto por un `<select>`.
- **Calificación de la película:** la nota de la tarjeta viene de `peliculas.json` y no se recalcula con las reseñas nuevas. Si la rúbrica pide promedio, es otra función.
- **Botones del modal:** usan tus clases `index` y `Reseña`. Si algún botón se ve distinto, es porque tu CSS global los toca.
``````

## Qué se incorporó al proyecto
- `js/toast.js`: archivo nuevo con `mostrarToast`, tal como lo entregó la respuesta.
- `js/api.js`: la función `actualizarResena`, pegada antes de `eliminarResena`, que completa el CRUD (antes faltaba Update).
- `htmls/catalogo.html`: reemplazado por la versión de la respuesta, con carga incremental (botón "Ver más películas"), modal de detalle, pestañas "Sinopsis" y "Reseñas", acordeón de reseñas con editar y eliminar, y toasts.
- `htmls/Reseña.html`: reemplazado por la versión de la respuesta, con el `<select>` de películas, el campo de calificación, el formulario con Alpine y la preselección de la película desde la URL (`?peliculaId=`). Alpine pasó al final del `<body>`, después del script del módulo.
- Cambio respecto de lo que pedí: la respuesta envía el id de la película en la URL en vez del nombre, porque dos películas pueden compartir título y la reseña guardada necesita `peliculaId`.
- El menú desplegable de esta misma respuesta se registra en `2026-11-10_tilin67-67_menu-desplegable.md`.


## Verificación

**Cómo lo probé**
- simplemente aplique la vieja confiable npm run dev, me fui a catalogo, vi que podia pinchar peliculas, ver reseñas, hacer, etc. Tambien achique la pagina para ver si es que el menu se desplegaba bien y poco mas.

**Qué entiendo del código**
- `toast.js`: `obtenerContenedor()` crea una sola vez un `<div>` fijo abajo a la derecha (`position: fixed`) con `role="status"` y `aria-live="polite"`, para que los lectores de pantalla anuncien los avisos. `mostrarToast(mensaje, tipo)` crea un `<div>` con el color según el tipo (éxito, error o info), usa `textContent` en vez de `innerHTML` para que ningún texto se interprete como HTML, lo agrega al contenedor y lo borra solo a los 3 segundos con `setTimeout`.
- `actualizarResena(id, cambios)` sigue el patrón de las demás funciones de `api.js`: espera la latencia, carga los datos, busca el índice con `findIndex` y, si no existe, devuelve 404. Si existe, el operador de propagación `...resenas[indice]` conserva id, autor y fecha, y solo reemplaza calificación y comentario; luego guarda en `localStorage` y responde 200.
- CRUD completo: Create con `crearResena` (en `Reseña.html`), Read con `obtenerResenas(id)` (al abrir el modal), Update con `actualizarResena` (botón Editar) y Delete con `eliminarResena` (botón Eliminar, con `confirm()` previo).
- Carga incremental: `visibles` parte en `POR_PAGINA` (6), el getter `peliculasVisibles` devuelve `peliculas.slice(0, visibles)`, y `verMas()` suma 6. `cargar()` reinicia `visibles` cuando cambia el filtro o el orden, para no quedar con resultados de la búsqueda anterior.
- Modal: `<template x-if="modalAbierto && peliculaSel">` crea el modal solo mientras está abierto, así no se evalúa `peliculaSel.titulo` cuando vale `null`. `@click.self` cierra al hacer clic en el fondo oscuro, `@keydown.escape.window` cierra con Esc, y `role="dialog"` con `aria-modal` lo hacen accesible.
- La tarjeta abre el modal con `@click` solo en el bloque de imagen y texto, no en toda la tarjeta, para que el enlace "Escribir reseña" no abra el modal al pulsarlo.
- Pestañas: `pestana` guarda cuál está activa y `x-show` muestra el panel correspondiente. Acordeón: `abiertaId` guarda la reseña abierta; al pulsar otra se cierra la anterior y al pulsar la misma se cierra.
- Editar y eliminar solo aparecen si `r.autor === autorActual`, donde `autorActual` sale de `obtenerUsuario()?.nombre || 'Usuario'`. `?.` evita un error si no hay sesión.
- `cargarResenas()` guarda el `id` antes de pedir los datos y, al volver, compara con `this.peliculaSel.id`; si abriste otra película mientras cargaba, la respuesta vieja se descarta y no pisa a la nueva.
- `Reseña.html`: lee `?peliculaId=` con `URLSearchParams(location.search)`, y asigna `peliculaId` después de `await this.$nextTick()`, cuando el DOM ya tiene las opciones del `<select>`; si no, Alpine fija el valor antes de que existan las opciones y no se selecciona nada. `x-model.number` convierte el valor a número, y `:disabled="enviando"` evita enviar dos veces.
- Orden de scripts: `Reseña.html` define `resenaApp()` en un `<script type="module">`, por eso Alpine va después, al final del `<body>`. Es el mismo problema de orden que el del registro `alpine-orden-carga`.