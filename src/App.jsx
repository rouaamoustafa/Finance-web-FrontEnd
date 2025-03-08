import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import Login from "./componenets/Login.jsx";
import MainPage from "./MainPage.jsx";
import AdminPage from "./admins/AdminPage.jsx";
import CreateAdmin from "./admins/CreateAdmin.jsx";
import ReportsPage from "./ReportsPage.jsx";
import ProfitGoalPage from "./ProfitGoalPage.jsx";
import PrivateRoute from "./componenets/PrivateRoute"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import "./App.css"; 

const AppWrapper = () => {
  console.log("Stored Role in localStorage:", localStorage.getItem("role"));
  return (
    <Router>
      <App />
    </Router>
  );
};

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div>
      {/* 🔹 Render Header only if NOT on login page */}
      {location.pathname !== "/login" && (
        <header className="app-header">
          <nav className="nav-container">
            <div className="nav-spacer"></div> 
            <div className="nav-center">
              <Link to="/main" className="nav-link">📊 Dashboard</Link>
              <Link to="/reports" className="nav-link">📑 Reports</Link>
              <Link to="/profit-goals" className="nav-link">💰 Profit Goals</Link>
            </div>
            <div className="logout-container">
              <button className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faUser} style={{ color: "white", marginRight: "8px" }} /> Logout
              </button>
            </div>
          </nav>
        </header>
      )}

      {/* 🔹 Define Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setRole={setRole} />} />

        {/* 🔒 Protected Routes (Only Accessible with Token) */}
        <Route element={<PrivateRoute />}>
          <Route path="/main" element={<MainPage role={role} />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profit-goals" element={<ProfitGoalPage />} />
          <Route path="/admin" element={role === "subadmin" ? <AdminPage /> : <Navigate to="/main" />} />
          <Route path="/create-admin" element={role === "subadmin" ? <CreateAdmin /> : <Navigate to="/main" />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
