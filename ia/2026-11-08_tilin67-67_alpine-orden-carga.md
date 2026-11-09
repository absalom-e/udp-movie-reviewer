# Corrección del orden de carga de Alpine.js en el catálogo

- **Fecha:** 2026-11-08
- **Integrante:** Moises Collarte (@tilin67-67)
- **Herramienta y modelo:** Claude (Sonnet 5.5)
- **Enlace a la conversación:** (no disponible)
- **Archivos afectados:** htmls/catalogo.html (el script de Alpine se movió del `<head>` al final del `<body>`)

## Objetivo
Al abrir el catálogo, la consola mostraba decenas de errores `Alpine Expression Error: catalogoApp is not defined` y la página aparecía vacía. Consulté a la IA para entender los errores y cómo solucionarlos, y luego por la advertencia de Tailwind que seguía apareciendo.

## Conversación (texto completo, sin editar)

### Prompt 1
esto me tiro consola, explicame los errores y como solucionarlos:

(index):64 cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation
(anonymous) @ (index):64
cdn.min.js:1 Alpine Expression Error: catalogoApp is not defined

Expression: "catalogoApp()"

 <body style=​"padding-top:​ 20px;​" x-data=​"catalogoApp()​" x-init=​"cargar()​">​…​</body>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 <body style=​"padding-top:​ 20px;​" x-data=​"catalogoApp()​" x-init=​"cargar()​">​…​</body>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: busqueda is not defined

Expression: "busqueda"

 <input type=​"text" x-model=​"busqueda" @keydown.enter=​"cargar()​" placeholder=​"Buscar por título o director..." style=​"padding:​ 7px 12px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ width:​ 240px;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: genero is not defined

Expression: "genero"

 <select x-model=​"genero" @change=​"cargar()​" style=​"padding:​ 7px 10px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ background:​ white;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​…​</select>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: orden is not defined

Expression: "orden"

 <select x-model=​"orden" @change=​"cargar()​" style=​"padding:​ 7px 10px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ background:​ white;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​…​</select>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: cargando is not defined

Expression: "cargando"

 <div x-show=​"cargando" style=​"padding:​ 30px;​ display:​ none;​">​…​</div>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: cargando is not defined

Expression: "!cargando && error"

 <div x-show=​"!cargando && error" style=​"margin:​ 20px auto;​ padding:​ 15px;​ max-width:​ 400px;​ border:​ 1px solid rgb(229, 115, 115)​;​ border-radius:​ 4px;​ background-color:​ rgb(255, 235, 238)​;​ display:​ none;​">​…​</div>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: error is not defined

Expression: "error"

 <p style=​"color:​ #c62828;​ margin-bottom:​ 12px;​" x-text=​"error">​</p>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: cargando is not defined

Expression: "!cargando && !error && peliculas.length === 0"

 <div x-show=​"!cargando && !error && peliculas.length === 0" style=​"padding:​ 30px;​ border:​ 1px dashed rgb(204, 204, 204)​;​ border-radius:​ 4px;​ display:​ none;​">​…​</div>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: cargando is not defined

Expression: "!cargando && !error && peliculas.length > 0"

 <div x-show=​"!cargando && !error && peliculas.length > 0" class=​"grid grid-cols-1 sm:​grid-cols-2 md:​grid-cols-3 gap-6" style=​"margin-top:​ 25px;​ text-align:​ left;​ display:​ none;​">​…​</div>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: peliculas is not defined

Expression: "peliculas"

 <template x-for=​"p in peliculas" :key=​"p.id">​…​</template>​
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: catalogoApp is not defined
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:5 Uncaught ReferenceError: busqueda is not defined
cdn.min.js:5 Uncaught ReferenceError: genero is not defined
cdn.min.js:5 Uncaught ReferenceError: orden is not defined
cdn.min.js:5 Uncaught ReferenceError: cargando is not defined
cdn.min.js:5 Uncaught ReferenceError: cargando is not defined
cdn.min.js:5 Uncaught ReferenceError: error is not defined
cdn.min.js:5 Uncaught ReferenceError: cargando is not defined
cdn.min.js:5 Uncaught ReferenceError: cargando is not defined
cdn.min.js:5 Uncaught ReferenceError: peliculas is not defined
cdn.min.js:1 Alpine Expression Error: busqueda is not defined

Expression: "busqueda"

 <input type=​"text" x-model=​"busqueda" @keydown.enter=​"cargar()​" placeholder=​"Buscar por título o director..." style=​"padding:​ 7px 12px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ width:​ 240px;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: busqueda is not defined

Expression: "busqueda"

 <input type=​"text" x-model=​"busqueda" @keydown.enter=​"cargar()​" placeholder=​"Buscar por título o director..." style=​"padding:​ 7px 12px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ width:​ 240px;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: busqueda is not defined
cdn.min.js:5 Uncaught ReferenceError: busqueda is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 <input type=​"text" x-model=​"busqueda" @keydown.enter=​"cargar()​" placeholder=​"Buscar por título o director..." style=​"padding:​ 7px 12px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ width:​ 240px;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 <button class=​"index" @click=​"cargar()​">​ Buscar ​</button>​
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 <button class=​"index" @click=​"cargar()​">​ Buscar ​</button>​
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 <button class=​"index" @click=​"cargar()​">​ Buscar ​</button>​
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: genero is not defined

Expression: "genero"

 <select x-model=​"genero" @change=​"cargar()​" style=​"padding:​ 7px 10px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ background:​ white;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​…​</select>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: genero is not defined

Expression: "genero"

 <select x-model=​"genero" @change=​"cargar()​" style=​"padding:​ 7px 10px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ background:​ white;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​…​</select>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 <select x-model=​"genero" @change=​"cargar()​" style=​"padding:​ 7px 10px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ background:​ white;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​…​</select>​
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: genero is not defined
cdn.min.js:5 Uncaught ReferenceError: genero is not defined
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: orden is not defined

Expression: "orden"

 <select x-model=​"orden" @change=​"cargar()​" style=​"padding:​ 7px 10px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ background:​ white;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​…​</select>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: orden is not defined

Expression: "orden"

 <select x-model=​"orden" @change=​"cargar()​" style=​"padding:​ 7px 10px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ background:​ white;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​…​</select>​
gi @ cdn.min.js:1
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 <select x-model=​"orden" @change=​"cargar()​" style=​"padding:​ 7px 10px;​ border:​ 1px solid rgb(0,160,255)​;​ border-radius:​ 3px;​ background:​ white;​ font-size:​ 14px;​ height:​ 35px;​ box-sizing:​ border-box;​">​…​</select>​
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: orden is not defined
cdn.min.js:5 Uncaught ReferenceError: orden is not defined
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined
cdn.min.js:1 Alpine Expression Error: cargar is not defined

Expression: "cargar()"

 
gi @ cdn.min.js:1
cdn.min.js:5 Uncaught ReferenceError: cargar is not defined

### Respuesta 1
``````
Todos esos errores, salvo el primero, tienen **una sola causa**: el orden en que cargan los scripts. El resto es el mismo fallo repetido unas 50 veces.

## 1. `cdn.tailwindcss.com should not be used in production`
Es solo una **advertencia**, no un error. Tailwind avisa que el CDN no está pensado para producción. La pauta permite el CDN, y esa advertencia no se puede quitar sin instalar Tailwind con npm, algo que ya descartaron. No la arregles, pero si el profesor pregunta, ya sabes por qué sale.

## 2. `catalogoApp is not defined` y todo lo demás
Estos son los errores reales. En `catalogo.html` pasa esto, en orden:

1. El `<head>` carga Alpine con `<script defer ...>`. Es el **primer** script diferido del documento.
2. Al final del `<body>` está el `<script type="module">` que define `window.catalogoApp`. Es el **segundo** script diferido.
3. Los scripts diferidos corren en el orden en que aparecen en el HTML. Alpine arranca primero, lee `x-data="catalogoApp()"` y esa función **todavía no existe**.

Como `x-data` falló, Alpine no pudo crear el estado de la página. Por eso todo lo que depende de él aparece como "not defined": `cargar`, `busqueda`, `genero`, `orden`, `cargando`, `error` y `peliculas`. Las tarjetas y el spinner quedan con `display: none`, y por eso ves la página vacía.

Lo señalé antes como un riesgo posible ("catalogoApp is not defined"), y tu consola lo confirma. Probablemente explica más de lo que te dije sobre los mocks: aunque cargaran perfecto, la pantalla no iba a mostrar nada.

## Cómo solucionarlo
Mueve el script de Alpine **después** del script que define `catalogoApp`. Es cambiar una línea de lugar:

1. En `htmls/catalogo.html`, **borra** del `<head>` esta línea:
   ```html
   <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
   ```
2. Pégala al final del `<body>`, justo después del `</script>` del módulo y antes de `</body>`:
   ```html
     </script>

     <!-- Alpine va DESPUÉS del script que define catalogoApp -->
     <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
   </body>
   ```

Así `window.catalogoApp` ya existe cuando Alpine arranca. No hace falta tocar nada más. `index.html` no necesita el cambio porque no usa `x-data`.

Después, haz Ctrl+Shift+R. Y, mientras pruebas, limpia el `localStorage` una vez (F12 → Application → Local Storage → Clear), por el caché que te expliqué antes.

## Qué hacer con las marcas y el registro
La línea que mueves queda ahora dentro del bloque `[IA]` del `<body>`. Eso es una modificación tuya al código de la IA, y conviene anotarla en "Qué se incorporó" de `ia/2026-11-07_tilin67-67_catalogo.md`, por ejemplo: *"Moví el script de Alpine al final del body porque, en el `<head>`, se ejecutaba antes de que existiera `catalogoApp`"*. Como el arreglo salió de esta consulta, también debería tener su propio registro. Si quieres, te dejo armado `ia/2026-11-08_tilin67-67_alpine-orden-carga.md`, la fila del índice y el mensaje de commit con `[IA]`.

¿Lo hago así? Y avísame cuando recargues, para ver si ahora el catálogo muestra las 10 películas.
``````

### Prompt 2
se ve bien ahora, pero en consola me sale (index):64 cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation
(anonymous) @ (index):64
(anonymous) @ (index):64
podrias explicarmelo

### Respuesta 2
``````
Esa línea es una **advertencia, no un error**. La página funciona igual, y es normal que aparezca siempre con el CDN de Tailwind.

## Qué significa
Cuando cargas Tailwind desde `cdn.tailwindcss.com`, el navegador tiene que **generar el CSS al vuelo**, leyendo tus clases (`grid`, `gap-6`, `md:grid-cols-3`...) cada vez que abre la página. Eso es cómodo para aprender y hacer prototipos, pero es más lento y pesado que usar un CSS ya generado. Por eso Tailwind avisa que no es la forma recomendada para un sitio en producción.

Las dos líneas `(anonymous) @ (index):64` no son dos problemas: es el mismo mensaje con la traza de dónde salió. `(index)` es la propia página, y el script de Tailwind es quien escribe el aviso.

## ¿Hay que arreglarlo?
Yo no lo haría, por tres razones:

- **La pauta lo permite.** En la sección 3 dice que Tailwind y Alpine "se pueden incluir por CDN o instalar con npm y Vite". Lo único que pide es que el README diga cuál usaron.
- **Quitarlo implica instalar Tailwind con npm** y configurar Vite para varias páginas. Es justo lo que les falló al principio (los botones se deformaron por Preflight), y a estas alturas arriesgas romper algo que hoy funciona.
- **La rúbrica pide "sin errores"** (D3), y esto no es un error. Como mucho, un revisor muy estricto lo vería como algo aislado que no impide el uso.

## Lo que sí conviene hacer
En el README, en la parte de tecnologías, escribe algo como: *"Tailwind CSS y Alpine.js se incluyen por CDN (sin instalación). La advertencia 'cdn.tailwindcss.com should not be used in production' que aparece en la consola es esperada con este método."* Así queda claro que lo saben y que es una decisión consciente.

## Lo que no te recomiendo
Hay trucos para esconder el aviso (sobrescribir `console.warn`), pero tapar mensajes de la consola es mala práctica y no cambia nada de fondo. Si el profesor lo ve, se nota.

Me alegra que el catálogo ya se vea bien. Quedan dos cosas de esta sesión: dejar documentado el arreglo del orden de Alpine (registro `ia/`, fila del índice y commit con `[IA]`) y el filtro de géneros que sigue fallando. ¿Empiezo por el registro?
``````

## Qué se incorporó al proyecto
- De la respuesta 1: moví la línea `<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>` desde el `<head>` de `htmls/catalogo.html` hasta el final del `<body>`, justo después del `<script type="module">` que define `window.catalogoApp`.
- La respuesta 2 solo explicó la advertencia `cdn.tailwindcss.com should not be used in production`; no se incorporó código de ella.
- Esta modificación corrige el código de `htmls/catalogo.html` obtenido en la consulta registrada en `2026-11-07_tilin67-67_catalogo.md`.

## Verificación

**Cómo lo probé**
- Recargué la página del catálogo con `Ctrl+Shift+R` después del cambio y comprobé visualmente que el catálogo se ve bien.
- Revisé la consola del navegador: los errores de Alpine desaparecieron y solo queda la advertencia de Tailwind por el CDN, que es una advertencia y no un error.

**Qué entiendo del código**
- Un script con `defer` se ejecuta cuando el HTML ya se leyó, y los scripts diferidos corren en el orden en que aparecen en el documento.
- Los scripts de tipo `module` también se ejecutan diferidos y en ese mismo orden.
- Antes, Alpine estaba en el `<head>`, así que arrancaba primero y leía `x-data="catalogoApp()"` cuando esa función todavía no existía. Como `x-data` falló, no se creó el estado (`peliculas`, `cargando`, `error`, `busqueda`, `genero`, `orden`), y de ahí salían todos los errores "is not defined".
- Al poner Alpine después del script que define `window.catalogoApp`, la función ya existe cuando Alpine arranca y el estado se crea bien.
- La advertencia de Tailwind aparece porque el CDN genera el CSS en el navegador; la pauta permite usar CDN, y esa advertencia no impide que la página funcione.