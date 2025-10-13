import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    // Fetch user by id from token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "User is banned" });
    }


    // Check tokenVersion
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res
        .status(401)
        .json({ message: "Token invalidated, please login again" });
    }

    req.user = { _id: user._id }; // ✅ Fix

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res
      .status(403)
      .json({ message: "Invalid or expired token. Please login again." });
  }
};