import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
