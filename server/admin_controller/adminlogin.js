import Admin from '../models/admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const Adminlogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const formattedEmail = email.toLowerCase();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      const error = new Error("Password must be at least 8 characters long and include at least one letter, one number, and one special character");
      error.statusCode = 400;
      throw error;
    }

    const findUser = await Admin.findOne({ email: formattedEmail });
    if (!findUser) {
      const error = new Error("No user found");
      error.statusCode = 400;
      throw error;
    }

    const isPsMatch = await bcrypt.compare(password, findUser.password);
    if (!isPsMatch) {
      const error = new Error("Incorrect Password");
      error.statusCode = 400;
      throw error;
    }

    const accessToken = jwt.sign({
      email: formattedEmail,
      userId: findUser._id,
      tokenVersion: findUser.tokenVersion,
    }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "7d" });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProduction,                           // ✅ true on Render
      sameSite: isProduction ? "None" : "Lax",        // ✅ required for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });


    res.status(200).json({
      message: "Login successful",
      status: true,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

