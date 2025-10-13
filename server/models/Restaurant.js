import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, default: "Foodie" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  hours: { type: String, default: "" },
});

export default mongoose.model("Restaurant", restaurantSchema);
