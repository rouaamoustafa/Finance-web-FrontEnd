import React, { useEffect, useState } from "react";
import Modal from "../componenets/Modal";
import "../styling-sheet/FinanceTable.css";

const ExpensesPage = ({ role }) => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://finance-web-zdgx.onrender.com/expenses", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const canEditDelete = role === "admin" || role === "subadmin";

  const openForm = () => setShowModal(true);
  const closeForm = () => {
    setShowModal(false);
    setEditingExpenseId(null);
    setTitle("");
    setDescription("");
    setAmount("");
    setCurrency("");
  };

  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingExpenseId ? `https://finance-web-zdgx.onrender.com/expenses/${editingExpenseId}` : "https://finance-web-zdgx.onrender.com/expenses";
    const method = editingExpenseId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, amount, currency:"$" }),
      });

      const result = await response.json();
      if (response.ok) {
        setExpenses(prev =>
          editingExpenseId ? prev.map(exp => (exp.id === editingExpenseId ? result.expense : exp)) : [...prev, result.expense]
        );
        closeForm();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert("Error adding/updating expense.");
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpenseId(expense.id);
    setTitle(expense.title);
    setDescription(expense.description || "");
    setAmount(expense.amount);
    setCurrency(expense.currency);
    setShowModal(true);
  };

  const handleDeleteExpense = async (id) => {
    if (!id) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://finance-web-zdgx.onrender.com/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
      } else {
        alert("Failed to delete expense.");
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
    <div className="table-container">
      <div className="container-title">
        <h2>Expenses</h2>
        {canEditDelete && <button className="add-btn" onClick={openForm}>ADD</button>}
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{expense.title}</td>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
              <td>$</td>
              <td className="btn-Edit-Delete">
                {canEditDelete && (
                  <>
                    <button className="ebtn" onClick={() => handleEditClick(expense)}>✏️ Edit</button>
                    <button className="dbtn" onClick={() => handleDeleteExpense(expense.id)}>🗑 Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Modal Popup for Adding/Editing Expense */}
      <Modal isOpen={showModal} onClose={closeForm}>
        <h3>{editingExpenseId ? "Edit Expense" : "Add Expense"}</h3>
        <form onSubmit={handleAddOrUpdateExpense}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <input type="text" placeholder="Currency" value="$" onChange={(e) => setCurrency(e.target.value)} required />
          <button type="submit" className="sbtn">{editingExpenseId ? "Update" : "Add"}</button>
          <button type="button" className="sbtn cancel-btn" onClick={closeForm}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default ExpensesPage;
