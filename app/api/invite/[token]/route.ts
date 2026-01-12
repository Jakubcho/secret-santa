import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import Event from "@/models/Event";
import Participant from "@/models/Participant";

export async function GET(
  req: Request,
  context: { params: { token: string } }
) {
  const { token } = context.params;
  await connectMongoose();

  const event = await Event.findOne({ inviteToken: token });
  if (!event)
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });

  const participants = await Participant.find({
    eventId: event._id,
    userId: { $exists: false },
  });

  return NextResponse.json(participants);
}
