import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Participant from "@/models/Participant";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.participantId)
    return NextResponse.json({}, { status: 401 });

  await connectMongoose();

  const participant = await Participant.findById(
    session.user.participantId
  ).populate("assignedTo");

  return NextResponse.json(participant);
}
