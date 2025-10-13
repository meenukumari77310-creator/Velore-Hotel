// models/LoyaltyConfig.js
import mongoose from "mongoose";

const loyaltyConfigSchema = new mongoose.Schema({
  pointsPerCurrencyUnit: {
    type: Number,
    required: true,
    default: 10, // e.g., 10 points = ₹1
  },
}, { timestamps: true });

export default mongoose.model("LoyaltyConfig", loyaltyConfigSchema);
