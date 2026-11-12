# Top 3 de películas mejor calificadas en la página de inicio (index.html)

- **Fecha:** 2026-11-11

- **Integrante:** Moises Collarte (@tilin67-67)

- **Herramienta y modelo:** ChatGPT (GPT-6)

- **Enlace a la conversación:** (no disponible)

- **Archivos afectados:** index.html (sección de importación de funciones y nueva sección de películas destacadas).


## Objetivo

La página principal (`index.html`) mostraba principalmente texto relacionado con el catálogo. Se buscaba mejorar su contenido incorporando una sección que mostrara automáticamente las 3 películas mejor calificadas.

La información debía obtenerse desde los archivos mocks mediante la capa de servicios `js/api.js`, evitando escribir manualmente las películas en el HTML.

Además, se buscaba reutilizar las funciones existentes, implementar la visualización mediante Alpine.js y dejar identificada la intervención de IA mediante comentarios `[IA] inicio` y `[IA] fin`.


## Conversación (texto completo, sin editar)


### Prompt 1

revisa mi repositorio, [https://github.com/tilin67-67/udp-movie-reviewer](https://github.com/tilin67-67/udp-movie-reviewer), necesito aplicar lo siguiente, en index solo muestro texto en base al catalogo, ayudame a mostrar las 3 mejores peliculas cargadas desde los mocks via api.js, explicame el codigo, y la idea, ademas debo dejar un registro de donde use ia y donde termine de usar, ejemplo:

```html
<!-- [IA] inicio · ia/2026-11-07_tilin67-67_tailwind-alpine.md -->
<!-- [IA] fin -->
```


### Respuesta 1

Para implementar esta funcionalidad se propuso reutilizar la función `obtenerPeliculas()` existente en `js/api.js`, evitando modificar la capa de servicios o duplicar la lógica de acceso a los datos.

La idea consiste en solicitar las películas ordenadas por calificación descendente (`rating_desc`) y seleccionar las primeras tres mediante `slice(0, 3)`.

Para permitir que Alpine.js acceda a la función importada desde el módulo, se propuso exponerla mediante `window.obtenerPeliculas`.

#### 1. Exponer la función de la API

Se propuso modificar el bloque de importaciones de `index.html`, agregando `obtenerPeliculas`:

```html
<!-- [IA] inicio · ia/2026-11-11_tilin67-67_top-3-inicio.md -->
<script type="module">

import { obtenerUsuario, logout, obtenerPeliculas } from '/js/api.js';

window.obtenerUsuario = obtenerUsuario;

window.logout = logout;

window.obtenerPeliculas = obtenerPeliculas;

</script>
<!-- [IA] fin -->
```

De esta manera, la función `obtenerPeliculas()` queda disponible mediante `window`, permitiendo utilizarla desde el componente de Alpine.js.

#### 2. Incorporar la sección de películas destacadas

Se propuso agregar una sección nueva en `index.html`, inmediatamente después de la sección de muestra del catálogo.

El código propuesto fue:

```html
<!-- [IA] inicio · ia/2026-11-11_tilin67-67_top-3-inicio.md -->
<section
    id="top-peliculas"
    class="max-w-6xl mx-auto px-6 py-10"
    x-data="{
        peliculas: [],
        cargando: true,
        error: '',

        async init() {
            try {
                const respuesta = await window.obtenerPeliculas({
                    orden: 'rating_desc'
                });

                if (!respuesta.ok) {
                    this.error = respuesta.error;
                    return;
                }

                this.peliculas = respuesta.data.slice(0, 3);

            } catch (error) {
                this.error = 'No se pudieron cargar las películas.';
            } finally {
                this.cargando = false;
            }
        }
    }"
>
    <h2 class="text-2xl font-bold text-sky-700 mb-2">
        Las 3 mejores películas
    </h2>

    <p class="text-gray-600 mb-6">
        Descubre las películas mejor calificadas de nuestro catálogo.
    </p>

    <!-- Estado de carga -->
    <p x-show="cargando">
        Cargando películas...
    </p>

    <!-- Estado de error -->
    <p x-show="error" x-text="error" class="text-red-600"></p>

    <!-- Películas cargadas -->
    <div
        x-show="!cargando && !error"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
        <template x-for="(pelicula, indice) in peliculas" :key="pelicula.id">
            <article class="border border-sky-200 rounded-lg p-4 shadow-sm">

                <h3
                    class="text-lg font-bold text-sky-700 mb-3"
                    x-text="(indice + 1) + '. ' + pelicula.titulo"
                ></h3>

                <img
                    :src="pelicula.poster"
                    :alt="'Póster de ' + pelicula.titulo"
                    class="w-full h-72 object-contain mb-4"
                >

                <p>
                    <strong>Director:</strong>
                    <span x-text="pelicula.director"></span>
                </p>

                <p>
                    <strong>Año:</strong>
                    <span x-text="pelicula.anio"></span>
                </p>

                <p class="mt-2 text-lg font-bold text-sky-600">
                    Calificación:
                    <span x-text="pelicula.calificacion + '/10'"></span>
                </p>

            </article>
        </template>
    </div>
</section>
<!-- [IA] fin -->
```

#### 3. Explicación del funcionamiento

**Variables utilizadas en Alpine.js:**

- `peliculas: []`: almacena las películas que devuelve la API.
- `cargando: true`: indica que los datos todavía se están cargando.
- `error: ''`: almacena un mensaje cuando ocurre un problema.

**Carga automática mediante `init()`:**

Alpine.js ejecuta automáticamente el método `init()` cuando inicializa el componente.

Se utiliza `async` porque la solicitud a la API es asíncrona y es necesario esperar su respuesta.

**Solicitud de películas:**

```javascript
const respuesta = await window.obtenerPeliculas({
    orden: 'rating_desc'
});
```

Se llama a `obtenerPeliculas()` solicitando que los resultados estén ordenados por calificación descendente.

El parámetro `rating_desc` permite obtener primero las películas con mayor calificación.

**Comprobación de la respuesta:**

```javascript
if (!respuesta.ok) {
    this.error = respuesta.error;
    return;
}
```

Se comprueba si la API respondió correctamente. Si ocurre un error, se guarda el mensaje correspondiente y se interrumpe la ejecución.

**Selección de las tres mejores películas:**

```javascript
this.peliculas = respuesta.data.slice(0, 3);
```

Se utiliza `slice(0, 3)` para obtener únicamente los primeros tres elementos del arreglo recibido.

Como la API ya entrega las películas ordenadas por calificación descendente, estos tres elementos corresponden a las películas mejor calificadas.

**Finalización de la carga:**

```javascript
finally {
    this.cargando = false;
}
```

Independientemente de si la solicitud fue exitosa o falló, se desactiva el estado de carga.

**Renderizado dinámico con Alpine.js:**

```html
<template x-for="(pelicula, indice) in peliculas" :key="pelicula.id">
```

Se utiliza `x-for` para recorrer el arreglo de películas y generar automáticamente una tarjeta por cada elemento.

No es necesario escribir manualmente tres tarjetas, ya que Alpine.js genera los elementos según los datos recibidos.

Se utilizan las propiedades de cada película para mostrar:

- Título.
- Póster.
- Director.
- Año.
- Calificación.

También se utilizan `x-show` y `x-text` para controlar la visibilidad de los mensajes y mostrar los datos correspondientes.


## Qué se incorporó al proyecto

- Se propuso reutilizar la función `obtenerPeliculas()` de `js/api.js`.
- Se propuso exponer la función mediante `window.obtenerPeliculas` para permitir su utilización desde Alpine.js.
- Se propuso incorporar una nueva sección en `index.html` para mostrar las tres películas mejor calificadas.
- Se propuso utilizar `orden: 'rating_desc'` para solicitar las películas ordenadas de mayor a menor calificación.
- Se propuso utilizar `slice(0, 3)` para limitar los resultados a tres películas.
- Se propuso utilizar `x-for` para generar las tarjetas dinámicamente.
- Se incorporaron en la propuesta estados de carga y error.
- No se propuso modificar `js/api.js` ni los archivos JSON de `mocks/`, ya que la funcionalidad necesaria de ordenamiento ya existía en la capa de servicios.


## Verificación

**Cómo lo probé**

- npm run dev, y revise el la pagina de inicio en index, apareciron las 3 peliculas mejor calificadas, asi que fue un exito.


**Qué entiendo del código**

- `window.obtenerPeliculas` permite acceder desde Alpine.js a una función que fue importada mediante un módulo JavaScript.
- `async` permite trabajar con operaciones asíncronas y `await` espera la respuesta de la API.
- `orden: 'rating_desc'` solicita los resultados ordenados desde la calificación más alta hasta la más baja.
- `slice(0, 3)` selecciona únicamente los tres primeros elementos del arreglo sin modificar el arreglo original.
- `init()` permite ejecutar automáticamente la carga de películas cuando Alpine.js inicializa el componente.
- `x-data` define las variables y funciones que utiliza el componente.
- `x-for` recorre el arreglo y genera las tarjetas correspondientes a cada película.
- `x-text` permite mostrar dinámicamente los datos de cada película.
- `x-show` permite mostrar u ocultar elementos según el estado de carga o la existencia de errores.
- `:key="pelicula.id"` identifica cada tarjeta mediante el ID de la película.

