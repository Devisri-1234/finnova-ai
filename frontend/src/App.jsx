import { useEffect, useState } from "react";

function App() {

  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    merchant: "",
    payment_method: ""
  });

  useEffect(() => {
    fetchTransactions();
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

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const addTransaction = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/transactions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            ...formData,
            amount: Number(formData.amount)
          })
        }
      );

      if (response.ok) {

        setFormData({
          category: "",
          amount: "",
          merchant: "",
          payment_method: ""
        });

        fetchTransactions();
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        FinNova AI
      </h1>

      {/* ANALYTICS CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
          <h2 className="text-gray-400 mb-2">
            Total Transactions
          </h2>

          <p className="text-4xl font-bold">
            {transactions.length}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
          <h2 className="text-gray-400 mb-2">
            Total Spending
          </h2>

          <p className="text-4xl font-bold">
            ₹
            {transactions
              .reduce(
                (acc, item) => acc + item.amount,
                0
              )
              .toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
          <h2 className="text-gray-400 mb-2">
            Categories
          </h2>

          <p className="text-4xl font-bold">
            {
              new Set(
                transactions.map(
                  (item) => item.category
                )
              ).size
            }
          </p>
        </div>

      </div>

      {/* ADD TRANSACTION FORM */}

      <div className="bg-gray-900 p-8 rounded-3xl mb-10 border border-gray-800">

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
            className="bg-black p-4 rounded-xl outline-none"
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="bg-black p-4 rounded-xl outline-none"
            required
          />

          <input
            type="text"
            name="merchant"
            placeholder="Merchant"
            value={formData.merchant}
            onChange={handleChange}
            className="bg-black p-4 rounded-xl outline-none"
            required
          />

          <input
            type="text"
            name="payment_method"
            placeholder="Payment Method"
            value={formData.payment_method}
            onChange={handleChange}
            className="bg-black p-4 rounded-xl outline-none"
            required
          />

          <button
            type="submit"
            className="bg-white text-black p-4 rounded-xl font-bold hover:scale-105 duration-300"
          >
            Add Transaction
          </button>

        </form>

      </div>

      {/* TRANSACTIONS LIST */}

      <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">

        <h2 className="text-3xl font-bold mb-6">
          Recent Transactions
        </h2>

        <div className="space-y-5">

          {transactions.map((item) => (

            <div
              key={item.id}
              className="flex justify-between items-center bg-black p-5 rounded-2xl"
            >

              <div>
                <h3 className="text-xl font-semibold">
                  {item.merchant}
                </h3>

                <p className="text-gray-400">
                  {item.category}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">
                  ₹{item.amount}
                </p>

                <p className="text-gray-400">
                  {item.payment_method}
                </p>
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default App;