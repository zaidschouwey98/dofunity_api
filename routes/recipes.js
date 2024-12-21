const express = require('express');
const router = express.Router();
const { Recipe, Item } = require('../models');

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({ include: Item });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, { include: Item });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new recipe
router.post('/', async (req, res) => {
  try {
    const { id } = req.body;
    const newRecipe = await Recipe.create({ id });
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a recipe
router.delete('/:id', async (req, res) => {
  try {
    await Recipe.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
