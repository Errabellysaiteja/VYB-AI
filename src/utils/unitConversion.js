// src/utils/unitConversion.js

const unitConversions = {
  "katori": 150,        // grams
  "piece": 50,          // e.g., flatbread
  "tbsp": 15,           // tablespoon
  "cup": 250,           // cup (liquid)
  "teaspoon": 5         // teaspoon
};

// Convert a unit and quantity into grams
function convertToGrams(unit, quantity) {
  unit = unit.toLowerCase().trim();
  return unitConversions[unit] ? quantity * unitConversions[unit] : null;
}

// Estimate weight in grams based on category
function getCategoryWeight(category) {
  const categoryData = {
    'Veg Gravy': 150,
    'Veg Fry': 100,
    'Non-Veg Gravy': 150,
    'Non-Veg Fry': 100,
    'Dals': 150,
    'Wet Breakfast Item': 130,
    'Dry Breakfast Item': 100,
    'Snacks': 100,
    'Sweets': 120
  };

  return categoryData[category] || 100; // Default to 100g
}

module.exports = {
  convertToGrams,
  getCategoryWeight
};
