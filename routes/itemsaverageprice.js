const express = require('express');
const router = express.Router();
const { ItemsAveragePrice, Item } = require('../models');

// GET all item average prices
router.get('/', async (req, res) => {
  try {
    const averages = await ItemsAveragePrice.findAll({ include: Item });
    res.json(averages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create an average price for an item
router.post('/', async (req, res) => {
  try {
    const {itemId, averagePrice} = req.body;
 
    await ItemsAveragePrice.create({ averagePrice, itemId });
    
    res.status(201).json();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an average price
router.delete('/:id', async (req, res) => {
  try {
    await ItemsAveragePrice.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Average price deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
