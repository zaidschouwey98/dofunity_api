const axios = require('axios');
const { Category, RootCategory } = require('../models'); 

async function fetchAndPopulate() {
  try {
    // Liste des endpoints
    console.log(`Fetching data from categories...`);
    // Étape 1 : Récupérer et insérer les root categories
    const allRootCategories = new Set(); // Pour stocker les `superTypeId`
    for (let skip = 0; skip <= 200; skip += 50) {
      const categoriesResponse = await axios.get(`https://api.dofusdb.fr/item-types?$skip=${skip}&$limit=150&lang=fr`);
      const categories = categoriesResponse.data.data;

      // Extraire les `superTypeId`
      categories.forEach((category) => {
        if (category.superTypeId) {
          allRootCategories.add(category.superTypeId);
        }
      });
    }

    // Insérer les root categories dans la base de données
    for (const rootCategoryId of allRootCategories) {
      await RootCategory.findOrCreate({
        where: { id: rootCategoryId },
        defaults: {
          id: rootCategoryId,
          name: `RootCategory ${rootCategoryId}`, // Nom par défaut si l'API ne le fournit pas
        },
      });
    }
    console.log(`Root categories inserted successfully!`);

    // Étape 2 : Récupérer et insérer les catégories
    for (let skip = 0; skip <= 200; skip += 50) {
      const categoriesResponse = await axios.get(`https://api.dofusdb.fr/item-types?$skip=${skip}&$limit=150&lang=fr`);
      const categories = categoriesResponse.data.data;

      for (const category of categories) {
        await Category.findOrCreate({
          where: { id: category.id },
          defaults: {
            id: category.id,
            name: category.name.fr,
            rootCategoryId: category.superTypeId || null, // Associer à une root category ou NULL
          },
        });
      }
    }
    console.log(`Categories inserted successfully!`);
  } catch (err) {
    console.error('Error fetching or inserting data:', err.message);
  }
}

fetchAndPopulate();
