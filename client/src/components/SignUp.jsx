import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    allergies: "",
    medications: "",
    consent: false,
    role: 'patient',
    assignedProvider: '',
  });

  function updateField(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = { ...form };
    if (payload.assignedProvider === '') delete payload.assignedProvider;

    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Registration successful! Please Login.");
    navigate("/login");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white shadow-md rounded-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 border rounded mb-3"
          value={form.name}
          onChange={updateField}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={form.email}
          onChange={updateField}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          value={form.password}
          onChange={updateField}
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          className="w-full p-2 border rounded mb-3"
          value={form.age}
          onChange={updateField}
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight"
          className="w-full p-2 border rounded mb-3"
          value={form.weight}
          onChange={updateField}
        />

        <textarea
          name="allergies"
          placeholder="Allergies (optional)"
          className="w-full p-2 border rounded mb-3"
          value={form.allergies}
          onChange={updateField}
        />

        <textarea
          name="medications"
          placeholder="Medications (optional)"
          className="w-full p-2 border rounded mb-3"
          value={form.medications}
          onChange={updateField}
        />

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={updateField}
          />
          <span>I agree to share my data for medical analysis</span>
        </label>

        <div className="mb-3">
          <label className="block text-sm mb-1">Account type</label>
          <select name="role" value={form.role} onChange={updateField} className="w-full border p-2 rounded">
            <option value="patient">Patient</option>
            <option value="provider">Healthcare Provider</option>
          </select>
        </div>

        {form.role === 'patient' && (
          <input
            type="text"
            name="assignedProvider"
            placeholder="Assigned provider ID (optional)"
            className="w-full p-2 border rounded mb-3"
            value={form.assignedProvider}
            onChange={updateField}
          />
        )}

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Sign Up
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
