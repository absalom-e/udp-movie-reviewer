# Registro de uso de IA

Este proyecto usó IA de forma consultiva, según la sección 10 de la pauta de la Entrega 2. Cada interacción que aportó código está registrada en un archivo de esta carpeta, con los prompts y respuestas completos. El código asistido por IA está marcado en los archivos fuente con comentarios `[IA] inicio` y `[IA] fin` que apuntan a su registro.

| Fecha | Integrante | Herramienta | Tema | Registro |
|---|---|---|---|---|
| 2026-11-06 | @absalom-e | Antigravity (Gemini) | Semántica HTML | [ver](2026-11-06_absalom-e_semantica-html.md) |
| 2026-11-07 | @absalom-e | Antigravity (Gemini) | Esqueleto mocks | [ver](2026-11-07_absalom-e_esqueleto-mocks.md) |
| 2026-11-07 | @tilin67-67 | Gemini | Tailwind CSS y Alpine.js por CDN | [ver](2026-11-07_tilin67-67_tailwind-alpine.md) |
| 2026-11-07 | @tilin67-67 | Gemini | Capa de servicios (js/api.js) | [ver](2026-11-07_tilin67-67_capa-api.md) |
| 2026-11-07 | @tilin67-67 | Gemini | Catálogo con búsqueda, filtros y estados | [ver](2026-11-07_tilin67-67_catalogo.md) |
| 2026-11-08 | @tilin67-67 | Claude (Sonnet 5.5) | Corrección del orden de carga de Alpine | [ver](2026-11-08_tilin67-67_alpine-orden-carga.md) |
| 2026-11-08 | @tilin67-67 | Claude (Sonnet 5.5) | Corrección del filtro por género | [ver](2026-11-08_tilin67-67_filtro-genero.md) |
| 2026-11-09 | @tilin67-67 | Claude | Menú de navegación compartido | [ver](2026-11-09_tilin67-67_menu-estatico.md) |
| 2026-11-09 | @absalom-e | Antigravity (Gemini) | Flujo de login y registro con Alpine | [ver](2026-11-09_absalom-e_login-registro-alpine.md) |
| 2026-11-10 | @tilin67-67 | Claude | Capa de servicios completa: registro por API simulada, mocks, estados y manejo de errores | [ver](2026-11-10_tilin67-67_capa-servicios.md) |
| 2026-11-10 | @tilin67-67 | Claude | Reseñas con CRUD, modal, pestañas, acordeón, toasts y carga incremental | [ver](2026-11-10_tilin67-67_resenas-crud.md) |
| 2026-11-10 | @tilin67-67 | Claude | Menú desplegable "Cuenta" | [ver](2026-11-10_tilin67-67_menu-desplegable.md) |
| 2026-11-11 | @tilin67-67 | ChatGPT (GPT-6) | Top 3 de películas mejor calificadas en la página de inicio | [ver](2026-11-11_tilin67-67_top-3-inicio.md) |
| 2026-11-11 | @tilin67-67 | ChatGPT (GPT-6) | Arreglo del login y validación descriptiva por campo en formularios | [ver](2026-11-11_tilin67-67_forms-arregloapi.md) |
| 2026-11-11 | @tilin67-67 | ChatGPT (GPT-6) | Separación del acceso a la sesión del menú mediante js/menu.js y la capa API | [ver](2026-11-11_tilin67-67_sacaracceso-localstorage.md) |

## Archivos con código asistido por IA

| Archivo | Registro |
|---|---|
| `index.html` | [2026-11-06_absalom-e_semantica-html.md](2026-11-06_absalom-e_semantica-html.md), [2026-11-07_tilin67-67_tailwind-alpine.md](2026-11-07_tilin67-67_tailwind-alpine.md) (bloque del `<head>` con Tailwind y Alpine), [2026-11-09_tilin67-67_menu-estatico.md](2026-11-09_tilin67-67_menu-estatico.md), [2026-11-10_tilin67-67_menu-desplegable.md](2026-11-10_tilin67-67_menu-desplegable.md), [2026-11-11_tilin67-67_top-3-inicio.md](2026-11-11_tilin67-67_top-3-inicio.md) y [2026-11-11_tilin67-67_sacaracceso-localstorage.md](2026-11-11_tilin67-67_sacaracceso-localstorage.md) (propuesta de refactor del menú, pendiente de integrar) |
| `htmls/catalogo.html` | [2026-11-06_absalom-e_semantica-html.md](2026-11-06_absalom-e_semantica-html.md), [2026-11-07_tilin67-67_tailwind-alpine.md](2026-11-07_tilin67-67_tailwind-alpine.md), [2026-11-07_tilin67-67_catalogo.md](2026-11-07_tilin67-67_catalogo.md), [2026-11-08_tilin67-67_alpine-orden-carga.md](2026-11-08_tilin67-67_alpine-orden-carga.md), [2026-11-08_tilin67-67_filtro-genero.md](2026-11-08_tilin67-67_filtro-genero.md), [2026-11-09_tilin67-67_menu-estatico.md](2026-11-09_tilin67-67_menu-estatico.md), [2026-11-10_tilin67-67_resenas-crud.md](2026-11-10_tilin67-67_resenas-crud.md), [2026-11-10_tilin67-67_capa-servicios.md](2026-11-10_tilin67-67_capa-servicios.md) y [2026-11-11_tilin67-67_sacaracceso-localstorage.md](2026-11-11_tilin67-67_sacaracceso-localstorage.md) (propuesta de carga de menu.js, pendiente de integrar) |
| `htmls/Cre.html` | [2026-11-06_absalom-e_semantica-html.md](2026-11-06_absalom-e_semantica-html.md), [2026-11-09_tilin67-67_menu-estatico.md](2026-11-09_tilin67-67_menu-estatico.md), [2026-11-10_tilin67-67_capa-servicios.md](2026-11-10_tilin67-67_capa-servicios.md) y [2026-11-11_tilin67-67_sacaracceso-localstorage.md](2026-11-11_tilin67-67_sacaracceso-localstorage.md) (propuesta de carga de menu.js, pendiente de integrar) |
| `htmls/Se.html` | [2026-11-06_absalom-e_semantica-html.md](2026-11-06_absalom-e_semantica-html.md), [2026-11-09_tilin67-67_menu-estatico.md](2026-11-09_tilin67-67_menu-estatico.md) y [2026-11-11_tilin67-67_sacaracceso-localstorage.md](2026-11-11_tilin67-67_sacaracceso-localstorage.md) (propuesta de carga de menu.js, pendiente de integrar) |
| `htmls/Reseña.html` | [2026-11-06_absalom-e_semantica-html.md](2026-11-06_absalom-e_semantica-html.md), [2026-11-09_tilin67-67_menu-estatico.md](2026-11-09_tilin67-67_menu-estatico.md), [2026-11-10_tilin67-67_resenas-crud.md](2026-11-10_tilin67-67_resenas-crud.md) y [2026-11-11_tilin67-67_sacaracceso-localstorage.md](2026-11-11_tilin67-67_sacaracceso-localstorage.md) (propuesta de carga de menu.js, pendiente de integrar) |
| `htmls/exito.html` | [2026-11-06_absalom-e_semantica-html.md](2026-11-06_absalom-e_semantica-html.md) |
| `js/api.js` | [2026-11-07_tilin67-67_capa-api.md](2026-11-07_tilin67-67_capa-api.md), [2026-11-08_tilin67-67_filtro-genero.md](2026-11-08_tilin67-67_filtro-genero.md), [2026-11-10_tilin67-67_capa-servicios.md](2026-11-10_tilin67-67_capa-servicios.md) y [2026-11-10_tilin67-67_resenas-crud.md](2026-11-10_tilin67-67_resenas-crud.md) |
| `js/menu.js` | [2026-11-11_tilin67-67_sacaracceso-localstorage.md](2026-11-11_tilin67-67_sacaracceso-localstorage.md) (propuesta de creación, pendiente de integrar) |
| `js/toast.js` | [2026-11-10_tilin67-67_resenas-crud.md](2026-11-10_tilin67-67_resenas-crud.md) |
| `mocks/peliculas.json` | [2026-11-07_absalom-e_esqueleto-mocks.md](2026-11-07_absalom-e_esqueleto-mocks.md) y [2026-11-10_tilin67-67_capa-servicios.md](2026-11-10_tilin67-67_capa-servicios.md) |
| `mocks/usuarios.json` | [2026-11-07_absalom-e_esqueleto-mocks.md](2026-11-07_absalom-e_esqueleto-mocks.md) y [2026-11-10_tilin67-67_capa-servicios.md](2026-11-10_tilin67-67_capa-servicios.md) |
| `mocks/resenas.json` | [2026-11-07_absalom-e_esqueleto-mocks.md](2026-11-07_absalom-e_esqueleto-mocks.md) y [2026-11-10_tilin67-67_capa-servicios.md](2026-11-10_tilin67-67_capa-servicios.md) |
| `htmls/Se.html` | [2026-11-09_absalom-e_login-registro-alpine.md](2026-11-09_absalom-e_login-registro-alpine.md), [2026-11-11_tilin67-67_forms-arregloapi.md](2026-11-11_tilin67-67_forms-arregloapi.md)  |
| `htmls/Cre.html` | [2026-11-09_absalom-e_login-registro-alpine.md](2026-11-09_absalom-e_login-registro-alpine.md), [2026-11-11_tilin67-67_forms-arregloapi.md](2026-11-11_tilin67-67_forms-arregloapi.md)  |