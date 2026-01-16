"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RegisterClient() {
  const searchParams = useSearchParams();
  const participantId = searchParams.get("participantId");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <form>
      <h1 className="text-white text-xl mb-4">
        Zarejestruj się, aby zobaczyć swoje losowanie 🎁
      </h1>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Hasło"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <input type="hidden" value={participantId ?? ""} />

      <button>Zarejestruj</button>
    </form>
  );
}
