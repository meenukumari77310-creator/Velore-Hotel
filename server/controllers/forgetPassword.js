import User from "../models/user.js";
import crypto from "crypto";
import { sendMail } from "../config/sendMail.js";

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  console.log("📨 Forgot password request for:", email);

  try {
    const formattedEmail = email.toLowerCase();
    const findUser = await User.findOne({ email: formattedEmail });
    if (!findUser) {
      console.warn("❗ No user found for email:", formattedEmail);

      // DEBUG ONLY: REMOVE AFTER TESTING
      const users = await User.find({});
      console.log("All users in DB:", users);

      const error = new Error("No user found");
      error.statusCode = 400;
      throw error;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const token = crypto.randomBytes(32).toString("hex");
    const sendTime = Date.now() + 1 * 60 * 1000;

    findUser.otp = { otp, sendTime, token };
    await findUser.save();

    console.log("✅ OTP generated and user saved");
    await sendMail({
      to: formattedEmail,
      subject: "Reset Password OTP",
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({
      message: "Please check your email for OTP",
      status: true,
      token,
    });
  } catch (error) {
    console.error("❌ Error in forgetPassword:", error.message);
    next(error);
  }
};
