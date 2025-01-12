const express = require('express');
const router = express.Router();
const { ItemCharacteristic,Characteristic, CharacteristicRune , Item, ItemRecipe, Recipe, Category, ItemsAveragePrice, RootCategory, ExactPrice } = require('../models');
const { sequelize } = require('../models'); // Importez Sequelize depuis models/index.js
const { where } = require('sequelize');

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
