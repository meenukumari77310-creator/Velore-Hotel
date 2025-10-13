// Redux/CartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Hydrate cart from backend or localStorage
    setCart: (_, action) => {
      return Array.isArray(action.payload) ? action.payload : [];
    },

    // Add item to cart if not already present
    addToCart: (state, action) => {
      const item = action.payload;
      const exists = state.find(
        (i) => i._id === item._id || i.dishId === item.dishId
      );
      if (!exists) {
        state.push(item);
      }
    },

    // Remove item by _id or dishId
    removeFromCart: (state, action) => {
      return state.filter(
        (item) =>
          item._id !== action.payload && item.dishId !== action.payload
      );
    },

    // Clear all cart items
    clearCart: () => [],
  },
});

export const { setCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
