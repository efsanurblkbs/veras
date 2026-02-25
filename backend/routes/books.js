import express from "express";
import Book from "../models/Book.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * GET /api/books/stats
 * toplam, durumlara göre sayılar, ortalama puan
 */
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const toplam = await Book.countDocuments();

    const durumlar = await Book.aggregate([
      { $group: { _id: "$durum", count: { $sum: 1 } } },
    ]);

    const puanIst = await Book.aggregate([
      { $match: { puan: { $ne: null } } },
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
 * Kitap ekler
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const yeniKitap = await Book.create(req.body);
    res.status(201).json(yeniKitap);
  })
);

/**
 * GET /api/books
 * Liste + filtre + arama + sıralama
 * ?durum=okundu
 * ?q=simyaci
 * ?sort=puan_desc | puan_asc
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { durum, q, sort } = req.query;

    const filter = {};

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
 * kitap sil
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const silinen = await Book.findByIdAndDelete(req.params.id);
    if (!silinen) {
      res.status(404);
      throw new Error("Kitap bulunamadı");
    }
    res.json({ message: "Kitap silindi ✅" });
  })
);

/**
 * PUT /api/books/:id
 * kitap güncelle
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const guncel = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!guncel) {
      res.status(404);
      throw new Error("Kitap bulunamadı");
    }

    res.json(guncel);
  })
);

/**
 * PATCH /api/books/:id/rating
 * puan ekle/güncelle
 */
router.patch(
  "/:id/rating",
  asyncHandler(async (req, res) => {
    const { puan } = req.body;

    const guncel = await Book.findByIdAndUpdate(
      req.params.id,
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
 * puanı sil
 */
router.delete(
  "/:id/rating",
  asyncHandler(async (req, res) => {
    const guncel = await Book.findByIdAndUpdate(
      req.params.id,
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
 * durum güncelle
 */
router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const { durum } = req.body;

    const guncel = await Book.findByIdAndUpdate(
      req.params.id,
      { durum },
      { new: true }
    );

    if (!guncel) {
      res.status(404);
      throw new Error("Kitap bulunamadı");
    }

    res.json(guncel);
  })
);

export default router;