const express = require('express');
const categoryRoutes = require('./routes/categories');
const rootCategoryRoutes = require('./routes/rootcategories');
const recipeRoutes = require('./routes/recipes');
const itemRecipeRoutes = require('./routes/itemrecipes');
const averageRoutes = require('./routes/itemsaverageprice');
const itemRoutes = require('./routes/items');
const cors = require('cors');
const exactPriceRoutes = require('./routes/exactprices');

const app = express();

app.use(cors({
    origin: 'http://localhost:3333',
  }));

// serve static assets normally
app.use(express.static('www'))

app.use('/items', itemRoutes);
app.use('/categories', categoryRoutes);
app.use('/rootcategories', rootCategoryRoutes);
app.use('/recipes', recipeRoutes);
app.use('/itemrecipes', itemRecipeRoutes);
app.use('/itemsaverageprice', averageRoutes);
app.use('/exactprices', exactPriceRoutes);



const PORT = 2989;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));