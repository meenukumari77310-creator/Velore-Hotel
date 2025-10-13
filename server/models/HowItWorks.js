import mongoose from "mongoose";

const howItWorksSchema = new mongoose.Schema(
  {
    icon: String,
    title: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("HowItWorks", howItWorksSchema);
