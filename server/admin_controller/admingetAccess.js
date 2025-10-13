import Admin from '../models/admin.js';

export const AdmingetAccess = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await Admin.findById(_id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, message: "Authorized" });
  } catch (err) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
};