# Respuestas — API de Rastro

> Una o dos frases por respuesta, con tus palabras.

## Ejercicio 0 — Push directo a `main`

 error: GH013: Repository rule violations found for refs/heads/main.
- Changes must be made through a pull request.

GitHub no me deja subir directamente a `main`: tengo que hacerlo con una pull request.


## Pregunta 1

¿Qué código recibes en `GET /api/health` con MongoDB parado? ¿Qué parte de `index.ts` ha respondido?

*Respuesta:*

Recibo un error 500. Como MongoDB está parado, la ruta falla y responde el manejador de errores del final de `index.ts`.



## Pregunta 2

Con `find(req.query)`, ¿por qué `GET /api/listings?price=380` no encuentra el iPhone? (Pista: ¿en qué formato llega todo lo que viene en una URL?)

*Respuesta:*

Porque todo lo que viene en la URL llega como texto. La API busca `price: "380"` (texto), pero en la base de datos el precio es el número `380`, así que no sale.


## Pregunta 3

¿Por qué la API ignora `views` y `status` si el cliente los envía? ¿Qué podría hacer alguien si no los ignorara?

*Respuesta:*

Porque esos campos los pone la API, no el cliente. Si no los ignorara, alguien podría crear un anuncio con muchas visitas falsas o vendido.


## Pregunta 4

Ana baja el iPhone de 380 a 350 €. La oferta de Sara guarda una copia: `listing.price: 380`. ¿Debe tu PATCH cambiar también esa copia? ¿Por qué?

*Respuesta:*

No. La copia guarda el precio que tenía el anuncio cuando Sara hizo la oferta, y eso no tiene que cambiar.


## Pregunta 5

¿Por qué ofertar por un anuncio vendido es 409 y no 400?

*Respuesta:*

Porque la petición está bien hecha y el anuncio existe, pero ya está vendido. Choca con el estado del anuncio.


## Pregunta 6

¿Qué comprueba MongoDB por ti en esta API? ¿Y qué has tenido que comprobar tú en el código? Pon un ejemplo de cada.

*Respuesta:*

- MongoDB comprueba: que no se repita un email, porque tiene un índice único.
- Yo compruebo en el código: que el anuncio existe antes de crear una oferta.
