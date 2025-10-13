import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
      title: String,
      image: String,
      category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // changed here
      price: Number,
    },
  ],
});


export default mongoose.model("Cart", CartSchema);
