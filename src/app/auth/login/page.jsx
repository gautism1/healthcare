"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast"; // Importing toast for notifications

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlelogin = async (e) => {
    e.preventDefault();

    // Reset any previous toasts
    toast.dismiss();

    // Show loading toast
    const loginToast = toast.loading("logging in...");

    try {
      // Making the API call to the login endpoint
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(">>", data);
        localStorage.setItem("jwtToken", data.token);
        // If successful, show success toast and redirect
        toast.success("Successfully signed in!", { id: loginToast });
        setTimeout(function () {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        // If the response has an error, show error toast
        toast.error(data.message || "Something went wrong!", {
          id: loginToast,
        });
      }
    } catch (error) {
      // If there was a network or API error
      toast.error("An error occurred. Please try again.", { id: loginToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handlelogin}
        className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

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
        <div className="mb-6">
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Login
        </button>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Dont have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-500 hover:text-blue-700"
            >
              Register Here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
