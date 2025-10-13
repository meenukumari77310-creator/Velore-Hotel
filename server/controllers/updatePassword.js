import User from "../models/user.js";
import bcrypt from "bcrypt";

export const updatePassword = async (req, res, next) => {
  const { password, confirmPassword, token } = req.body;

  try {
    const findUser = await User.findOne({ "otp.token": token });
    if (!findUser) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400;
      throw error;
    }

    const otpExpiry = new Date(findUser.otp.sendTime).getTime() + 5 * 60 * 1000;
    if (Date.now() > otpExpiry) {
      const error = new Error("OTP has expired");
      error.statusCode = 400;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      throw error;
    }

    // ✅ Strong password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      const error = new Error(
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character"
      );
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.updateOne(
      { _id: findUser._id },
      {
        $set: { password: hashedPassword },
        $unset: { otp: "" },
      },
      { runValidators: false } // Skip schema-level validators
    );

    if (result.modifiedCount === 0) {
      throw new Error("Password update failed. Please try again.");
    }

    res.status(200).json({
      message: "Password updated successfully",
      status: true,
    });
  } catch (error) {
    next(error);
  }
};
 