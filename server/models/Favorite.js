import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    dishTitle: {
      type: String,
      required: true,
    },
    dishImage: {
      type: String,
      required: true,
    },
    dishPrice: {
      type: Number,
      required: true,
    },
    dishCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);
