import GeneralEventInfo from "../models/generalEventInfo.js";

// Get all general info sections
export const getAllGeneralInfo = async (req, res) => {
  try {
    const info = await GeneralEventInfo.find().sort({ createdAt: -1 });
    res.json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch general info" });
  }
};

// Add new general info section
export const addGeneralInfo = async (req, res) => {
  try {
    if (req.file) req.body.imageUrl = req.file.path;

    const info = new GeneralEventInfo({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl || "",
    });
    await info.save();
    res.status(201).json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Creation failed" });
  }
};


// Update a section
export const updateGeneralInfo = async (req, res) => {
  try {
    if (req.file) req.body.imageUrl = req.file.path;

    const updated = await GeneralEventInfo.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    }, { new: true, runValidators: true });

    if (!updated) return res.status(404).json({ message: "Section not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete a section
export const deleteGeneralInfo = async (req, res) => {
  try {
    const deleted = await GeneralEventInfo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Section not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
