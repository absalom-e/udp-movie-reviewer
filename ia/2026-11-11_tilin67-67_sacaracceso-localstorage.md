Separar el acceso a localStorage del menú mediante js/menu.js
- Fecha: 2026-11-11
- Integrante: Moises Collarte (@tilin67-67)
- Herramienta y modelo: ChatGPT (GPT-6)
- Enlace a la conversación: (no disponible)
- Archivos revisados: index.html, js/api.js, htmls/Se.html, htmls/Cre.html, htmls/Reseña.html, htmls/catalogo.html, htmls/exito.html y htmls/prueba_menu_tutorial.html.
- Archivos para los que se propuso código: js/menu.js (nuevo archivo), index.html, htmls/Se.html, htmls/Cre.html, htmls/Reseña.html y htmls/catalogo.html.
- Estado de la propuesta: código sugerido, pendiente de integrar y probar en el repositorio.
Objetivo
Se buscó eliminar el acceso directo a localStorage desde el HTML del menú. La regla del proyecto establece que los documentos HTML no deben leer ni modificar el almacenamiento local directamente: todo ese acceso debe pasar por la capa de servicios js/api.js.

La solución propuesta fue crear js/menu.js como componente Alpine.js, utilizando las funciones obtenerUsuario() y logout() que ya existen y están exportadas desde js/api.js. También se debía conservar el comportamiento del menú compartido, ya que varias páginas obtienen su header mediante fetch('/index.html').

El objetivo final de la integración es que una búsqueda global de localStorage limitada a archivos *.html devuelva cero coincidencias.
Conversación (prompt original y respuesta registrada)
Prompt 1
necesito que me ayudes a sacar el acceso directo a localstorage  del menu, en el header se puso localstorage.getitem('usuario activo') y remove item directamente en el html, por regla ningun html debe tocar localstorage directo; todo debe pasar por api.js.

para lo cual debemos crear un js/menu.js(o usar alpine.data) que consuma obtenerusuario() y logout() de api.js y que al buscar localstorage en html, no exista ninguna coincidencia.

recuerda revisar mi repositorio, guiarme y explicarme
Respuesta 1
Se revisó la rama 067 del repositorio y se comprobó que js/api.js ya contiene las funciones necesarias para manejar la sesión:
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
Por lo tanto, no era necesario volver a escribir la lógica de lectura y eliminación de sesión. El menú debía importar y consumir esas funciones.
1. Diagnóstico del acceso directo
En index.html, el objeto de x-data del header contenía estas operaciones:
init() {
  try {
    this.usuario = JSON.parse(localStorage.getItem('usuario_activo') || 'null');
  } catch (e) {
    this.usuario = null;
  }
},

cerrarSesion() {
  localStorage.removeItem('usuario_activo');
  this.usuario = null;
  window.location.href = '/index.html';
},
Estas dos operaciones eran el problema: el HTML estaba consultando y eliminando la sesión directamente, saltándose la capa api.js.

También se revisó cómo se comparte el header. htmls/Se.html, htmls/Cre.html, htmls/Reseña.html y htmls/catalogo.html descargan el menú desde index.html mediante fetch. Por ese motivo, crear el componente no era suficiente: el módulo que lo registra debía cargarse en cada documento que usa el menú.
2. Crear js/menu.js con Alpine.data
Se propuso crear el archivo js/menu.js con este contenido:
import { obtenerUsuario, logout } from '/js/api.js';

// Componente que controla el menú principal
document.addEventListener('alpine:init', () => {

  Alpine.data('menu', () => ({

    // Estado del menú
    abierto: false,
    cuenta: false,

    // Página actual
    actual: decodeURIComponent(location.pathname),

    // Enlaces principales
    enlaces: [
      { nombre: 'Inicio', ruta: '/index.html' },
      { nombre: 'Ver catálogo', ruta: '/htmls/catalogo.html' },
      { nombre: 'Hacer una reseña', ruta: '/htmls/Reseña.html' }
    ],

    // Usuario que tiene la sesión iniciada
    usuario: null,

    // Se ejecuta al inicializar el componente
    init() {
      this.usuario = obtenerUsuario();
    },

    // Cierra la sesión
    cerrarSesion() {
      logout();
      this.usuario = null;
      window.location.href = '/index.html';
    },

    // Enlaces relacionados con la cuenta
    enlacesCuenta: [
      { nombre: 'Crear cuenta', ruta: '/htmls/Cre.html' },
      { nombre: 'Iniciar sesión', ruta: '/htmls/Se.html' }
    ],

    // Comprueba si un enlace corresponde a la página actual
    esActual(ruta) {
      return this.actual === ruta ||
        (ruta === '/index.html' && this.actual === '/');
    },

    // Comprueba si estamos en Crear cuenta o Iniciar sesión
    cuentaActiva() {
      return this.enlacesCuenta.some(e => this.esActual(e.ruta));
    }

  }));

});
Cómo funciona:
- import { obtenerUsuario, logout } from '/js/api.js' importa las funciones públicas que ya centralizan el acceso a la sesión.
- document.addEventListener('alpine:init', ...) espera el evento de inicialización de Alpine para registrar el componente.
- Alpine.data('menu', ...) registra un componente reutilizable llamado menu.
- usuario: null define el estado inicial del usuario.
- init() se ejecuta cuando Alpine inicializa el componente y llama a obtenerUsuario(). El menú recibe el usuario o null, sin conocer cómo se guarda.
- cerrarSesion() llama a logout() para solicitar a api.js que elimine la sesión, actualiza el estado visual y redirige al inicio.
- Las propiedades abierto, cuenta, enlaces, enlacesCuenta, esActual() y cuentaActiva() conservan el comportamiento de navegación que ya tenía el menú.
3. Simplificar el header en index.html
Se indicó reemplazar el objeto JavaScript extenso que estaba dentro de x-data por el nombre del componente registrado:
<header
  id="menu-principal"
  class="relative flex flex-wrap items-center justify-between px-8 py-3 border-b border-sky-200"
  x-data="menu"
>
El resto del contenido del menú podía mantenerse: enlaces, botones, x-show, x-if, x-for, cerrarSesion() y las expresiones de Alpine. Ahora esas expresiones utilizan las propiedades y métodos definidos en js/menu.js.

Por ejemplo, el bloque que muestra el usuario y permite cerrar la sesión no necesita cambiar:
<template x-if="usuario">
  <div>
    <li><span x-text="'Hola, ' + usuario.nombre"></span></li>
    <li><button @click="cerrarSesion()">Cerrar sesión</button></li>
  </div>
</template>
4. Cargar menu.js en las páginas que reutilizan el header
Se propuso agregar el módulo antes del script de Alpine en cada documento que utiliza el menú:
<script type="module" src="/js/menu.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
Las páginas identificadas fueron:
- index.html
- htmls/Se.html
- htmls/Cre.html
- htmls/Reseña.html
- htmls/catalogo.html
Esto es necesario porque esas páginas cargan el header desde index.html, pero el contenido insertado mediante fetch no ejecuta por sí mismo los scripts que estaban en el documento descargado. Cada página debe tener registrado el componente menu antes de que Alpine inicialice el header.

htmls/exito.html y htmls/prueba_menu_tutorial.html no se incluyeron porque, en la revisión, no utilizaban ese header compartido.
5. Limpiar las importaciones del index
En index.html también existía un módulo que exponía varias funciones de api.js en window:
import { obtenerUsuario, logout, obtenerPeliculas } from '/js/api.js';

window.obtenerUsuario = obtenerUsuario;
window.logout = logout;
window.obtenerPeliculas = obtenerPeliculas;
Se propuso dejar solamente obtenerPeliculas, que sigue siendo utilizada por la sección de las tres películas mejor calificadas:
import { obtenerPeliculas } from '/js/api.js';
window.obtenerPeliculas = obtenerPeliculas;
Las funciones obtenerUsuario() y logout() ya no necesitan exponerse en window, porque menu.js las importa directamente.
6. Verificación propuesta
En la revisión de los siete documentos HTML consultados se encontraron dos coincidencias con localStorage, ambas dentro de index.html:
localStorage.getItem('usuario_activo')
localStorage.removeItem('usuario_activo')
No se encontraron coincidencias en htmls/Se.html, htmls/Cre.html, htmls/Reseña.html, htmls/catalogo.html, htmls/exito.html ni htmls/prueba_menu_tutorial.html.

Después de integrar los cambios, se propuso buscar localStorage en VS Code con el filtro *.html. El resultado esperado es cero coincidencias.

También se recomendó probar el flujo completo:
1. Sin sesión iniciada, el menú debe mostrar «Crear cuenta» e «Iniciar sesión».
2. Al iniciar sesión, debe mostrar el nombre del usuario y «Cerrar sesión».
3. Al actualizar la página, la sesión debe seguir reflejada en el menú.
4. Al cerrar sesión, debe redirigir al inicio y mostrar nuevamente los enlaces de acceso.
5. Repetir la comprobación en catálogo, reseñas, inicio y formularios.
Qué se propuso incorporar al proyecto
- Crear js/menu.js como componente Alpine reutilizable mediante Alpine.data('menu', ...).
- Importar obtenerUsuario() y logout() desde js/api.js, sin duplicar la lógica de localStorage.
- Reemplazar el objeto largo de x-data del header de index.html por x-data="menu".
- Cargar js/menu.js en index.html, htmls/Se.html, htmls/Cre.html, htmls/Reseña.html y htmls/catalogo.html, antes de Alpine.
- Retirar obtenerUsuario y logout de la exposición global window en index.html, manteniendo window.obtenerPeliculas.
- Mantener en js/api.js las funciones actuales obtenerUsuario() y logout(), ya que cumplen la responsabilidad de manejar la sesión.
Verificación
Cómo se verificó
-no hay codigo de localstorage en los archivos index, se,cre,catalogo y reseña, lo que aparece solo es sobre el comentario de ia donde se menciona localstorage. Ahora respecto al funcionamiento, sigue funcionando bien, puedo reseñar, primero me pide sesion, puedo acceder con las cuentas de mocks, crear mis cuentas, acceder a ellas, etc.
Qué entiendo del código
- El HTML debe encargarse de la estructura y de enlazar el componente, no de leer o borrar datos de localStorage.
- api.js concentra las operaciones de almacenamiento y expone funciones que el resto del proyecto puede reutilizar.
- import permite que menu.js utilice las funciones exportadas sin depender de variables globales.
- Alpine.data('menu', ...) registra un componente con estado y métodos reutilizables.
- x-data="menu" conecta el header con ese componente.
- init() carga el usuario al inicializar el menú y cerrarSesion() delega el cierre en logout().
- Como el header se inserta dinámicamente en otras páginas, estas también deben cargar el módulo que registra menu.
- La comprobación final consiste en buscar localStorage en todos los archivos *.html y confirmar que no exista ninguna coincidencia.