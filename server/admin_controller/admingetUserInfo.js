// controllers/userController.js
import User from "../models/admin.js";

export const AdmingetUserInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, _id } = req.user;
    return res.status(200).json({ name, email, _id });
  } catch (err) {
    console.error("Error fetching user info:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
