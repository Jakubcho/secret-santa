import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "admin" | "user";
      participantId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: "admin" | "user";
    participantId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: "admin" | "user";
    participantId?: string | null;
  }
}
