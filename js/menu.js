// <!--[IA] inicio · ia/2026-11-11_tilin67-67_sacaracceso-localstorage.md-->
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

// [IA] fin