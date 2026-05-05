const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// Force Node.js to use Google DNS to bypass local SRV ECONNREFUSED errors
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Expense = require('../models/Expense');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));

// API Routes
app.get('/api/expenses', async (req, res) => {
  try {
    let query = {};
    const { month, year } = req.query;
    
    if (year && year !== 'all') {
      const y = parseInt(year);
      if (month && month !== 'all') {
        const m = parseInt(month);
        const startDate = new Date(y, m - 1, 1);
        const endDate = new Date(y, m, 0, 23, 59, 59);
        query.date = { $gte: startDate, $lte: endDate };
      } else {
        // Only year is selected
        const startDate = new Date(y, 0, 1);
        const endDate = new Date(y, 11, 31, 23, 59, 59);
        query.date = { $gte: startDate, $lte: endDate };
      }
    } else if (month && month !== 'all') {
      // Only month is selected (for all years)
      const m = parseInt(month);
      // This is trickier in MongoDB without the year, but we can use $expr or $where
      // However, usually "Month" filter without year means "this month in all years"
      // or we can just ignore it. Let's implement month-of-year filtering.
      query.$expr = { $eq: [{ $month: "$date" }, m] };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
