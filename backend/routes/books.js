import express from "express";
import mongoose from "mongoose";
import Book from "../models/Book.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// Bu router'daki HER endpoint için login şart:
router.use(requireAuth);

// owner id'yi tek yerden güvenli alalım
function getOwnerId(req) {
  // requireAuth bazı projelerde req.userId, bazılarında req.user._id koyar
  const id = req.userId || req.user?._id;
  return id; // string veya ObjectId olabilir
}

/**
 * GET /api/books/stats
 * Sadece giriş yapan kullanıcının istatistikleri
 */
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const owner = getOwnerId(req);
    const ownerObjId = new mongoose.Types.ObjectId(owner);

    const toplam = await Book.countDocuments({ owner: ownerObjId });

    const durumlar = await Book.aggregate([
      { $match: { owner: ownerObjId } },
      { $group: { _id: "$durum", count: { $sum: 1 } } },
    ]);

    const puanIst = await Book.aggregate([
      { $match: { owner: ownerObjId, puan: { $ne: null } } },
      {
        $group: {
          _id: null,
          ortalamaPuan: { $avg: "$puan" },
          puanliKitapSayisi: { $sum: 1 },
        },
      },
    ]);

    const durumMap = { okunacak: 0, okunuyor: 0, okundu: 0 };
    for (const d of durumlar) durumMap[d._id] = d.count;

    res.json({
      toplam,
      durumlar: durumMap,
      ortalamaPuan: puanIst[0]?.ortalamaPuan ?? null,
      puanliKitapSayisi: puanIst[0]?.puanliKitapSayisi ?? 0,
    });
  })
);

/**
 * POST /api/books
 * Kitap ekler (owner otomatik giriş yapan kullanıcı olur)
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const owner = getOwnerId(req);

    const yeniKitap = await Book.create({
      ...req.body,
      owner, // mongoose string'i de ObjectId'e cast eder
    });

    res.status(201).json(yeniKitap);
  })
);

/**
 * GET /api/books
 * Liste + filtre + arama + sıralama (sadece kendi kitapların)
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const owner = getOwnerId(req);
    const { durum, q, sort } = req.query;

    const filter = { owner };

    if (durum) filter.durum = durum;

    if (q) {
      filter.$or = [
        { baslik: { $regex: q, $options: "i" } },
        { yazar: { $regex: q, $options: "i" } },
        { tur: { $regex: q, $options: "i" } },
      ];
    }

    let sortObj = { _id: -1 };
    if (sort === "puan_desc") sortObj = { puan: -1 };
    if (sort === "puan_asc") sortObj = { puan: 1 };

    const kitaplar = await Book.find(filter).sort(sortObj);
    res.json(kitaplar);
  })
);

/**
 * DELETE /api/books/:id
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const owner = getOwnerId(req);

    const silinen = await Book.findOneAndDelete({ _id: req.params.id, owner });

    if (!silinen) {
      res.status(404);
      throw new Error("Kitap bulunamadı");
    }

    res.json({ message: "Kitap silindi ✅" });
  })
);

/**
 * PUT /api/books/:id
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const owner = getOwnerId(req);

    const guncel = await Book.findOneAndUpdate(
      { _id: req.params.id, owner },
      req.body,
      { new: true, runValidators: true }
    );

    if (!guncel) {
      res.status(404);
      throw new Error("Kitap bulunamadı");
    }

    res.json(guncel);
  })
);

/**
 * PATCH /api/books/:id/rating
 */
router.patch(
  "/:id/rating",
  asyncHandler(async (req, res) => {
    const owner = getOwnerId(req);
    const { puan } = req.body;

    const guncel = await Book.findOneAndUpdate(
      { _id: req.params.id, owner },
      { puan },
      { new: true, runValidators: true }
    );

    if (!guncel) {
      res.status(404);
      throw new Error("Kitap bulunamadı");
    }

    res.json(guncel);
  })
);

/**
 * DELETE /api/books/:id/rating
 */
router.delete(
  "/:id/rating",
  asyncHandler(async (req, res) => {
    const owner = getOwnerId(req);

    const guncel = await Book.findOneAndUpdate(
      { _id: req.params.id, owner },
      { puan: null },
      { new: true }
    );

    if (!guncel) {
      res.status(404);
      throw new Error("Kitap bulunamadı");
    }

    res.json(guncel);
  })
);

/**
 * PATCH /api/books/:id/status
 */
router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const owner = getOwnerId(req);
    const { durum } = req.body;

    const guncel = await Book.findOneAndUpdate(
      { _id: req.params.id, owner },
      { durum },
      { new: true, runValidators: true }
    );

    if (!guncel) {
      res.status(404);
      throw new Error("Kitap bulunamadı");
    }

    res.json(guncel);
  })
);

export default router;