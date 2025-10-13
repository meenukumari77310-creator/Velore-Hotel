// models/ContactMessage.js
import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    replied: { type: Boolean, default: false },
    replyMessage: String,
    repliedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", ContactMessageSchema);
