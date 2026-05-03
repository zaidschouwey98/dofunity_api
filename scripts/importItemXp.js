const fs = require('fs');
const path = require('path');
const { Item } = require('../models');

/**
 * Lit item_xp.txt (tabulation : Nom puis XP avec virgule décimale) et met à jour Items.xpPerUnit par nom français.
 */
async function main() {
  const filePath =
    process.env.ITEM_XP_PATH || path.join(__dirname, '..', 'item_xp.txt');
  if (!fs.existsSync(filePath)) {
    console.error(`Fichier introuvable: ${filePath}`);
    process.exitCode = 1;
    await Item.sequelize.close().catch(() => {});
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/).filter(Boolean);

  if (lines.length === 0) {
    console.warn(`Aucune ligne à lire dans ${filePath} (fichier vide ? vérifie qu’il est bien enregistré sur disque).`);
    await Item.sequelize.close();
    return;
  }

  let matched = 0;
  let updated = 0;
  let skippedHeader = false;
  const unmatched = [];

  for (const line of lines) {
    const idx = line.indexOf('\t');
    if (idx === -1) continue;
    const nom = line.slice(0, idx).trim();
    const xpRaw = line.slice(idx + 1).trim();

    if (!skippedHeader && nom.toLowerCase() === 'nom' && xpRaw.toLowerCase().startsWith('xp')) {
      skippedHeader = true;
      continue;
    }

    const xpStr = xpRaw.replace(',', '.');
    const xpPerUnit = parseFloat(xpStr);
    if (nom === '' || Number.isNaN(xpPerUnit)) continue;

    const [count] = await Item.update({ xpPerUnit }, { where: { name: nom } });
    if (count === 0) {
      unmatched.push(nom);
    } else {
      matched += count;
      updated += count;
    }
  }

  console.log(`Lignes traitées depuis ${filePath}`);
  console.log(`Items mis à jour (lignes en base correspondant au nom): ${matched}`);
  if (unmatched.length) {
    console.log(`Sans correspondance en base (${unmatched.length}), exemples:`, unmatched.slice(0, 15));
    if (unmatched.length > 15) console.log(`... et ${unmatched.length - 15} autres`);
  }

  await Item.sequelize.close();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await Item.sequelize.close();
  } catch (_) {
    /**/
  }
  process.exitCode = 1;
});
