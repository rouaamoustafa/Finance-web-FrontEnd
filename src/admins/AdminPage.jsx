import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateAdmin from "./CreateAdmin";
import "../styling-sheet/AdminPage.css"; // Import styles for smooth animation

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null); // 🛠 Track admin being edited
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedRole, setUpdatedRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setError("");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5001/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("Unauthorized. Please log in again.");
        }
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      console.error("❌ Error fetching admins:", err);
      setError(err.message || "Failed to load admins.");
    }
  };

  const handleDelete = async (adminId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5001/admins/${adminId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);

      alert("✅ Admin deleted successfully!");
      setAdmins(admins.filter((admin) => admin.admin_id !== adminId));
    } catch (error) {
      console.error("❌ Error deleting admin:", error);
      alert("Failed to delete admin.");
    }
  };

  // ✅ Open Edit Form with Admin Details
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setUpdatedName(admin.name);
    setUpdatedEmail(admin.email);
    setUpdatedRole(admin.role);
  };

  // ✅ Update Admin
  const handleUpdate = async () => {
    if (!editingAdmin) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5001/admins/${editingAdmin.admin_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: updatedName, email: updatedEmail, role: updatedRole }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Update failed");

      alert("✅ Admin updated successfully!");
      setEditingAdmin(null);
      fetchAdmins(); // Refresh admin list
    } catch (error) {
      console.error("❌ Error updating admin:", error);
      alert("Failed to update admin.");
    }
  };

  return (
    <div className="admin-page-container">
      <h2 className="admin-page-title">Admin Management</h2>
      {error && <p className="error-message">{error}</p>}

      <button className="toggle-btn" onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? "⬆ Hide Admin Form" : "⬇ Show Admin Form"}
      </button>

      <div className={`collapsible-content ${isFormVisible ? "show" : ""}`}>
        <CreateAdmin onAdminCreated={fetchAdmins} />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <tr key={admin.admin_id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>
                  {admin.role !== "superadmin" && (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(admin)}>✏️ Edit</button>
                      <button className="dbtn" onClick={() => handleDelete(admin.admin_id)}>🗑 Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No admins found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Edit Form (Appears when an admin is being edited) */}
      {editingAdmin && (
        <div className="edit-modal">
          <h3>Edit Admin</h3>
          <input type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
          <input type="email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
          <select value={updatedRole} onChange={(e) => setUpdatedRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="subadmin">Subadmin</option>
          </select>
          <button onClick={handleUpdate}>Save Changes</button>
          <button onClick={() => setEditingAdmin(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
