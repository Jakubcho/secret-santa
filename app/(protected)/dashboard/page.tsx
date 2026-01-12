import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Participant from "@/models/Participant";
import { connectMongoose } from "@/lib/mongoose";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectMongoose();

  const me = await Participant.findById(session.user.participantId);


  if (!me) {
    return <h1>Nie znaleziono uczestnika</h1>;
  }

  if (!me.assignedTo) {
    return <h1>🎄 Losowanie jeszcze się nie odbyło</h1>;
  }


  const target = await Participant.findById(me.assignedTo);

  if (!target) {
    return <h1>Nie znaleziono wylosowanej osoby</h1>;
  }

  return (
    <div>
      <h1>Wylosowałeś 🎁</h1>
      <h2>{target.name}</h2>

    </div>
  );
}
