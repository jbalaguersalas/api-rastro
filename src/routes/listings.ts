import { Router } from "express";
import { ObjectId } from "mongodb";
import type { Filter } from "mongodb";
import { listingsCollection, offersCollection, usersCollection } from "../db";
import type { Listing } from "../types";

const router = Router();

const LIST_FIELDS = { title: 1, price: 1, category: 1, city: 1, status: 1 };

function isNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

router.get("/", async (req, res) => {
  const filter: Filter<Listing> = {};

  if (typeof req.query.category === "string") {
    filter.category = req.query.category;
  }

  if (typeof req.query.city === "string") {
    filter.city = req.query.city;
  }

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

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "El id no tiene un formato válido" });
    return;
  }

  const listing = await listingsCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { views: 1 } },
    { returnDocument: "after" },
  );

  if (!listing) {
    res.status(404).json({ error: "No existe ese anuncio" });
    return;
  }

  res.json(listing);
});

router.post("/", async (req, res) => {
  const body = req.body ?? {};

  if (
    !isNonEmptyText(body.title) ||
    !isNonEmptyText(body.description) ||
    !isNonEmptyText(body.category) ||
    !isNonEmptyText(body.city)
  ) {
    res.status(400).json({ error: "title, description, category y city son obligatorios" });
    return;
  }

  if (typeof body.price !== "number" || body.price < 0) {
    res.status(400).json({ error: "price tiene que ser un número mayor o igual que 0" });
    return;
  }

  if (typeof body.sellerId !== "string" || !ObjectId.isValid(body.sellerId)) {
    res.status(400).json({ error: "sellerId no tiene un formato válido" });
    return;
  }

  const seller = await usersCollection().findOne({ _id: new ObjectId(body.sellerId) });
  if (!seller) {
    res.status(400).json({ error: "No existe ningún usuario con ese sellerId" });
    return;
  }

  const attributes =
    typeof body.attributes === "object" && body.attributes !== null && !Array.isArray(body.attributes)
      ? body.attributes
      : {};

  const newListing: Listing = {
    title: body.title,
    description: body.description,
    price: body.price,
    category: body.category,
    status: "AVAILABLE",
    city: body.city,
    publishedAt: new Date(),
    views: 0,
    seller: { id: seller._id, name: seller.name },
    photos: [],
    attributes,
  };

  const result = await listingsCollection().insertOne(newListing);

  res.status(201).json({ _id: result.insertedId, ...newListing });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body ?? {};

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "El id no tiene un formato válido" });
    return;
  }

  if (typeof body.price !== "number" || body.price < 0) {
    res.status(400).json({ error: "price tiene que ser un número mayor o igual que 0" });
    return;
  }

  const listing = await listingsCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { price: body.price } },
    { returnDocument: "after" },
  );

  if (!listing) {
    res.status(404).json({ error: "No existe ese anuncio" });
    return;
  }

  res.json(listing);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "El id no tiene un formato válido" });
    return;
  }

  const result = await listingsCollection().deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    res.status(404).json({ error: "No existe ese anuncio" });
    return;
  }

  res.status(204).end();
});

router.get("/:id/offers", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "El id no tiene un formato válido" });
    return;
  }

  const listing = await listingsCollection().findOne({ _id: new ObjectId(id) });
  if (!listing) {
    res.status(404).json({ error: "No existe ese anuncio" });
    return;
  }

  const offers = await offersCollection().find({ "listing.id": listing._id }).toArray();
  res.json(offers);
});

export default router;
