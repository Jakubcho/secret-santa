import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Event from "@/models/Event";
import Participant from "@/models/Participant";

type Params = {
  eventId: string;
};

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function isValid(assignments: any[]) {
  return assignments.every((p) => {
    if (!p.exclusions || p.exclusions.length === 0) return true;
    return !p.exclusions.some(
      (ex: any) => ex.toString() === p.assignedTo.toString()
    );
  });
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<Params> }
) {
  const { eventId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectMongoose();

  const event = await Event.findById(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event nie istnieje" }, { status: 404 });
  }

  if (event.isDrawn) {
    return NextResponse.json(
      { error: "Losowanie już zostało wykonane" },
      { status: 400 }
    );
  }

  const participants = await Participant.find({ eventId });

  if (participants.length < 2) {
    return NextResponse.json(
      { error: "Za mało uczestników" },
      { status: 400 }
    );
  }

  let valid = false;
  let tries = 0;
  let final: any[] = [];

  while (!valid && tries < 1000) {
    const shuffled = shuffle(participants);

    for (let i = 0; i < shuffled.length; i++) {
      shuffled[i].assignedTo =
        shuffled[(i + 1) % shuffled.length]._id;
    }

    if (isValid(shuffled)) {
      valid = true;
      final = shuffled;
    }

    tries++;
  }

  if (!valid) {
    return NextResponse.json(
      {
        error:
          "Nie można spełnić wykluczeń. Zmień je i spróbuj ponownie.",
      },
      { status: 400 }
    );
  }

  for (const p of final) {
    await Participant.findByIdAndUpdate(p._id, {
      assignedTo: p.assignedTo,
    });
  }

  event.isDrawn = true;
  await event.save();

  return NextResponse.json({ success: true });
}
