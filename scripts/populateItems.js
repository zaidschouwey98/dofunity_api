const axios = require('axios');
const { Item, Category, Characteristic, ItemCharacteristic } = require('../models');

async function fetchAndPopulate() {
    const items = [];
    let skip = 0; // Début de la pagination
    const limit = 50; // Nombre d'items à récupérer par requête
    try {

        let maxSkip = 19850;
        
        for (skip = 0; skip <= maxSkip; skip += 50) {
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

            // Traitement des caractéristiques
            if (item.effects && item.effects.length > 0) {
                for (const effect of item.effects) {
                    const characteristicId = effect.characteristic;

                    // Vérifier si la characteristic existe
                    if (characteristicId !== -1) {
                        const characteristic = await Characteristic.findOne({
                            where: { id: characteristicId },
                        });

                        if (characteristic) {
                            // Créer le lien dans ItemCharacteristics
                            await ItemCharacteristic.findOrCreate({
                                where: {
                                    itemId: item.id,
                                    characteristicId: characteristic.id,
                                    from: effect.from,
                                    to: effect.to,
                                },
                                defaults: {
                                    itemId: item.id,
                                    characteristicId: characteristic.id,
                                    from: effect.from,
                                    to: effect.to,
                                },
                            });
                        }
                    }
                }
            }

            console.log(`Inserted item: ${item.name?.fr}`);
        } catch (err) {
            console.error(`Failed to insert item ID ${item.id}:`, err.message);
        }
    }
    console.log(`Data from https://api.dofusdb.fr/items inserted successfully!`);
}

fetchAndPopulate();
