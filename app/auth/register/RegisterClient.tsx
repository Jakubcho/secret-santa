"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const participantId = searchParams.get("participantId");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        participantId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Błąd rejestracji");
      setLoading(false);
      return;
    }

    // ✅ po sukcesie przechodzimy do logowania
    router.push("/auth/login");
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          Rejestracja
        </h1>
        <p className="text-sm text-gray-200 mt-1 drop-shadow">
          Zarejestruj się, aby zobaczyć swoje losowanie 🎁
        </p>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Email</label>
          <input
            type="email"
            placeholder="Email"
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
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Hasło</label>
          <input
            type="password"
            placeholder="Hasło"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
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
        disabled={loading}
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
          disabled:opacity-50
        "
      >
        {loading ? "Rejestruję..." : "Zarejestruj"}
      </button>
    </form>
  );
}
