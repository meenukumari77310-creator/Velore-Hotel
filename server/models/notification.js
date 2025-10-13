// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true }, // Optional: can be derived from user
    title: { type: String, required: true }, // e.g., "Booking Confirmed"
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    status: { type: String, enum: ["read", "unread"], default: "unread" },
    relatedBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }, // optional
    // models/notification.js
    source: {
      type: String,
      enum: ["table", "event"],
      default: "table",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
