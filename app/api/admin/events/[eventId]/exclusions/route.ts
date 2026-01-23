import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Participant from "@/models/Participant";


type Params = {
  eventId: string;
};


export async function POST(
    request: NextRequest,
    context: { params: Promise<Params> }
) {
  const { eventId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { participantId, exclusions } = await request.json();

  await connectMongoose();

  await Participant.findByIdAndUpdate(participantId, {
    exclusions,
  });

  return NextResponse.json({ success: true });
}
