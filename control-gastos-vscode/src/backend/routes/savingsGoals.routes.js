const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/savingsGoal.model');
const auth = require('../middleware/auth.middleware');

// Get all savings goals for user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await SavingsGoal.findAll({
      where: { user_id: req.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener metas' });
  }
});

// Create savings goal
router.post('/', auth, async (req, res) => {
  try {
    const { name, target_amount, current_amount, deadline, color } = req.body;

    if (!name || !target_amount) {
      return res.status(400).json({ message: 'Nombre y monto objetivo requeridos' });
    }

    const goal = await SavingsGoal.create({
      user_id: req.userId,
      name,
      target_amount,
      current_amount: current_amount || 0,
      deadline,
      color: color || 'blue'
    });

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear meta' });
  }
});

// Update savings goal
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, target_amount, current_amount, deadline, color } = req.body;

    const goal = await SavingsGoal.findOne({
      where: { id, user_id: req.userId }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Meta no encontrada' });
    }

    if (name !== undefined) goal.name = name;
    if (target_amount !== undefined) goal.target_amount = target_amount;
    if (current_amount !== undefined) goal.current_amount = current_amount;
    if (deadline !== undefined) goal.deadline = deadline;
    if (color !== undefined) goal.color = color;

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar meta' });
  }
});

// Delete savings goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await SavingsGoal.findOne({
      where: { id, user_id: req.userId }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Meta no encontrada' });
    }

    await goal.destroy();
    res.json({ message: 'Meta eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar meta' });
  }
});

module.exports = router;
