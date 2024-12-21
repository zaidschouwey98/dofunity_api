const axios = require('axios');
const { Category, } = require('../models'); 

async function fetchAndPopulate() {
  try {
    // Liste des endpoints
    console.log(`Fetching data from categories...`);
    const categoriesResponse = await axios.get('https://api.dofusdb.fr/item-types?$skip=0&$limit=150&lang=fr');
    const categories = categoriesResponse.data.data;
    // Parcourir les données et insérer dans la base
    for (const category of categories) {
        console.log(category)
        await Category.update(
            { rootCategoryId: category.superTypeId },
            {
              where: {
                id: category.id,
              },
            },
          );
       
        // await Category.findOrCreate({
        //     where: { id: category.id },
        //     defaults: {
        //       id: category.id,
        //       name: category.name.fr,
        //       rootCategoryId: category.superTypeId
        //     },
        //   });
    }
    console.log(`Data from https://api.dofusdb.fr/item-types inserted successfully!`);
  } catch (err) {
    console.error('Error fetching or inserting data:', err.message);
  }
}

fetchAndPopulate();
