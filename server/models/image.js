import mongoose from "mongoose";

const GalleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("GalleryImage", GalleryImageSchema);
