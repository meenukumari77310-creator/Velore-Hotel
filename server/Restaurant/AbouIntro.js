// controllers/aboutIntroController.js
import AboutIntro from "../models/AboutIntro.js"

// Get
export const getIntro = async (req, res) => {
  try {
    const intro = await AboutIntro.findOne();
    res.json(intro);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch intro" });
  }
};

// Add or Update (PUT used for both simplicity)
export const updateIntro = async (req, res) => {
  try {
    const { header, subHeader } = req.body;
    const imageUrl = req.file?.path;

    const existing = await AboutIntro.findOne();

    const dataToSave = {
      header,
      subHeader,
      ...(imageUrl && { imageUrl }),
    };

    if (existing) {
      const updated = await AboutIntro.findByIdAndUpdate(
        existing._id,
        dataToSave,
        { new: true }
      );
      return res.json(updated);
    }

    const created = await AboutIntro.create(dataToSave);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error saving intro section:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

