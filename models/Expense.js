const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this expense.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide the amount for this expense.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for this expense.'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide the date of the expense.'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  paid: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
