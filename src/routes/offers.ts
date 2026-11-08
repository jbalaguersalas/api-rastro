import { Router } from "express";
// Imports que te harán falta (descomenta cuando los uses):
// import { ObjectId } from "mongodb";
// import { listingsCollection, offersCollection, usersCollection } from "../db";
// import type { Offer } from "../types";

const router = Router();

// =====================================================================
// PARTE 6 — Ofertas                                 Rama: feature/offers
// =====================================================================
// Este router se monta en /api/offers (descomenta las líneas de index.ts).
//
// Ejercicio 6.1: POST /api/offers. El cliente envía:
//   { "listingId": "670000000000000000000008", "buyerId": "660000000000000000000002", "amount": 100 }
//
// Comprueba, EN ESTE ORDEN:
//   1. listingId y buyerId tienen formato de ObjectId → 400
//   2. amount es un número mayor que 0               → 400
//   3. El anuncio existe                              → 400
//   4. El comprador existe                            → 400
//   5. El anuncio está AVAILABLE                      → 409
//
// Si todo va bien, guarda la oferta con status: "PENDING", createdAt con la
// fecha de ahora y las copias:
//   listing: { id, title, price }  y  buyer: { id, name }
// Responde 201.
//
// Tabla de pruebas:
//   POST Luis (…002) ofrece 100 € por la mesa (…008)   → 201, con listing.price: 120 y buyer.name: "Luis Martín"
//   POST Sara (…005) ofrece 100 € por el Samsung (…004) → 409 (está vendido)
//   POST con "amount": 0                                → 400
//   POST con un listingId que no existe                 → 400
//
// (El Ejercicio 6.2, GET /api/listings/:id/offers, va en routes/listings.ts)

// ✏️ TU SOLUCIÓN EJERCICIO 6.1:



// =====================================================================
// RETO OPCIONAL — Aceptar una oferta        Rama: feature/accept-offer
// =====================================================================
// PATCH /api/offers/:id con { "status": "ACCEPTED" }: la oferta pasa a
// ACCEPTED y el anuncio a RESERVED. 409 si la oferta no está PENDING.
// Son dos escrituras: ¿qué pasa si el servidor se apaga entre una y otra?

// ✏️ TU SOLUCIÓN (opcional):



// =====================================================================
// RETO OPCIONAL — Tu propio anuncio       Rama: feature/own-listing-offer
// =====================================================================
// Un usuario no puede ofertar por su propio anuncio (400).
// Pista: dos ObjectId no se comparan con ===; busca el método equals.
// (Se añade dentro del POST del Ejercicio 6.1)

export default router;
