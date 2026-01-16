import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import { draw } from "@/lib/draw";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {

  const { eventId } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({}, { status: 403 });
  }

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
