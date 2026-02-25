import booksRouter from "./routes/books.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    app.use("/api/books", booksRouter);
  res.json({ message: "API çalışıyor 😈" });
});

app.use(express.json());

// 👉 BUNU EKLEDİK
app.get("/", (req, res) => {
  res.send("🐾 VERAS Backend çalışıyor! Made with 💗");
});

app.use("/api/books", bookRoutes);
app.use("/api/books", booksRouter);
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// ...
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5050;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB bağlandı");
    app.listen(PORT, () => {
      console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB hata:", err.message);
  });