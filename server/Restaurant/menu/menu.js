import Dish from "../../models/dish.js";

// GET all dishes
export const menu = async (req, res) => {
  try {
    const dishes = await Dish.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json(dishes);
  } catch (err) {
    console.error("Menu fetch error:", err);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
};

// POST create new dish
export const createDish = async (req, res) => {
  try {
    const { title, price, category, description } = req.body;

    if (!title || !price || !category) {
      return res
        .status(400)
        .json({ message: "Title, price and category are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = req.file.path.replace(/\\/g, "/");

    const newDish = await Dish.create({
      title: title.trim(),
      price: Math.round(Number(price)),
      category: category.trim(),
      description: description?.trim() || "",
      image,
    });

    const populatedDish = await Dish.findById(newDish._id).populate("category");

    res.status(201).json({ message: "Dish created", dish: populatedDish });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ error: "Failed to create dish" });
  }
};

// GET dish by ID
export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate("category");

    if (!dish) return res.status(404).json({ message: "Dish not found" });

    res.status(200).json(dish);
  } catch (err) {
    console.error("Get dish by ID error:", err);
    res.status(500).json({ error: "Failed to fetch dish" });
  }
};

// PUT update dish
export const updateDish = async (req, res) => {
  try {
    const { title, price, category, description } = req.body;

    const updatedFields = {};
    if (title) updatedFields.title = title.trim();
    if (price) updatedFields.price = Math.round(Number(price));
    if (category) updatedFields.category = category.trim();
    if (description) updatedFields.description = description.trim();
    if (req.file) updatedFields.image = req.file.path.replace(/\\/g, "/");

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    ).populate("category");

    if (!updatedDish)
      return res.status(404).json({ message: "Dish not found" });

    res.status(200).json({ message: "Dish updated", dish: updatedDish });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update dish" });
  }
};

// DELETE a dish
export const deleteDish = async (req, res) => {
  try {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);

    if (!deletedDish)
      return res.status(404).json({ message: "Dish not found" });

    res.status(200).json({ message: "Dish deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete dish" });
  }
};
