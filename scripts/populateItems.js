const axios = require('axios');
const { Item,Category } = require('../models');

async function fetchAndPopulate() {
    const items = [];
    let skip = 0; // Début de la pagination
    const limit = 100; // Nombre d'items à récupérer par requête
    try {

        const maxSkip = 19900;
        for (skip = 0; skip < maxSkip; skip += 100) {
            console.log(`Fetching items with skip=${skip} and limit=${limit}...`);

            // Appel API avec pagination
            const response = await axios.get(`https://api.dofusdb.fr/items`, {
                params: {
                    $limit: limit,
                    $skip: skip,
                },
            });

            const data = response.data.data;

            // Ajouter les items récupérés à la liste complète
            items.push(...data);
        }

        console.log(`Total items fetched: ${items.length}`);
    } catch (err) {
        console.error('Error fetching items:', err.message);
    }
    for (const item of items) {
        try {
            // Chercher la catégorie dans la base
            let category = await Category.findOne({ where: { id: item.type?.id } });

            // Utiliser une catégorie par défaut si la catégorie est inexistante
            if (category == null) {
                category = { id: 54 }; // ID de la catégorie par défaut
            }

            // Insérer l'item dans la base
            await Item.findOrCreate({
                where: { id: item.id },
                defaults: {
                    id: item.id,
                    name: item.name?.fr || 'Unknown', // Utiliser un nom par défaut si absent
                    lvl: item.level,
                    categoryId: category.id, // Associer l'item à la catégorie
                },
            });

            console.log(`Inserted item: ${item.name?.fr}`);
        } catch (err) {
            console.error(`Failed to insert item ID ${item.id}:`, err.message);
        }
    }
    console.log(`Data from https://api.dofusdb.fr/items inserted successfully!`);
}

fetchAndPopulate();
