
const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel'); 

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const [incomeAgg] = await Income.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
    ]);

    const [expenseAgg] = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
    ]);

    const totalIncome = incomeAgg?.total || 0;
    const totalExpenses = expenseAgg?.total || 0;
    const totalBalance = totalIncome - totalExpenses;

    const [recentIncomes, recentExpenses] = await Promise.all([
      Income.find({ user: userId }).sort({ date: -1 }).limit(5).lean(),
      Expense.find({ user: userId }).sort({ date: -1 }).limit(5).lean()
    ]);

    const recentTransactions = [
      ...recentIncomes.map(i => ({ type: 'income', ...i })),
      ...recentExpenses.map(e => ({ type: 'expense', ...e })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.json({
      totalIncome,
      totalExpenses,
      totalBalance,
      recentTransactions,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};
