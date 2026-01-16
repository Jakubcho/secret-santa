import { NextRequest, NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import Event from "@/models/Event";
import Participant from "@/models/Participant";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  await connectMongoose();

  const event = await Event.findOne({ inviteToken: token });
  if (!event) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 404 }
    );
  }

  const participants = await Participant.find({
    eventId: event._id,
    userId: { $exists: false },
  });

  return NextResponse.json(participants);
}
