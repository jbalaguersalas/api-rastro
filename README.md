# API de Rastro

Práctica del bootcamp de Full Stack de The Bridge.

## Qué he hecho

Rastro es una app inventada para comprar y vender cosas de segunda mano, parecida a Wallapop.

He hecho la API con Express y TypeScript. Recibe las peticiones, lee o guarda los datos en MongoDB (usuarios, anuncios y ofertas) y contesta en JSON.

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

Cuando algo falla, la API contesta con un error y un mensaje. Por ejemplo:

- Si alguien pone "barato" en el precio en vez de un número, le avisa de que eso no vale.
- Si alguien busca un anuncio que no existe, le dice que no existe.
- Si alguien quiere hacer una oferta por algo que ya está vendido, le dice que ya no se puede.
- Si la base de datos está apagada, avisa de que hay un error, pero sin enseñar detalles internos.

## Cómo he trabajado

- La rama `main` está protegida: no se puede subir nada directamente.
- Cada parte la he hecho en su propia rama.
- Cuando una parte funcionaba, abría un pull request.
- Antes de mezclarlo, GitHub Actions pasa el lint. Si falla, no deja mezclar.

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
