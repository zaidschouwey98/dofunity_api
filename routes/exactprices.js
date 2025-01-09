const express = require('express');
const router = express.Router();
const { ExactPrice, Item } = require('../models');

// GET /exactprices - Récupérer tous les prix exacts
router.get('/', async (req, res) => {
  try {
    const exactPrices = await ExactPrice.findAll({
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'categoryId', 'lvl'],
        },
      ],
    });
    res.json(exactPrices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /exactprices/:id - Récupérer un prix exact par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const exactPrice = await ExactPrice.findOne({
      where: { id },
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'categoryId', 'lvl'],
        },
      ],
    });
    if (!exactPrice) {
      return res.status(404).json({ error: 'ExactPrice not found' });
    }
    res.json(exactPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /exactprices - Ajouter un nouveau prix exact
router.post('/', async (req, res) => {
  let { itemId, exactPrice } = req.body;

  if(exactPrice < 0)
    exactPrice = null;

  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    const newExactPrice = await ExactPrice.create({ itemId, exactPrice });
    res.status(201).json(newExactPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /exactprices/:id - Mettre à jour un prix exact
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { exactPrice } = req.body;
  try {
    const updatedExactPrice = await ExactPrice.update(
      { exactPrice },
      { where: { id }, returning: true }
    );
    if (!updatedExactPrice[0]) {
      return res.status(404).json({ error: 'ExactPrice not found' });
    }
    res.json(updatedExactPrice[1][0]); // Retourne l'enregistrement mis à jour
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /exactprices/:id - Supprimer un prix exact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ExactPrice.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'ExactPrice not found' });
    }
    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
