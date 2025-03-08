import React, { useEffect, useState } from "react";
import Modal from "../componenets/Modal"; // Import Modal component
import "../styling-sheet/FinanceTable.css";

const IncomesPage = ({ role }) => {
  const [incomes, setIncomes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔹 Show/hide modal

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://finance-web-zdgx.onrender.com/incomes", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setIncomes(data);
    } catch (err) {
      console.error("Error fetching incomes:", err);
    }
  };

  const handleAddOrUpdateIncome = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingIncomeId
      ? `https://finance-web-zdgx.onrender.com/incomes/${editingIncomeId}`
      : "https://finance-web-zdgx.onrender.com/incomes";
    const method = editingIncomeId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, amount, currency:"$" }),
      });

      const result = await response.json();
      if (response.ok) {
        setIncomes(prev =>
          editingIncomeId ? prev.map(inc => (inc.id === editingIncomeId ? result.income : inc)) : [...prev, result.income]
        );
        closeForm();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert("Error adding/updating income.");
    }
  };

  const handleEditClick = (income) => {
    setEditingIncomeId(income.id);
    setTitle(income.title);
    setDescription(income.description || "");
    setAmount(income.amount);
    setCurrency(income.currency);
    setShowModal(true); // Show modal
  };

  const handleDeleteIncome = async (id) => {
    if (!id) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://finance-web-zdgx.onrender.com/incomes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setIncomes(prev => prev.filter(inc => inc.id !== id));
      } else {
        alert("Failed to delete income.");
      }
    } catch (err) {
      console.error("Error deleting income:", err);
    }
  };

  const openForm = () => setShowModal(true);
  const closeForm = () => {
    setShowModal(false);
    setEditingIncomeId(null);
    setTitle("");
    setDescription("");
    setAmount("");
    setCurrency("");
  };

  return (
    <div className="table-container">
      <div className="container-title">
        <h2>Incomes</h2>
        <button className="add-btn" onClick={openForm}>ADD</button>
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
          {incomes.map(income => (
            <tr key={income.id}>
              <td>{income.title}</td>
              <td>{income.description}</td>
              <td>{income.amount}</td>
              <td>$</td>
              <td className="btn-Edit-Delete">
                <button className="ebtn" onClick={() => handleEditClick(income)}>✏️ Edit</button>
                <button className="dbtn" onClick={() => handleDeleteIncome(income.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Modal Popup for Adding/Editing Income */}
      <Modal isOpen={showModal} onClose={closeForm}>
        <h3>{editingIncomeId ? "Edit Income" : "Add Income"}</h3>
        <form onSubmit={handleAddOrUpdateIncome}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <input type="text" placeholder="Currency" value="$" onChange={(e) => setCurrency(e.target.value)} disabled />
          <button type="submit" className="sbtn">{editingIncomeId ? "Update" : "Add"}</button>
          <button type="button" className="sbtn cancel-btn" onClick={closeForm}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default IncomesPage;
