import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoose } from "@/lib/mongoose";
import User from "@/models/User";
import Participant from "@/models/Participant";

export async function POST(req: Request) {
  const { email, password, participantId } = await req.json();

  await connectMongoose();

  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json({ error: "Email zajęty" }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hash,
    role: "user",
    participantId,
  });

  await Participant.findByIdAndUpdate(participantId, {
    userId: user._id,
  });

  return NextResponse.json({ ok: true });
}
