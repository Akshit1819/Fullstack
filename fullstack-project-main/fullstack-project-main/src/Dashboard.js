// src/Dashboard.js
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [mood, setMood] = useState("");
  const [streak, setStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState("");
  const [lastXpDate, setLastXpDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        const today = new Date().toDateString();

        if (userSnap.exists()) {
          const data = userSnap.data();
          setXp(data.xp || 0);
          setMood(data.mood || "");
          setStreak(data.streak || 0);
          setLastLoginDate(data.lastLoginDate || "");
          setLastXpDate(data.lastXpDate || "");

          if (data.lastLoginDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (data.lastLoginDate === yesterday.toDateString()) {
              setStreak(data.streak + 1);
              await updateDoc(userRef, {
                streak: data.streak + 1,
                lastLoginDate: today,
              });
            } else {
              setStreak(1);
              await updateDoc(userRef, {
                streak: 1,
                lastLoginDate: today,
              });
            }
          }
        } else {
          await setDoc(userRef, {
            xp: 0,
            mood: "",
            streak: 1,
            lastLoginDate: today,
            createdAt: serverTimestamp(),
            moodLog: [],
            lastXpDate: "",
          });
          setStreak(1);
          setLastLoginDate(today);
          setLastXpDate("");
        }
      }
    });
  }, []);

  const handleMoodChange = async () => {
    if (!mood.trim()) {
      alert("Please enter your mood before submitting!");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const today = new Date().toISOString().slice(0, 10);
    await updateDoc(userRef, {
      mood,
      moodLog: arrayUnion({ date: today, mood }),
    });
    alert("Mood updated! 😊");
  };

  const gainXP = async () => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();
    const today = new Date().toDateString();

    if (data.lastXpDate === today) {
      alert("You've already gained XP today! 🎉");
      return;
    }

    const newXp = (data.xp || 0) + 10;
    setXp(newXp);
    setLastXpDate(today);
    await updateDoc(userRef, {
      xp: newXp,
      lastXpDate: today,
    });
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mt-5 text-center">
      <h2>👋 Welcome, {user.email}</h2>
      <p>⭐ XP: <strong>{xp}</strong></p>
      <p>🔥 Streak: <strong>{streak}</strong> day(s)</p>
      <input
        type="text"
        placeholder="How are you feeling?"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="form-control my-2"
      />
      <button onClick={handleMoodChange} className="btn btn-primary w-100 mb-2">
        😊 Submit Mood
      </button>
      <button onClick={gainXP} className="btn btn-success w-100 mb-2">
        🎮 Gain XP
      </button>
      <button
        onClick={() => navigate("/mood-history")}
        className="btn btn-info w-100 mb-2"
      >
        📊 View Mood History
      </button>
      <button onClick={logout} className="btn btn-danger w-100">
        🚪 Logout
      </button>
    </div>
  );
}

export default Dashboard;
