# Respuestas — API de Rastro

> Una o dos frases por respuesta, con tus palabras.

## Ejercicio 0 — Push directo a `main`

Cambia cualquier cosa, haz commit e intenta `git push` directamente a `main`. ¿Qué pasa? Copia la línea importante del error.

```
(pega aquí la línea del error)
```

## Pregunta 1

¿Qué código recibes en `GET /api/health` con MongoDB parado? ¿Qué parte de `index.ts` ha respondido?

**Respuesta:**

Recibo un error 500. Como MongoDB está parado, la ruta falla y responde el manejador de errores del final de `index.ts`.



## Pregunta 2

Con `find(req.query)`, ¿por qué `GET /api/listings?price=380` no encuentra el iPhone? (Pista: ¿en qué formato llega todo lo que viene en una URL?)

**Respuesta:**


## Pregunta 3

¿Por qué la API ignora `views` y `status` si el cliente los envía? ¿Qué podría hacer alguien si no los ignorara?

**Respuesta:**


## Pregunta 4

Ana baja el iPhone de 380 a 350 €. La oferta de Sara guarda una copia: `listing.price: 380`. ¿Debe tu PATCH cambiar también esa copia? ¿Por qué?

**Respuesta:**


## Pregunta 5

¿Por qué ofertar por un anuncio vendido es 409 y no 400?

**Respuesta:**


## Pregunta 6

¿Qué comprueba MongoDB por ti en esta API? ¿Y qué has tenido que comprobar tú en el código? Pon un ejemplo de cada.

**Respuesta:**

- MongoDB comprueba:
- Yo compruebo en el código:
