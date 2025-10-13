// controllers/roomSummaryController.js
import RoomSummary from "../models/RoomSummary.js";

// ✅ Get all room summaries
export const getRooms = async (req, res) => {
  try {
    const rooms = await RoomSummary.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single room summary by slug (better than _id for frontend URLs)
export const getRoomBySlug = async (req, res) => {
  try {
    const room = await RoomSummary.findOne({ slug: req.params.slug });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add Room (Admin)
export const addRoom = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : "";

    const slug =
      req.body.slug ||
      req.body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const room = new RoomSummary({
      name: req.body.name,
      type: req.body.type,
      slug,
      coverImage: imageUrl,
    });

    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update Room
export const updateRoom = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      type: req.body.type,
    };

    // ⚠️ Optional: allow slug update, or keep it fixed
    if (req.body.slug) updateData.slug = req.body.slug;

    if (req.file) updateData.coverImage = req.file.path;

    const updatedRoom = await RoomSummary.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(updatedRoom);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


// ✅ Delete a room summary
export const deleteRoom = async (req, res) => {
  try {
    await RoomSummary.findByIdAndDelete(req.params.id);
    res.json({ message: "Room summary deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
