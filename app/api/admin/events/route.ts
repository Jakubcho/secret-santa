import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";

import Event from "@/models/Event";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({}, { status: 403 });
  }

  await connectMongoose();

  const events = await Event.find({ adminId: session.user.id }).sort({
    createdAt: -1,
  });

  return NextResponse.json(events);
}
