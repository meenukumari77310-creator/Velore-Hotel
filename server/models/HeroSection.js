// models/HeroSection.js
import mongoose from "mongoose";

const HeroSectionSchema = new mongoose.Schema({
  slides: [
    {
      url: String,
      public_id: String,
    },
  ],
  greetings: {
    morning: { type: String, default: "Good Morning!" },
    afternoon: { type: String, default: "Good Afternoon!" },
    evening: { type: String, default: "Good Evening!" },
    night: { type: String, default: "Welcome!" },
  },
  description: { type: String },
  textColor: { type: String, default: "#ffffff" },
  fontSize: { type: Number, default: 36 },
  textAlign: { type: String, default: "center" },
});

export default mongoose.model("HeroSection", HeroSectionSchema);
