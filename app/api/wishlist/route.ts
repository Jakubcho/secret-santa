import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import Wishlist from "@/models/Wishlist";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.participantId) {
    return NextResponse.json({}, { status: 401 });
  }

  await connectMongoose();

  const wishlist = await Wishlist.findOne({
    participantId: session.user.participantId,
  });

  return NextResponse.json(wishlist);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.participantId) {
    return NextResponse.json({}, { status: 401 });
  }

  const { items } = await req.json();

  await connectMongoose();

  const wishlist = await Wishlist.findOneAndUpdate(
    { participantId: session.user.participantId },
    { items },
    { upsert: true, new: true }
  );

  return NextResponse.json(wishlist);
}
