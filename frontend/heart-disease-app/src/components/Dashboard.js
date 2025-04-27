import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const user_id = localStorage.getItem("userId");
                if (!user_id) {
                    setError("User ID not found in localStorage.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `http://localhost:8080/api/dashboard/features/${user_id}`
                );

                const data = response.data;

                if (data.message) {
                    setError(data.message);
                } else {
                    const formattedHistory = data.history.map((item) => {
                        const match = item.prediction_result.match(/(\d+(\.\d+)?)%/);
                        const percentage = match ? match[1] : null; // get only numeric part
                        return {
                            name: item.name,
                            result: percentage,
                            age: item.age,
                            gender: item.gender,
                        };
                    });

                    setHistory(formattedHistory);
                }
            } catch (error) {
                console.error("Error fetching prediction history:", error);
                setError("No History Available");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getResultColor = (percentage) => {
        if (percentage === null) return "white";
        return parseFloat(percentage) < 50 ? "lightgreen" : "red";
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <div className="history-section">
                <h2>Prediction History</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : history.length > 0 ? (
                    <ul>
                        {history.map((entry, index) => (
                            <li key={index}>
                                <p><strong>Name:</strong> {entry.name}</p>
                                <p><strong>Age:</strong> {entry.age}</p>
                                <p><strong>Gender:</strong> {entry.gender}</p>
                                <p>
                                    <strong>Prediction Result:</strong>{" "}
                                    <span style={{ color: getResultColor(entry.result) }}>
                                        {entry.result !== null ? `${entry.result}%` : "N/A"}
                                    </span>
                                </p>
                                <hr />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No history available yet.</p>
                )}
            </div>
            <button className="predict-btn" onClick={() => navigate("/predict")}>
                Make a Prediction
            </button>
        </div>
    );
};

export default Dashboard;
