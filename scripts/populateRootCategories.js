const axios = require('axios');
const { RootCategory, Item, Recipe } = require('../models'); 

async function fetchAndPopulate() {
  try {
    // Liste des endpoints

    console.log(`Fetching data from rootcategories...`);
    const categoriesResponse = await axios.get('https://api.dofusdb.fr/item-super-types?$skip=0&$limit=100');
    const categories = categoriesResponse.data.data;
    // Parcourir les données et insérer dans la base
    for (const category of categories) {
        await RootCategory.findOrCreate({
            where: { id: category.id },
            defaults: {
              id: category.id,
              name: category.name.fr,
            
            },
          });
    }
    console.log(`Data from https://api.dofusdb.fr/item-super-types inserted successfully!`);
  } catch (err) {
    console.error('Error fetching or inserting data:', err.message);
  }
}

fetchAndPopulate();
