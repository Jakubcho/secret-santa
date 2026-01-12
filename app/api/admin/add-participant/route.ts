import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import Participant from "@/models/Participant";

export async function POST(req: Request) {


  const { name, eventId } = await req.json();

  await connectMongoose();

  const participant = await Participant.create({
    name,
    eventId,
  });

  return NextResponse.json(participant);
}
