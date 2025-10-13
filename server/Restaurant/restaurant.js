import Restaurant from "../models/Restaurant.js";

// POST: Add new restaurant settings (only if none exist)
export const addRestaurantDetails = async (req, res) => {
  const { name, address, phone, email, hours } = req.body;

  try {
    // Prevent adding multiple settings docs
    const existing = await Restaurant.findOne();
    if (existing) {
      return res.status(400).json({ message: "Settings already exist. Please update instead." });
    }

    const newInfo = new Restaurant({ name, address, phone, email, hours });
    await newInfo.save();

    res.status(201).json({ message: "Restaurant settings added", data: newInfo });
  } catch (err) {
    res.status(500).json({ message: "Failed to add settings" });
  }
};

// GET: Fetch restaurant settings
export const getRestaurantDetails = async (req, res) => {
  try {
    let info = await Restaurant.findOne();
    if (!info) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
};

// PUT: Update restaurant settings
export const updateRestaurantDetails = async (req, res) => {
  const { name, address, phone, email, hours } = req.body;

  try {
    let info = await Restaurant.findOne();

    if (!info) {
      return res.status(404).json({ message: "No settings to update" });
    }

    info.name = name;
    info.address = address;
    info.phone = phone;
    info.email = email;
    info.hours = hours;

    await info.save();

    res.json({ message: "Restaurant info updated", data: info });
  } catch (err) {
    res.status(500).json({ message: "Failed to update info" });
  }
};
