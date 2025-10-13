// models/AboutIntro.js
import mongoose from "mongoose";

const aboutIntroSchema = new mongoose.Schema({
  header: String,
  subHeader: String,
  imageUrl: String,
}, { timestamps: true });

export default mongoose.model("AboutIntro", aboutIntroSchema);
