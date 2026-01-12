"use client";

import { useEffect, useState } from "react";

export default function ParticipantPage() {
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [assignedWishlist, setAssignedWishlist] = useState<string[]>([]);
  const [assignedUser, setAssignedUser] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD MOJA WISHLIST
  ========================= */
  async function load() {
    const res = await fetch("/api/wishlist", { credentials: "include" });
    const data = await res.json();

    if (data?.items) {
      setItems(data.items.map((i: any) => i.text));
    }
  }

  /* =========================
     ZAPIS DO BAZY (JEDYNE ŹRÓDŁO PRAWDY)
  ========================= */
  async function persist(nextItems: string[]) {
    setLoading(true);

    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        items: nextItems.map((text) => ({ text })),
      }),
    });

    setItems(nextItems);
    setSaved(true);
    setLoading(false);

    setTimeout(() => setSaved(false), 2000);
  }

  /* =========================
     DODAJ
  ========================= */
  function addItem() {
    if (!text.trim()) return;

    const next = [...items, text.trim()];
    setText("");
    persist(next);
  }

  /* =========================
     USUŃ (Z BAZY!)
  ========================= */
  function removeItem(index: number) {
    const next = items.filter((_, i) => i !== index);
    persist(next);
  }

  /* =========================
     WISHLIST WYLOSOWANEJ OSOBY
  ========================= */
  async function loadAssigned() {
    const res = await fetch("/api/wishlist/assigned", {
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();

    if (data?.wishlist?.items) {
      setAssignedWishlist(data.wishlist.items.map((i: any) => i.text));
    }

    if (data?.assignedUser?.name) {
      setAssignedUser(data.assignedUser.name);
    }
  }

  useEffect(() => {
    load();
    loadAssigned();
  }, []);

  return (
    <div className="backdrop-blur-lg bg-black/40 rounded-2xl p-8 w-full max-w-3xl shadow-2xl flex flex-col gap-10">

      {/* ================= MOJA WISHLIST ================= */}
      <section className="flex flex-col gap-5">
        <h1 className="text-2xl font-semibold text-white text-center">
          🎄 Moja lista życzeń
        </h1>

        <div className="flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Np. Książka, Lego, skarpetki 🎁"
            className="flex-1 rounded-lg bg-black/60 border border-white/30 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={addItem}
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 transition text-white px-5 rounded-lg shadow"
          >
            Dodaj
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-400 text-center text-sm">
            Brak dodanych życzeń
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <span>🎁 {item}</span>
                <button
                  onClick={() => removeItem(idx)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>
        )}

        {saved && (
          <p className="text-center text-green-400 text-sm">
            ✅ Lista zapisana
          </p>
        )}
      </section>

      {/* ================= WISHLIST WYLOSOWANEJ OSOBY ================= */}
      {assignedUser && (
        <section className="pt-6 border-t border-white/20 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white text-center">
            🎁 Lista życzeń: {" "}
            <span className="text-green-400">{assignedUser}</span>
          </h2>

          {assignedWishlist.length === 0 ? (
            <p className="text-gray-400 text-center">
              Ta osoba nie dodała jeszcze listy
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {assignedWishlist.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  🎄 {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
