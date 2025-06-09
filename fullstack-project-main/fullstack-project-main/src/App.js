// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import MoodHistory from "./MoodHistory"; // ✅ Import MoodHistory

function App() {
  return (
    <Router>
      <nav className="p-3 bg-light">
        <Link to="/signup" className="me-3">Sign Up</Link>
        <Link to="/login" className="me-3">Login</Link>
        <Link to="/dashboard" className="me-3">Dashboard</Link>
        <Link to="/mood-history">Mood History</Link> {/* ✅ Added link */}
      </nav>

      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mood-history" element={<MoodHistory />} /> {/* ✅ Route added */}
      </Routes>
    </Router>
  );
}

export default App;
