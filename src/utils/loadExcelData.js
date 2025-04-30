const XLSX = require('xlsx');
const path = require('path');

function loadExcelData() {
  const filePath = './data/nutrition_db.xlsx'; 


  try {
    const workbook = XLSX.readFile(filePath);

    const nutritionSource = XLSX.utils.sheet_to_json(workbook.Sheets['Nutrition source'] || []);
    const unitOfMeasurements = XLSX.utils.sheet_to_json(workbook.Sheets['Unit of measurements'] || []);
    const foodCategories = XLSX.utils.sheet_to_json(workbook.Sheets['Food categories'] || []);

    return {
      nutritionSource,
      unitOfMeasurements,
      foodCategories
    };
  } catch (error) {
    console.error('Error loading Excel data:', error.message);
    return {
      nutritionSource: [],
      unitOfMeasurements: [],
      foodCategories: []
    };
  }
}

module.exports = loadExcelData;
