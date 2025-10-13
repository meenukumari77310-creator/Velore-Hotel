// controller/adminGalleryController.js
import GalleryImage from "../models/image.js";
import { cloudinary } from "../config/Cloudinary.js"

export const addImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image provided" });

    const newImage = new GalleryImage({
      url: file.path,
      public_id: file.filename,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const getImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    const updated = await GalleryImage.findByIdAndUpdate(id, { url }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update image" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    await cloudinary.uploader.destroy(image.public_id);
    await GalleryImage.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image" });
  }
};
