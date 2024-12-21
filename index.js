const express = require('express');
const categoryRoutes = require('./routes/categories');
const recipeRoutes = require('./routes/recipes');
const itemRecipeRoutes = require('./routes/itemrecipes');
const averageRoutes = require('./routes/itemsaverageprice');
const itemRoutes = require('./routes/items');

const app = express();
app.use(express.json());
app.use('/items', itemRoutes);
app.use('/categories', categoryRoutes);
app.use('/recipes', recipeRoutes);
app.use('/itemrecipes', itemRecipeRoutes);
app.use('/itemsaverageprice', averageRoutes);
const PORT = 2989;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));