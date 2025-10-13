// src/utils/categoryUtils.js

export const categoryMeta = {
  appetizers: { icon: "🥟", label: "Appetizers" },
  "main course": { icon: "🍛", label: "Main Course" },
  desserts: { icon: "🍰", label: "Desserts" },
  beverages: { icon: "🥤", label: "Beverages" },
  vegan: { icon: "🥦", label: "Vegan" },
  "kids menu": { icon: "🧒", label: "Kids Menu" },
};

export const getCategoryIcon = (category) =>
  categoryMeta[category?.toLowerCase()]?.icon || "🍽️";

export const getCategoryLabel = (category) =>
  categoryMeta[category?.toLowerCase()]?.label || capitalize(category);

const capitalize = (str) =>
  str?.charAt(0).toUpperCase() + str?.slice(1);
