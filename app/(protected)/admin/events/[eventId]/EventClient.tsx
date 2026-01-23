"use client";

import { useEffect, useMemo, useState } from "react";

type Participant = {
  _id: string;
  name: string;
  assignedTo?: string | null;
  exclusions?: string;
};

type Props = {
  eventId: string;
  inviteToken: string;
  eventName: string;
  drawn: boolean;
};

export default function EventClient({
  eventId,
  inviteToken,
  eventName,
  drawn,
}: Props) {
  const [origin, setOrigin] = useState("");
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDrawn, setIsDrawn] = useState(drawn);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const inviteLink = origin
    ? `${origin}/invite/${inviteToken}`
    : "";

  async function fetchParticipants() {
    const res = await fetch(
      `/api/admin/events/${eventId}/participants`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) return;

    const data = await res.json();
    setParticipants(data);
  }

  async function draw() {
    const res = await fetch(
      `/api/admin/events/${eventId}/draw`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Błąd losowania");
      return;
    }

    alert("Losowanie wykonane 🎁");
    setIsDrawn(true);
    fetchParticipants();
  }

  async function addParticipant() {
    if (!name.trim()) return;

    await fetch(`/api/admin/events/${eventId}/participants`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchParticipants();
  }

  async function saveExclusions(participantId: string, exclusions: string[]) {
    await fetch(`/api/admin/events/${eventId}/exclusions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ participantId, exclusions }),
    });

    fetchParticipants(); // odśwież
  }

  useEffect(() => {
    fetchParticipants();
  }, []);

  const namesMap = useMemo(
    () =>
      Object.fromEntries(
        participants.map((p) => [p._id, p.name])
      ),
    [participants]
  );

  return (
    <div className="backdrop-blur-lg bg-black/40 rounded-2xl p-8 w-full max-w-4xl shadow-2xl flex flex-col gap-8">
      <h1 className="text-center text-2xl font-semibold text-white drop-shadow">
        🎄 Wydarzenie:{" "}
        <span className="text-green-400">
          {eventName}
        </span>
      </h1>

      {isDrawn && inviteLink && (
        <section className="flex flex-col gap-3 items-center">
          <p className="text-white font-medium">
            🔗 Link zaproszenia
          </p>

          <div className="flex gap-3 w-full max-w-xl">
            <input
              value={inviteLink}
              readOnly
              onClick={(e) =>
                e.currentTarget.select()
              }
              className="flex-1 rounded-lg bg-black/50 border border-white/30 px-4 py-3 text-white text-sm focus:outline-none"
            />

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  inviteLink
                )
              }
              className="bg-blue-600 hover:bg-blue-500 transition text-white px-5 rounded-lg shadow text-sm"
            >
              Kopiuj
            </button>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4 items-center">
        <h2 className="text-xl font-semibold text-white">
          👥 Uczestnicy
        </h2>

        {!isDrawn && (
          <div className="flex gap-3 w-full max-w-md">
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Imię uczestnika"
              className="flex-1 rounded-lg bg-black/50 border border-white/30 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={addParticipant}
              className="bg-green-600 hover:bg-green-500 transition text-white px-5 rounded-lg shadow"
            >
              Dodaj
            </button>
          </div>
        )}

<ul className="w-full max-w-xl flex flex-col gap-2">
  {participants.map((p) => (
    <li
      key={p._id}
      className="bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white flex flex-col shadow"
    >
      {/* Imię uczestnika */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-lg">🎅 {p.name}</span>

        {isDrawn && p.assignedTo && (
          <span className="text-sm text-gray-300">
            wylosował →{" "}
            <strong className="text-green-400">{namesMap[p.assignedTo]}</strong>
          </span>
        )}
      </div>

      {/* Sekcja wykluczeń, widoczna tylko jeśli losowanie nie zostało wykonane */}
      {!isDrawn && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-200 font-semibold">
            NIE może wylosować:
          </label>
          <select
            multiple
            className="h-18 w-full bg-black/50 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={p.exclusions ?? []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map(
                (o) => o.value
              );
              saveExclusions(p._id, values);
            }}
          >
            {participants
              .filter((x) => x._id !== p._id)
              .map((x) => (
                <option key={x._id} value={x._id}>
                  {x.name}
                </option>
              ))}
          </select>
        </div>
      )}
    </li>
  ))}
</ul>


        {!isDrawn ? (
          <button
            onClick={draw}
            className="mt-4 bg-red-600 hover:bg-red-500 transition text-white px-8 py-3 rounded-lg shadow-lg font-medium"
          >
            🎁 Losuj prezenty
          </button>
        ) : (
          <p className="text-green-400 font-semibold mt-4">
            🎉 Losowanie zostało wykonane
          </p>
        )}
      </section>
    </div>
  );
}
