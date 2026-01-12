"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const participantId = searchParams.get("participantId");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(form.password.length < 5){
      setError("Hasło musi mieć co najmniej 5 znaków");
      return;
    }

    if (!participantId) {
      setError("Nieprawidłowy link rejestracji");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        participantId,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/auth/login";
  };

  return (
    <form
      onSubmit={submit}
      className="
        backdrop-blur-lg
        bg-black/40
        rounded-2xl
        p-8
        w-full
        max-w-md
        shadow-2xl
        flex
        flex-col
        gap-6
      "
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white drop-shadow">
          Utwórz konto
        </h1>
        <p className="text-sm text-gray-200 mt-1 drop-shadow">
          Zarejestruj się, aby zobaczyć swoje losowanie 🎁
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Email</label>
          <input
            type="email"
            placeholder="np. jan@email.pl"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="
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
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Hasło</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="
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
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="
          mt-2
          bg-green-600
          hover:bg-green-500
          transition
          text-white
          font-medium
          py-3
          rounded-lg
          shadow-lg
        "
      >
        Zarejestruj się
      </button>

      {error && (
        <p className="text-center text-red-400 text-sm">
          {error}
        </p>
      )}
    </form>


  );
}
