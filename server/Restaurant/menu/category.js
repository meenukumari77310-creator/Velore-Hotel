import Category from "../../models/Category.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// CREATE a new category
export const createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(409).json({ message: "Category already exists" });

    const category = await Category.create({
      name: name.trim(),
      icon: icon?.trim() || "",
      description: description?.trim() || "",
    });

    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

// GET category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// UPDATE category
export const updateCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name.trim();
    if (icon) updatedFields.icon = icon.trim();
    if (description) updatedFields.description = description.trim();

    const updated = await Category.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category updated", category: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

// DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
