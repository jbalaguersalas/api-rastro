import { Router } from "express";
import { listingsCollection } from "../db";
// Imports que te harán falta según avances (descomenta cuando los uses,
// si los dejas sin usar ESLint dará error "no-unused-vars"):
// import { ObjectId } from "mongodb";                         // Parte 2 (ejercicio 2)
// import type { Filter } from "mongodb";                      // Parte 3
// import type { Listing } from "../types";                    // Parte 3 / Parte 4
// import { usersCollection, offersCollection } from "../db";  // Parte 4 / Parte 6

const router = Router();

// Lo que se enseña de cada anuncio en un listado
const LIST_FIELDS = { title: 1, price: 1, category: 1, city: 1, status: 1 };

// =====================================================================
// PARTE 2 — Leer anuncios                     Rama: feature/read-listings
// =====================================================================

// ---------- 2.1 Ejemplo resuelto: GET /api/listings (listado) ----------
// La pantalla de resultados enseña una lista de anuncios. No necesita la
// descripción, las fotos ni los atributos: eso es de la ficha.
//  - .project(...) es la proyección de mongosh: qué campos devolver. El _id sale siempre.
//  - .sort({ publishedAt: -1 }): los más recientes primero.
// Pídelo: tienen que salir 8 anuncios; el primero, la mesa de roble.
//
// ⚠️ En la PARTE 3 sustituirás esta ruta por la versión con filtros (ver más abajo).
router.get("/", async (_req, res) => {
  const listings = await listingsCollection()
    .find()
    .project(LIST_FIELDS)
    .sort({ publishedAt: -1 })
    .toArray();

  res.json(listings);
});

// =====================================================================
// PARTE 3 — Filtrar anuncios                 Rama: feature/listing-filters
// =====================================================================
// La app tiene un buscador. El cliente envía lo que busca en query params:
//   GET /api/listings?category=Cars&city=Valencia&maxPrice=5000
//
// ---------- Ejercicio 3.1: Rómpelo a propósito ----------
// Cambia temporalmente el find() del listado por find(req.query) y prueba:
//   GET /api/listings?category=Cars → funciona.
//   GET /api/listings?price=380     → no encuentra el iPhone.
// Pregunta 2 (en respuestas.md): ¿por qué la segunda no encuentra nada?
// Después vuelve a dejar find().
//
// ---------- 3.2 Ejemplo resuelto: filtrar por categoría ----------
// (Sustituye la ruta GET "/" de la Parte 2 por esta)
//
//   router.get("/", async (req, res) => {
//     const filter: Filter<Listing> = {};
//
//     if (typeof req.query.category === "string") {
//       filter.category = req.query.category;
//     }
//
//     const listings = await listingsCollection()
//       .find(filter)
//       .project(LIST_FIELDS)
//       .sort({ publishedAt: -1 })
//       .toArray();
//
//     res.json(listings);
//   });
//
// ---------- Ejercicio 3.2: ciudad y precio máximo ----------
// Añade dos filtros más (opcionales y combinables con category):
//   city      → solo los anuncios de esa ciudad        | si llega mal: —
//   maxPrice  → solo los de precio menor o igual       | si llega mal: 400 si no es un número
// Pista maxPrice: llega como texto. Number(...) y Number.isNaN(...).
// El filtro queda así: { price: { $lte: 400 } }
//
// Tabla de pruebas:
//   ?category=Cars                              → 200, 2 anuncios
//   ?city=Valencia                              → 200, 4 anuncios
//   ?maxPrice=100                               → 200, 3 anuncios (Xiaomi, chaqueta y zapatillas)
//   ?category=Phones&city=Valencia&maxPrice=400 → 200, 2 anuncios (Xiaomi e iPhone)
//   ?maxPrice=abc                               → 400

// ✏️ TU SOLUCIÓN PARTE 3 (pon aquí el router.get("/") con filtros y borra el de la Parte 2):



// =====================================================================
// PARTE 2 — Ejercicio 2: GET /api/listings/:id (ficha de un anuncio)
// =====================================================================
// Devuelve el anuncio completo y, como alguien acaba de abrir la ficha,
// suma 1 a sus views.
// Pistas:
//  - Para el 400 y el 404, copia la idea del apartado 4.3 del apunte 02b.
//  - Para sumar y devolver el documento a la vez, usa findOneAndUpdate
//    (apunte 02b, 4.5) con $inc en lugar de $set, y returnDocument: "after".
//
// Tabla de pruebas:
//   GET /api/listings/670000000000000000000003 → 200, el iPhone completo y views: 513
//   La misma petición otra vez                 → 200 y views: 514
//   GET /api/listings/abc                      → 400
//   GET /api/listings/670000000000000000000099 → 404

// ✏️ TU SOLUCIÓN EJERCICIO 2:



// =====================================================================
// PARTE 4 — Publicar un anuncio              Rama: feature/create-listing
// =====================================================================
// Ejercicio 4: POST /api/listings. El cliente envía:
//   {
//     "title": "Bicicleta de montaña Orbea",
//     "description": "Revisada en taller.",
//     "price": 300,
//     "category": "Sports",
//     "city": "Castellón",
//     "sellerId": "660000000000000000000004",
//     "attributes": { "size": "L", "type": "mountain", "wheelInches": 29 }
//   }
// Y la API guarda (y devuelve con 201) el anuncio con:
//   status: "AVAILABLE", publishedAt: fecha de ahora, views: 0, photos: [],
//   seller: { id, name }  ← name se copia del usuario (desnormalización)
//
// Reglas:
//   title, description, category, city → Obligatorios. Texto no vacío.
//   price      → Obligatorio. Número mayor o igual que 0.
//   sellerId   → Obligatorio. Formato de ObjectId y tiene que existir en users.
//   attributes → Opcional. Si no llega, {}.
//   Cualquier otro campo → Se ignora.
//
// Ejemplo resuelto: comprobar que el vendedor existe
//   if (typeof body.sellerId !== "string" || !ObjectId.isValid(body.sellerId)) {
//     res.status(400).json({ error: "sellerId no tiene un formato válido" });
//     return;
//   }
//   // MongoDB no comprueba las referencias: lo hacemos nosotros
//   const seller = await usersCollection().findOne({ _id: new ObjectId(body.sellerId) });
//   if (!seller) {
//     res.status(400).json({ error: "No existe ningún usuario con ese sellerId" });
//     return;
//   }
// Con seller ya tienes el _id y el name para construir seller: { id, name }.
//
// IMPORTANTE: construye el anuncio nuevo campo a campo. Nunca guardes
// req.body tal cual (apunte 02b, apartado 4.4).
//
// Tabla de pruebas:
//   El body de arriba                                   → 201, la bici con status, views y seller como en el ejemplo
//   El mismo body con "views": 9999, "status": "SOLD"   → 201, pero con views: 0 y AVAILABLE
//   "price": "75" (texto)                               → 400
//   Sin title                                           → 400
//   "sellerId": "660000000000000000000099"              → 400 (no existe)

// ✏️ TU SOLUCIÓN EJERCICIO 4:



// =====================================================================
// PARTE 5 — Cambiar el precio y borrar   Rama: feature/update-delete-listing
// =====================================================================
// Ejercicio 5.1: PATCH /api/listings/:id para cambiar el precio. Body: { "price": 80 }
//   - price tiene que ser un número mayor o igual que 0. Si no: 400.
//   - Cualquier otro campo se ignora.
//   - Devuelve el anuncio ya modificado (findOneAndUpdate con $set).
//
// Ejercicio 5.2: DELETE /api/listings/:id → 204 si lo borra, 404 si no existía.
//
// Tabla de pruebas:
//   PATCH /api/listings/670000000000000000000005 con { "price": 80 }  → 200, el Xiaomi con price: 80
//   El mismo con { "price": "barato" }                                → 400
//   PATCH /api/listings/670000000000000000000099 con { "price": 1 }   → 404
//   DELETE /api/listings/670000000000000000000006                     → 204
//   El mismo DELETE otra vez                                          → 404

// ✏️ TU SOLUCIÓN EJERCICIO 5.1 (PATCH):



// ✏️ TU SOLUCIÓN EJERCICIO 5.2 (DELETE):



// =====================================================================
// PARTE 6 — Ejercicio 6.2: GET /api/listings/:id/offers   Rama: feature/offers
// =====================================================================
// Devuelve las ofertas de un anuncio. 404 si el anuncio no existe.
// Pista: las ofertas guardan el id del anuncio en listing.id.
//
// Tabla de pruebas:
//   GET /api/listings/670000000000000000000001/offers → 200, 2 ofertas del Seat
//   GET /api/listings/670000000000000000000099/offers → 404

// ✏️ TU SOLUCIÓN EJERCICIO 6.2:



export default router;
