import React, { useState } from 'react';
import "../styling-sheet/CreateAdmin.css"; // Updated stylesheet

const CreateAdmin = ({ onAdminCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found. Please log in again.");
      return;
    }

    const formData = { name, email, password, role };

    try {
      const response = await fetch("https://finance-web-zdgx.onrender.com/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Admin created successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setRole("admin");
        if (onAdminCreated) onAdminCreated();
      } else {
        alert(`❌ Failed to create admin: ${data.error}`);
      }
    } catch (error) {
      alert("❌ Failed to create admin.");
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-box">
        <h1 className="admin-form-title"> Register Admin</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="input-field-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="input-field-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-field-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="input-field-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="admin">Admin</option>
              <option value="subadmin">Subadmin</option>
            </select>
            
          </div>

          <button className="admin-submit-btn" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
