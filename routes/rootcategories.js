const express = require('express');
const router = express.Router();
const { RootCategory } = require('../models');

// GET all rootCategories
router.get('/', async (req, res) => {
  try {
    const rootCategories = await RootCategory.findAll();
    res.json(rootCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET rootCategory by ID
router.get('/:id', async (req, res) => {
  try {
    const rootCategory = await RootCategory.findByPk(req.params.id, { include: Item });
    if (!rootCategory) {
      return res.status(404).json({ error: 'RootCategory not found' });
    }
    res.json(rootCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new rootCategory
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await RootCategory.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a rootCategory
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCategory = await RootCategory.update(
      { name },
      { where: { id: req.params.id } }
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a rootCategory
router.delete('/:id', async (req, res) => {
  try {
    await RootCategory.destroy({ where: { id: req.params.id } });
    res.json({ message: 'RootCategory deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
