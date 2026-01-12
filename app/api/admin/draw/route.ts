import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import { draw } from "@/lib/draw";

export async function POST(req: Request) {
  const { eventId } = await req.json();
  await connectMongoose();

  const participants = await Participant.find({ eventId });
  const pairs = draw(participants.map(p => p._id.toString()));

  for (const pair of pairs) {
    await Participant.findByIdAndUpdate(pair.giver, {
      assignedTo: pair.receiver,
    });
  }

  await Event.findByIdAndUpdate(eventId, { isDrawn: true });

  return NextResponse.json({ ok: true });
}
