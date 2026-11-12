# Dashboard con reseñas del usuario autenticado en la página de inicio

- **Fecha:** 2026-11-11
- **Integrante:** Gabriel Echenique (@absalom-e)
- **Herramienta y modelo:** Antigravity (Gemini 3.8 Flash)
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** index.html

## Objetivo
Completar los requerimientos del Dashboard (Criterio A1 y B3) en la página principal (`index.html`), agregando una sección dinámica que consulte la API simulada para listar las reseñas del usuario que tiene la sesión activa, incluyendo estados de carga, error y estado vacío.

## Conversación (texto completo, sin editar)

### Prompt 1
Vale, entonces explicame el como puedo hacer lo que falta del dashboard, que las reseñas de el usuario que va usando se guarden dentro de la aplicacion. Hazlo como un esqueleto donde yo entienda que funciones debo de importar y que modificaciones clave debiese hacer

### Respuesta 1
``````
Aquí tienes la explicación conceptual y el **esqueleto paso a paso** para entender cómo viajan los datos y qué tienes que modificar.

---

### 1. El camino de los datos (¿Cómo se guardan y se leen?)

Todo el sistema ya está conectado en tu proyecto, solo faltaba "el puente" para mostrarlo en el inicio:

```
[Reseña.html]
Usuario escribe su crítica
        ↓
crearResena({ autor: usuario.nombre, ... })
        ↓
Se guarda en localStorage (en la lista 'resenas')
══════════════════════════════════════════════════
[index.html - Dashboard]
1. obtenerUsuario()  →  "¿Quién está conectado?" (ej: 'Roberto')
2. obtenerResenas()  →  "Tráeme todas las reseñas del sistema"
3. FILTRO CLAVE:        resenas.filter(r => r.autor === 'Roberto')
        ↓
Alpine muestra solo las reseñas de 'Roberto'
```

---

### 2. ¿Qué funciones debes importar en `index.html`?

En el `<script type="module">` de `index.html`, necesitas **dos funciones clave** de `api.js`:

```js
import { obtenerUsuario, obtenerResenas } from '/js/api.js';

// Las dejamos disponibles para que Alpine pueda usarlas:
window.obtenerUsuario = obtenerUsuario;
window.obtenerResenas = obtenerResenas;
```

* **`obtenerUsuario()`**: Te dice si hay sesión abierta y cómo se llama la persona.
* **`obtenerResenas()`**: Trae la lista completa de reseñas desde los mocks/localStorage.

---

### 3. El esqueleto lógico en Alpine.js

Este es el cerebro del componente que pondrás en `index.html`:

```js
{
  // 1. Estado inicial
  usuario: null,      // Aquí guardaremos al usuario conectado
  misResenas: [],     // Aquí guardaremos SOLO sus reseñas
  cargando: true,     // Para mostrar "Cargando..."

  async init() {
    // Paso A: Verificamos si hay alguien conectado
    this.usuario = window.obtenerUsuario();

    // Si NO hay sesión, no hacemos nada más
    if (!this.usuario) {
      this.cargando = false;
      return;
    }

    // Paso B: Traemos todas las reseñas del sistema
    const res = await window.obtenerResenas();

    if (res.ok) {
      // Paso C (EL FILTRO): Nos quedamos únicamente con las del usuario
      this.misResenas = res.data.filter(
        r => r.autor.toLowerCase() === this.usuario.nombre.toLowerCase()
      );
    }

    this.cargando = false;
  }
}
```

---

### 4. El esqueleto visual en el HTML

En el HTML de `index.html`, creas una sección con `x-data` usando la lógica anterior:

```html
<section 
  x-data="/* el objeto del paso 3 */" 
  x-show="usuario"  <!-- 👈 CLAVE: solo se muestra si el usuario inició sesión -->
>

  <h2>Tus reseñas publicadas</h2>

  <!-- Estado 1: Cargando -->
  <p x-show="cargando">Cargando tus reseñas...</p>

  <!-- Estado 2: Si SÍ tiene reseñas (las recorremos con x-for) -->
  <div x-show="!cargando && misResenas.length > 0">
    <template x-for="r in misResenas" :key="r.id">
      <div>
        <p><strong>Nota:</strong> <span x-text="r.calificacion"></span> / 10</p>
        <p x-text="r.comentario"></p>
        <small x-text="r.fecha"></small>
      </div>
    </template>
  </div>

  <!-- Estado 3: Si NO tiene reseñas todavía (Estado vacío que pide el profe) -->
  <div x-show="!cargando && misResenas.length === 0">
    <p>Aún no has escrito ninguna reseña. ¡Visita el catálogo para reseñar!</p>
  </div>

</section>
```

---

### Resumen de modificaciones clave que harás:
1. **En el `<script type="module">` de `index.html`**: agregar `obtenerResenas` al `import` y asignarlo a `window.obtenerResenas`.
2. **En el `<main>` de `index.html`**: pegar la sección con `x-show="usuario"` que use `filter()` para mostrar las críticas del autor conectado.
3. **Prueba final**: Entrar con `U.Normal@gmail.com` (clave `12345`) y ver cómo el inicio se llena automáticamente con las 5 reseñas que ese usuario ya tiene en los mocks.
``````

### Prompt 2
¿Y el esqueleto logico en donde se debiese posicionar?

### Respuesta 2
``````
Se posiciona **directamente dentro de la etiqueta `<section>`**, en el atributo `x-data`, exactamente igual a como Moisés hizo con el `top-peliculas`.

Y esa `<section>` va dentro del `<main>`, **justo debajo de la sección de las 3 mejores películas** (después de la línea 243 de `index.html`).

---

### Así se ve exactamente en tu archivo:

```html
    <!-- ... Aquí termina la sección de top-peliculas de Moisés ... -->
    </section>

    <!-- 👇 AQUÍ MISMO VA TU NUEVA SECCIÓN DEL DASHBOARD: -->
    <!-- [IA] inicio · ia/2026-11-11_absalom-e_dashboard-resenas-usuario.md -->
    <section
      id="mis-resenas-usuario"
      class="max-w-6xl mx-auto px-6 py-6 text-left"
      x-data="{
        usuario: null,
        resenas: [],
        cargando: true,
        error: '',

        async init() {
          this.usuario = window.obtenerUsuario();
          if (!this.usuario) {
            this.cargando = false;
            return;
          }

          try {
            const respuesta = await window.obtenerResenas();
            if (!respuesta.ok) {
              this.error = respuesta.error;
              return;
            }

            // Filtramos las reseñas del usuario conectado
            this.resenas = respuesta.data.filter(
              r => r.autor.toLowerCase() === this.usuario.nombre.toLowerCase()
            );
          } catch (err) {
            this.error = 'No se pudieron cargar tus reseñas.';
          } finally {
            this.cargando = false;
          }
        }
      }"
      x-show="usuario"
    >

      <!-- Aquí dentro va el contenido visual (el título, las tarjetas de reseñas con x-for, etc.) -->

    </section>
    <!-- [IA] fin -->

  </main> <!-- Aquí termina el main -->
```

De esta manera:
1. El código JavaScript queda empaquetado dentro de su propia sección en `x-data`.
2. Sigue el mismo estilo limpio que dejó tu compañero.
3. El `x-show="usuario"` se encarga de que todo ese bloque sea completamente invisible si no hay una sesión iniciada.
``````

## Qué se incorporó al proyecto
- Se añadió `obtenerResenas` al script de importaciones de `/js/api.js` en `index.html`, exponiéndolo a nivel global para su consumo en la interfaz.
- Se incorporó la sección `<section id="mis-resenas-usuario">` dentro de `<main>` en `index.html` utilizando directivas de Alpine.js (`x-data`, `x-show="usuario"`, `x-for`).
- Se implementó la lógica de filtrado reactivo para mostrar únicamente las reseñas coincidentes con el autor de la sesión activa (`r.autor.toLowerCase() === this.usuario.nombre.toLowerCase()`).
- Se programaron los tres estados de interfaz requeridos por la pauta: estado de carga (`cargando`), mensaje de fallo (`error`), y estado vacío cuando el usuario no cuenta con reseñas registradas.

## Verificación
Se realizaron pruebas en el navegador iniciando sesión con el usuario de prueba `U.Normal@gmail.com` (clave `12345`), verificando que al abrir la página principal (`index.html`) se listan correctamente sus 5 reseñas asociadas. Luego se comprobó cerrando sesión que la sección se oculta automáticamente, y se probó con una cuenta nueva sin reseñas para verificar que se muestra el mensaje de estado vacío invitando a reseñar.