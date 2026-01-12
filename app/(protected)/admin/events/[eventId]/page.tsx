import { connectMongoose } from "@/lib/mongoose";
import Event from "@/models/Event";
import EventClient from "./EventClient";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  await connectMongoose();

  const event = await Event.findById(eventId).lean();

  if (!event) return <p>Nie znaleziono wydarzenia</p>;

  return (
    <EventClient
      eventId={event._id.toString()}
      inviteToken={event.inviteToken}
      drawn={event.isDrawn}
      eventName={event.name}
    />
  );
}
