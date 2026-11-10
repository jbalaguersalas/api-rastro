import { Router } from "express";
import { ObjectId } from "mongodb";
import type { Filter } from "mongodb";
import { listingsCollection, usersCollection } from "../db";
import type { Listing } from "../types";

const router = Router();

// Lo que se enseña de cada anuncio en un listado
const LIST_FIELDS = { title: 1, price: 1, category: 1, city: 1, status: 1 };

// Devuelve true si es un texto con algo escrito (no vacío)
function isNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

// ---------- GET /api/listings (listado con filtros) ----------
router.get("/", async (req, res) => {
  // Empieza vacío: sin filtros, salen todos
  const filter: Filter<Listing> = {};

  // category: solo si llega y es un texto
  if (typeof req.query.category === "string") {
    filter.category = req.query.category;
  }

  // city: solo si llega y es un texto
  if (typeof req.query.city === "string") {
    filter.city = req.query.city;
  }

  // maxPrice: llega como texto, hay que pasarlo a número
  if (req.query.maxPrice !== undefined) {
    const maxPrice = Number(req.query.maxPrice);
    if (Number.isNaN(maxPrice)) {
      res.status(400).json({ error: "maxPrice tiene que ser un número" });
      return;
    }
    filter.price = { $lte: maxPrice };
  }

  const listings = await listingsCollection()
    .find(filter)
    .project(LIST_FIELDS)
    .sort({ publishedAt: -1 })
    .toArray();

  res.json(listings);
});

// ---------- GET /api/listings/:id (ficha de un anuncio) ----------
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // 1. ¿El id tiene formato válido? Si no → 400
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "El id no tiene un formato válido" });
    return;
  }

  // 2. Buscar el anuncio y sumar 1 a views (y devolverlo ya sumado)
  const listing = await listingsCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { views: 1 } },
    { returnDocument: "after" },
  );

  // 3. ¿No existe? → 404
  if (!listing) {
    res.status(404).json({ error: "No existe ese anuncio" });
    return;
  }

  // 4. Todo bien → devolver el anuncio completo
  res.json(listing);
});

// ---------- POST /api/listings (publicar un anuncio) ----------
router.post("/", async (req, res) => {
  const body = req.body ?? {};

  // 1. Los textos obligatorios
  if (
    !isNonEmptyText(body.title) ||
    !isNonEmptyText(body.description) ||
    !isNonEmptyText(body.category) ||
    !isNonEmptyText(body.city)
  ) {
    res.status(400).json({ error: "title, description, category y city son obligatorios" });
    return;
  }

  // 2. El precio: tiene que ser un número >= 0
  if (typeof body.price !== "number" || body.price < 0) {
    res.status(400).json({ error: "price tiene que ser un número mayor o igual que 0" });
    return;
  }

  // 3. El vendedor: formato de ObjectId
  if (typeof body.sellerId !== "string" || !ObjectId.isValid(body.sellerId)) {
    res.status(400).json({ error: "sellerId no tiene un formato válido" });
    return;
  }

  // 4. MongoDB no comprueba las referencias: lo hacemos nosotros
  const seller = await usersCollection().findOne({ _id: new ObjectId(body.sellerId) });
  if (!seller) {
    res.status(400).json({ error: "No existe ningún usuario con ese sellerId" });
    return;
  }

  // 5. attributes es opcional: si no llega (o no es un objeto), {}
  const attributes =
    typeof body.attributes === "object" && body.attributes !== null && !Array.isArray(body.attributes)
      ? body.attributes
      : {};

  // 6. Construimos el anuncio campo a campo (nunca req.body tal cual)
  const newListing: Listing = {
    title: body.title,
    description: body.description,
    price: body.price,
    category: body.category,
    status: "AVAILABLE", // siempre disponible al crearlo
    city: body.city,
    publishedAt: new Date(), // la fecha de ahora
    views: 0, // 0 visitas
    seller: { id: seller._id, name: seller.name }, // copia del usuario
    photos: [], // sin fotos
    attributes,
  };

  const result = await listingsCollection().insertOne(newListing);

  res.status(201).json({ _id: result.insertedId, ...newListing });
});

export default router;
