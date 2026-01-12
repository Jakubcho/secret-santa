import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: String,
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    inviteToken: {
      type: String,
      required: true,
      unique: true,
    },
    isDrawn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model("Event", EventSchema);
