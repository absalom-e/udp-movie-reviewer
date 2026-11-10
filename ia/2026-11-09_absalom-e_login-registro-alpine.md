# Flujo de inicio de sesión y registro de usuarios con Alpine.js

- **Fecha:** 2026-11-09
- **Integrante:** Gabriel Echenique (@absalom-e)
- **Herramienta y modelo:** Antigravity (Gemini 3.8 Flash)
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** 
  - `htmls/Se.html`
  - `htmls/Cre.html`

## Objetivo
Comprender e implementar la lógica de autenticación (login y registro) utilizando Alpine.js para vincular campos de formulario.

## Conversación (texto completo, sin editar)

### Prompt 1
Ahora ayudame a entender el como hacer el login/register funcionar haciendo el uso correspondiente de Alpine. Dame una guia de como se podria hacer esto, algun ejemplo generico de ser posible, y si existe alguna documentacion relativamente facil de entender, tambien enviamela

### Respuesta 1
Aprender a usar **Alpine.js** para formularios y sesiones es uno de los mejores trucos en desarrollo web moderno porque **te ahorra decenas de líneas de JavaScript tradicional**. No necesitas escribir `document.getElementById`, ni `addEventListener`, ni lidiar con recargas molestas de página.

A continuación tienes una guía clara, paso a paso, con ejemplos genéricos y enlaces a la documentación más sencilla.

---

### 1. Las 4 directivas mágicas de Alpine para formularios

Alpine funciona agregando pequeños atributos (llamados **directivas**) directamente en el HTML:

| Directiva | ¿Para qué sirve? | Equivalente mental |
|---|---|---|
| **`x-data="{ ... }"`** | Define las variables de esa sección (la "caja" de memoria). | `let correo = ""; let clave = "";` |
| **`x-model="correo"`** | Conecta el `<input>` con la variable en tiempo real. Lo que el usuario teclea se guarda automáticamente en la variable. | `input.value` automático |
| **`@submit.prevent="funcion()"`** | Escucha el envío del formulario y **cancela el viaje a otra URL** (`preventDefault`). | `form.addEventListener('submit', e => e.preventDefault())` |
| **`:disabled="cargando"`** | Apaga el botón mientras la petición está procesándose. | `boton.disabled = true` |
| **`x-show="error"`** | Muestra u oculta un elemento según una condición booleana. | `elemento.style.display = 'block' / 'none'` |

---

### 2. Ejemplo genérico: Flujo de Iniciar Sesión (Login)

Este es el patrón estándar de un login con Alpine conectado a una función asíncrona (como tu `login()` de `api.js`):

```html
<!-- 1. Envolvemos el formulario en x-data con su controlador -->
<div x-data="loginForm()">

  <h1>Iniciar Sesión</h1>

  <!-- @submit.prevent evita que el form recargue la página -->
  <form @submit.prevent="iniciarSesion()">

    <!-- Campo de correo vinculado con x-model -->
    <div>
      <label for="correo">Correo electrónico:</label>
      <input type="email" id="correo" x-model="correo" required>
    </div>

    <!-- Campo de clave vinculado con x-model -->
    <div>
      <label for="clave">Contraseña:</label>
      <input type="password" id="clave" x-model="clave" required>
    </div>

    <!-- Mensaje de error: solo se muestra si la variable 'error' tiene texto -->
    <p x-show="error" x-text="error" style="color: red;"></p>

    <!-- Botón con estado de carga (Criterio A3 de la rúbrica) -->
    <button type="submit" :disabled="cargando">
      <span x-text="cargando ? 'Iniciando sesión...' : 'Entrar'"></span>
    </button>

  </form>

</div>

<script type="module">
  import { login } from '/js/api.js';

  // Controlador de Alpine
  window.loginForm = function() {
    return {
      correo: '',
      clave: '',
      error: null,
      cargando: false,

      async iniciarSesion() {
        this.cargando = true;
        this.error = null;

        // Llamamos a la función de la capa de servicios
        const res = await login(this.correo, this.clave);

        if (res.ok) {
          // Éxito: el usuario ya quedó en localStorage por api.js
          // Redirigimos al catálogo o inicio
          window.location.href = '../index.html';
        } else {
          // Error: mostramos el mensaje al usuario (ej: "Correo o clave incorrecta")
          this.error = res.error;
          this.cargando = false;
        }
      }
    };
  };
</script>
```

---

### 3. Ejemplo genérico: Flujo de Registro (Crear Cuenta)

El registro sigue la misma lógica, pero guardando al nuevo usuario en la lista de usuarios simulados:

```html
<div x-data="registroForm()">
  <h1>Crear Cuenta</h1>

  <form @submit.prevent="crearCuenta()">
    <div>
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" x-model="nombre" required>
    </div>

    <div>
      <label for="correo">Correo:</label>
      <input type="email" id="correo" x-model="correo" required>
    </div>

    <div>
      <label for="clave">Contraseña:</label>
      <input type="password" id="clave" x-model="clave" minlength="8" required>
    </div>

    <p x-show="error" x-text="error" style="color: red;"></p>
    <p x-show="exito" style="color: green;">¡Cuenta creada con éxito! Redirigiendo...</p>

    <button type="submit" :disabled="cargando">Registrarse</button>
  </form>
</div>

<script type="module">
  window.registroForm = function() {
    return {
      nombre: '',
      correo: '',
      clave: '',
      error: null,
      exito: false,
      cargando: false,

      async crearCuenta() {
        this.cargando = true;
        this.error = null;

        // 1. Leemos los usuarios guardados en localStorage
        let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

        // 2. Validamos si el correo ya está registrado
        const existe = usuarios.some(u => u.correo.toLowerCase() === this.correo.toLowerCase());
        if (existe) {
          this.error = 'Este correo ya tiene una cuenta registrada.';
          this.cargando = false;
          return;
        }

        // 3. Creamos el nuevo usuario
        const nuevoUsuario = {
          id: Date.now(),
          nombre: this.nombre,
          correo: this.correo,
          clave: this.clave,
          rol: 'usuario',
          reputacion: 10 // Puntos iniciales para su sistema
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // 4. Marcamos éxito y redirigimos a éxito o login
        this.exito = true;
        setTimeout(() => {
          window.location.href = 'exito.html';
        }, 1200);
      }
    };
  };
</script>
```

---

### 4. ¿Cómo hacer dinámico el Menú (Navbar)?

Este es el truco para que en el `<header>` de todas las páginas se muestre *"Iniciar Sesión"* si nadie ha entrado, o *"Hola, Gabriel [Cerrar Sesión]"* si ya inició sesión:

```html
<header x-data="navBar()">
  <!-- Si NO hay sesión iniciada -->
  <nav x-show="!usuario">
    <a href="htmls/Se.html">Iniciar Sesión</a>
    <a href="htmls/Cre.html">Registrarse</a>
  </nav>

  <!-- Si SÍ hay sesión iniciada -->
  <nav x-show="usuario">
    <span>Hola, <strong x-text="usuario ? usuario.nombre : ''"></strong> (Rep: <span x-text="usuario ? usuario.reputacion : ''"></span>)</span>
    <button @click="cerrarSesion()">Cerrar Sesión</button>
  </nav>
</header>

<script type="module">
  import { logout, obtenerUsuario } from '/js/api.js';

  window.navBar = function() {
    return {
      usuario: obtenerUsuario(), // Lee de localStorage

      cerrarSesion() {
        logout(); // Borra el usuario de localStorage
        window.location.reload(); // Recarga la página
      }
    };
  };
</script>
```

---

### 5. Documentación fácil de entender

La documentación oficial de Alpine.js es considerada una de las más amigables de todo el ecosistema web porque no usa rodeos teóricos:

1. **Guía esencial de Alpine (5 minutos):**
   * [Página oficial de Alpine.js (alpinejs.dev)](https://alpinejs.dev/start-here) — Lee solo la sección *"Start Here"*. Es súper corta y muestra ejemplos interactivos.
2. **Las directivas clave para este paso:**
   * [`x-model` (vincular inputs)](https://alpinejs.dev/directives/model): Muestra cómo conectar texto, checkboxes y selects.
   * [`x-show` (mostrar u ocultar)](https://alpinejs.dev/directives/show): Cómo hacer aparecer mensajes de error o modales.
   * [`@submit.prevent` (manejo de eventos)](https://alpinejs.dev/directives/on): Explica cómo escuchar clics y submits cancelando el comportamiento por defecto.
3. **CheatSheet rápido (muy visual):**
   * [Alpine.js Cheat Sheet (alpinejs.codewithhugo.com)](https://alpinejs.codewithhugo.com/) — Un resumen de una sola página con todas las directivas y su sintaxis en una sola mirada.

## Qué se incorporó al proyecto
Se incorporaron los patrones reactivos de Alpine.js en los formularios de las vistas `Se.html` (login) y `Cre.html` (registro):
- Manejo de envío asíncrono con `@submit.prevent` sin recarga de página.
- Enlace bidireccional de datos en inputs mediante `x-model`.
- Bloqueo de botones durante la petición con `:disabled`.
- Notificaciones de error y éxito condicionales con `x-show` y `x-text`.
- Almacenamiento y consulta de usuarios en `localStorage`.

## Verificación
Se realizaron pruebas creando cuentas nuevas en `Cre.html` y comprobando en las herramientas de desarrollo del navegador que los datos se almacenan correctamente. Luego se probó iniciar sesión en `Se.html` validando tanto el caso fallido (mensaje de error en rojo) como el exitoso (redirección a `index.html`).