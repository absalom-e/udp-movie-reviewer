# Esqueleto base para archivos de datos simulados (mocks)

- **Fecha:** 2026-11-07
- **Integrante:** Gabriel Echenique (@absalom-e)
- **Herramienta y modelo:** Antigravity (Gemini 3.8 Flash)
- **Enlace a la conversación:** no disponible
- **Archivos afectados:** 
  - `mocks/peliculas.json` 
  - `mocks/usuarios.json` 
  - `mocks/resenas.json` 

## Objetivo
Obtener una estructura base o esqueleto en formato JSON para organizar los datos simulados requeridos por la rúbrica, garantizando compatibilidad con las propiedades consumidas por la capa de servicios (`api.js`) y el catálogo.

## Conversación (texto completo, sin editar)

### Prompt 1
Dime o dame una idea general de contenidos de prueba con los cuales rellenar estos mocks, no te pido que lo hagas tu, solo que me des un esqueleto generico y base para poder rellenar yo

### Respuesta 1
Aquí tienes el esqueleto base para cada uno de los 3 archivos, con los campos exactos que el código de catalogo.html y js/api.js ya están esperando recibir.

1. mocks/peliculas.json (Recurso Principal):
```json
[
  {
    "id": 1,
    "titulo": "Nombre de la Película 1",
    "director": "Nombre del Director",
    "anio": 2024,
    "genero": "Ciencia Ficción",
    "calificacion": 4.8,
    "sinopsis": "Breve resumen o sinopsis de la trama de la película...",
    "poster": "https://url-de-la-imagen-del-poster.jpg"
  }
]
```

2. mocks/usuarios.json (Para Login y Reputación):
```json
[
  {
    "id": 1,
    "nombre": "Gabriel (Admin)",
    "correo": "admin@cubes.cl",
    "clave": "admin1234",
    "rol": "admin",
    "reputacion": 500
  }
]
```

3. mocks/resenas.json (Para el detalle de películas):
```json
[
  {
    "id": 1,
    "peliculaId": 1,
    "autor": "Moisés Crítico",
    "calificacion": 5,
    "comentario": "Una obra maestra visual y sonora.",
    "fecha": "2026-11-01"
  }
]
```

## Qué se incorporó al proyecto
Se utilizaron los esquemas de campos propuestos para estructurar los tres archivos `.json` en la carpeta `mocks/`. La IA no generó las películas ni los textos definitivos: todos los datos reales (los 10 títulos de películas, directores, años, sinopsis, URLs de pósters, usuarios con diferentes niveles de reputación y reseñas) fueron investigados y redactados manualmente por el integrante.

## Verificación
Se validó la sintaxis JSON mediante validación estricta comprobando que no quedaran comas sobrantes y que los tipos de datos coincidieran con lo requerido por `api.js`.