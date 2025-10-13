import mongoose from "mongoose";

const eventBookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  eventType: String,
  date: String,
  time: String,
  guests: Number,
  notes: String,
  country: String,     // <-- Add this
  address: String,     // <-- Add this
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "declined"],
    default: "pending",
  },
  usedPoints: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("EventBooking", eventBookingSchema);
