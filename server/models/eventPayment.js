// models/eventPayment.js
import mongoose from "mongoose";

const eventPaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "EventBooking", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  eventType: String,
  totalAmount: Number,
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  sessionId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("EventPayment", eventPaymentSchema);
