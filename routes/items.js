const express = require('express');
const router = express.Router();
const { Item, Category } = require('../models');

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
