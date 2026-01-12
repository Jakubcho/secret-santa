"use client";

import { useEffect, useState } from "react";

type Participant = {
  _id: String,
  name: String,
};

export default function InviteClient({
  eventId,
  eventName,
}: {
  eventId: string,
  eventName: string,
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(()=> {
    fetch(`/api/events/${eventId}/participants`)
     .then((res) => res.json())
     .then(setParticipants);
  }, [eventId]);

  return (
<div className="        backdrop-blur-lg
        bg-black/40
        rounded-2xl
        p-8
        w-full
        max-w-md
        shadow-2xl
        flex
        flex-col
        gap-6">
  <div className="text-center">
    <p className="text-sm uppercase tracking-wide text-gray-300 mb-1">
      Wydarzenie
    </p>
    <h1 className="text-2xl font-semibold text-white">
      {eventName}
    </h1>
  </div>

  <div className="flex flex-col gap-2">
    <label className="text-sm text-gray-300">
      Kim jesteś?
    </label>

    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="
        w-full
        rounded-lg
        bg-black/30
        border border-white/20
        px-4 py-3
        text-white
        focus:outline-none
        focus:ring-2
        focus:ring-green-500
      "
    >
      <option value="">Wybierz swoje imię</option>
      {participants.map((p) => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>
  </div>

  {selected && (
    <a
      href={`/auth/register?participantId=${selected}`}
      className="
        mt-4
        text-center
        bg-green-600
        hover:bg-green-500
        transition
        text-white
        font-medium
        py-3
        rounded-lg
      "
    >
      Przejdź dalej →
    </a>
  )}
</div>

  );
}