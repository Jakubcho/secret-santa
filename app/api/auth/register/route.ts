import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Participant from "@/models/Participant";
import { connectMongoose } from "@/lib/mongoose";

export async function POST(req: Request) {
  const { email, password, participantId } = await req.json();

  if (!email || !password || !participantId) {
    return NextResponse.json(
      { error: "Brak danych" },
      { status: 400 }
    );
  }

  if (password.length < 5) {
    return NextResponse.json(
      { error: "Hasło musi mieć co najmniej 5 znaków" },
      { status: 400 }
    );
  }

  await connectMongoose();

  const participant = await Participant.findById(participantId);
  if (!participant) {
    return NextResponse.json(
      { error: "Uczestnik nie istnieje" },
      { status: 400 }
    );
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json(
      { error: "Email już istnieje" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashed,
    role: "user",
    participantId,
  });

  return NextResponse.json({ ok: true });
}
