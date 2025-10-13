// models/generalEventInfo.js
import mongoose from "mongoose";

const GeneralEventInfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("GeneralEventInfo", GeneralEventInfoSchema);
