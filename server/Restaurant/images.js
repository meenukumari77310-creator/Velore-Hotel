// controller/userGalleryController.js
import GalleryImage from "../models/image.js";

export const getImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
