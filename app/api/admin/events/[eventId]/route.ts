import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";

import Event from "@/models/Event";
import Participant from "@/models/Participant";
import Wishlist from "@/models/Wishlist";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{eventId: string}> }
) {
  const { eventId } = await params;

  console.log("DELETE EVENT:", eventId);

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectMongoose();

  const participants = await Participant.find({ eventId });

  const participantIds = participants.map(p => p._id);

  await Wishlist.deleteMany({
    participantId: { $in: participantIds },
  });

  await Participant.deleteMany({ eventId });
  await Event.findByIdAndDelete(eventId);

  return NextResponse.json({ success: true });
}
