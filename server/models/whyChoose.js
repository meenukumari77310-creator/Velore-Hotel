import mongoose from "mongoose";

const whyChooseSchema = new mongoose.Schema(
  {
    icon: String, // Font Awesome class or emoji
    title: String,
  },
  { timestamps: true }
);

export default mongoose.model("WhyChoose", whyChooseSchema);
