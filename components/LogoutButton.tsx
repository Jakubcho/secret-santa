"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="
        px-4 py-2
        rounded-lg
        text-sm
        text-white
        bg-red-600
        hover:bg-red-500
        transition
        shadow
      "
    >
      Wyloguj
    </button>

  );
}
