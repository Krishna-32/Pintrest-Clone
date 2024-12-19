import mongoose from "mongoose";
import User from "./users";
import Comment from "./comments";

const pinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      url: {
        type: String,
        required: true, // Enforce image URL is required
      },
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
        },
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to the Comment model
      },
    ],
  },
  { timestamps: true }
);

// Avoid re-compiling the model in case of hot reloading
export default mongoose.models.Pin || mongoose.model("Pin", pinSchema);
