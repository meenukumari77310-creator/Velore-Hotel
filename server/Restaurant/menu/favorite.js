// routes/favoriteRoutes
import Favorite from "../../models/Favorite.js";
import Dish from "../../models/dish.js";

// ✅ Add to favorites
export const addFavorite = async (req, res) => {
  try {
    const { dishId } = req.body;
    const userId = req.user._id;

    const existing = await Favorite.findOne({ user: userId, dishId });
    if (existing) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    const dish = await Dish.findById(dishId).populate("category");
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    const favorite = await Favorite.create({
      user: userId,
      dishId: dish._id,
      dishTitle: dish.title,
      dishImage: dish.image,
      dishPrice: dish.price,
      dishCategory: dish.category?._id, // store category reference
    });

    res.status(201).json(favorite);
  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({ message: "Failed to add to favorites" });
  }
};

// ✅ Get all favorites (with populated category)
export const getFavorite = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate(
      "dishCategory"
    );
    res.json(favorites);
  } catch (err) {
    console.error("Get favorite error:", err);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

// ✅ Remove a favorite item
export const deleteFavorite = async (req, res) => {
  try {
    const { dishId } = req.params;
    const userId = req.user._id;

    const deleted = await Favorite.findOneAndDelete({ user: userId, dishId });
    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error("Delete favorite error:", err);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

// ✅ Clear all favorites for a user
export const clearFavorite = async (req, res) => {
  try {
    await Favorite.deleteMany({ user: req.user._id });
    res.json({ message: "All favorites cleared" });
  } catch (err) {
    console.error("Clear favorite error:", err);
    res.status(500).json({ message: "Failed to clear favorites" });
  }
};
