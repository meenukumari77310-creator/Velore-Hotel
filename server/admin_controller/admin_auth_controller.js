import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";

export const AdminloginViaFirebase = async (req, res, next) => {
  const { name, email, platform } = req.body;

  try {
    let user = await Admin.findOne({ email });

    // If user exists with another platform, block login
    if (user) {
      if (user.platform !== platform) {
        const error = new Error(
          `This email is already registered via ${user.platform}`
        );
        error.statusCode = 400;
        throw error;
      }
    } else {
      // Create new user
      user = new Admin({ name, email, platform });
      await user.save();
    }

    // Create JWT token
    const accessToken = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        tokenVersion: user.tokenVersion || 0, // ✅ add this
      },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "7d" }
    );

    // Set cookie with token
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      status: true,
      message: "Google sign-in successful",
      user,
    });
  } catch (err) {
    next(err);
  }
};
