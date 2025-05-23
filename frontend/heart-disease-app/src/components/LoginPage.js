import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./LoginPage.css";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await fetch("http://127.0.0.1:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const responseData = await response.json(); // Read response as JSON

            // Debugging logs
            console.log("Response Status:", response.status);
            console.log("Response Data:", responseData);

            if (response.ok && responseData.status === "success") {
                // Store userId in localStorage or state management
                localStorage.setItem("userId", responseData.userId);

                // Redirect to the dashboard
                navigate("/dashboard");
            } else {
                setError("Invalid username or password. Please try again.");
            }
        } catch (error) {   
            setError("Server error. Please try again later.");
            console.error("Login Error:", error);
        }
    };

    return (
        <motion.div 
            className="auth-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <h2 className="auth-title">Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    className="auth-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="auth-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="neon-btn">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <p className="switch-auth">
                Not registered?{" "}
                <span className="register-link" onClick={() => navigate("/register")}>
                    Create an account
                </span>
            </p>
        </motion.div>
    );
};

export default LoginPage;
