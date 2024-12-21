const express = require('express');
const router = express.Router();
const { ItemRecipe, Item, Recipe } = require('../models');

// GET all item-recipe relations
router.get('/', async (req, res) => {
  try {
    const itemRecipes = await ItemRecipe.findAll({ include: [Item, Recipe] });
    res.json(itemRecipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new item-recipe relation
router.post('/', async (req, res) => {
  try {
    const { id, itemId, recipeId, quantity } = req.body;
    const newItemRecipe = await ItemRecipe.create({ id, itemId, recipeId, quantity });
    res.status(201).json(newItemRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an item-recipe relation
router.delete('/:id', async (req, res) => {
  try {
    await ItemRecipe.destroy({ where: { id: req.params.id } });
    res.json({ message: 'ItemRecipe relation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
