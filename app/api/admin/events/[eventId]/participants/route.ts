import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Participant from "@/models/Participant";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({}, { status: 403 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Brak imienia" }, { status: 400 });
  }

  await connectMongoose();

  const participant = await Participant.create({
    name,
    eventId: new mongoose.Types.ObjectId(eventId),
  });

  return NextResponse.json(participant);
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({}, { status: 403 });
  }

  await connectMongoose();

  const participants = await Participant.find({
    eventId: new mongoose.Types.ObjectId(eventId),
  }).sort({ createdAt: 1 });

  return NextResponse.json(participants);
}
