import React, { useState } from "react";

export default function UserInputForm({ onNext }) {
  const [formData, setFormData] = useState({ age: "", sex: "", chestPain: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleNext} className="glass max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Basic Information</h2>

      <label className="block mb-2">Age:</label>
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded"
        required
      />

      <label className="block mb-2">Sex:</label>
      <select
        name="sex"
        value={formData.sex}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded"
        required
      >
        <option value="">Select</option>
        <option value="0">Female</option>
        <option value="1">Male</option>
      </select>

      <label className="block mb-2">Chest Pain Type:</label>
      <select
        name="chestPain"
        value={formData.chestPain}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded"
        required
      >
        <option value="">Select</option>
        <option value="1">Typical Angina</option>
        <option value="2">Atypical Angina</option>
        <option value="3">Non-Anginal Pain</option>
        <option value="4">Asymptomatic</option>
      </select>

      <button type="submit" className="neon-btn w-full mt-4">Next</button>
    </form>
  );
}
