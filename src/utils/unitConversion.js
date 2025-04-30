const unitConversions = {
    "katori": 150, // in grams (converted to lowercase)
    "piece": 50, // for example, a flatbread
    "tbsp": 15, // tablespoon to grams
    "cup": 250, // cup to grams (for liquids)
    "teaspoon": 5, // teaspoon to grams
};

// Function to convert the quantity to grams
function convertToGrams(unit, quantity) {
  unit = unit.toLowerCase(); // Convert unit to lowercase for case-insensitivity
  if (unitConversions[unit]) {
    return quantity * unitConversions[unit];
  }
  return null; // If unit is not recognized
}

// Function to return category weight in grams based on Food Categories
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
    'Sweets': 120,
    // Add more categories as needed
  };

  return categoryData[category] || 100; // Default to 100g if category is not found
}

module.exports = { convertToGrams, getCategoryWeight };
