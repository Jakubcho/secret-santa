import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin")
    return NextResponse.json({}, { status: 403 });

  const {name} = await req.json();

  await connectMongoose();

  const event = await Event.create({
    name,
    adminId: session.user.id,
    inviteToken: crypto.randomUUID(),
  });

  return NextResponse.json(event);
}
