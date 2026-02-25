import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    baslik: {
      type: String,
      required: [true, "başlık zorunlu"],
      trim: true,
    },
    yazar: {
      type: String,
      required: [true, "yazar zorunlu"],
      trim: true,
    },

    // 🔥 KİŞİYE ÖZEL TEK ALAN: owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    favoriKarakter: { type: String, default: "" },
    tur: { type: String, default: "" },

    baslamaTarihi: { type: Date, default: null },
    bitisTarihi: { type: Date, default: null },

    // okuma durumu: okunacak / okunuyor / okundu
    durum: {
      type: String,
      enum: ["okunacak", "okunuyor", "okundu"],
      default: "okunacak",
    },

    // puan
    puan: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    ozet: { type: String, default: "" },
    alintilar: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Book", BookSchema);