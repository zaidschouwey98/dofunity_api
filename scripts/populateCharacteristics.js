const axios = require('axios');
const { Characteristic } = require('../models');

async function fetchAndPopulate() {
    const characteristics = [];
    let skip = 0; // Début de la pagination
    const limit = 50; // Nombre d'items à récupérer par requête
    try {

        const maxSkip = 100;
        for (skip = 0; skip <= maxSkip; skip += 50) {
            console.log(`Fetching characteristics with skip=${skip} and limit=${limit}...`);

            // Appel API avec pagination
            const response = await axios.get(`https://api.dofusdb.fr/characteristics`, {
                params: {
                    $limit: limit,
                    $skip: skip,
                },
            });

            const data = response.data.data;

            // Ajouter les items récupérés à la liste complète
            characteristics.push(...data);
        }

        console.log(`Total items fetched: ${characteristics.length}`);
    } catch (err) {
        console.error('Error fetching items:', err.message);
    }
    for (const characteristic of characteristics) {
        try {

            await Characteristic.findOrCreate({
                where: { id: characteristic.id },
                defaults: {
                    id:characteristic.id,
                    order:characteristic.order,
                    scaleFormulaId:characteristic.scaleFormulaId,
                    upgradable:characteristic.upgradable,
                    name:characteristic.name.fr
                },
            });



            console.log(`Inserted characteristic: ${characteristic.name?.fr}`);
        } catch (err) {
            console.error(`Failed to insert characteristic ID ${characteristic.id}:`, err.message);
        }
    }
    console.log(`Data from https://api.dofusdb.fr/characteristics inserted successfully!`);
}

fetchAndPopulate();
