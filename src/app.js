const express = require('express');
const app = express();
const nutritionRoutes = require('./routes/nutrition');

const PORT = process.env.PORT || 3000;

app.use('/nutrition', nutritionRoutes);

app.get('/', (req, res) => {
  res.send("Nutrition Estimator API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
