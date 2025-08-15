// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIUrl } from "../utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  FaWallet,
  FaMoneyBillWave,
  FaShoppingCart,
  FaPlane,
  FaLightbulb,
  FaHome,
  FaBus,
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const loggedInUser = localStorage.getItem("loggedInUser") || "User";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`${APIUrl}/income`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${APIUrl}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const incomeData = await incomeRes.json();
      const expenseData = await expenseRes.json();

      const incomeTotal = incomeData.data.reduce((sum, i) => sum + i.amount, 0);
      const expenseTotal = expenseData.data.reduce((sum, e) => sum + e.amount, 0);
      const balance = incomeTotal - expenseTotal;

      setTotals({ income: incomeTotal, expense: expenseTotal, balance });

      const allTransactions = [
        ...incomeData.data.map((i) => ({ ...i, type: "income" })),
        ...expenseData.data.map((e) => ({ ...e, type: "expense" })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#6366f1", "#ef4444", "#f97316"];
  const chartData = [
    { name: "Total Balance", value: totals.balance },
    { name: "Total Expenses", value: totals.expense },
    { name: "Total Income", value: totals.income },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-6">
        <h1 className="text-xl font-bold mb-6">Expense Tracker</h1>
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://avatars.githubusercontent.com/u/000000?v=4"
            alt="avatar"
            className="w-16 h-16 rounded-full"
          />
          <h2 className="mt-2 font-semibold">{loggedInUser}</h2>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li className="flex items-center gap-3 p-2 bg-purple-100 text-purple-600 rounded-lg">
              <span>📊</span> Dashboard
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              💰 Income
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              💸 Expense
            </li>
            <li
              className="flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              🚪 Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <SummaryCard
            icon={<FaWallet size={28} />}
            title="Total Balance"
            amount={totals.balance}
            color="bg-purple-100 text-purple-600"
          />
          <SummaryCard
            icon={<FaMoneyBillWave size={28} />}
            title="Total Income"
            amount={totals.income}
            color="bg-orange-100 text-orange-500"
          />
          <SummaryCard
            icon={<FaShoppingCart size={28} />}
            title="Total Expenses"
            amount={totals.expense}
            color="bg-red-100 text-red-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between mb-4">
              <h4 className="font-semibold">Recent Transactions</h4>
              <button className="text-gray-500 text-sm">See All →</button>
            </div>
            <ul className="space-y-3">
              {transactions.map((t, i) => (
                <TransactionItem key={i} transaction={t} />
              ))}
            </ul>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold mb-4">Financial Overview</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

// Components
function SummaryCard({ icon, title, amount, color }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <h3 className="text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }) {
  const icons = {
    Shopping: <FaShoppingCart />,
    Travel: <FaPlane />,
    "Electricity Bill": <FaLightbulb />,
    "Loan Repayment": <FaHome />,
    Transport: <FaBus />,
  };

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-full">
          {icons[transaction.title] || <FaWallet />}
        </div>
        <div>
          <p className="font-medium">{transaction.title}</p>
          <span className="text-sm text-gray-500">
            {new Date(transaction.date).toLocaleDateString()}
          </span>
        </div>
      </div>
      <p className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
      </p>
    </li>
  );
}
