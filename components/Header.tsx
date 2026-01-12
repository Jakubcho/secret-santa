"use client";

import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header
      className="
        backdrop-blur-lg
        bg-black/40
        border-b border-white/10
        shadow-lg
        px-6
        py-4
        flex
        justify-between
        items-center
      "
    >
      {/* LOGO */}
      <span className="font-bold text-lg text-white tracking-wide">
        🎅 Secret Santa
      </span>

      {/* PRAWA STRONA */}
      <div className="flex items-center gap-3">
        {status === "authenticated" && session?.user?.role === "admin" && (
          <>
            <Link
              href="/admin"
              className="
                px-4 py-2
                rounded-lg
                text-sm
                text-white
                bg-white/10
                hover:bg-white/20
                transition
                shadow
              "
            >
              Wydarzenia
            </Link>

            <Link
              href="/admin/wishlists"
              className="
                px-4 py-2
                rounded-lg
                text-sm
                text-white
                bg-white/10
                hover:bg-white/20
                transition
                shadow
              "
            >
              Wishlisty
            </Link>
          </>
        )}

        {status === "authenticated" && (
          <div className="ml-2">
            <LogoutButton />
          </div>
        )}
      </div>
    </header>

  );
}
