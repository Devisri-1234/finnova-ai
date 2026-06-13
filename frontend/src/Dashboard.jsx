  // paste all your current App code here
  import { useEffect, useState } from "react";
  import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
  } from "recharts";
  function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [budget, setBudget] = useState(null);
  const [goal, setGoal] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [budgetInput, setBudgetInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  
  const [healthScore, setHealthScore] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
      category: "",
      amount: "",
      merchant: "",
      payment_method: "",
      transaction_type: "Expense",
    });
  
    useEffect(() => {
    fetchTransactions();
    fetchBudget();
    fetchGoal();
    fetchHealthScore();
    fetchAnalytics();
  }, []);
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/transactions"
        );
  
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBudget = async () => {
    const res = await fetch(
      "http://127.0.0.1:8000/budget"
    );
  
    const data = await res.json();
    setBudget(data);
  };
  
  const fetchGoal = async () => {
    const res = await fetch(
      "http://127.0.0.1:8000/goal"
    );
  
    const data = await res.json();
    setGoal(data);
  };
  
  const fetchHealthScore = async () => {
    const res = await fetch(
      "http://127.0.0.1:8000/health-score"
    );
  
    const data = await res.json();
    setHealthScore(data);
  };
  
  const fetchAnalytics = async () => {
    const res = await fetch(
      "http://127.0.0.1:8000/analytics"
    );
  
    const data = await res.json();
    setAnalytics(data);
  };
  const saveBudget = async () => {
    try {
      await fetch(
        "http://127.0.0.1:8000/budget",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            monthly_budget: Number(
              budgetInput
            ),
          }),
        }
      );
  
      fetchBudget();
      setBudgetInput("");
    } catch (error) {
      console.log(error);
    }
  };
  const saveGoal = async () => {
  try {
    await fetch(
      "http://127.0.0.1:8000/goal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal_amount: Number(goalInput),
        }),
      }
    );

    fetchGoal();
    setGoalInput("");
  } catch (error) {
    console.log(error);
  }
};
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const addTransaction = async (e) => {
    e.preventDefault();
  
    try {
      if (editingId) {
        await fetch(
          `http://127.0.0.1:8000/transactions/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              amount: Number(formData.amount),
            }),
          }
        );
  
        setEditingId(null);
      } else {
        await fetch(
          "http://127.0.0.1:8000/transactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              amount: Number(formData.amount),
            }),
          }
        );
      }
  
      setFormData({
        category: "",
        amount: "",
        merchant: "",
        payment_method: "",
        transaction_type: "Expense",
      });
  
      fetchTransactions();
    } catch (error) {
      console.log(error);
    }
  };
  
    const deleteTransaction = async (id) => {
      try {
        await fetch(
          `http://127.0.0.1:8000/transactions/${id}`,
          {
            method: "DELETE",
          }
        );
  
        fetchTransactions();
      } catch (error) {
        console.log(error);
      }
    };
    const editTransaction = (item) => {
    setEditingId(item.id);
  
    setFormData({
      category: item.category,
      amount: item.amount,
      merchant: item.merchant,
      payment_method: item.payment_method,
      transaction_type: item.transaction_type,
    });
  };
    const categoryData = Object.values(
    transactions
      .filter(
        (item) =>
          item.transaction_type === "Expense"
      )
      .reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            name: item.category,
            value: 0,
          };
        }
  
        acc[item.category].value += item.amount;
        return acc;
      }, {})
  );
const filteredTransactions = transactions.filter((item) => {
  const searchMatch =
    item.category?.toLowerCase().includes(search.toLowerCase()) ||
    item.merchant?.toLowerCase().includes(search.toLowerCase());

  const typeMatch =
    filterType === "All"
      ? true
      : item.transaction_type === filterType;

  return searchMatch && typeMatch;
});
    const barChartData = categoryData.map((item) => ({
      category: item.name,
      amount: item.value,
    }));
  
    const COLORS = [
      "#06B6D4",
      "#3B82F6",
      "#8B5CF6",
      "#22C55E",
      "#F59E0B",
      "#EF4444",
    ];
  
    const totalIncome = transactions
      .filter(
        (item) =>
          item.transaction_type === "Income"
      )
      .reduce(
        (sum, item) => sum + item.amount,
        0
      );
  
    const totalExpense = transactions
      .filter(
        (item) =>
          item.transaction_type === "Expense"
      )
      .reduce(
        (sum, item) => sum + item.amount,
        0
      );
  
    const balance =
      totalIncome - totalExpense;
  
    const totalSpending = totalExpense;
  
    const topCategory =
      categoryData.length > 0
        ? categoryData.reduce((a, b) =>
            a.value > b.value ? a : b
          )
        : null;
  
    const averageTransaction =
      transactions.length > 0
        ? totalSpending /
          transactions.length
        : 0;
  
    const warning =
      totalExpense > 10000
        ? "⚠ High Spending Alert"
        : "✅ Spending Under Control";
    const monthlyData = transactions.map(
  (item) => ({
    month: new Date().toLocaleString(
      "default",
      { month: "short" }
    ),
    amount: item.amount,
  })
);
    const predictedExpense =
    transactions.length > 0
      ? Math.round(totalExpense * 1.1)
      : 0;
    let recommendation = "";

if (
  budget &&
  totalExpense > budget.monthly_budget
) {
  const excess =
    totalExpense - budget.monthly_budget;

  recommendation =
    `⚠ Budget exceeded by ₹${excess}. `;
}

if (topCategory) {
  const cutAmount = Math.round(
    topCategory.value * 0.20
  );

  recommendation +=
    `Reduce ${topCategory.name} expenses by around ₹${cutAmount}. `;
}

if (
  goal &&
  balance < goal.goal_amount
) {
  const remaining =
    goal.goal_amount - balance;

  recommendation +=
    `You need ₹${remaining} more to achieve your savings goal. `;
}

if (
  budget &&
  totalExpense <
    budget.monthly_budget * 0.8
) {
  recommendation +=
    `Great job! Your spending is within budget. `;
}

if (
  goal &&
  balance >= goal.goal_amount
) {
  recommendation +=
    `🎉 Savings goal achieved. `;
}

if (
  predictedExpense >
  totalExpense
) {
  recommendation +=
    `At the current pace, next month's expense may reach ₹${predictedExpense}.`;
}
    return (
    <div
className={`min-h-screen p-8 ${
theme === "dark"
? "bg-slate-950 text-white"
: "bg-white text-black"
}`}
>
  
    {/* HEADER */}
      
    <div className="mb-12">
      <h1 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
        FinNova AI
      </h1>
  
      <p className="text-slate-400 mt-3 text-lg">
        Smart Personal Finance Intelligence
      </p>
    </div>
    <button
    onClick={() =>
      setTheme(
        theme === "dark"
          ? "light"
          : "dark"
      )
    }
    className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl font-bold"
  >
    {theme === "dark"
      ? "☀ Light Mode"
      : "🌙 Dark Mode"}
  </button>

     <div className="flex gap-4 mb-8">
  
    <a
      href="http://127.0.0.1:8000/export/pdf"
      target="_blank"
      rel="noreferrer"
      className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
    >
      Export PDF
    </a>
  
    <a
      href="http://127.0.0.1:8000/export/excel"
      target="_blank"
      rel="noreferrer"
      className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-bold"
    >
      Export Excel
    </a>
  
  </div> 
    {/* ANALYTICS */}
  
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
  
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
        <h2 className="text-slate-400 mb-2">
          Total Income
        </h2>
  
        <p className="text-4xl font-bold text-green-400">
          ₹{totalIncome.toFixed(2)}
        </p>
      </div>
  
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
        <h2 className="text-slate-400 mb-2">
          Total Expense
        </h2>
  
        <p className="text-4xl font-bold text-red-400">
          ₹{totalExpense.toFixed(2)}
        </p>
      </div>
  
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
        <h2 className="text-slate-400 mb-2">
          Current Balance
        </h2>
  
        <p className="text-4xl font-bold text-cyan-400">
          ₹{balance.toFixed(2)}
        </p>
      </div>
  
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
        <h2 className="text-slate-400 mb-2">
          Transactions
        </h2>
  
        <p className="text-4xl font-bold">
          {transactions.length}
        </p>
      </div>
  
    </div>
    {/* NEW BUDGET / GOAL / HEALTH SCORE CARDS */}
  
  <div className="grid md:grid-cols-4 gap-6 mb-10">
  
    <div className="bg-slate-900/70 p-6 rounded-3xl">
  <h3>Monthly Budget</h3>

  <p className="text-3xl font-bold text-cyan-400">
    ₹{budget?.monthly_budget || 0}
  </p>

  <p className="mt-2 text-slate-400">
    Used :
    {" "}
    {budget?.monthly_budget
      ? Math.round(
          (totalExpense /
            budget.monthly_budget) *
            100
        )
      : 0}
    %
  </p>
</div>
  
    <div className="bg-slate-900/70 p-6 rounded-3xl">
  <h3>Savings Goal</h3>

  <p className="text-3xl font-bold text-green-400">
    ₹{goal?.goal_amount || 0}
  </p>

  <p className="mt-2 text-slate-400">
    Progress :
    {" "}
    {goal?.goal_amount
      ? Math.min(
          100,
          Math.round(
            (balance /
              goal.goal_amount) *
              100
          )
        )
      : 0}
    %
  </p>
</div>
  
    <div className="bg-slate-900/70 p-6 rounded-3xl">
      <h3>Health Score</h3>
      <p className="text-3xl font-bold text-yellow-400">
        {healthScore?.score || 0}/100
      </p>
    </div>
  
    <div className="bg-slate-900/70 p-6 rounded-3xl">
      <h3>Balance</h3>
      <p className="text-3xl font-bold text-purple-400">
        ₹{analytics?.balance || 0}
      </p>
    </div>
  
  </div>
    {/* BUDGET PLANNER */}
  
  <div className="bg-slate-900/70 backdrop-blur-lg p-8 rounded-3xl border border-slate-700 mb-10">
  
    <h2 className="text-2xl font-bold mb-4">
      Monthly Budget Planner
    </h2>
  
    <div className="flex gap-4">
  
      <input
        type="number"
        placeholder="Enter Monthly Budget"
        value={budgetInput}
        onChange={(e) =>
          setBudgetInput(e.target.value)
        }
        className="bg-slate-950 border border-slate-700 p-4 rounded-xl flex-1"
      />
  
      <button
        onClick={saveBudget}
        className="bg-cyan-600 px-6 rounded-xl"
      >
        Save Budget
      </button>
  
    </div>
  
  </div>
  <div className="bg-slate-900/70 backdrop-blur-lg p-8 rounded-3xl border border-slate-700 mb-10">

  <h2 className="text-2xl font-bold mb-4">
    Savings Goal
  </h2>

  <div className="flex gap-4">

    <input
      type="number"
      placeholder="Enter Savings Goal"
      value={goalInput}
      onChange={(e) =>
        setGoalInput(e.target.value)
      }
      className="bg-slate-950 border border-slate-700 p-4 rounded-xl flex-1"
    />

    <button
      onClick={saveGoal}
      className="bg-green-600 px-6 rounded-xl"
    >
      Save Goal
    </button>

  </div>

</div>
    {/* AI INSIGHTS */}
  
    <div className="grid md:grid-cols-4 gap-6 mb-10">
  
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
        <h3 className="text-slate-400 mb-2">
          AI Insight
        </h3>
  
        <p className="text-lg font-bold">
          Highest Spending Category
        </p>
  
        <p className="text-cyan-400 mt-2 text-xl">
          {topCategory ? topCategory.name : "No Data"}
        </p>
      </div>
  
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
        <h3 className="text-slate-400 mb-2">
          Average Transaction
        </h3>
  
        <p className="text-green-400 text-3xl font-bold">
          ₹{averageTransaction.toFixed(2)}
        </p>
      </div>
  
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
        <h3 className="text-slate-400 mb-2">
          Current Spending
        </h3>
  
        <p className="text-purple-400 text-3xl font-bold">
          ₹{totalSpending.toFixed(2)}
        </p>
      </div>
  
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
        <h3 className="text-slate-400 mb-2">
          AI Spending Alert
        </h3>
  
        <p className="text-xl font-bold text-yellow-400">
          {warning}
        </p>
      </div>
  
    </div>
      <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700">
    <h3 className="text-slate-400 mb-2">
      AI Expense Prediction
    </h3>
  
    <p className="text-2xl font-bold text-cyan-400">
      ₹{predictedExpense}
    </p>
  

    <p className="text-slate-400 mt-2">
      Next Month Estimate
    </p>
  </div>
  <div className="bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl border border-slate-700 mt-6">

  <h3 className="text-slate-400 mb-2">
    FinNova AI Recommendation
  </h3>

  <p className="text-cyan-400 text-lg font-semibold">
    {recommendation}
  </p>

</div>
    {/* ADD TRANSACTION */}
  
    <div className="bg-slate-900/70 backdrop-blur-lg p-8 rounded-3xl mb-10 border border-slate-700">
  
      <h2 className="text-3xl font-bold mb-6">
        Add Transaction
      </h2>
  
      <form
        onSubmit={addTransaction}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
  
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="bg-slate-950 border border-slate-700 p-4 rounded-xl"
          required
        />
  
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="bg-slate-950 border border-slate-700 p-4 rounded-xl"
          required
        />
  
        <input
          type="text"
          name="merchant"
          placeholder="Merchant"
          value={formData.merchant}
          onChange={handleChange}
          className="bg-slate-950 border border-slate-700 p-4 rounded-xl"
          required
        />
  
        <input
          type="text"
          name="payment_method"
          placeholder="Payment Method"
          value={formData.payment_method}
          onChange={handleChange}
          className="bg-slate-950 border border-slate-700 p-4 rounded-xl"
          required
        />
  
        <select
          name="transaction_type"
          value={formData.transaction_type}
          onChange={handleChange}
          className="bg-slate-950 border border-slate-700 p-4 rounded-xl"
          required
        >
          <option value="Expense">
            Expense
          </option>
  
          <option value="Income">
            Income
          </option>
        </select>
  
        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-xl font-bold"
        >
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>
  
      </form>
  
    </div>
      {/* PIE CHART */}
  
    <div className="bg-slate-900/70 backdrop-blur-lg rounded-3xl p-8 border border-slate-700 mb-10">
  
      <h2 className="text-3xl font-bold mb-6">
        Spending Distribution
      </h2>
  
      <div className="h-96">
  
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
  
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={130}
              label
            >
  
              {categoryData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
  
            </Pie>
  
            <Tooltip />
  
          </PieChart>
        </ResponsiveContainer>
  
      </div>
  
    </div>
  
    {/* BAR CHART */}
  
    <div className="bg-slate-900/70 backdrop-blur-lg rounded-3xl p-8 border border-slate-700 mb-10">
  
      <h2 className="text-3xl font-bold mb-6">
        Spending Overview
      </h2>
  
      <div className="h-96">
  
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData}>
  
            <CartesianGrid strokeDasharray="3 3" />
  
            <XAxis dataKey="category" />
  
            <YAxis />
  
            <Tooltip />
  
            <Bar
              dataKey="amount"
              radius={[10, 10, 0, 0]}
            />
  
          </BarChart>
        </ResponsiveContainer>
  
      </div>
  
    </div>
    <div className="flex gap-4 mb-8">

  <input
    type="text"
    placeholder="Search Merchant or Category"
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="bg-slate-950 border border-slate-700 p-4 rounded-xl flex-1"
  />

  <select
    value={filterType}
    onChange={(e) =>
      setFilterType(e.target.value)
    }
    className="bg-slate-950 border border-slate-700 p-4 rounded-xl"
  >
    <option>All</option>
    <option>Income</option>
    <option>Expense</option>
  </select>

</div>
    <div className="bg-slate-900/70 p-8 rounded-3xl mb-10">

  <h2 className="text-3xl font-bold mb-6">
    Monthly Trend
  </h2>

  <div className="h-96">

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <LineChart data={monthlyData}>

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="amount"
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>
    {/* RECENT TRANSACTIONS */}
  
    <div className="bg-slate-900/70 backdrop-blur-lg rounded-3xl p-8 border border-slate-700">
  
      <h2 className="text-3xl font-bold mb-6">
        Recent Transactions
      </h2>
  
      <div className="space-y-5">
  
        {filteredTransactions.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-slate-950 border border-slate-800 p-5 rounded-2xl"
          >
  
            <div>
              <h3 className="text-xl font-semibold">
                {item.merchant}
              </h3>
  
              <p className="text-slate-400">
                {item.category}
              </p>
            </div>
  
            <div className="text-right">
  
              <p className="text-2xl font-bold text-cyan-400">
                ₹{item.amount}
              </p>
  
              <p className="text-slate-400">
                {item.payment_method}
              </p>
  
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold ${
                  item.transaction_type === "Income"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {item.transaction_type}
              </span>
  
              <div className="flex gap-2 mt-3">
  
    <button
      onClick={() => editTransaction(item)}
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
    >
      Edit
    </button>
  
    <button
      onClick={() => deleteTransaction(item.id)}
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
    >
      Delete
    </button>
  
  </div>
  
            </div>
  
          </div>
        ))}
  
      </div>
  
    </div>
  
  </div>
  );
  }

export default Dashboard;