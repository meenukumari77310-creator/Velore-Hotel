// controllers/profileController.js
import User from "../models/user.js";
import { uploadProfileImage } from "../config/Cloudinary.js";

// Use this export in your route
export const upload = uploadProfileImage;

// GET profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email profileImage");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || null,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// POST/PUT: Add or update profile image
export const addOrUpdateProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.profileImage = req.file.path; // Cloudinary's URL
    await user.save();

    res.json({ imageUrl: user.profileImage });
  } catch (err) {
    console.error("Upload profile image error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
};
