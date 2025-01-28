const express = require('express');
const categoryRoutes = require('./routes/categories');
const rootCategoryRoutes = require('./routes/rootcategories');
const recipeRoutes = require('./routes/recipes');
const itemRecipeRoutes = require('./routes/itemrecipes');
const averageRoutes = require('./routes/itemsaverageprice');
const itemRoutes = require('./routes/items');
const cors = require('cors');
const exactPriceRoutes = require('./routes/exactprices');
const path = require('path');
const staticPath = path.join(__dirname, 'www');

const app = express();

app.use(express.json());

app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/rootcategories', rootCategoryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/itemrecipes', itemRecipeRoutes);
app.use('/api/itemsaverageprice', averageRoutes);
app.use('/api/exactprices', exactPriceRoutes);

// Servir les fichiers statiques ensuite
app.use(express.static(staticPath));

// Rediriger toutes les autres requêtes vers index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = 2989;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));