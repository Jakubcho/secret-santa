import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Event from "@/models/Event";
import Participant from "@/models/Participant";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({}, { status: 403 });
  }

  await connectMongoose();

  const event = await Event.findById(eventId);
  if (!event) {
    return NextResponse.json( { error: "Event nie istnieje" }, { status: 404 } );
  }
  if (event.drawn) {
    return NextResponse.json( { error: "Losowanie już zostało wykonane" }, { status: 400 } );
  }
  if (event.isDrawn) {
    return NextResponse.json( { error: "Losowanie już wykonane" }, { status: 400 } );
  }
  const participants = await Participant.find({ eventId });


  if (participants.length < 2) {
    return NextResponse.json( { error: "Za mało uczestników" }, { status: 400 } );
  }

  const shuffled = [...participants].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length; i++) { shuffled[i].assignedTo = shuffled[(i + 1) % shuffled.length]._id;

  await shuffled[i].save(); } event.isDrawn = true;
  await event.save();

  return NextResponse.json({ success: true });
}