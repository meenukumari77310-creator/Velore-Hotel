import mongoose from "mongoose";

const RoomDetailSchema = new mongoose.Schema({
  roomSummary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomSummary",
    required: true,
    unique: false,
  },
  price: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
  availableRooms: { type: Number},
  isAvailable: { type: Boolean, default: true },
  amenities: [String],
  description: { type: String },
  maxGuests: { type: Number },
  size: { type: String },
  bedType: { type: String },
  rating: { type: Number },
  images: [{ type: String }],
});

export default mongoose.model("RoomDetail", RoomDetailSchema);
