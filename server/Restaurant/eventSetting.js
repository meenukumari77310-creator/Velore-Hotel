import EventSettings from "../models/eventSetting.js";

// Add new event setting
export const addEventSetting = async (req, res) => {
  try {
    if (req.file) req.body.imageUrl = req.file.path;

    const existing = await EventSettings.findOne({ eventType: req.body.eventType });
    if (existing) return res.status(400).json({ message: `Event type "${req.body.eventType}" already exists` });

    const setting = new EventSettings(req.body);
    await setting.save();
    res.status(201).json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Creation failed" });
  }
};

// Get all event settings
export const getEventSettings = async (req, res) => {
  try {
    const settings = await EventSettings.find();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

// Update event setting
export const updateEventSetting = async (req, res) => {
  try {
    if (req.file) req.body.imageUrl = req.file.path;

    const updated = await EventSettings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete event setting
export const deleteEventSetting = async (req, res) => {
  try {
    const deleted = await EventSettings.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
