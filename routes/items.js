const express = require('express');
const router = express.Router();
const { Item, Category, ItemsAveragePrice } = require('../models');

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll({ include: Category });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, { include: Category });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
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

    res.status(200).json({item, averagePrices});
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
