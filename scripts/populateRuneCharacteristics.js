const axios = require('axios');
const { Item, Characteristic, CharacteristicRune } = require('../models');

async function fetchAndPopulate() {
  const items = [];
  const limit = 50;
  let maxSkip = 19850;
  try {
    // Pagination pour récupérer tous les items
    for (let skip = 0; skip <= maxSkip; skip += limit) {
      console.log(`Fetching items with skip=${skip} and limit=${limit}...`);

      const response = await axios.get(`https://api.dofusdb.fr/items/`, {
        params: {
          $limit: limit,
          $skip: skip,
        },
      });

      const data = response.data.data;
      items.push(...data);
    }

    console.log(`Total items fetched: ${items.length}`);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    return;
  }

  // Traitement et insertion des items et runes
  for (const item of items) {
    try {
        if(!isValidString(item.name.fr))
            continue;
      // Si l'item est une rune
      if (item.type.id === 78) {
        for (const effect of item.effects) {
          const characteristicId = effect.characteristic;

          if (characteristicId && characteristicId !== -1) {
            const characteristic = await Characteristic.findOne({
              where: { id: characteristicId },
            });

            if (characteristic) {
            
            const effect = (await axios.get(`https://api.dofusdb.fr/effects/${item.possibleEffects[0].effectId}?lang=fr`)).data
            if(effect.effectPowerRate < 0 || !effect.effectPowerRate) continue;
              await CharacteristicRune.findOrCreate({
                where: {
                  characteristicId: characteristic.id,
                  runeId: item.id,
                },
                defaults: {
                  characteristicId: characteristic.id,
                  runeId: item.id,
                  density: effect.effectPowerRate
                },
              });
            }
          }
        }
      } else continue;

      console.log(`Processed item: ${item.name?.fr} ${item.id}`);
    } catch (err) {
      console.error(`Failed to process item ID ${item.id}:`, err.message);
    }
  }

  console.log(`Data from https://api.dofusdb.fr/items processed successfully!`);
}
function isValidString(input) {
    return !input.toLowerCase().includes('rune pa') && !input.toLowerCase().includes('rune ra');
  }
fetchAndPopulate();
