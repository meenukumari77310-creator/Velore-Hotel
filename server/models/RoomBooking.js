import mongoose from "mongoose";


const RoomBookingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "RoomDetail", required: true },
  name: String,
  email: String,
  phone: String,
  guests: Number,
  address: String,
  country: String,
  stripeSessionId: String,
  paid: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("RoomBooking", RoomBookingSchema);
