import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Participant from "@/models/Participant";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { name, eventId } = await req.json();

  if (!name || !eventId) {
    return NextResponse.json(
      { error: "Brak danych" },
      { status: 400 }
    );
  }

  await connectMongoose();

  const participant = await Participant.create({
    name,
    eventId,
  });

  return NextResponse.json(participant);
}
