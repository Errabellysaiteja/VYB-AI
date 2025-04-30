// src/utils/loadExcelData.js

const XLSX = require('xlsx');

function loadExcelData() {
  // Load the Excel file
  // src/utils/loadExcelData.js

  const filePath = './data/nutrition_db.xlsx'; // Adjust path based on where the file is located
  const workbook = XLSX.readFile(filePath);

  // Extract the sheets
  const nutritionSource = XLSX.utils.sheet_to_json(workbook.Sheets['Nutrition source']);
  const unitOfMeasurements = XLSX.utils.sheet_to_json(workbook.Sheets['Unit of measurements']);
  const foodCategories = XLSX.utils.sheet_to_json(workbook.Sheets['Food categories']);

  return {
    nutritionSource,
    unitOfMeasurements,
    foodCategories
  };
}

module.exports = loadExcelData;
