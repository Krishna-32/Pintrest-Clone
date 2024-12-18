import mongoose from "mongoose";
import Pin from "./pins";
import User from "./users";

const commentSchema = new mongoose.Schema(
 {
   user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User", // Reference to the User model
     required: true,
   },
   profileImage: {
     type: String,
     required: true, // Optional, adjust based on your needs
   },
   comment: {
     type: String,
     required: true,
     trim: true,
   },
   commentedOn: {
     type: Date,
     default: Date.now,
   },
 },
 {timestamps: true}
);


// Avoid re-compiling the model in case of hot reloading
export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);
