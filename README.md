# API de Rastro

API de una app de segunda mano (como Wallapop). Hecha con **Express + TypeScript + MongoDB**.

Permite ver, buscar, publicar, editar y borrar anuncios, y hacer ofertas.

## Tecnologías

- **Express**: el servidor y las rutas.
- **TypeScript**: JavaScript con tipos.
- **MongoDB** (en Docker): la base de datos.
- **ESLint + GitHub Actions**: revisan el código en cada PR.

## Cómo arrancarlo

1. Arranca MongoDB:
   ```bash
   docker start mongodb-practica
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia `.env.example` a `.env` y pon tu usuario y contraseña de MongoDB.
4. Arranca la API:
   ```bash
   npm run dev
   ```
   La API queda en `http://localhost:3000`.

| Comando | Para qué |
|---|---|
| `npm run dev` | Arranca la API |
| `npm run lint` | Busca errores de estilo |
| `npm run typecheck` | Busca errores de tipos |

## Estructura

```text
src/
├── index.ts            # Arranca el servidor, monta las rutas y maneja errores
├── db.ts               # Conexión a MongoDB
├── types.ts            # Cómo es cada documento (User, Listing, Offer)
└── routes/
    ├── listings.ts     # Rutas de anuncios
    └── offers.ts       # Rutas de ofertas
```

## Rutas

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/health` | Comprueba que la API y MongoDB funcionan |
| GET | `/api/listings` | Lista de anuncios. Filtros: `?category=`, `?city=`, `?maxPrice=` |
| GET | `/api/listings/:id` | Un anuncio completo (suma 1 visita) |
| POST | `/api/listings` | Publica un anuncio |
| PATCH | `/api/listings/:id` | Cambia el precio |
| DELETE | `/api/listings/:id` | Borra un anuncio |
| GET | `/api/listings/:id/offers` | Ofertas de un anuncio |
| POST | `/api/offers` | Hace una oferta |

## Códigos de respuesta

| Código | Cuándo |
|---|---|
| `200` | Todo bien |
| `201` | Se ha creado algo |
| `204` | Se ha borrado algo |
| `400` | El cliente envía algo mal (o un id del **body** que no existe) |
| `404` | El id de la **URL** no existe |
| `409` | Todo bien, pero choca con el estado (ofertar por un anuncio vendido) |
| `500` | Error del servidor (MongoDB caído) |

Los errores siempre llegan así: `{ "error": "mensaje" }`

## Lo más importante que aprendí

- **MongoDB no comprueba que un id exista** (un vendedor, un anuncio…). Lo comprueba la API.
- **Lo que llega en la URL es siempre texto**: `"380"` no es `380`. Hay que pasarlo a número.
- **Nunca guardar `req.body` tal cual**: se construye campo a campo. Así nadie puede enviar `views: 9999` o `status: "SOLD"`.
- **Se copian datos** (desnormalización): la oferta guarda el título y el precio del anuncio *de ese momento*.

## Cómo se trabajó

Como en una empresa:

- La rama `main` está **protegida**: no se puede subir nada directo.
- Cada parte se hizo en una rama `feature/...` con su **pull request**.
- El **CI** (`.github/workflows/ci.yml`) pasa ESLint y HTMLHint. Solo se fusiona si sale en verde ✅.

| Parte | Rama | Qué se hizo |
|---|---|---|
| 0 | — | CI y `main` protegida |
| 1 | `feature/database-connection` | Conexión a MongoDB |
| 2 | `feature/read-listings` | Ver lista y ficha de anuncios |
| 3 | `feature/listing-filters` | Filtros de búsqueda |
| 4 | `feature/create-listing` | Publicar anuncios |
| 5 | `feature/update-delete-listing` | Cambiar precio y borrar |
| 6 | `feature/offers` | Ofertas |

Las respuestas a las preguntas de la entrega están en [`respuestas.md`](respuestas.md).
