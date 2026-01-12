import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import Participant from "@/models/Participant";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  await connectMongoose();

  const participants = await Participant.find(
    { eventId: new mongoose.Types.ObjectId(eventId) },
    { name: 1 }
  ).sort({ createdAt: 1 });

  return NextResponse.json(participants);
}
