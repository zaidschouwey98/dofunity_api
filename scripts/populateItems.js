const axios = require('axios');
const { Item, Category, Characteristic, ItemCharacteristic } = require('../models');

async function fetchAndPopulate() {
    let skip = 0; 
    const limit = 50; 
    let hasMoreData = true; // Déclencheur de notre boucle
    let totalInserted = 0;

    console.log('Démarrage de la récupération des données...');

    while (hasMoreData) {
        try {
            console.log(`Fetching items with skip=${skip} and limit=${limit}...`);

            // 1. Récupération des données (Page par page)
            const response = await axios.get(`https://api.dofusdb.fr/items`, {
                params: {
                    $limit: limit,
                    $skip: skip,
                },
            });

            const items = response.data.data;

            // Si on ne reçoit plus rien, on arrête la boucle
            if (!items || items.length === 0) {
                hasMoreData = false;
                break;
            }

            // 2. Insertion immédiate en base de données pour cette page
            for (const item of items) {
                try {
                    // Chercher la catégorie dans la base
                    let category = await Category.findOne({ where: { id: item.type?.id } });
                    
                    // Sécurité : si la catégorie n'existe pas en base, on évite un crash sur category.id
                    let categoryId = category ? category.id : null; 

                    // Insérer l'item dans la base
                    await Item.findOrCreate({
                        where: { id: item.id },
                        defaults: {
                            id: item.id,
                            name: item.name?.fr || 'Unknown', 
                            lvl: item.level,
                            categoryId: categoryId, 
                        },
                    });

                    // Traitement des caractéristiques
                    if (item.effects && item.effects.length > 0) {
                        for (const effect of item.effects) {
                            const characteristicId = effect.characteristic;

                            if (characteristicId !== -1) {
                                const characteristic = await Characteristic.findOne({
                                    where: { id: characteristicId },
                                });

                                if (characteristic) {
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
                    totalInserted++;
                } catch (err) {
                    console.error(`Failed to insert item ID ${item.id}:`, err.message);
                }
            } // Fin de la boucle for des items

            // 3. Préparation pour la page suivante
            skip += limit;
            
            // Si on a reçu moins de 50 items, c'est qu'on a atteint la dernière page
            if (items.length < limit) {
                hasMoreData = false;
            }

        } catch (err) {
            console.error('Erreur lors de la requête API (fetch):', err.message);
            // Optionnel : on peut décider de mettre hasMoreData = false ici si l'API crashe
            hasMoreData = false; 
        }
    }

    console.log(`Terminé ! Total des items insérés : ${totalInserted}`);
    console.log(`Data from https://api.dofusdb.fr/items inserted successfully!`);
}

fetchAndPopulate();