import { Router } from "express";
import { ObjectId } from "mongodb";
import { listingsCollection, offersCollection, usersCollection } from "../db";
import type { Offer } from "../types";

const router = Router();

router.post("/", async (req, res) => {
    const {listingId, buyerId, amount} = req.body;

    if(!ObjectId.isValid(listingId) || !ObjectId.isValid(buyerId) || typeof amount !== "number" || amount <=0){
        res.status(400).json({ error: "Datos no válidos"});
        return;
    }

    const listing = await listingsCollection().findOne({_id:new ObjectId(listingId)});
    const buyer = await usersCollection().findOne({_id: new ObjectId(buyerId)});

    if (!listing || !buyer) {
        res.status(400).json({ error: "El anuncio o el comprador no existen"})
        return;
    }
    if (listing.status !== "AVAILABLE") {
        res.status(409).json({ error: "El anuncio no está disponinble"});
        return;
    }
    const offer: Offer = {
        amount,
        status: "PENDING",
        createdAt: new Date(),
        listing: { id: listing._id, title: listing.title, price: listing.price },
        buyer: { id: buyer._id, name: buyer.name },
    };

    const result = await offersCollection().insertOne(offer);
    res.status(201).json({ _id: result.insertedId, ...offer });
});
export default router