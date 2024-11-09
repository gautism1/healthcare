"use client";
import { useState } from "react";
import { toast } from "react-hot-toast"; // Import toast for notifications

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("caregiver");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Reset error state
    setError(null);

    // Send registration request to the API
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Registration successful! , Redirecting to Login Page"); // Show success toast
      // Redirect to the login page
      setTimeout(function () {
        window.location.href = "/auth/login";
      }, 2000);
    } else {
      if (data.message.includes("duplicate")) {
        toast.error("This email is already registered!");
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role Select */}
        <div className="mb-6">
          <label
            htmlFor="role"
            className="block text-sm font-semibold text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="caregiver">Caregiver</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Register
        </button>

        {/* Redirect to Login */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-500 hover:text-blue-700">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
