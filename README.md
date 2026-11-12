# udp-movie-reviewer (Cubes)

Plataforma web para reseñar películas, series y otros medios audiovisuales. Proyecto de Desarrollo Web y Móvil (CIT2008), Universidad Diego Portales. Entrega 2: frontend con datos simulados (mocks).

**Integrantes:** Gabriel Echenique ([@absalom-e](https://github.com/absalom-e)) y Moises Collarte ([@tilin67-67](https://github.com/tilin67-67)).

## Tecnologías
- HTML, CSS y JavaScript (módulos ES).
- **Tailwind CSS** y **Alpine.js 3**, incluidos por **CDN** (no se instalan con npm). Tailwind se usa con `preflight` desactivado para no alterar los estilos propios. La advertencia `cdn.tailwindcss.com should not be used in production` en la consola es esperada con este método.
- **Vite**, solo como servidor de desarrollo.

## Requisitos
- Node.js 20 o superior (verificar con `node -v`) y npm.
- Un navegador moderno.

## Instalación y ejecución
```bash
git clone https://github.com/tilin67-67/udp-movie-reviewer.git
cd udp-movie-reviewer
npm install
npm run dev
```
Abrir la dirección que muestra la terminal (normalmente `http://localhost:5173`). **No abrir los HTML con doble clic**: los datos se cargan con `fetch`, que necesita un servidor. Se usa `npm run dev` (no `npm run build`).

## Credenciales de prueba
| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | Gabriel.Echenique@cubes.cl | admin1234 |
| Crítico senior | A.Ego@LaCritique.fr | 12345678 |
| Crítico junior (usuario normal) | U.Normal@gmail.com | 12345678 |

También se puede crear una cuenta nueva en "Cuenta > Crear cuenta".

## Vistas disponibles
| Vista | Ruta | Cómo llegar |
|---|---|---|
| Inicio | `/index.html` | Logo o "Inicio" del menú |
| Catálogo | `/htmls/catalogo.html` | Menú "Ver catálogo" |
| Hacer una reseña | `/htmls/Reseña.html` | Menú, o "Escribir reseña" en una película |
| Crear cuenta | `/htmls/Cre.html` | Menú "Cuenta > Crear cuenta" |
| Iniciar sesión | `/htmls/Se.html` | Menú "Cuenta > Iniciar sesión" |
| Cuenta creada | `/htmls/exito.html` | Al terminar el registro |

## Datos simulados (mocks)
Los datos están en `mocks/` (`peliculas.json`, `resenas.json`, `usuarios.json`). Ninguna vista los lee directamente: todas usan las funciones de `js/api.js`, que simulan una API REST (latencia de 500 ms, formato de respuesta uniforme y escrituras guardadas en `localStorage`).

Formato de respuesta: `{ ok: true, status, data }` si sale bien y `{ ok: false, status, error }` si falla. Códigos simulados: 200, 201, 400, 401, 404, 409 y 500.

### Endpoints simulados
| Función | Método | Ruta equivalente | Descripción | Códigos |
|---|---|---|---|---|
| `obtenerPeliculas({busqueda, genero, orden})` | GET | `/api/peliculas` | Lista películas con búsqueda, filtro por género y orden. | 200, 500 |
| `obtenerPelicula(id)` | GET | `/api/peliculas/:id` | Devuelve una película. | 200, 404 |
| `obtenerGeneros()` | GET | `/api/generos` | Lista los géneros existentes, sin repetir. | 200 |
| `obtenerResenas(peliculaId?)` | GET | `/api/resenas` | Lista reseñas; con `peliculaId` filtra por película. | 200 |
| `crearResena(datos)` | POST | `/api/resenas` | Crea una reseña. | 201, 400, 404 |
| `actualizarResena(id, cambios)` | PUT | `/api/resenas/:id` | Edita calificación y comentario. | 200, 400, 404 |
| `eliminarResena(id)` | DELETE | `/api/resenas/:id` | Elimina una reseña. | 200, 404 |
| `registrarUsuario(datos)` | POST | `/api/usuarios` | Crea una cuenta. | 201, 400, 409 |
| `login(correo, clave)` | POST | `/api/login` | Inicia sesión y guarda el usuario activo. | 200, 401 |
| `obtenerUsuario()` | GET | `/api/sesion` | Lee el usuario activo (local, síncrona). | - |
| `logout()` | POST | `/api/logout` | Cierra la sesión (local, síncrona). | - |

### Modelo de datos
- **Película:** `id`, `titulo`, `director`, `anio`, `genero`, `calificacion` (0 a 10), `sinopsis`, `poster`.
- **Reseña:** `id`, `peliculaId`, `autor`, `calificacion` (0 a 10), `comentario`, `fecha` (AAAA-MM-DD).
- **Usuario:** `id`, `nombre`, `correo`, `clave`, `rol`, `reputacion`.

### Probar los estados de error
- Abrir `catalogo.html?error=1`, o ejecutar en la consola `localStorage.setItem('forzar_error', '1')` y recargar.
- Para volver a la normalidad: `localStorage.removeItem('forzar_error')` y pulsar "Reintentar".

## Uso de inteligencia artificial
El uso de IA está documentado en [ia/README.md](ia/README.md).