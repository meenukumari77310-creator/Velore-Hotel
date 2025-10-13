import RoomDetail from "../models/RoomDetails.js";
import RoomSummary from "../models/RoomSummary.js";
import { cloudinary } from "../config/Cloudinary.js";

// Add Room Detail
// Add Room Detail
export const addRoomDetail = async (req, res) => {
  try {
    const { roomSummaryId } = req.params;
    const summary = await RoomSummary.findById(roomSummaryId);
    if (!summary)
      return res.status(404).json({ message: "Room summary not found" });

    // Extract fields from req.body
    const images = req.files ? req.files.map(f => f.path) : [];
    const amenities = req.body.amenities ? req.body.amenities.split(",") : [];

    const detail = await new RoomDetail({
      roomSummary: roomSummaryId,
      price: req.body.price,
      totalRooms: req.body.totalRooms,
      availableRooms: req.body.availableRooms,
      isAvailable: req.body.isAvailable ?? true, // default = true
      amenities,
      description: req.body.description,
      maxGuests: req.body.maxGuests || 2,
      size: req.body.size,
      bedType: req.body.bedType,
      rating: req.body.rating || 0,
      images,
    }).save();

    res.status(201).json({ message: "Room detail added", detail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// Get Details by Summary
export const getRoomDetailsBySummaryId = async (req, res) => {
  try {
    const details = await RoomDetail.find({
      roomSummary: req.params.roomSummaryId,
    }).populate("roomSummary");
    if (!details.length)
      return res.status(404).json({ message: "Room details not found" });
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Detail
export const updateRoomDetail = async (req, res) => {
  try {
    const { detailId } = req.params;
    const updateData = { ...req.body };

    // Parse amenities if present
    if (updateData.amenities)
      updateData.amenities = updateData.amenities.split(",");

    // Fetch existing room detail
    const existingDetail = await RoomDetail.findById(detailId);
    if (!existingDetail)
      return res.status(404).json({ message: "Room detail not found" });

    // Combine old images with new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => f.path);
      updateData.images = [...existingDetail.images, ...newImages];
    }

    // Ensure availability fields are properly cast
    if (updateData.availableRooms !== undefined) {
      updateData.availableRooms = Number(updateData.availableRooms);
    }
    if (updateData.isAvailable !== undefined) {
      updateData.isAvailable =
        updateData.isAvailable === "true" || updateData.isAvailable === true;
    }

    const updated = await RoomDetail.findByIdAndUpdate(detailId, updateData, {
      new: true,
    });

    res.json({ message: "Room detail updated", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const removeRoomImage = async (req, res) => {
  try {
    const { detailId, imageUrl } = req.body;

    if (!detailId || !imageUrl)
      return res.status(400).json({ message: "Missing required data" });

    const room = await RoomDetail.findById(detailId);
    if (!room) return res.status(404).json({ message: "Room detail not found" });

    // Remove image from Cloudinary
    const publicId = imageUrl.split("/").pop().split(".")[0]; // extract file name without extension
    await cloudinary.uploader.destroy(`Rooms/${publicId}`);

    // Remove from images array
    room.images = room.images.filter((img) => img !== imageUrl);
    await room.save();

    res.json({ message: "Image removed", images: room.images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Detail
export const deleteRoomDetail = async (req, res) => {
  try {
    const { detailId } = req.params;
    const deleted = await RoomDetail.findByIdAndDelete(detailId);
    if (!deleted)
      return res.status(404).json({ message: "Room detail not found" });
    res.json({ message: "Room detail deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
