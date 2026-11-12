# Menú dinámico de sesión, usuario activo y cierre de sesión con Alpine.js

- **Fecha:** 2026-11-10
- **Integrante:** Gabriel Echenique (@absalom-e)
- **Herramienta y modelo:** Antigravity (Gemini 3.8 Flash)
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** index.html (líneas 32-36 y 40-141)

## Objetivo
Implementar la lógica reactiva en el menú principal de navegación (`index.html`) para reflejar si hay una sesión activa, mostrando "Hola, [nombre]" y la opción de cerrar sesión, o los enlaces de registro e inicio de sesión si no hay usuario autenticado.

## Conversación (texto completo, sin editar)

### Prompt 1
Vale, ahora mismo voy a empezar con el Logout + nombre, etc en el menu, tampoco quiero que se haga tooodo, solo quiero saber una guia de donde tengo que ir. Un esqueleto con el cual entender la logica, con el cual desarrollar el codigo dentro de la pagina para que sea funcional

### Respuesta 1
``````
## Guía: Logout + "Hola, [nombre]" en el menú

### El problema conceptual

El menú siempre muestra "Crear cuenta" e "Iniciar sesión" porque su `x-data` **no lee la sesión**. La lógica que necesitas agregar es:

```
¿Hay usuario en localStorage?
  → SÍ: muestra "Hola, [nombre]" + "Cerrar sesión"
  → NO: muestra "Crear cuenta" + "Iniciar sesión"
```

---

### Dónde tocar: solo `index.html`

El menú se inyecta desde `index.html` al resto de páginas — si lo arreglas ahí, se propaga solo a todas.

---

### El esqueleto lógico (pseudocódigo)

El `x-data` del `<header>` hoy tiene esto:

```js
// Estado actual (simplificado)
{
  enlacesCuenta: [
    { nombre: 'Crear cuenta',   ruta: '/htmls/Cre.html' },
    { nombre: 'Iniciar sesión', ruta: '/htmls/Se.html'  }
  ]
}
```

Lo que necesitas agregar:

```js
{
  // 1. Leer la sesión al iniciar
  usuario: null,            // ← null = no hay sesión
  
  init() {
    // leer localStorage al montar el header
    this.usuario = /* obtenerUsuario() de api.js */
  },

  // 2. Función de logout
  cerrarSesion() {
    /* logout() de api.js */
    this.usuario = null;
    // redirigir a inicio o login
  }
}
```

Y en el HTML del menú, cambiar el dropdown "Cuenta" para que sea **condicional**:

```html
<!-- Si HAY sesión -->
<template x-if="usuario">
  <li>Hola, <span x-text="usuario.nombre"></span></li>
  <li><button @click="cerrarSesion()">Cerrar sesión</button></li>
</template>

<!-- Si NO hay sesión -->
<template x-if="!usuario">
  <!-- los enlaces actuales de Crear cuenta / Iniciar sesión -->
</template>
```

---

### El flujo completo

```
index.html se carga
      ↓
Alpine ejecuta init() del header
      ↓
init() llama obtenerUsuario()
      ↓
¿localStorage tiene 'usuario_activo'?
   ├─ SÍ → usuario = { nombre, correo, rol... }
   │        → menú muestra "Hola, Gabriel" + "Cerrar sesión"
   └─ NO → usuario = null
            → menú muestra "Crear cuenta" + "Iniciar sesión"

Al hacer click en "Cerrar sesión":
      ↓
cerrarSesion() llama logout() de api.js
      ↓
logout() borra 'usuario_activo' del localStorage
      ↓
this.usuario = null → menú reactivo vuelve a mostrar los enlaces
```

---

### Lo que ya tienes hecho

- `obtenerUsuario()` — ya existe en `api.js`, es síncrona, devuelve el objeto usuario o `null`
- `logout()` — ya existe en `api.js`, borra la sesión
- El menú ya tiene un dropdown "Cuenta" con `x-show` y `x-for` — solo hay que reemplazar lo que renderiza dentro

### Lo único que tienes que escribir

1. En el `x-data` del `<header>`: agregar `usuario`, `init()` y `cerrarSesion()`
2. En el HTML del dropdown: cambiar el `<template x-for>` de `enlacesCuenta` por los dos `<template x-if>` condicionales
3. Importar `obtenerUsuario` y `logout` desde `/js/api.js`. Como el `x-data` del header se evalúa como expresión inline, no puede importar módulos directamente; la solución más limpia es agregar un `<script type="module">` antes del tag `<header>` que haga:
```js
import { obtenerUsuario, logout } from '/js/api.js';
window.obtenerUsuario = obtenerUsuario;
window.logout = logout;
```
Y luego en el `x-data` llamas `window.obtenerUsuario()` y `window.logout()`.
``````

### Prompt 2
como se cual es el dropdown cuenta para reemplazar?

### Respuesta 2
``````
En `index.html` es este bloque, entre las líneas 163 y 191:

```html
<li class="relative" @click.outside="cuenta = false" @keydown.escape.window="cuenta = false">
  <button
    type="button"
    ...
    @click="cuenta = !cuenta"
  >Cuenta <span aria-hidden="true">▾</span></button>

  <ul
    x-show="cuenta"
    ...
  >
    <template x-for="e in enlacesCuenta" :key="e.ruta">  <!-- ← ESTO es lo que reemplazas -->
      <li>
        <a :href="e.ruta" x-text="e.nombre" ...></a>
      </li>
    </template>
  </ul>
</li>
```

Lo que hay dentro del `<ul>` es el `<template x-for>` que siempre itera sobre `enlacesCuenta`. **Ese `<template>` es lo que tienes que reemplazar** por los dos condicionales:

```html
<ul x-show="cuenta" ...>

  <!-- SI hay sesión -->
  <template x-if="usuario">
    <div>
      <li><span x-text="'Hola, ' + usuario.nombre"></span></li>
      <li><button @click="cerrarSesion()">Cerrar sesión</button></li>
    </div>
  </template>

  <!-- SI no hay sesión -->
  <template x-if="!usuario">
    <div>
      <template x-for="e in enlacesCuenta" :key="e.ruta">
        <li><a :href="e.ruta" x-text="e.nombre"></a></li>
      </template>
    </div>
  </template>

</ul>
```

> **Importante:** `<template x-if>` solo puede tener **un elemento hijo directo**, por eso se envuelve en un `<div>`. Si pones dos `<li>` sueltos dentro, Alpine se queja.
``````

### Prompt 3
bien, ahora explicame por favor que es lo que hace ese script, que significa window. porque el from js/api, el logout, todo por favor

### Respuesta 3
``````
Explicación línea por línea:

---

### `<script type="module">`

Le dice al navegador que este script usa el **sistema de módulos de JavaScript (ESModules)**. Solo los scripts con `type="module"` pueden usar `import`.
Sin esto, `import` no existe y el navegador tira error.

---

### `import { obtenerUsuario, logout } from '/js/api.js'`

Tres partes:
- **`import { ... }`** → "quiero usar estas funciones que otro archivo exportó"
- **`{ obtenerUsuario, logout }`** → los nombres exactos de las funciones (tienen que coincidir con los `export function` que están en `api.js`)
- **`from '/js/api.js'`** → el archivo donde viven esas funciones

Es como decirle: *"ve a `api.js`, trae `obtenerUsuario` y `logout`, y tráelos aquí".*

---

### `window.obtenerUsuario = obtenerUsuario`

- **`window`** es el objeto global del navegador. Todo lo que pongas en `window.algo` está disponible **en cualquier parte** de la página.
- El problema es que `import` solo funciona dentro de un `<script type="module">`, y ese script vive en su propia burbuja aislada.
- El `x-data` del `<header>` **no es un módulo** — es una expresión evaluada por Alpine directamente, que vive fuera de esa burbuja.
- Entonces si en `init()` escribes `obtenerUsuario()`, Alpine no sabe qué es eso.

La solución: copiar la función al `window` para que salga de la burbuja del módulo y quede disponible globalmente:

```
api.js                módulo                    window (global)
──────────         ──────────────          ──────────────────────
export             import {                window.obtenerUsuario 
function     →     obtenerUsuario    →     = obtenerUsuario
obtenerUsuario     } from api.js           
                                           ↑ Alpine puede leerlo aquí
```

---

### `window.logout = logout`

Exactamente lo mismo pero con `logout`. Sin esto, `cerrarSesion()` llamaría a `logout()` y Alpine diría *"logout is not defined"*.

---

### Resumen en una frase
> `api.js` tiene las funciones encerradas en un módulo. El script las importa y las copia al `window` para que Alpine, que vive fuera del módulo, pueda usarlas.
``````

### Prompt 4
Oye, inicié sesión pero en el menú me sigue saliendo "Crear cuenta / Iniciar sesión" y no me muestra "Hola, [nombre]" ni el botón de cerrar sesión. ¿Por qué ocurrió esto y cómo lo soluciono para que funcione en todas las páginas?

### Respuesta 4
``````
El menú sigue mostrando "Crear cuenta" e "Iniciar sesión", lo que significa que `obtenerUsuario()` está devolviendo `null`. Hay dos causas posibles:

---

### Motivo 1: ¿Crear cuenta vs. Iniciar sesión?
* **Crear cuenta (`Cre.html`)**: Solo guarda el nuevo usuario en la lista general de `usuarios`. No inicia sesión automáticamente (no guarda el registro `usuario_activo`).
* **Iniciar sesión (`Se.html`)**: Es el que efectivamente llama a `login()` y guarda a la persona en `usuario_activo`. Si solo creaste la cuenta pero no iniciaste sesión después en `Se.html`, la sesión nunca existió.

---

### Motivo 2: El orden de carga de Alpine y el clonado del menú
1. **Alpine está en el `<head>`**: Como carga con `defer`, se ejecuta antes de que el `<script type="module">` alcance a definir `window.obtenerUsuario`. Cuando Alpine corre `init()`, la función aún no existe en `window`, tira un error en la consola y `usuario` se queda en `null`.
2. **Inyección con `DOMParser`**: Las demás páginas (`catalogo.html`, etc.) cargan el menú haciendo un `fetch('/index.html')` y extrayendo solo el `<header>`. El navegador no ejecuta scripts importados cuando usa `DOMParser`, por lo que en el catálogo `window.obtenerUsuario` tampoco existiría.

---

### La solución: leer directo de `localStorage`
`obtenerUsuario()` en `api.js` literalmente es solo `JSON.parse(localStorage.getItem('usuario_activo'))`. Si hacemos que el propio menú lea y borre de `localStorage` de forma nativa:

1. **En el `x-data` del `<header>` en `index.html`:**
```js
usuario: null,

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
```

2. **En el `<ul>` del dropdown "Cuenta" en `index.html`:**
```html
<ul
  x-show="cuenta"
  x-transition
  style="display: none;"
  class="list-none m-0 p-1 mt-1 bg-white border border-sky-200 rounded shadow-lg md:absolute md:right-0 md:min-w-[11rem] z-20"
>
  <!-- SI HAY SESIÓN -->
  <template x-if="usuario">
    <div class="p-2 text-sm">
      <li class="px-2 py-1 font-semibold text-gray-700 border-b border-sky-100">
        Hola, <span x-text="usuario.nombre"></span>
      </li>
      <li>
        <button
          type="button"
          @click="cerrarSesion()"
          class="w-full text-left px-2 py-1 mt-1 text-red-600 hover:bg-red-50 rounded border-0 bg-transparent cursor-pointer"
        >
          Cerrar sesión
        </button>
      </li>
    </div>
  </template>
    
  <!-- SI NO HAY SESIÓN -->
  <template x-if="!usuario">
    <div>
      <template x-for="e in enlacesCuenta" :key="e.ruta">
        <li>
          <a
            :href="e.ruta"
            x-text="e.nombre"
            class="block px-3 py-1 rounded no-underline text-sky-600 hover:bg-sky-100"
          ></a>
        </li>
      </template>
    </div>
  </template>
</ul>
```

3. **Mover Alpine al final del `<body>` en `index.html`**: Mover `<script defer src="...alpine.min.js">` justo antes de `</body>` para unificar el orden de carga con las demás vistas.
``````

## Qué se incorporó al proyecto
Se incorporó la lógica de autenticación reactiva en el menú principal de `index.html`:
- Variables de estado `usuario`, `init()` y `cerrarSesion()` en el `x-data` del `<header>`.
- Estructura condicional con `<template x-if="usuario">` para desplegar el nombre del usuario y el botón de cierre de sesión, y `<template x-if="!usuario">` para las opciones de cuenta públicas.
- Limpieza de sesión mediante `localStorage.removeItem('usuario_activo')` y redirección a `index.html`.
- Reubicación de la etiqueta `<script defer src="...alpinejs...">` desde el `<head>` hasta el final del `<body>` para evitar conflictos en el orden de carga.

## Verificación
Se probó el inicio de sesión en `Se.html` con las credenciales de prueba (`Gabriel.Echenique@cubes.cl` / `admin1234`). Al volver a la página de inicio `index.html`, el desplegable "Cuenta" mostró exitosamente "Hola, Gabriel (Admin)" y el botón "Cerrar sesión". Al presionar el botón de cierre de sesión, se confirmó la eliminación de la clave en `localStorage` y el menú regresó a mostrar "Crear cuenta" e "Iniciar sesión".