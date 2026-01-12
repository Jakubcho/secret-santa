"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Event = {
  _id: string;
  name: string;
};

export default function AdminPage() {
  const [name, setName] = useState("");
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const res = await fetch("/api/admin/events", {
      credentials: "include",
    });
    const data = await res.json();
    setEvents(data);
  };

  const deleteEvent = async (eventId:string) => {
    const confirmed = confirm(
      "Czy na pewno chcesz usunąć to wydarzenie?\n\nUsunięci zostaną wszyscy uczestnicy i ich wishlisty."
    );

    if (!confirmed) return;

    const res = await fetch(`/api/admin/events/${eventId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Błąd podczas usuwania wydarzenia");
      return;
    }

    // odśwież listę eventów
    fetchEvents();
  }


  const createEvent = async () => {
    await fetch("/api/admin/create-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      credentials: "include",
    });
    setName("");
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
  <div className="backdrop-blur-lg bg-black/40 rounded-2xl p-8 w-full max-w-4xl shadow-2xl flex flex-col gap-8">

    <h1 className="text-center text-3xl font-semibold text-white drop-shadow">
      🎅 Panel admina
    </h1>

    {/* TWORZENIE EVENTU */}
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <input
        placeholder="Nazwa wydarzenia"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="
          flex-1
          max-w-md
          rounded-lg
          bg-black/50
          border border-white/30
          px-4 py-3
          text-white
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-green-500
        "
      />

      <button
        onClick={createEvent}
        className="
          bg-green-600
          hover:bg-green-500
          transition
          text-white
          px-6
          py-3
          rounded-lg
          shadow-lg
          font-medium
        "
      >
        ➕ Utwórz wydarzenie
      </button>
    </div>

    {/* LISTA EVENTÓW */}
    <section className="flex flex-col gap-4">
      <h2 className="text-center text-xl font-semibold text-white">
        📋 Twoje wydarzenia
      </h2>

      {events.length === 0 ? (
        <p className="text-center text-gray-400">
          Brak utworzonych wydarzeń
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li
              key={event._id}
              className="
                bg-black/30
                border border-white/20
                rounded-xl
                px-5 py-4
                flex flex-col sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
                shadow
              "
            >
              <span className="text-white font-medium text-lg">
                🎄 {event.name}
              </span>

              <div className="flex gap-4 items-center">
                <Link
                  href={`/admin/events/${event._id}`}
                  className="
                    text-blue-400
                    hover:text-blue-300
                    font-medium
                    transition
                  "
                >
                  Zarządzaj
                </Link>

                <button
                  onClick={() => deleteEvent(event._id)}
                  className="
                    text-red-400
                    hover:text-red-300
                    transition
                    text-sm
                  "
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>


  );
}
