// src/MoodHistory.js
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";

// Map mood text or emoji to numeric score for charting
const moodScore = {
  "😄": 5,
  "😊": 4,
  "😐": 3,
  "😞": 2,
  "😢": 1,
  "happy": 5,
  "good": 4,
  "okay": 3,
  "sad": 2,
  "bad": 1,
};

function MoodHistory() {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.moodLog && data.moodLog.length > 0) {
            // Sort by date ascending
            const sortedMoodLog = data.moodLog.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );

            // Map to chart data points, convert mood text to score
            const chartData = sortedMoodLog.map((entry) => {
              // Try to find score by exact mood, else default to 3 (neutral)
              const moodText = entry.mood.toLowerCase();
              let score =
                moodScore[entry.mood] ||
                moodScore[moodText] ||
                3; // default neutral

              return {
                date: entry.date,
                mood: entry.mood,
                score,
              };
            });

            setMoodData(chartData);
          } else {
            setMoodData([]);
          }
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <p>Loading mood history...</p>;
  if (moodData.length === 0) return <p>No mood data to display.</p>;

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">📊 Mood History</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={moodData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            label={{ value: "Mood Score", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value, name, props) => {
              const { payload } = props;
              return [payload.mood, "Mood"];
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MoodHistory;
