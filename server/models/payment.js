import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [5, "Address must be at least 5 characters"],
    },
    dob: {
      type: String, // You can use Date if you're storing real date objects
      required: [true, "Date of birth is required"],
    },
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    dishName: {
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
      min: [0, "Dish price must be a positive number"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [1, "Total amount must be at least ₹1"],
    },
    address: {
      type: String,
      default: "N/A",
    },
    country: {
      type: String,
      default: "Unknown",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    sessionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
