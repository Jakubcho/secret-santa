"use client";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Nieprawidłowe dane");
      return;
    }

    const session = await getSession();

    if(!session?.user){
      setError("Błąd sesji");
      return;
    }

    if(session.user.role === "admin"){
      window.location.href = "/admin";
    } else {
      window.location.href = "/participant";
    }

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
          Zaloguj się
        </h1>
        <p className="text-sm text-gray-200 mt-1 drop-shadow">
          Zaloguj się, aby zobaczyć swoje losowanie 🎁
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Email</label>
          <input
            type="email"
            placeholder="np. jan@email.pl"
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
        Zaloguj
      </button>

      {error && (
        <p className="text-center text-red-400 text-sm">
          {error}
        </p>
      )}
    </form>

  );
}
