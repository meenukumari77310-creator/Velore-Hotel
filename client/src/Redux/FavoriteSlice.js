import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: [],
  reducers: {
    setFavorite: (_, action) => action.payload,
    addToFavorite: (state, action) => {
      const item = action.payload;
      const exists = state.find((i) => i._id === item._id);
      if (!exists) state.push(item);
    },
    removeFromFavorite: (state, action) =>
      state.filter((item) => item._id !== action.payload),
    clearFavorite: () => [],
  },
});

export const {
  setFavorite,
  addToFavorite,
  removeFromFavorite,
  clearFavorite,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
