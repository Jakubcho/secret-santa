"use client";

import { useEffect, useState } from "react";

type Wishlist = {
  _id: string;
  items: { text: string }[];
  participantId: {
    name: string;
    assignedTo?: {
      name: string;
    };
  };
};

export default function AdminWishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);

  async function load() {
    const res = await fetch("/api/admin/wishlists", {
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();
    setWishlists(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="backdrop-blur-lg bg-black/40 rounded-2xl p-8 w-full max-w-4xl shadow-2xl flex flex-col gap-8">

      <h1 className="text-2xl font-semibold text-white text-center drop-shadow">
        🎁 Wishlisty uczestników
      </h1>

      {wishlists.length === 0 ? (
        <p className="text-center text-gray-400">
          Brak zapisanych wishlist
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {wishlists.map((w) => (
            <div
              key={w._id}
              className="
                bg-black/30
                border border-white/20
                rounded-xl
                p-5
                shadow-lg
                flex flex-col
                gap-4
              "
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <h3 className="text-lg font-semibold text-white">
                  👤 {w.participantId.name}
                </h3>

                <span className="text-sm text-gray-300">
                  🎯 Losuje dla:{" "}
                  <span className="text-green-400 font-medium">
                    {w.participantId.assignedTo?.name ?? "—"}
                  </span>
                </span>
              </div>

              {/* LISTA */}
              {w.items.length === 0 ? (
                <p className="text-gray-400 text-sm italic">
                  Brak elementów na liście
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {w.items.map((i, idx) => (
                    <li
                      key={idx}
                      className="
                        bg-black/40
                        border border-white/10
                        rounded-lg
                        px-4 py-2
                        text-white
                        shadow
                      "
                    >
                      🎄 {i.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

  );
}
