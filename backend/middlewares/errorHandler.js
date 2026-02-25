export const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR:", err);

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Sunucu hatası",
  });
};