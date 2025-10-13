// models/Mission.js
import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
  {
    icon: String,     // e.g., "FaBullseye"
    title: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Mission", missionSchema);
