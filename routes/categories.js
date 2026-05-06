const express = require('express');
const router = express.Router();
const { Category, Item, RootCategory } = require('../models');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const includeRoot =
      req.query.includeRoot === '1' || req.query.includeRoot === 'true';
    const findOptions = {};
    if (includeRoot) {
      findOptions.include = [
        {
          model: RootCategory,
          as: 'rootCategory',
          attributes: ['id', 'name'],
        },
      ];
    }
    const categories = await Category.findAll(findOptions);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: Item });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a category
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCategory = await Category.update(
      { name },
      { where: { id: req.params.id } }
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a category
router.delete('/:id', async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
