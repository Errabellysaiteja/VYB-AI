// src/utils/estimateNutrition.js

const convertToGrams = require('./unitConversion');
const loadExcelData = require('./loadExcelData');
const { nutritionSource } = loadExcelData();  // ✅ Import the data correctly

// Nutrition estimation based on food and its unit
function estimateNutrition(foodName, unit, quantity) {
  const foodData = nutritionSource.find(food => food.food_name.toLowerCase() === foodName.toLowerCase());
  if (!foodData) {
    return { error: "Food not found" };
  }

  // Convert quantity to grams if necessary
  const grams = convertToGrams(unit, quantity);
  if (!grams) {
    return { error: "Invalid unit or quantity" };
  }

  // Calculate nutrition per 100g
  const nutrition = {
    calories: parseFloat(((foodData.energy_kcal * grams) / 100).toFixed(2)),
    protein: parseFloat(((foodData.protein_g * grams) / 100).toFixed(2)),
    carbs: parseFloat(((foodData.carb_g * grams) / 100).toFixed(2)),
    fat: parseFloat(((foodData.fat_g * grams) / 100).toFixed(2))
  };

  return nutrition;
}

module.exports = estimateNutrition;
