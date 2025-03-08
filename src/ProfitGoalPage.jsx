import React, { useEffect, useState } from "react";
import Modal from "./componenets/Modal"; // Import existing Modal component
import "./styling-sheet/FinanceTable.css";

const ProfitGoalPage = ({ role }) => {
  const [goals, setGoals] = useState([]);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [date, setDate] = useState("");
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔹 Show/hide modal

  const storedRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch("https://finance-web-zdgx.onrender.com/profit_goals", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("❌ API Error:", response.status);
        return;
      }

      const data = await response.json();
      setGoals(data);
    } catch (err) {
      console.error("❌ Network Error Fetching Profit Goals:", err);
    }
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    const url = editingGoalId
      ? `https://finance-web-zdgx.onrender.com/profit_goals/${editingGoalId}`
      : "https://finance-web-zdgx.onrender.com/profit_goals";

    const method = editingGoalId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount, currency, date }),
      });

      const data = await response.json();

      if (response.ok) {
        setGoals(prev =>
          editingGoalId ? prev.map(goal => (goal.profit_goal_id === editingGoalId ? data.profit_goal : goal)) : [...prev, data.profit_goal]
        );
        closeForm();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
    }
  };

  const handleEditClick = (goal) => {
    setEditingGoalId(goal.profit_goal_id);
    setAmount(goal.amount);
    setCurrency(goal.currency);
    setDate(goal.date);
    setShowModal(true); // Show modal for editing
  };

  const handleDeleteGoal = async (id) => {
    try {
      const response = await fetch(`https://finance-web-zdgx.onrender.com/profit_goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setGoals(prev => prev.filter(goal => goal.profit_goal_id !== id));
      } else {
        alert("❌ Error deleting profit goal");
      }
    } catch (err) {
      console.error("❌ Network Error Deleting Profit Goal:", err);
    }
  };

  const openForm = () => setShowModal(true);
  const closeForm = () => {
    setShowModal(false);
    setEditingGoalId(null);
    setAmount("");
    setCurrency("");
    setDate("");
  };

  return (
    <div className="table-container">
      <div className="container-title">
        <h2>Profit Goals</h2>
        {storedRole === "subadmin" && <button className="add-btn" onClick={openForm}> Add</button>}
      </div>

      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            {storedRole === "subadmin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {goals.map(goal => (
            <tr key={goal.profit_goal_id}>
              <td>{goal.amount}</td>
              <td>{goal.currency}</td>
              <td>{goal.date}</td>
              {storedRole === "subadmin" && (
                <td className="btn-Edit-Delete">
                  <button className="ebtn" onClick={() => handleEditClick(goal)}>✏️ Edit</button>
                  <button className="dbtn" onClick={() => handleDeleteGoal(goal.profit_goal_id)}>🗑 Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Modal Popup for Adding/Editing Profit Goal */}
      <Modal isOpen={showModal} onClose={closeForm}>
        <h3>{editingGoalId ? "Edit Profit Goal" : "Add Profit Goal"}</h3>
        <form onSubmit={handleSaveGoal}>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <input type="text" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
          <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <button type="submit" className="sbtn">{editingGoalId ? "Update" : "Add"}</button>
          <button type="button" className="sbtn cancel-btn" onClick={closeForm}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default ProfitGoalPage;
