import Admin from "../models/admin.js";

export const AdminlogoutAllDevices = async (req, res) => {
  try {
    const userId = req.user._id;

    // Increment tokenVersion to invalidate all existing tokens
    await Admin.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });

    // Optionally clear cookie on this device
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,                      // ✅ needed for Render
      sameSite: isProduction ? "None" : "Lax",   // ✅ required for cross-site cookie removal
      path: "/",                                 // ✅ clear cookie from root, not /login
    });


    res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    res.status(500).json({ error: "Server error during logout" });
  }
};
