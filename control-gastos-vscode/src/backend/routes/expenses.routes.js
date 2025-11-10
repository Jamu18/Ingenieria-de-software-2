
const express = require('express');
const router = express.Router();
const Expense = require('../models/expense.model');
const auth = require('../middleware/auth.middleware');

// Create expense
router.post('/', auth, async (req, res) => {
  try{
    const { title, amount, currency, category, date, note } = req.body;
    const exp = await Expense.create({ user_id: req.userId, title, amount, currency, category, date, note });
    res.json(exp);
  }catch(err){ console.error(err); res.status(500).json({ message: 'error' }); }
});

// Get expenses for logged user (with optional month filter)
router.get('/', auth, async (req, res) => {
  try{
    const { month } = req.query; // format YYYY-MM
    const where = { user_id: req.userId };
    if(month){
      const start = month + '-01';
      const end = month + '-31';
      where.date = { $between: [start, end] };
    }
    const exps = await Expense.findAll({ where, order: [['date', 'DESC']] });
    res.json(exps);
  }catch(err){ console.error(err); res.status(500).json({ message: 'error' }); }
});

  // Delete expense
  router.delete('/:id', auth, async (req, res) => {
    try {
      const expense = await Expense.findOne({ 
        where: { 
          id: req.params.id, 
          user_id: req.userId 
        } 
      });
    
      if (!expense) {
        return res.status(404).json({ message: 'Gasto no encontrado' });
      }
    
      await expense.destroy();
      res.json({ message: 'Gasto eliminado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'error' });
    }
  });

module.exports = router;
