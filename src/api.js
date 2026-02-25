const BASE = import.meta.env.VITE_API_BASE;

export async function getBooks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${BASE}/api/books?${qs}` : `${BASE}/api/books`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Kitaplar alınamadı");
  return res.json();
}

export async function addBook(payload) {
  const res = await fetch(`${BASE}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kitap eklenemedi");
  return data;
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE}/api/books/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kitap silinemedi");
  return data;
}

export async function updateStatus(id, durum) {
  const res = await fetch(`${BASE}/api/books/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ durum }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Durum güncellenemedi");
  return data;
}

export async function updateRating(id, puan) {
  const res = await fetch(`${BASE}/api/books/${id}/rating`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puan }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Puan güncellenemedi");
  return data;
}
export async function getStats() {
  const BASE = import.meta.env.VITE_API_BASE;
  const res = await fetch(`${BASE}/api/books/stats`);
  if (!res.ok) throw new Error("Stats alınamadı");
  return res.json();
}