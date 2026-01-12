import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Wishlist from "@/models/Wishlist";
import Participant from "@/models/Participant";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({}, { status: 403 });
  }

  await connectMongoose();

  const wishlists = await Wishlist.find()
    .populate({
      path: "participantId",
      model: Participant,
      select: "name assignedTo",
      populate: {
        path: "assignedTo",
        model: Participant,
        select: "name",
      },
    });

  return NextResponse.json(wishlists);
}
