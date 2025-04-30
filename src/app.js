// src/app.js

const readline = require('readline');
const loadExcelData = require('./utils/loadExcelData');
const { getCategoryWeight } = require('./utils/unitConversion'); // Removed convertToGrams (not used)
const data = loadExcelData();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter a dish name : ", (dishName) => {
  const result = estimateNutrition(dishName);
  console.log(JSON.stringify(result, null, 2)); // Pretty-print JSON
  rl.close();
});

function estimateNutrition(dishName) {
  // Step 1: Find the nutrition data for the dish
  const dishData = data.nutritionSource.find(item =>
    item.food_name.toLowerCase().includes(dishName.toLowerCase())
  );

  if (!dishData) {
    return { error: "Dish not found!" };
  }

  // Step 2: Identify the dish category (e.g., Veg Gravy, Veg Fry)
  const dishCategory = getDishCategory(dishName);

  // Step 3: Convert category to estimated 200ml katori weight (grams)
  const categoryWeight = getCategoryWeight(dishCategory); // e.g., 200g for Wet Sabzi

  // Step 4: Calculate nutrition per 200ml katori
  const nutrition = calculateNutrition(dishData, categoryWeight);

  // Step 5: Return the output
  return {
    estimated_nutrition_per_200ml_katori: nutrition,
    dish_type: dishCategory,
    ingredients_used: getIngredientsList(dishName)
  };
}

function calculateNutrition(dishData, weight) {
  const multiplier = weight / 100; // Assuming base values are per 100g
  return {
    calories: parseFloat((dishData.energy_kcal * multiplier).toFixed(2)),
    protein: parseFloat((dishData.protein_g * multiplier).toFixed(2)),
    carbs: parseFloat((dishData.carb_g * multiplier).toFixed(2)),
    fat: parseFloat((dishData.fat_g * multiplier).toFixed(2))
  };
}

function getDishCategory(dishName) {
  const name = dishName.toLowerCase();

  // Specific dish mappings for better precision
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
    "chicken": "Non-Veg Gravy"  // Catch-all for chicken-related dishes
  };

  // Check if the dish name matches any known dish
  for (let key in knownDishes) {
    if (name.includes(key)) {
      return knownDishes[key];
    }
  }

  // Regular expression checks for keywords (case-insensitive)
  const keywordMappings = [
    { keyword: /chicken/, category: "Non-Veg Gravy" },  // Match "chicken" as Non-Veg Gravy
    { keyword: /gravy/, category: "Non-Veg Gravy" },    // Match "gravy" as Non-Veg Gravy
    { keyword: /fry/, category: "Non-Veg Fry" },        // Match "fry" as Non-Veg Fry
    { keyword: /dal/, category: "Dals" },               // Match "dal" as Dals
    { keyword: /veg/, category: "Veg Gravy" },          // Match "veg" as Veg Gravy
    { keyword: /sabzi/, category: "Veg Gravy" },        // Match "sabzi" as Veg Gravy
    { keyword: /sweets/, category: "Sweets" },          // Match "sweets" as Sweets
    { keyword: /breakfast/, category: "Wet Breakfast Item" }, // Match breakfast dishes
    { keyword: /snack/, category: "Snacks" }            // Match snack-related dishes
  ];

  // Iterate through keyword mappings and return the matched category
  for (let mapping of keywordMappings) {
    if (mapping.keyword.test(name)) {
      return mapping.category;
    }
  }

  // Default category if no match is found
  return "Other";
}


  
  function getIngredientsList(dishName) {
    const dish = dishName.toLowerCase();
    const keywords = dish.split(" ").filter(w => w.length > 2); // ignore short words
    const quantityOptions = ["1 cup", "1/2 cup", "1 tbsp", "2 tbsp", "100g", "50g"];
  
    // Extract all ingredients from nutrition source
    const allIngredients = data.nutritionSource.map(item => item.food_name);
  
    // Filter ingredients that match any keyword from the dish name
    let matchedIngredients = allIngredients.filter(ing =>
      keywords.some(word => ing.toLowerCase().includes(word))
    );
  
    // If no matches, return fallback
    if (matchedIngredients.length === 0) {
      return ["Ingredient not found in Nutrition Database"];
    }
  
    // If not enough matches, supplement with random
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