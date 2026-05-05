const express = require('express');
const router = express.Router();
const { ItemCharacteristic,Characteristic, CharacteristicRune , Item, ItemRecipe, Recipe, Category, ItemsAveragePrice, RootCategory, ExactPrice } = require('../models');
const { sequelize } = require('../models'); // Importez Sequelize depuis models/index.js
const { where, Op } = require('sequelize');

// GET all items
router.get('/', async (req, res) => {
  try {
    // Récupérer les paramètres `offset` et `limit` de la requête
    const offset = parseInt(req.query.offset, 10) || 0; // Par défaut, 0
    const limit = parseInt(req.query.limit, 10) || 100;  // Par défaut, 10
    const items = await Item.findAll({
      offset: offset, // Index de départ
      limit: limit,   // Nombre d'items à retourner
      include: [
        {
          model: Recipe,
          as: 'ResultRecipes',
          include: [
            {
              model: ItemRecipe,
              as: 'Ingredients',
              include: [
                {
                  model: Item,
                  as: 'Ingredient',
                  include: [
                    {
                      model: ItemsAveragePrice,
                      as: 'averagePrices',
                      attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'],
                      limit: 1,
                      order: [['createdAt', 'DESC']],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Category,
          as: 'category', // Alias défini dans `Item`
          attributes: ['id', 'name'], // Champs nécessaires de `Category`
          include: [
            {
              model: RootCategory,
              as: 'rootCategory', // Alias défini dans `Category`
              attributes: ['id', 'name'], // Champs nécessaires de `RootCategory`
            },
          ],
        },
        {
          model: ItemCharacteristic,
          as: 'characteristics',
          include: [
            {
              model: Characteristic,
              as: 'characteristic',
              attributes: ['id', 'name'],
              include: [
                {
                  model: CharacteristicRune,
                  as: 'runes',
                  include: [
                    {
                      model: Item,
                      as: 'rune',
                      attributes: ['id', 'name'], // Charger 'density'
                      include: [
                        {
                          model: ItemsAveragePrice,
                          as: 'averagePrices',
                          attributes: ['averagePrice'],
                          limit: 1,
                          order: [['createdAt', 'DESC']],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/equipments/:id', async (req, res) => {
  try {
    // Récupérer les paramètres `offset` et `limit` de la requête
    const rootCategoryId = req.params.id;
    const offset = parseInt(req.query.offset, 10) || 0; // Par défaut, 0
    const limit = parseInt(req.query.limit, 10) || 100;  // Par défaut, 10
    const root = await RootCategory.findOne({
      where: { id:rootCategoryId },
      include: [
        {
          model: Category,
          as: 'Categories',
          attributes: ['id', 'name'],
        }]
    })
    const categories = []
    for(cat of root.Categories){
      categories.push(cat.dataValues.id)
    }

    const items = await Item.findAll({
      offset: offset, // Index de départ
      limit: limit,   // Nombre d'items à retourner
      where: {
        categoryId: categories,
      },
      include: [
        {
          model: Recipe,
          as: 'ResultRecipes',
          include: [
            {
              model: ItemRecipe,
              as: 'Ingredients',
              include: [
                {
                  model: Item,
                  as: 'Ingredient',
                  include: [
                    {
                      model: ItemsAveragePrice,
                      as: 'averagePrices',
                      attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'],
                      limit: 1,
                      order: [['createdAt', 'DESC']],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Category,
          as: 'category', // Alias défini dans `Item`
          attributes: ['id', 'name'], // Champs nécessaires de `Category`
          include: [
            {
              model: RootCategory,
              as: 'rootCategory',
              attributes: ['id', 'name'], // Champs nécessaires de `RootCategory`
            },
          ],
        },
        {
          model: ItemCharacteristic,
          as: 'characteristics',
          include: [
            {
              model: Characteristic,
              as: 'characteristic',
              attributes: ['id', 'name'],
              include: [
                {
                  model: CharacteristicRune,
                  as: 'runes',
                  include: [
                    {
                      model: Item,
                      as: 'rune',
                      attributes: ['id', 'name'], // Charger 'density'
                      include: [
                        {
                          model: ItemsAveragePrice,
                          as: 'averagePrices',
                          attributes: ['averagePrice'],
                          limit: 1,
                          order: [['createdAt', 'DESC']],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/equipments', async (req, res) => {
  try {
    // Récupérer les paramètres `offset` et `limit` de la requête
    const offset = parseInt(req.query.offset, 10) || 0; // Par défaut, 0
    const limit = parseInt(req.query.limit, 10) || 100;  // Par défaut, 10
    const EQUIPMENT_CATEGORY_IDS = [1,2,3,4,5,6,7,8,9,10,11,16,17,19,21,22,82]; // Exemple d'IDs pour les catégories d'équipements
    const items = await Item.findAll({
      where: {
        categoryId: EQUIPMENT_CATEGORY_IDS, // Filtre les items par les catégories d'équipements
      },
      offset: offset, // Index de départ
      limit: limit,   // Nombre d'items à retourner
      include: [
        {
          model: Recipe,
          as: 'ResultRecipes',
          include: [
            {
              model: ItemRecipe,
              as: 'Ingredients',
              include: [
                {
                  model: Item,
                  as: 'Ingredient',
                  include: [
                    {
                      model: ItemsAveragePrice,
                      as: 'averagePrices',
                      attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'],
                      limit: 1,
                      order: [['createdAt', 'DESC']],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Category,
          as: 'category', // Alias défini dans `Item`
          attributes: ['id', 'name'], // Champs nécessaires de `Category`
          include: [
            {
              model: RootCategory,
              as: 'rootCategory', // Alias défini dans `Category`
              attributes: ['id', 'name'], // Champs nécessaires de `RootCategory`
            },
          ],
        },
        {
          model: ItemCharacteristic,
          as: 'characteristics',
          include: [
            {
              model: Characteristic,
              as: 'characteristic',
              attributes: ['id', 'name'],
              include: [
                {
                  model: CharacteristicRune,
                  as: 'runes',
                  include: [
                    {
                      model: Item,
                      as: 'rune',
                      attributes: ['id', 'name'], // Charger 'density'
                      include: [
                        {
                          model: ItemsAveragePrice,
                          as: 'averagePrices',
                          attributes: ['averagePrice'],
                          limit: 1,
                          order: [['createdAt', 'DESC']],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /items/with-exactprice - Récupérer tous les items avec leur dernier exactPrice
router.get('/items/with-exactprice', async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: ExactPrice,
          as: 'exactPrices', // Alias défini dans le modèle Item
          attributes: ['id', 'exactPrice', 'createdAt'], // Retourner uniquement les champs nécessaires
          limit: 1, // Retourner uniquement le dernier prix
          order: [['createdAt', 'DESC']], // Trier par date décroissante
        },
      ],
      // Filtrer les items pour n'inclure que ceux ayant un ExactPrice
      where: sequelize.literal('(SELECT COUNT(*) FROM ExactPrices WHERE ExactPrices.itemId = Item.id) > 0'),
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/runes', async (req, res) => {
  try {
    const items = await Item.findAll({
      where:{
        categoryId:78
      },
      include: [
        {
          model: ItemsAveragePrice,
          as: 'averagePrices',
          attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'],
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Référence familier 1 → 100 : « 359 virgule 184 » croquettes = 359.184 (décimal), pas 359184.
 * 179592 XP ÷ 359.184 = 500 XP / croquette (aligné avec item_xp.txt pour la croquette).
 * Les XP du fichier = XP familier par unité pour chaque ressource.
 */
const FAMILIER_100_CROQUETTE_UNITS = 359.184;
const FAMILIER_100_TOTAL_PET_XP = 179592;
const CROQUETTE_ENRICHIE_NAME = 'Croquette enrichie';
/** Fallback si l’item n’est pas en base ou xpPerUnit absent (valeur habituelle dans item_xp.txt). */
const CROQUETTE_FILE_XP_FALLBACK = 500;

/** Ressources avec XP/unité et dernier prix moyen ; comparaison coût vs parcours 100 % croquettes. */
router.get('/resources/profitability', async (req, res) => {
  try {
    const parsed = parseInt(req.query.limit, 10);
    const limit = Math.min(parsed > 0 ? parsed : 800, 5000);

    const manualCroqRaw =
      req.query.croquettePriceKamas ?? req.query.croquettePrice ?? '';
    const manualCroqParsed = parseFloat(
      String(manualCroqRaw).replace(/\s/g, '').replace(',', '.')
    );
    const manualCroquettePrice =
      Number.isFinite(manualCroqParsed) && manualCroqParsed > 0
        ? manualCroqParsed
        : null;

    const budgetRaw =
      req.query.familier100BudgetKamas ?? req.query.budgetKamas ?? '';
    const budgetParsed = parseFloat(
      String(budgetRaw).replace(/\s/g, '').replace(',', '.')
    );
    const familier100BudgetKamas =
      Number.isFinite(budgetParsed) && budgetParsed > 0 ? budgetParsed : null;

    const croquetteItem = await Item.findOne({
      where: { name: CROQUETTE_ENRICHIE_NAME },
      attributes: ['id', 'name', 'xpPerUnit'],
      include: [
        {
          model: ItemsAveragePrice,
          as: 'averagePrices',
          attributes: ['averagePrice'],
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    const croquetteXpRaw = croquetteItem?.get('xpPerUnit');
    const croquetteFileXp =
      croquetteXpRaw != null && String(croquetteXpRaw).trim() !== ''
        ? parseFloat(String(croquetteXpRaw))
        : CROQUETTE_FILE_XP_FALLBACK;

    const croqAvg = croquetteItem?.averagePrices?.[0]?.averagePrice;
    const croquetteUnitPriceHdv =
      croqAvg != null && croqAvg !== ''
        ? parseFloat(String(croqAvg))
        : null;

    let croquettePriceSource = null;
    let croquetteUnitPriceUsed = null;
    if (manualCroquettePrice != null) {
      croquetteUnitPriceUsed = manualCroquettePrice;
      croquettePriceSource = 'manuel';
    } else if (
      croquetteUnitPriceHdv != null &&
      !Number.isNaN(croquetteUnitPriceHdv) &&
      croquetteUnitPriceHdv > 0
    ) {
      croquetteUnitPriceUsed = croquetteUnitPriceHdv;
      croquettePriceSource = 'hdv';
    }

    const costFullCroquettePathKamas =
      croquetteUnitPriceUsed != null &&
      !Number.isNaN(croquetteUnitPriceUsed) &&
      croquetteUnitPriceUsed > 0
        ? FAMILIER_100_CROQUETTE_UNITS * croquetteUnitPriceUsed
        : null;

    const items = await Item.findAll({
      where: { xpPerUnit: { [Op.not]: null } },
      attributes: ['id', 'name', 'lvl', 'categoryId', 'xpPerUnit'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
          required: false,
          include: [
            {
              model: RootCategory,
              as: 'rootCategory',
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
        {
          model: ItemsAveragePrice,
          as: 'averagePrices',
          attributes: ['averagePrice'],
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    const rows = items.map((item) => {
      const xpPerUnitRaw = item.get('xpPerUnit');
      const xpPerUnit =
        xpPerUnitRaw != null ? parseFloat(String(xpPerUnitRaw)) : null;

      const avg = item.averagePrices?.[0]?.averagePrice;
      const unitPrice =
        avg != null && avg !== ''
          ? parseFloat(String(avg))
          : null;

      const xpPerPrice =
        unitPrice != null && unitPrice > 0 && xpPerUnit != null && !Number.isNaN(xpPerUnit)
          ? xpPerUnit / unitPrice
          : null;

      /** Même 179592 XP familier : unités = total XP ÷ (XP familier / unité dans le fichier). */
      let unitsForSameFamilierProgress = null;
      let costSameFamilierProgressKamas = null;
      let benefitVsCroquettesKamas = null;
      /**
       * Plafond prix / u si tu ne veux pas dépasser un budget total B pour le 1→100 :
       * (179592/xp) * P ≤ B  ⇒  P_max = B * xp / 179592.
       */
      let maxUnitPriceForBudgetKamas = null;
      if (
        xpPerUnit != null &&
        !Number.isNaN(xpPerUnit) &&
        xpPerUnit > 0 &&
        familier100BudgetKamas != null
      ) {
        maxUnitPriceForBudgetKamas =
          (familier100BudgetKamas * xpPerUnit) / FAMILIER_100_TOTAL_PET_XP;
      }

      /**
       * Plafond vs croquettes : (179592/xp) * P_max = 359,184 * P_croq.
       */
      let maxProfitableUnitPriceKamas = null;

      if (
        xpPerUnit != null &&
        !Number.isNaN(xpPerUnit) &&
        xpPerUnit > 0 &&
        croquetteUnitPriceUsed != null &&
        !Number.isNaN(croquetteUnitPriceUsed) &&
        croquetteUnitPriceUsed > 0
      ) {
        maxProfitableUnitPriceKamas =
          (FAMILIER_100_CROQUETTE_UNITS *
            croquetteUnitPriceUsed *
            xpPerUnit) /
          FAMILIER_100_TOTAL_PET_XP;
      }

      if (
        xpPerUnit != null &&
        !Number.isNaN(xpPerUnit) &&
        xpPerUnit > 0 &&
        unitPrice != null &&
        !Number.isNaN(unitPrice) &&
        unitPrice > 0
      ) {
        unitsForSameFamilierProgress = FAMILIER_100_TOTAL_PET_XP / xpPerUnit;
        costSameFamilierProgressKamas = unitsForSameFamilierProgress * unitPrice;
        if (costFullCroquettePathKamas != null) {
          benefitVsCroquettesKamas =
            costFullCroquettePathKamas - costSameFamilierProgressKamas;
        }
      }

      return {
        id: item.id,
        name: item.name,
        lvl: item.lvl,
        categoryId: item.categoryId,
        category: item.category ?? null,
        xpPerUnit,
        unitPrice: unitPrice != null && !Number.isNaN(unitPrice) ? unitPrice : null,
        xpPerPrice,
        unitsForSameFamilierProgress,
        costSameFamilierProgressKamas,
        benefitVsCroquettesKamas,
        maxProfitableUnitPriceKamas,
        maxUnitPriceForBudgetKamas,
      };
    }).filter((r) => r.xpPerPrice != null && r.xpPerPrice > 0);

    rows.sort((a, b) => {
      const ba = a.benefitVsCroquettesKamas;
      const bb = b.benefitVsCroquettesKamas;
      if (ba != null && bb != null && ba !== bb) return bb - ba;
      if (ba != null && bb == null) return -1;
      if (ba == null && bb != null) return 1;
      return b.xpPerPrice - a.xpPerPrice;
    });

    res.json({
      reference: {
        croquetteItemId: croquetteItem?.id ?? null,
        croquetteName: CROQUETTE_ENRICHIE_NAME,
        croquetteFileXpPerUnit: croquetteFileXp,
        croquetteUnitPriceHdv:
          croquetteUnitPriceHdv != null && !Number.isNaN(croquetteUnitPriceHdv)
            ? croquetteUnitPriceHdv
            : null,
        croquetteUnitPriceUsed:
          croquetteUnitPriceUsed != null && !Number.isNaN(croquetteUnitPriceUsed)
            ? croquetteUnitPriceUsed
            : null,
        croquettePriceSource,
        croquetteUnitsForFamilier100: FAMILIER_100_CROQUETTE_UNITS,
        familier100TotalPetXp: FAMILIER_100_TOTAL_PET_XP,
        familier100BudgetKamas,
        costFullCroquettePathKamas,
      },
      rows: rows.slice(0, limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id,
      {
        include: [
          {
            model: Recipe,
            as: 'ResultRecipes',
            include: [
              {
                model: ItemRecipe,
                as: 'Ingredients',
                include: [
                  {
                    model: Item,
                    as: 'Ingredient',
                    include: [
                      {
                        model: ItemsAveragePrice,
                        as: 'averagePrices',
                        attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'],
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: Category,
            as: 'category', // Alias défini dans `Item`
            attributes: ['id', 'name'], // Champs nécessaires de `Category`
            include: [
              {
                model: RootCategory,
                as: 'rootCategory', // Alias défini dans `Category`
                attributes: ['id', 'name'], // Champs nécessaires de `RootCategory`
              },
            ],
          },
          {
            model: ItemCharacteristic,
            as: 'characteristics',
            include: [
              {
                model: Characteristic,
                as: 'characteristic',
                attributes: ['id', 'name'],
                include: [
                  {
                    model: CharacteristicRune,
                    as: 'runes',
                    include: [
                      {
                        model: Item,
                        as: 'rune',
                        attributes: ['id', 'name'], // Charger 'density'
                        include: [
                          {
                            model: ItemsAveragePrice,
                            as: 'averagePrices',
                            attributes: ['averagePrice'],
                            limit: 1,
                            order: [['createdAt', 'DESC']],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id/recipe', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findOne({
      where: { id },
      include: [
        {
          model: Recipe,
          as: 'ResultRecipes',
          include: [
            {
              model: ItemRecipe,
              as: 'Ingredients',
              include: [
                {
                  model: Item,
                  as: 'Ingredient',
                  include: [
                    {
                      model: ItemsAveragePrice,
                      as: 'averagePrices',
                      attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'],
                      limit: 1,
                      order: [['createdAt', 'DESC']],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: ItemCharacteristic,
          as: 'characteristics',
          include: [
            {
              model: Characteristic,
              as: 'characteristic',
              attributes: ['id', 'name'],
              include: [
                {
                  model: CharacteristicRune,
                  as: 'runes',
                  include: [
                    {
                      model: Item,
                      as: 'rune',
                      attributes: ['id', 'name'], // Charger 'density'
                      include: [
                        {
                          model: ItemsAveragePrice,
                          as: 'averagePrices',
                          attributes: ['averagePrice'],
                          limit: 1,
                          order: [['createdAt', 'DESC']],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/items/recipes', async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: ItemsAveragePrice,
          as: 'averagePrices', // Alias défini dans Item
          attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'],
          limit: 1, // Récupérer uniquement le dernier prix
          order: [['createdAt', 'DESC']], // Trier par date de création décroissante
        },
        {
          model: Recipe, // Relation avec les recettes
          as: 'ResultRecipes',
          include: [
            {
              model: ItemRecipe, // Relation entre recette et ingrédients
              as: 'Ingredients',
              include: [
                {
                  model: Item, // Relation avec les items en tant qu'ingrédients
                  as: 'Ingredient',
                  include: [
                    {
                      model: ItemsAveragePrice,
                      as: 'averagePrices',
                      attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'],
                      limit: 1, // Récupérer uniquement le dernier prix
                      order: [['createdAt', 'DESC']], // Trier par date de création décroissante
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/items/average-prices', async (req, res) => {
  try {
    // Récupérer tous les items avec leurs prix moyens associés
    const itemsWithPrices = await Item.findAll({
      include: [
        {
          model: ItemsAveragePrice,
          as: 'averagePrices', // Utiliser l'alias défini dans le modèle
          attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'], // Champs nécessaires
        },
        {
          model: Category,
          as: 'category', // Alias défini dans `Item`
          attributes: ['id', 'name'], // Champs nécessaires de `Category`
          include: [
            {
              model: RootCategory,
              as: 'rootCategory', // Alias défini dans `Category`
              attributes: ['id', 'name'], // Champs nécessaires de `RootCategory`
            },
          ],
        },
      ],
    });

    // Vérifier si des items existent
    if (!itemsWithPrices || itemsWithPrices.length === 0) {
      return res.status(404).json({ error: 'No items found' });
    }

    res.status(200).json(itemsWithPrices);
  } catch (err) {
    console.error('Error fetching items with average prices:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:itemId/average-prices', async (req, res) => {
  const { itemId } = req.params;

  try {
    // Vérifier si l'item existe
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Récupérer les prix moyens associés à cet item
    const averagePrices = await ItemsAveragePrice.findAll({
      where: { itemId: itemId },
      attributes: ['id', 'averagePrice', 'createdAt', 'updatedAt'], // Inclure les champs nécessaires
    });

    res.status(200).json({ item, averagePrices });
  } catch (err) {
    console.error('Error fetching average prices:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST create a new item
router.post('/', async (req, res) => {
  try {
    const items = req.body;
    for (const { name, categoryId } of items) {
      const newItem = await Item.create({ name, categoryId });
    }
    res.status(201).json();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update an item
router.put('/:id', async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const updatedItem = await Item.update(
      { name, categoryId },
      { where: { id: req.params.id } }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an item
router.delete('/:id', async (req, res) => {
  try {
    await Item.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
