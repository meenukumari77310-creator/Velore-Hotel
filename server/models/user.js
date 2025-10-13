import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      minlength: 3,
      maxlength: 50,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.platform === "manual" || this.platform === "magic_link";
      },
      minlength: [8, "Password must be at least 8 characters long"],
    },
    platform: {
      type: String,
      enum: ["manual", "magic_link", "google"],
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    otp: {
      otp: { type: String },
      sendTime: { type: Number },
      token: { type: String },
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    loyaltyPoints: {
    type: Number,
    default: 0,
  },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);