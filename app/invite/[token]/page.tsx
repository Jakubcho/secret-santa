import { connectMongoose } from "@/lib/mongoose";
import Event from "@/models/Event";
import InviteClient from "./InviteClient";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  await connectMongoose();

  const event = await Event.findOne({ inviteToken: token }).lean();

  if (!event) {
    return <h1>Zaproszenie nie istnieje</h1>;
  }

  return (
    <InviteClient
      eventId={event._id.toString()}
      eventName={event.name}
    />
  );
}
