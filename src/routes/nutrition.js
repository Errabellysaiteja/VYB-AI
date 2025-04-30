// routes/nutrition.js

const express = require('express');
const router = express.Router();
const loadExcelData = require('../utils/loadExcelData');
const { getCategoryWeight } = require('../utils/unitConversion');

const data = loadExcelData();

// Main nutrition estimation route
router.get('/', (req, res) => {
  const { dish } = req.query;

  if (!dish) {
    return res.status(400).json({ error: 'Dish name is required as a query parameter (e.g., /nutrition?dish=paneer butter masala)' });
  }

  const result = estimateNutrition(dish);
  res.json(result);
});

// Core logic reused from CLI version
function estimateNutrition(dishName) {
    // Clean up the input dish name and split it into keywords (by spaces)
    const cleanedDishName = dishName.trim().toLowerCase();
    const dishKeywords = cleanedDishName.split(' ');
  
    // Log the input dish name for debugging
    console.log("Input dish name:", dishName);
    
    // Try to find the dish in the nutrition source data with improved keyword matching
    let dishData = null;
  
    // Loop through each dish and check if it contains any of the keywords
    for (let item of data.nutritionSource) {
      const foodName = item.food_name.toLowerCase();
  
      // Check if any keyword is present in the food name
      const isMatch = dishKeywords.some(keyword => foodName.includes(keyword));
  
      // If a match is found, set the dish data and exit the loop
      if (isMatch) {
        dishData = item;
        break; // Exit the loop after the first match is found
      }
    }
  
    // If no dish is found, return an error message with more details
    if (!dishData) {
      return { error: `Dish "${dishName}" not found. Please check the spelling or try another name.` };
    }
  
    // Get dish category and its corresponding weight in grams
    const dishCategory = getDishCategory(dishName);
    const categoryWeight = getCategoryWeight(dishCategory);
  
    // Calculate nutrition based on category weight (e.g., 200ml katori)
    const nutrition = calculateNutrition(dishData, categoryWeight);
  
    // Return the estimated nutrition details, category, and ingredients used
    return {
      estimated_nutrition_per_200ml_katori: nutrition,
      dish_type: dishCategory,
      ingredients_used: getIngredientsList(dishName)
    };
  }
    

function calculateNutrition(dishData, weight) {
  const multiplier = weight / 100;
  return {
    calories: parseFloat((dishData.energy_kcal * multiplier).toFixed(2)),
    protein: parseFloat((dishData.protein_g * multiplier).toFixed(2)),
    carbs: parseFloat((dishData.carb_g * multiplier).toFixed(2)),
    fat: parseFloat((dishData.fat_g * multiplier).toFixed(2))
  };
}

function getDishCategory(dishName) {
  const name = dishName.toLowerCase();

  const knownDishes = {
    "paneer butter masala": "Wet Sabzi",
    "dal tadka": "Dals",
    "aloo fry": "Veg Fry",
    "upma": "Wet Breakfast Item",
    "samosa": "Snacks",
    "paneer": "Wet Sabzi",
    "gulab jamun": "Sweets",
    "chicken curry": "Non-Veg Gravy",
    "fried chicken": "Non-Veg Fry",
    "chicken": "Non-Veg Gravy"
  };

  for (let key in knownDishes) {
    if (name.includes(key)) {
      return knownDishes[key];
    }
  }

  const keywordMappings = [
    { keyword: /chicken/, category: "Non-Veg Gravy" },
    { keyword: /gravy/, category: "Non-Veg Gravy" },
    { keyword: /fry/, category: "Non-Veg Fry" },
    { keyword: /dal/, category: "Dals" },
    { keyword: /veg/, category: "Veg Gravy" },
    { keyword: /sabzi/, category: "Veg Gravy" },
    { keyword: /sweets/, category: "Sweets" },
    { keyword: /breakfast/, category: "Wet Breakfast Item" },
    { keyword: /snack/, category: "Snacks" }
  ];

  for (let mapping of keywordMappings) {
    if (mapping.keyword.test(name)) {
      return mapping.category;
    }
  }

  return "Other";
}

function getIngredientsList(dishName) {
  const dish = dishName.toLowerCase();
  const keywords = dish.split(" ").filter(w => w.length > 2);
  const quantityOptions = ["1 cup", "1/2 cup", "1 tbsp", "2 tbsp", "100g", "50g"];

  const allIngredients = data.nutritionSource.map(item => item.food_name);

  let matchedIngredients = allIngredients.filter(ing =>
    keywords.some(word => ing.toLowerCase().includes(word))
  );

  if (matchedIngredients.length === 0) {
    return ["Ingredient not found in Nutrition Database"];
  }

  if (matchedIngredients.length < 4) {
    const shuffled = allIngredients.sort(() => 0.5 - Math.random());
    matchedIngredients = [...new Set([...matchedIngredients, ...shuffled])];
  }

  const used = new Set();
  const finalIngredients = [];

  for (let ing of matchedIngredients) {
    if (!used.has(ing.toLowerCase()) && finalIngredients.length < 5) {
      used.add(ing.toLowerCase());
      finalIngredients.push({
        ingredient: ing,
        quantity: quantityOptions[Math.floor(Math.random() * quantityOptions.length)]
      });
    }
  }

  return finalIngredients;
}

module.exports = router;
