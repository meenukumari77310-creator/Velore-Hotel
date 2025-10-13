// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";
import favoriteReducer from "./FavoriteSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorite: favoriteReducer,
  },
});
