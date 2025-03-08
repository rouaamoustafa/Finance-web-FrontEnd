import React, { useEffect, useState } from "react";
import Modal from "../componenets/Modal";
import "../styling-sheet/FinanceTable.css";

const RecurringIncomesPage = ({ role }) => {
  const [incomes, setIncomes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecurringIncomes();
  }, []);

  const fetchRecurringIncomes = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5001/recurring_incomes", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setIncomes(data);
    } catch (err) {
      console.error("Error fetching recurring incomes:", err);
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
    setStartDate("");
    setEndDate("");
  };

  const handleAddOrUpdateIncome = async (e) => {
    e.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      alert("End date cannot be earlier than the start date!");
      return;
    }
    
    const token = localStorage.getItem("token");
    const url = editingIncomeId ? `http://localhost:5001/recurring_incomes/${editingIncomeId}` : "http://localhost:5001/recurring_incomes";
    const method = editingIncomeId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, amount, currency:"$", start_date: startDate, end_date: endDate }),
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
    setStartDate(income.start_date);
    setEndDate(income.end_date);
    setShowModal(true);
  };

  const handleDeleteIncome = async (id) => {
    if (!id) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5001/recurring_incomes/${id}`, {
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

  return (
    <div className="table-container">
      <div className="container-title">
        <h2>Recurring Incomes</h2>
        <button className="add-btn" onClick={openForm}>ADD</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Start Date</th>
            <th>End Date</th>
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
              <td>{income.start_date}</td>
              <td>{income.end_date}</td>
              <td className="btn-Edit-Delete">
                <button className="ebtn" onClick={() => handleEditClick(income)}>✏️ Edit</button>
                <button className="dbtn" onClick={() => handleDeleteIncome(income.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Modal Popup for Adding/Editing Recurring Income */}
      <Modal isOpen={showModal} onClose={closeForm}>
        <h3>{editingIncomeId ? "Edit Recurring Income" : "Add Recurring Income"}</h3>
        <form onSubmit={handleAddOrUpdateIncome}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <input type="text" placeholder="Currency" value="$" onChange={(e) => setCurrency(e.target.value)} required />
          <input type="date" value={startDate} min={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          <button type="submit" className="sbtn">{editingIncomeId ? "Update" : "Add"}</button>
          <button type="button" className="sbtn cancel-btn" onClick={closeForm}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default RecurringIncomesPage;
