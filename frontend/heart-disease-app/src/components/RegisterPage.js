import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./RegisterPage.css";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const textData = await response.text(); // Backend returns a string, not JSON

            if (response.ok) {
                setMessage("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(textData || "Error registering. Please try again.");
            }
        } catch (error) {
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <motion.div 
            className="auth-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <h2 className="auth-title">Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    className="auth-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    className="auth-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <input
                    type="password"
                    className="auth-input"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" className="neon-btn">Register</button>
                {message && <p className="message">{message}</p>}
            </form>
            <p className="switch-auth">
                Already have an account?{" "}
                <span className="register-link" onClick={() => navigate("/login")}>
                    Login
                </span>
            </p>
        </motion.div>
    );
};

export default RegisterPage;
