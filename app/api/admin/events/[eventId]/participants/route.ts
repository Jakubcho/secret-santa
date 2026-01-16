import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Participant from "@/models/Participant";

type Params = {
  eventId: string;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { eventId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({}, { status: 403 });
  }

  await connectMongoose();

  const participants = await Participant.find({ eventId }).sort({
    createdAt: 1,
  });

  return NextResponse.json(participants);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { eventId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({}, { status: 403 });
  }

  const body = await request.json();

  await connectMongoose();

  const participant = await Participant.create({
    name: body.name,
    eventId,
  });

  return NextResponse.json(participant);
}
