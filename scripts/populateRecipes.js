const axios = require('axios');
const { Recipe, ItemRecipe } = require('../models');

async function fetchAndPopulate() {
    const recipes = [];
    let skip = 0; // Début de la pagination
    const limit = 50; // Nombre d'items à récupérer par requête
    try {

        let maxSkip = 4450;
        for (skip = 0; skip <= maxSkip; skip += 50) {
            console.log(`Fetching items with skip=${skip} and limit=${limit}...`);

            // Appel API avec pagination
            const response = await axios.get(`https://api.dofusdb.fr/recipes`, {
                params: {
                    $limit: limit,
                    $skip: skip,
                },
            });

            const data = response.data.data;

            // Ajouter les items récupérés à la liste complète
            recipes.push(...data);
        }

        console.log(`Total recipes fetched: ${recipes.length}`);
    } catch (err) {
        console.error('Error fetching recipe:', err.message);
    }
    for (const response_recipe of recipes) {
        try {
            const [recipe] = await Recipe.findOrCreate({
                where: { resultId: response_recipe.resultId }, 
                defaults: {
                    resultId: response_recipe.resultId,
                },
            });
            console.log(recipe)
            for (let i = 0; i < response_recipe.ingredientIds.length; ++i) {
                await ItemRecipe.findOrCreate({
                    where: { recipeId: recipe.id, itemId: response_recipe.ingredientIds[i] }, // Inclure itemId dans la contrainte
                    defaults: {
                        recipeId: recipe.id,
                        itemId: response_recipe.ingredientIds[i],
                        quantity: response_recipe.quantities[i],
                    },
                });
            }
            console.log(`Inserted recipe`);
        } catch (err) {
            console.error(`Failed to insert recipe:`, err.message);
        }
    }
    console.log(`Data from https://api.dofusdb.fr/recipe inserted successfully!`);
}

fetchAndPopulate();
