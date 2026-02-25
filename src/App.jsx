import { useEffect, useState } from "react";
import { getBooks, addBook, deleteBook, updateStatus, updateRating } from "./api";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form
  const [baslik, setBaslik] = useState("");
  const [yazar, setYazar] = useState("");
  const [tur, setTur] = useState("");
  const [puan, setPuan] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [durumFiltre, setDurumFiltre] = useState("");

  // small UI
  const [hoverId, setHoverId] = useState(null);

  // 🎀 soft theme palette
  const theme = {
    bg1: "#fff0f7",
    bg2: "#f3f7ff",
    bg3: "#fff8ee",
    panel: "#ffffff",
    ink: "#3a2b35",
    muted: "#7a5f6f",
    pink: "#ff6fae",
    pink2: "#ffd1e6",
    border: "#ffe2f0",
    glow: "0 18px 45px rgba(255, 111, 174, 0.25)",
    shadow: "0 10px 30px rgba(255, 111, 174, 0.16)",
    shadow2: "0 8px 20px rgba(122, 95, 111, 0.08)",
  };

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const data = await getBooks({ q, durum: durumFiltre });
      setBooks(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, durumFiltre]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setErr("");
      await addBook({
        baslik,
        yazar,
        tur,
        puan: puan === "" ? null : Number(puan),
      });

      setBaslik("");
      setYazar("");
      setTur("");
      setPuan("");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function handleDelete(id) {
    try {
      setErr("");
      await deleteBook(id);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function handleStatus(id, durum) {
    try {
      setErr("");
      await updateStatus(id, durum);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function handleRating(id, value) {
    try {
      setErr("");
      await updateRating(id, value);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  const Badge = ({ children }) => (
    <span
      style={{
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 999,
        background: theme.pink2,
        color: theme.ink,
        border: `1px solid ${theme.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 18,
        boxSizing: "border-box",
        fontFamily:
          "ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        color: theme.ink,

        // 💌 pastel gradient bg
        background: `radial-gradient(900px 520px at 10% 0%, ${theme.bg1} 0%, transparent 60%),
                     radial-gradient(900px 520px at 90% 10%, ${theme.bg2} 0%, transparent 58%),
                     radial-gradient(900px 520px at 50% 100%, ${theme.bg3} 0%, transparent 62%),
                     linear-gradient(180deg, #fff7fb 0%, #ffffff 45%, #fff7fb 100%)`,
      }}
    >
      {/* css keyframes (inline) */}
      <style>{`
        @keyframes kittyBounce {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
      `}</style>

      <div
        style={{
          maxWidth: 860,
          margin: "24px auto",
          background: theme.panel,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          boxShadow: theme.shadow,
          padding: 18,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 🧁 cute floating sparkles */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            fontSize: 18,
            opacity: 0.7,
            animation: "sparkle 2.2s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: "absolute",
            top: 44,
            right: 46,
            fontSize: 14,
            opacity: 0.6,
            animation: "sparkle 2.6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          ✨
        </div>

        {/* header */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* 🐱 animated kitty */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${theme.pink2} 0%, #fff 65%)`,
                border: `1px solid ${theme.border}`,
                display: "grid",
                placeItems: "center",
                boxShadow: theme.shadow2,
                animation: "kittyBounce 1.8s ease-in-out infinite",
              }}
              title="mırmır 🐾"
            >
              <span style={{ fontSize: 26 }}>🐱</span>
            </div>

            <div>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 0.2 }}>
                VERAS <span style={{ color: theme.pink }}>🐾</span>
              </div>
              <div style={{ color: theme.muted, marginTop: 4 }}>
                 kitap ajandası • vera destekli ✨
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge> {books.length} kitap</Badge>
            
          </div>
        </div>

        {/* search + filter */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            placeholder="🔎 Ara (başlık / yazar / tür)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              flex: 1,
              minWidth: 240,
              padding: "12px 12px",
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              outline: "none",
              boxShadow: theme.shadow2,
              background: "white",
                color: theme.ink,
              
            }}
          />

          <select
            value={durumFiltre}
            onChange={(e) => setDurumFiltre(e.target.value)}
            style={{
              padding: "12px 12px",
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              outline: "none",
              background: "white",
              boxShadow: theme.shadow2,
              color: theme.ink,
            }}
          >
            <option value="">Hepsi</option>
            <option value="okunacak">okunacak</option>
            <option value="okunuyor">okunuyor</option>
            <option value="okundu">okundu</option>
          </select>
        </div>

        {/* add form */}
        <form
          onSubmit={onSubmit}
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <input
            placeholder="📌 Başlık"
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            style={{
              padding: "12px 12px",
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              outline: "none",
              background: "white",
              color: theme.ink,
            }}
          />
          <input
            placeholder="✍️ Yazar"
            value={yazar}
            onChange={(e) => setYazar(e.target.value)}
            style={{
              padding: "12px 12px",
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              outline: "none",
              background: "white",
              color: theme.ink,
            }}
          />
          <input
            placeholder="🎀 Tür"
            value={tur}
            onChange={(e) => setTur(e.target.value)}
            style={{
              padding: "12px 12px",
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              outline: "none",
              background: "white",
              color: theme.ink,
            }}
          />
          <input
            placeholder="⭐ Puan (0-10)"
            value={puan}
            onChange={(e) => setPuan(e.target.value)}
            style={{
              padding: "12px 12px",
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              outline: "none",
              background: "white",
              color: theme.ink,
            }}
          />

          <button
            type="submit"
            style={{
              gridColumn: "1 / -1",
              padding: "12px 14px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              background: `linear-gradient(135deg, ${theme.pink} 0%, #ff9ac6 100%)`,
              color: "white",
              fontWeight: 900,
              boxShadow: theme.shadow,
            }}
          >
            + Kitap Ekle 🐱
          </button>
        </form>

        {/* error */}
        {err && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              background: "#fff0f6",
              border: "1px solid #ffc6dd",
              color: "#b4235a",
            }}
          >
            Hata: {err}
          </div>
        )}

        {/* list */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>
            Kitaplar 🧁
          </div>

          {loading ? (
            <div style={{ color: theme.muted }}>Yükleniyor… mırmır 🐾</div>
          ) : books.length === 0 ? (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: `1px dashed ${theme.border}`,
                background: "#fff",
                color: theme.muted,
              }}
            >
              Henüz kitap yok 🥹 İlk kitabını ekle de kedimiz sevinsin 🐱💗
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {books.map((b) => {
                const isHover = hoverId === b._id;

                return (
                  <li
                    key={b._id}
                    onMouseEnter={() => setHoverId(b._id)}
                    onMouseLeave={() => setHoverId(null)}
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${theme.border}`,
                      borderRadius: 18,
                      padding: 14,
                      marginBottom: 12,
                      boxShadow: isHover ? theme.glow : theme.shadow2,
                      transform: isHover ? "translateY(-1px)" : "translateY(0)",
                      transition: "all 160ms ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ fontSize: 16 }}>
                          <b style={{ color: theme.ink }}>{b.baslik}</b>{" "}
                          <span style={{ color: theme.muted }}>— {b.yazar}</span>
                        </div>

                        <div
                          style={{
                            marginTop: 6,
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <Badge>🎀 {b.tur || "-"}</Badge>
                          <Badge>⭐ {b.puan ?? "-"}</Badge>
                          <Badge>📌 {b.durum ?? "okunacak"}</Badge>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <select
                          value={b.durum ?? "okunacak"}
                          onChange={(e) => handleStatus(b._id, e.target.value)}
                          style={{
                            padding: "10px 10px",
                            borderRadius: 12,
                            border: `1px solid ${theme.border}`,
                            background: "#fff",
                            outline: "none",
                            color: theme.ink,
                            fontWeight: 700,
                          }}
                        >
                          <option value="okunacak">okunacak</option>
                          <option value="okunuyor">okunuyor</option>
                          <option value="okundu">okundu</option>
                        </select>

                        <input
                          style={{
                            width: 92,
                            padding: "10px 10px",
                            borderRadius: 12,
                            border: `1px solid ${theme.border}`,
                            outline: "none",
                            background: "#fff",
                            color: theme.ink,
                            fontWeight: 700,
                          }}
                          placeholder="Puan"
                          defaultValue={b.puan ?? ""}
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val === "") return;
                            const num = Number(val);
                            if (Number.isNaN(num)) {
                              setErr("Puan sayı olmalı");
                              return;
                            }
                            handleRating(b._id, num);
                          }}
                        />

                        <button
                          onClick={() => handleDelete(b._id)}
                          style={{
                            background: "#ff3b7a",
                            color: "white",
                            border: "none",
                            padding: "10px 12px",
                            borderRadius: 12,
                            cursor: "pointer",
                            fontWeight: 900,
                            boxShadow: isHover ? theme.shadow : "none",
                            transition: "all 160ms ease",
                          }}
                        >
                          Sil 🗑️
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* footer */}
        <div style={{ marginTop: 16, color: theme.muted, fontSize: 12 }}>
          Efsa Nur Bölükbaş tarafından geliştirildi.
        </div>
      </div>
    </div>
  );
}