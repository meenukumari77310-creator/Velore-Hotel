import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    bio: { type: String },
    email: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },
  { timestamps: true }
);


export default mongoose.model("TeamMember", teamMemberSchema);
