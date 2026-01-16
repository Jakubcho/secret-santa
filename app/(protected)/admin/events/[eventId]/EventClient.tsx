"use client";

import { useEffect, useState } from "react";

type Participant = {
  _id:string;
  name: string;
  assignedTo: string;
};

export default function EventClient({
  eventId,
  inviteToken,
  drawn,
  eventName,
}: {
  eventId: string;
  inviteToken: string;
  eventName:string;
  drawn: boolean;
}) {

  const inviteLink = `${window.location.origin}/invite/${inviteToken}`;

  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDrawn, setIsDrawn] = useState(drawn);

  async function fetchParticipants(){
    const res = await fetch(
      `/api/admin/events/${eventId}/participants`,
      {credentials: "include",
        cache: "no-store",
      }
    );
    const data= await res.json();
    setParticipants(data);
  }

  async function draw() {

   const res = await fetch(`/api/admin/events/${eventId}/draw`, {
      method: "POST",
      credentials: "include",
    });

  if (!res.ok) {
    const data = await res.json();
    alert(data.error);
  } else {
    alert("Losowanie wykonane 🎁");
    setIsDrawn(true);
    fetchParticipants();
  }
}

  async function addParticipant(){
    if(!name) return;

    await fetch(`/api/admin/events/${eventId}/participants`, {
      method:"POST",
      credentials:"include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name}),
    });

    setName("");
    fetchParticipants();
  }

  useEffect(() => {
    fetchParticipants();
  }, []);


  const namesMap = Object.fromEntries(participants.map(p => [p._id, p.name]));

  return (
    <div className="backdrop-blur-lg bg-black/40 rounded-2xl p-8 w-full max-w-4xl shadow-2xl flex flex-col gap-8">

      <h1 className="text-center text-2xl font-semibold text-white drop-shadow">
        🎄 Wydarzenie: <span className="text-green-400">{eventName}</span>
      </h1>

      {drawn && (
        <section className="flex flex-col gap-3 items-center">
          <p className="text-white font-medium">
            🔗 Link zaproszenia
          </p>

          <div className="flex gap-3 w-full max-w-xl">
            <input
              value={inviteLink}
              readOnly
              onClick={(e) => e.currentTarget.select()}
              className="
                flex-1
                rounded-lg
                bg-black/50
                border border-white/30
                px-4 py-3
                text-white
                text-sm
                focus:outline-none
              "
            />

            <button
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="
                bg-blue-600
                hover:bg-blue-500
                transition
                text-white
                px-5
                rounded-lg
                shadow
                text-sm
              "
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

        {!drawn && (
          <div className="flex gap-3 w-full max-w-md">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Imię uczestnika"
              className="
                flex-1
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
              onClick={addParticipant}
              className="
                bg-green-600
                hover:bg-green-500
                transition
                text-white
                px-5
                rounded-lg
                shadow
              "
            >
              Dodaj
            </button>
          </div>
        )}

        <ul className="w-full max-w-xl flex flex-col gap-2">
          {participants.map((p) => (
            <li
              key={p._id}
              className="
                bg-black/30
                border border-white/20
                rounded-lg
                px-4 py-3
                text-white
                flex justify-between
                items-center
                shadow
              "
            >
              <span className="font-medium">
                🎅 {p.name}
              </span>

              {drawn && (
                <span className="text-sm text-gray-300">
                  wylosował →{" "}
                  <strong className="text-green-400">
                    {namesMap[p.assignedTo]}
                  </strong>
                </span>
              )}
            </li>
          ))}
        </ul>

        {!drawn ? (
          <button
            onClick={draw}
            className="
              mt-4
              bg-red-600
              hover:bg-red-500
              transition
              text-white
              px-8
              py-3
              rounded-lg
              shadow-lg
              font-medium
            "
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