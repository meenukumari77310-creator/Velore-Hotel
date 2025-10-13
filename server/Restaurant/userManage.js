import User from "../models/user.js";

// Get all users
export const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Ban/unban user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: `User ${user.isBanned ? "banned" : "unbanned"}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update ban status" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

