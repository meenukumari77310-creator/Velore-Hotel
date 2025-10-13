import mongoose from "mongoose";

const RoomSummarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  coverImage: { type: String }, // single cover image
  slug: { type: String, unique: true }, // unique key for matching details
});

export default mongoose.model("RoomSummary", RoomSummarySchema);
