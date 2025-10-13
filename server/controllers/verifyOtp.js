import User from "../models/user.js";

export const verifyOtp = async (req, res, next) => {
  const { otp, token } = req.body;
  console.log("🔐 Received OTP:", otp, token);
  
console.log(req.body); // Check if OTP and token are received


  try {
    const findUser = await User.findOne({ "otp.otp": otp , "otp.token": token,});
    console.log("👤 User found:", findUser?.email);

    if (!findUser) {
      console.log("❌ Invalid OTP");
      const error = new Error("Invalid OTP");
      error.statusCode = 400;
      throw error;
    }

    const now = Date.now();
    const ttl = 60 * 1000;
    const expiryTime = findUser.otp.sendTime + ttl;

    if (now > expiryTime) {
      await User.updateOne({ _id: findUser._id }, { $unset: { otp: 1 } });
      console.log("⏰ OTP expired");
      const error = new Error("OTP has expired.");
      error.statusCode = 400;
      throw error;
    }

    console.log("✅ OTP verified successfully");
    return res.status(200).json({
      message: "OTP verified",
      status: true,
    });
  } catch (error) {
    console.error("❗ Error in verifyOtp:", error.message);
    next(error);
  }
}; 