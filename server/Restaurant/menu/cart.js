import mongoose from "mongoose";
import Dish from "../../models/dish.js";
import Cart from "../../models/cart.js";

// ✅ Add to Cart
export const addCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { dishId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(dishId)) {
      return res.status(400).json({ message: "Invalid dish ID" });
    }

    const dish = await Dish.findById(dishId);
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    const cartItem = {
      dishId: dish._id,
      title: dish.title,
      image: dish.image,
      category: dish.category, // now ObjectId reference to Category
      price: dish.price,
    };

    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({ userId, items: [cartItem] });
    } else {
      const exists = userCart.items.some((item) => item.dishId.equals(dish._id));
      if (exists) {
        return res.status(200).json({ message: "Dish already in cart" });
      }
      userCart.items.push(cartItem);
    }

    await userCart.save();
    await userCart.populate("items.category"); // populate category details

    res.status(200).json({ message: "Dish added to cart", cart: userCart.items });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Server error while adding to cart" });
  }
};

// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("items.category");
    if (!cart) return res.status(200).json({ cart: [] });

    res.status(200).json({ cart: cart.items });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Failed to get cart" });
  }
};

// ✅ Remove Specific Dish
export const deleteCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { dishId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dishId)) {
      return res.status(400).json({ message: "Invalid dish ID" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => !item.dishId.equals(new mongoose.Types.ObjectId(dishId))
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: "Dish not found in cart" });
    }

    await cart.save();
    await cart.populate("items.category");

    res.status(200).json({ message: "Dish removed from cart", cart: cart.items });
  } catch (err) {
    console.error("Remove dish error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};

// ✅ Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart: [] });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
