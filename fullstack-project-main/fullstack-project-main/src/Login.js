import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 320,
        margin: "80px auto",
        padding: 30,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderRadius: 12,
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>🔑 Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 15,
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 16,
          fontFamily: "inherit",
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 15,
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 16,
          fontFamily: "inherit",
        }}
      />
      <button
        onClick={login}
        disabled={loading}
        style={{
          width: "100%",
          padding: 14,
          backgroundColor: "#007bff",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = "#007bff")}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {message && (
        <p
          style={{
            marginTop: 20,
            textAlign: "center",
            color: message.includes("successful") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;
