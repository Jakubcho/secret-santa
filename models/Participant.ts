import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema(
  {
    name: String,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", default: null },
    wishlist: { type: [String], default: [] },
    exclusions: [{type: mongoose.Schema.Types.ObjectId, ref: "Participant",},],
  },
  { timestamps: true }
);


export default mongoose.models.Participant ||
  mongoose.model("Participant", ParticipantSchema);
