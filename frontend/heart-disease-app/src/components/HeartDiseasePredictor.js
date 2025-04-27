import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeartDiseasePredictor.css";

const initialState = {
    name: "", age: "", gender: "", chestPain: "", bp: "", cholesterol: "",
    sugarLevel: "", ecgIssues: "", maxHr: "", exerciseAngina: "", oldpeak: "", stSlope: ""
};

const reducer = (state, action) => {
    return { ...state, [action.name]: action.value };
};

const HeartDiseasePredictor = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        dispatch({ name: e.target.name, value: e.target.value });
    };

    const validateFields = (fields) => {
        return fields.every(field => state[field] && state[field].toString().trim() !== "");
    };

    const nextStep = () => {
        const stepValidation = {
            1: ["name", "age", "gender"],
            2: ["chestPain", "bp"],
            3: ["cholesterol", "sugarLevel"],
            4: ["exerciseAngina", "maxHr"],
            5: ["ecgIssues", "oldpeak", "stSlope"]
        };

        if (validateFields(stepValidation[step] || [])) {
            setStep(prev => prev + 1);
        } else {
            alert("Please fill all fields before proceeding.");
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Map gender and exerciseAngina select values to string as expected by backend
            const requestBody = {
                name: state.name,
                age: Number(state.age),
                gender: state.gender === "1" ? "male" : "female",
                chestPain: Number(state.chestPain),
                bp: Number(state.bp),
                cholesterol: Number(state.cholesterol),
                sugarLevel: Number(state.sugarLevel),
                ecgIssues: Number(state.ecgIssues),
                maxHr: Number(state.maxHr),
                exerciseAngina: state.exerciseAngina === "1" ? "yes" : "no",
                oldpeak: Number(state.oldpeak),
                stSlope: Number(state.stSlope),
                userId: 1 
            };

            const response = await fetch("http://127.0.0.1:8080/api/heart-disease/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            const risk = data.heart_disease_risk;

            navigate("/result", { state: { result: risk } });
        } catch (error) {
            console.error("Prediction Error:", error);
            navigate("/result", { state: { result: "Error in prediction. Please try again." } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="heart-disease-container">
            <div className="form-container">
                <h2 className="form-title">Heart Disease Risk Predictor</h2>

                {step === 1 && (
                    <div className="form-step">
                        <h3>Basic Information</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={state.name}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <input
                            type="number"
                            name="age"
                            placeholder="Your Age"
                            value={state.age}
                            onChange={handleChange}
                            className="input-field"
                            min="1"
                            required
                        />
                        <select
                            name="gender"
                            value={state.gender}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                        </select>
                        <button className="neon-btn" onClick={nextStep}>Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step">
                        <h3>Symptoms & Medical History</h3>
                        <label>Do you experience chest pain?</label>
                        <select
                            name="chestPain"
                            value={state.chestPain}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="0">No chest pain</option>
                            <option value="1">Mild discomfort</option>
                            <option value="2">Frequent pain</option>
                            <option value="3">Severe pain</option>
                        </select>

                        <label>Blood Pressure (mmHg):</label>
                        <input
                            type="number"
                            name="bp"
                            placeholder="Blood Pressure"
                            value={state.bp}
                            onChange={handleChange}
                            className="input-field"
                            min="50"
                            required
                        />
                        <button className="neon-btn" onClick={nextStep}>Next</button>
                        <button className="outline-btn" onClick={prevStep}>Back</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step">
                        <h3>Lifestyle & Additional Questions</h3>
                        <label>Cholesterol Level (mg/dL):</label>
                        <input
                            type="number"
                            name="cholesterol"
                            placeholder="Cholesterol Level"
                            value={state.cholesterol}
                            onChange={handleChange}
                            className="input-field"
                            min="100"
                            required
                        />

                        <label>Blood Sugar Level (mg/dL):</label>
                        <input
                            type="number"
                            name="sugarLevel"
                            placeholder="Blood Sugar Level"
                            value={state.sugarLevel}
                            onChange={handleChange}
                            className="input-field"
                            min="50"
                            required
                        />
                        <button className="neon-btn" onClick={nextStep}>Next</button>
                        <button className="outline-btn" onClick={prevStep}>Back</button>
                    </div>
                )}

                {step === 4 && (
                    <div className="form-step">
                        <h3>Physical Activity</h3>
                        <label>Do you feel chest pain after physical activity?</label>
                        <select
                            name="exerciseAngina"
                            value={state.exerciseAngina}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>

                        <label>Max Heart Rate during Exercise:</label>
                        <input
                            type="number"
                            name="maxHr"
                            placeholder="Max Heart Rate"
                            value={state.maxHr}
                            onChange={handleChange}
                            className="input-field"
                            min="50"
                            required
                        />
                        <button className="neon-btn" onClick={nextStep}>Next</button>
                        <button className="outline-btn" onClick={prevStep}>Back</button>
                    </div>
                )}

                {step === 5 && (
                    <form onSubmit={handleSubmit} className="form-step">
                        <h3>Final Questions</h3>

                        <label>ECG Issues:</label>
                        <input
                            type="number"
                            name="ecgIssues"
                            placeholder="ECG Issues (0-2)"
                            value={state.ecgIssues}
                            onChange={handleChange}
                            className="input-field"
                            min="0"
                            max="2"
                            required
                        />

                        <label>Oldpeak (ST Depression):</label>
                        <input
                            type="number"
                            name="oldpeak"
                            placeholder="Oldpeak Value"
                            value={state.oldpeak}
                            onChange={handleChange}
                            className="input-field"
                            step="0.1"
                            required
                        />

                        <label>ST Slope:</label>
                        <input
                            type="number"
                            name="stSlope"
                            placeholder="ST Slope (0-2)"
                            value={state.stSlope}
                            onChange={handleChange}
                            className="input-field"
                            min="0"
                            max="2"
                            required
                        />

                        <button type="submit" className="neon-btn" disabled={loading}>
                            {loading ? "Predicting..." : "Predict"}
                        </button>
                        <button type="button" className="outline-btn" onClick={prevStep}>Back</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default HeartDiseasePredictor;
