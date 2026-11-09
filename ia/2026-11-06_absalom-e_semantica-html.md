# Corrección de semántica y etiquetas HTML

- **Fecha:** 2026-11-06
- **Integrante:** Gabriel Echenique (@absalom-e)
- **Herramienta y modelo:** Antigravity (Gemini 3.8 Flash)
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** 
  - `index.html` 
  - `htmls/catalogo.html` 
  - `htmls/Cre.html` 
  - `htmls/Se.html` 
  - `htmls/Reseña.html` 
  - `htmls/exito.html` 

## Objetivo
Identificar errores sintácticos y etiquetas genéricas en las vistas HTML de la primera entrega para reemplazarlas por HTML5 semántico (header, nav, main, section, footer), y obtener la propuesta completa de código estructurado para cada vista.

## Conversación (texto completo, sin editar)

### Prompt 1
No quiero que cambies nada, solo quiero que veas los html y me digas que etiquetas reemplazar para tener una buena sintaxis de codigo como mi profesor pide, como es el primer paso, solo quiero cambiar las etiquetas para que sean buenas y menos genericas, nada mas

### Respuesta 1
He revisado detalladamente tanto la rúbrica oficial de la Entrega 2 como todos los archivos HTML actuales en udp-movie-reviewer.

Tal como me pediste, no he modificado ningún archivo. A continuación tienes el diagnóstico exacto de qué etiquetas cambiar y cómo estructurar el código para cumplir con lo que exige el profesor (especialmente los criterios D2: Código y estructura, 7: Calidad técnica y 6: Accesibilidad).

1. Errores críticos de estructura encontrados (Generales):
- `<nav>` dentro del `<head>` (Error grave de sintaxis en catalogo.html, Cre.html, Se.html y Reseña.html).
- Anidar botones dentro de enlaces (`<a><button>...</button></a>`).
- Abuso de `<div>` y atributos obsoletos como `align="right"`.
- Etiquetas sin cerrar y mayúsculas (`<H1>`).

2. Guía de reemplazo de etiquetas archivo por archivo:
- index.html: Envolver barra superior en `<header>`, `<main>` para contenido principal, dividir en `<section>` temáticos y `<footer id="contacto">`.
- catalogo.html: Sacar `<nav>` de `<head>`, mover a `<header>` en `<body>`, `<h1>` como título principal y `<main>`.
- Cre.html: Mover `<nav>` a `<header>`, `<div>` a `<main>`, eliminar enlace que envuelve a submit.
- Se.html: Mover `<nav>` fuera de `<head>`, `<H1>` a `<h1>`, `<main>` y cerrar `<div>` faltante.
- Reseña.html: Mover `<nav>` a `<header>`, corregir `id="nombre-pelicula"` sin espacios, agregar `<label for="contenido-resena">` al textarea y `<main>`.
- exito.html: Cerrar contenedor `<main>`, `<H1>` a `<h1>` y corregir `<title>`.

### Prompt 2
podrias enviarme sin modificar nada, si no que a traves de este chat como se verian los html con los cambios completos?

### Respuesta 2
Aquí tienes exactamente cómo quedarían tus 6 archivos HTML aplicando HTML5 semántico, limpiando la sintaxis y corrigiendo los errores que descuentan puntaje en la rúbrica (como el `<nav>` dentro del `<head>`, etiquetas sin cerrar, mayúsculas, atributos obsoletos y anidaciones inválidas).

1. index.html
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>udp-movie-reviewer</title>
    <link rel="stylesheet" href="/styles/style.css" />
  </head>
  <body style="padding-top: 20px;">
    <header style="text-align: right; margin-right: 30px;">
      <nav aria-label="Navegación de usuario">
        <a href="htmls/Se.html" class="login">Iniciar Sesión</a>
        <a href="htmls/Cre.html" class="register">Registrarse</a>
      </nav>
    </header> 

    <main style="text-align: center;">
      <section id="bienvenida">
        <h1>Bienvenida</h1>
        <p>Texto de bienvenida</p>
      </section>
      <section id="sobre-nosotros">
        <h2>¿Quiénes somos?</h2>
        <p>Es aquí en donde va el contenido que explica el propósito de la página.</p>
      </section>
      <section id="catalogo-muestra">
        <h2>Catálogo de películas</h2>
        <p>Un pequeño sample/imagen del catálogo de películas.</p>
        <a href="htmls/catalogo.html" class="Catalogo">Ver catálogo</a>
      </section>
      <section id="accion-resena">
        <h2>Crea una reseña</h2>
        <p>Botón para crear una reseña, debe pedir de requisito el iniciar sesión.</p>
        <a href="htmls/Reseña.html" class="Reseña">Hacer una reseña</a>
      </section>
    </main>

    <footer id="contacto" style="text-align: center;">
      <h2>Datos de contacto</h2>
      <p>Email, redes sociales, etc.</p>
    </footer>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

2. htmls/catalogo.html
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Catálogo de Películas</title>
    <link rel="stylesheet" href="/styles/catalogo_style.css" />
  </head>
  <body style="padding-top: 20px;">
    <header style="margin-left: 30px;">
      <nav aria-label="Navegación principal">
        <a href="../index.html" class="index">Volver al inicio</a>
      </nav>
    </header>
    <main style="text-align: center;">
      <section id="catalogo-info">
        <h1>Catálogo de Películas</h1>
        <p>Aquí va a estar el catálogo de todas las películas...</p>
      </section>
      <section id="catalogo-acciones">
        <a href="Reseña.html" class="Reseña">Hacer una reseña</a>
      </section>
    </main>
  </body>
</html>
```

3. htmls/Cre.html
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crear Cuenta</title>
    <link rel="stylesheet" href="/styles/create_account_style.css" />
  </head>
  <body style="padding-top: 20px;">
    <header style="margin-left: 30px;">
      <nav aria-label="Navegación principal">
        <a href="../index.html" class="index">Volver al inicio</a>
      </nav>
    </header>
    <main style="text-align: center;">
      <section class="form">
        <h1>Crea tu cuenta</h1>
        <form action="/CrearCuenta" method="post">
          <div class="register_mail">
            <label for="mail">Correo</label>
            <input type="email" id="mail" name="mail" required />
          </div>
          <div class="register_password">
            <label for="clave">Contraseña</label>
            <input type="password" id="clave" name="clave" minlength="8" required />
          </div>
          <div class="register_name">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" required />
          </div>
          <button type="submit">Crear cuenta</button>
        </form>
      </section>
    </main>
  </body>
</html>
```

4. htmls/Se.html
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="/styles/login_style.css" />
  </head>
  <body style="padding-top: 20px;">
    <header style="margin-left: 30px;">
      <nav aria-label="Navegación principal">
        <a href="../index.html" class="index">Volver al inicio</a>
      </nav>
    </header>
    <main style="text-align: center;">
      <section class="form">
        <h1>Iniciar sesión</h1>
        <form action="/login" method="post">
          <div class="login_mail">
            <label for="mail">Correo</label>
            <input type="email" id="mail" name="mail" required />
          </div>
          <div class="login_pass">
            <label for="clave">Contraseña</label>
            <input type="password" id="clave" name="clave" minlength="8" required />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
      </section>
    </main>
  </body>
</html>
```

5. htmls/Reseña.html
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crear Reseña</title>
    <link rel="stylesheet" href="/styles/reseña_style.css" />
  </head>
  <body style="padding-top: 20px;">
    <header style="margin-left: 30px;">
      <nav aria-label="Navegación principal">
        <a href="../index.html" class="index">Volver al inicio</a>
      </nav>
    </header>
    <main style="text-align: center;">
      <section class="form-resena">
        <h1>Crear reseña</h1>
        <form action="/resenas" method="post">
          <div>
            <label for="nombre-pelicula">Nombre de la película:</label>
            <input type="text" id="nombre-pelicula" name="nombre-pelicula" required />
          </div>
          <div style="margin-top: 15px;">
            <label for="contenido-resena">Tu reseña:</label><br />
            <textarea id="contenido-resena" name="contenido-resena" rows="10" cols="50" required placeholder="Escribe aquí tu opinión sobre la película..."></textarea>
          </div>
          <button type="submit" class="btn-resena" style="margin-top: 15px;">Enviar reseña</button>
        </form>
      </section>
      <section style="margin-top: 20px;">
        <a href="catalogo.html" class="Catalogo">Ver catálogo</a>
      </section>
    </main>
  </body>
</html>
```

6. htmls/exito.html
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registro Exitoso</title>
    <link rel="stylesheet" href="/styles/exito_style.css" />
  </head>
  <body style="padding-top: 20px;">
    <main style="text-align: center;">
      <section>
        <h1>¡Su cuenta ha sido creada exitosamente!</h1>
        <a href="../index.html" class="index">Volver al inicio</a>
      </section>
    </main>
  </body>
</html>
```

## Qué se incorporó al proyecto
Se incorporó la estructura semántica de HTML5 propuesta para las vistas del proyecto:
- El uso de `<header>`, `<nav>`, `<main>`, `<section>` y `<footer>` en lugar de divisiones genéricas `<div>`.
- La eliminación del anidamiento de elementos interactivos (`<a>` envolviendo `<button>`).
- En `Reseña.html` se asociaron correctamente las etiquetas `<label>` con sus identificadores de entrada (`id="nombre-pelicula"` y `id="contenido-resena"`).
- Se adaptaron los textos a un formato formal y representativo de la aplicación.
- Se mantuvo el diseño visual original adaptando las clases CSS existentes a la nueva jerarquía.

## Verificación
Se probó la correcta visualización de las vistas en el navegador mediante el servidor de desarrollo, comprobando que los enlaces mantuvieran la navegación entre páginas, que no existieran errores de consola ni advertencias en el árbol del DOM por etiquetas mal anidadas, y que cada formulario contuviera sus campos requeridos correctamente vinculados a sus etiquetas.

## Observacion Personal.

A pesar de que la inteligencia artificial menciono en reiteradas ocaciones el deshacerse de las etiquetas `<Button>`, para reemplazarlas con referencias `<a>` con el fin de mantener parte de la autenticidad y humanidad original del codigo, a su vez, se intento lo posible de adulterar lo menos posible dentro del codigo. Esto es posible y se ve sujeto a cambios posteriormente una vez se entre en proceso de optimizacion y aplicacion de buenas practicas de codigo, mas de momento preferi que las partes aun funcionales y originales del codigo se mantuvieran hasta el momento de refinar y pulir el mismo, ademas puesto a que no he hecho una investigacion extensiva sobre el proposito de `<a>` y el porque se podria considerar una buena practica el usarlo en vez de botones, una vez la investigacion formal sea realizada, se determinara si este cambio es necesario para la sustitucion.

## Segunda Observacion Personal.

A pesar de que el registro se hizo con algunos dias de posteridad respecto a el uso original esto es debido a que hace poco obtuve una mejor claridad del como yo y mi compañero ibamos a efectivamente documentar el uso de inteligencia artificial y fue mi compañero quien realizo y me explico el como hacer la documentacion de IA, los prompts utilizados durante este lapso de tiempo para la alteracion del codigo son los presentes en los archivos leidos aqui mismo.