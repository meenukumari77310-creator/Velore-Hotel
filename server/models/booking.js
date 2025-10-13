// backend/models/booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  name: String,
  email: { type: String, required: true },
  phone: String,
  country: String,  // 🌍 Add this
  address: String,  // 🏠 Optional detailed address
  date: String, // YYYY-MM-DD
  time: String, // HH:mm
  guests: Number,
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Booking", bookingSchema);
