import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IncomesPage from "./dashboard/IncomesPage.jsx";
import ExpensesPage from "./dashboard/ExpensesPage.jsx";
import RecurringExpensesPage from "./dashboard/RecurringExpensesPage.jsx";
import RecurringIncomesPage from "./dashboard/RecurringIncomesPage.jsx";
import  "./App.css";


const MainPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [activeTab, setActiveTab] = useState("income");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole && role !== storedRole) {
      setRole(storedRole);
    }
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(""); // Reset role before navigating
    navigate("/"); // Redirect to login
  };

  const goToAdminPage = () => {navigate("/admin");}

  const tabComponents = {
    income: <IncomesPage role={role} />,
    expense: <ExpensesPage role={role} />,
    recurringIncome: <RecurringIncomesPage role={role} />,
    recurringExpense: <RecurringExpensesPage role={role} />,
  };

  return (
    <div>
      <h2></h2>
      {/* <button onClick={handleLogout} className="logout-btn">
        Logout
      </button> */}
      
      <div className="finance-container ">
        <div className="same-line"><div className="menu-bar-header">
          {Object.keys(tabComponents).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "active" : ""}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace("Income", " Income").replace("Expense", " Expense")}
            </button>
          ))}
        </div>
        {role === "subadmin" && <button className= "add-admin-btn" onClick={goToAdminPage}>ADD Admin</button>}</div>

        <div className="table-container">{tabComponents[activeTab]}</div>
      </div>

      
    </div>
  );
};

export default MainPage;
