// src/utils/estimateNutrition.js

const convertToGrams = require('./unitConversion');

// Nutrition estimation based on food and its unit
function estimateNutrition(foodName, unit, quantity) {
  const foodData = nutritionSource.find(food => food.food_name === foodName);
  if (!foodData) {
    return { error: "Food not found" };
  }

  // Convert quantity to grams if necessary
  const grams = convertToGrams(unit, quantity);

  // Calculate nutrition per 100g
  const nutrition = {
    calories: (foodData.energy_kcal * grams) / 100,
    protein: (foodData.protein_g * grams) / 100,
    carbs: (foodData.carb_g * grams) / 100,
    fat: (foodData.fat_g * grams) / 100
  };

  return nutrition;
}

module.exports = estimateNutrition;
