# API de Rastro

Práctica del bootcamp de Full Stack de The Bridge.

## Qué he hecho

Rastro es una app inventada para comprar y vender cosas de segunda mano, parecida a Wallapop.

Yo he hecho la parte de la app que no se ve: la que recibe lo que pide el usuario, lo busca o lo guarda en la base de datos y le contesta. A esa parte se le llama API.

Es como un camarero. Tú le pides algo, él va a la cocina, lo prepara y te lo trae. Aquí la cocina es la base de datos, donde están guardados los usuarios, los anuncios y las ofertas.

## Qué se puede hacer

- Ver todos los anuncios.
- Buscar anuncios por categoría, ciudad o precio máximo.
- Abrir un anuncio y ver toda su información. Cada vez que alguien lo abre, se le suma una visita.
- Publicar un anuncio nuevo.
- Cambiar el precio de un anuncio.
- Borrar un anuncio.
- Hacer una oferta por un anuncio.
- Ver todas las ofertas que tiene un anuncio.

## Qué pasa cuando algo sale mal

La API no se rompe ni se queda callada. Siempre contesta y explica qué ha pasado. Por ejemplo:

- Si alguien pone "barato" en el precio en vez de un número, le avisa de que eso no vale.
- Si alguien busca un anuncio que no existe, le dice que no existe.
- Si alguien quiere hacer una oferta por algo que ya está vendido, le dice que ya no se puede.
- Si la base de datos está apagada, avisa de que hay un error, pero sin enseñar detalles internos.

## He aprendido

**A no fiarme de la base de datos.** Me guarda cualquier cosa sin comprobar nada. Si le digo que guarde un anuncio de un vendedor que no existe, lo guarda. Así que soy yo quien comprueba que el vendedor existe antes de guardar.

**A no fiarme del usuario.** Si alguien publica un anuncio y dice que ya tiene 9999 visitas, lo ignoro y le pongo 0. Lo mismo si intenta publicarlo como "vendido". Esas cosas las decide la app, no quien lo publica.

**Que lo que se escribe en una dirección web siempre es texto.** Si alguien busca anuncios de hasta 380 €, a mí me llega "380" como texto, no como número. Si no lo convierto, la búsqueda no encuentra nada.

**Que a veces hay que guardar copias.** Cuando alguien hace una oferta, guardo también el precio que tenía el anuncio en ese momento. Si el vendedor lo baja después, la oferta sigue mostrando el precio de cuando se hizo.

**A contestar con el aviso correcto.** No es lo mismo "me has enviado algo mal" que "eso no existe" o "eso ya está vendido". Cada caso tiene su respuesta.

## Cómo he trabajado

He trabajado como se hace en una empresa:

- La versión principal del proyecto está protegida. No se puede cambiar directamente, ni siquiera yo.
- Cada parte la he hecho por separado, en una copia aparte del proyecto.
- Cuando una parte funcionaba, pedía añadirla a la versión principal.
- Antes de añadirla, GitHub revisa el código de forma automática. Si encuentra errores, no deja añadirla.

La práctica tenía 7 partes:

0. Preparar la revisión automática y proteger la versión principal.
1. Conectar la API con la base de datos.
2. Ver los anuncios.
3. Buscar anuncios.
4. Publicar anuncios.
5. Cambiar el precio y borrar anuncios.
6. Hacer ofertas.

Las respuestas a las preguntas de la práctica están en [`respuestas.md`](respuestas.md).

## Con qué lo he hecho

- **Express**: para montar la API.
- **TypeScript**: el lenguaje en el que está escrito el código.
- **MongoDB**: la base de datos.
- **Docker**: para tener la base de datos funcionando en mi ordenador.
- **GitHub Actions**: la revisión automática del código.

---

<details>
<summary><b>Para programadores</b></summary>

### Cómo arrancarlo

```bash
docker start mongodb-practica   # arrancar MongoDB
npm install                     # instalar dependencias
cp .env.example .env            # crear el .env con el usuario y la contraseña
npm run dev                     # arranca en http://localhost:3000
```

`npm run lint` y `npm run typecheck` revisan el código.

### Rutas

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/health` | Comprueba que la API y MongoDB funcionan |
| GET | `/api/listings` | Lista de anuncios (`?category=`, `?city=`, `?maxPrice=`) |
| GET | `/api/listings/:id` | Un anuncio (suma 1 a `views`) |
| POST | `/api/listings` | Publica un anuncio |
| PATCH | `/api/listings/:id` | Cambia el precio |
| DELETE | `/api/listings/:id` | Borra un anuncio |
| GET | `/api/listings/:id/offers` | Ofertas de un anuncio |
| POST | `/api/offers` | Hace una oferta |

### Códigos de respuesta

| Código | Cuándo |
|---|---|
| 200 | Todo bien |
| 201 | Creado |
| 204 | Borrado |
| 400 | Datos mal enviados, o un id del body que no existe |
| 404 | El id de la URL no existe |
| 409 | Choca con el estado (ofertar por un anuncio vendido) |
| 500 | Error del servidor |

### Estructura

```text
src/
├── index.ts          # servidor y manejo de errores
├── db.ts             # conexión con MongoDB
├── types.ts          # forma de User, Listing y Offer
└── routes/
    ├── listings.ts   # rutas de anuncios
    └── offers.ts     # rutas de ofertas
```

</details>
