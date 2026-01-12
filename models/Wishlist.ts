import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
      unique: true,
    },

    items: [
      {
        text: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", WishlistSchema);
