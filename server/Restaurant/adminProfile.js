// controllers/adminProfileController.js
import Admin from "../models/admin.js";

// GET admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select(
      "name email profileImage"
    );
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.json({
      name: admin.name,
      email: admin.email,
      profileImage: admin.profileImage || null,
    });
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// POST/PUT: Add or update admin profile image
export const addOrUpdateAdminProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const admin = await Admin.findById(req.user._id);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    admin.profileImage = req.file.path; // cloudinary URL
    await admin.save();

    res.json({ imageUrl: admin.profileImage });
  } catch (err) {
    console.error("Upload admin image error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
};
