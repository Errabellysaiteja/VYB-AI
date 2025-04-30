Estimate nutritional value per standard serving for Indian home-cooked dishes using a lightweight AI-inspired pipeline.
This tool takes a dish name (e.g., "Paneer Butter Masala") and estimates its nutritional value per standard serving.
It uses:

1.A Nutrition Source database (based on IFCT-2017)
2.A Household Measurement Converter
3.Simple string matching and logic to map, estimate, and return results

Modular Pipeline:
1.Input Dish Name
Prompts the user to enter a dish name via CLI.

2.Ingredient Mapping
Returns a list of key ingredients and approximate quantities.

3.Nutrition Mapping
Fetches per-100g nutrition info from the provided Excel dataset.

4.Weight Estimation
Uses dish category (e.g., Wet Sabzi, Non-Veg Curry) to estimate serving size (e.g., 180g).

5.Final Calculation
Performs sum-product of quantity × per-100g values to compute calories, protein, fat, carbs.

6.Graceful Error Handling
Deals with missing items, unclassified dishes, and conversion gaps via safe fallbacks and logs.

Assumptions Made
Standard serving: 1 200ml katori is used
1 katori = ~6.67 tbsp

{
"estimated_nutrition_per_200ml_katori": {
"calories": 298.2,
"protein": 15.84,
"carbs": 7.2,
"fat": 24.12
},
"dish_type": "wet sabzi",
"ingredients_used": [
{ "ingredient": "Paneer", "quantity": "1 cup" },
{ "ingredient": "Butter", "quantity": "2 tbsp" },
{ "ingredient": "Cream", "quantity": "1 tbsp" },
{ "ingredient": "Tomato", "quantity": "1/2 cup" },
{ "ingredient": "Onion", "quantity": "1/4 cup" }
]
}

How to Run
1.Install Dependencies

npm install
2.Run the CLI Program

node src/app.js

Edge Case Handling

Edge Case Strategy
Dish not found in DB- Returns { error: "Dish not found!" }
Ingredient not found-Ingredient not foound in nutritiondatabase
No dish category match Defaults to "Other"
Quantity conversion issues Falls back to 100g per ingredient if needed

Features Implemented
Dish → Category classification
Ingredient estimation per dish
Household measurement → gram conversion
Nutrition per 100g mapping
Final nutrition estimation per 200ml serving
Readable CLI output (JSON)
Graceful fallback handling

Technologies Used
Node.js (JavaScript)

xlsx npm package (for Excel parsing)

Improvements for Future
Fuzzy search and ingredient spell correction
Auto-fetch recipes using OpenAI or a real API
