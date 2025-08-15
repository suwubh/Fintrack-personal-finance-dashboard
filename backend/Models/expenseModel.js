const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
