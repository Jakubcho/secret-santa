import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Participant from "@/models/Participant";
import Wishlist from "@/models/Wishlist";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.participantId) {
    return NextResponse.json({}, { status: 401 });
  }

  await connectMongoose();

  const me = await Participant.findById(session.user.participantId);
  if (!me || !me.assignedTo) {
    return NextResponse.json(
      { error: "Losowanie jeszcze nie zostało wykonane" },
      { status: 400 }
    );
  }

  const assignedUser = await Participant.findById(me.assignedTo);


  const wishlist = await Wishlist.findOne({
    participantId: me.assignedTo,
  });


  return NextResponse.json({wishlist, assignedUser});
}
