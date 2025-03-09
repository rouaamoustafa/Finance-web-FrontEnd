import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling-sheet/Signin-up.css";

const Login = ({ setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/main"); // ✅ Redirect logged-in users to main
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        console.log("Attempting to log in with:", email, password); // ✅ Log user input

        const response = await fetch("https://finance-web-zdgx.onrender.com/admins/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        console.log("Login Response:", response.status, data); // ✅ Log backend response

        if (!response.ok) {
            alert(`Login failed: ${data.error || "Unknown error"}`);
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        setRole(data.user.role);
        navigate("/main"); // ✅ Redirect after login
    } catch (err) {
        console.error("Error logging in:", err);
        alert("Error logging in. See console for details.");
    }
};



  return (
    <div className="login-container">     
      <form onSubmit={handleLogin} className="login">
        <h1 className="h1-sign">Login</h1>
        <label>Email <br/>
          <input className="input-sign"
            type="email" 
            name="email" 
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label> 
        <br/>
        <label>Password <br/>
          <input className="input-sign" 
            type="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="password"
          />
        </label> 
        <br/> <br/>
        <button className="btn-log" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Login;
