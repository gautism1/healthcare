"use client"; // Ensures the file runs on the client-side

import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CaregiversList = () => {
  const router = useRouter();
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for new caregiver form
  const [newCaregiverName, setNewCaregiverName] = useState("");
  const [newCaregiverRole, setNewCaregiverRole] = useState("");

  // Fetch caregivers from the API
  const fetchCaregivers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/caregivers");
      const data = await response.json();

      console.log(">>>", data);

      setCaregivers(data || []); // Set caregivers or an empty list
    } catch (error) {
      console.error("Error fetching caregivers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of caregivers when the component mounts
  useEffect(() => {
    fetchCaregivers();
  }, []);

  // Function to handle adding a new caregiver
  const handleAddCaregiver = async () => {
    const newCaregiver = {
      email: newCaregiverName,
    };
    try {
      // Send the new caregiver data to the API
      const res = await fetch("/api/caregivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCaregiver),
      });

      if (res.ok) {
        setNewCaregiverName(""); // Reset form

        toast.success("Added New Caregiver");
        fetchCaregivers(); // Refresh list
      } else {
        toast.error("Please try again");
      }
    } catch (error) {
      console.error("Error adding caregiver:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Send delete request to the API with correct headers and method
      const response = await fetch(`/api/caregivers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to delete caregiver");
      }

      // Refresh the list after successful deletion
      fetchCaregivers();
    } catch (error) {
      console.error("Error deleting caregiver:", error.message);
      alert(`Error deleting caregiver: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">Caregivers</h1>

        {/* Add Caregiver Form */}
        <div className="mb-6 border max-w-xl p-2 rounded-xl">
          <h2 className=" font-medium mb-4">Add New Caregiver</h2>
          <input
            type="email"
            placeholder="Caregiver Email"
            value={newCaregiverName}
            onChange={(e) => setNewCaregiverName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />

          <button
            onClick={handleAddCaregiver}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            Add Caregiver
          </button>
        </div>

        {/* List of Caregivers */}
        {loading ? (
          <p className="text-center text-gray-500">Loading caregivers...</p>
        ) : caregivers.length === 0 ? (
          <p className="text-center text-gray-500">
            No caregivers added till now.
          </p>
        ) : (
          <ul className="space-y-4">
            {caregivers.map((caregiver) => (
              <li
                key={caregiver.id}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
              >
                <div>
                  <h2 className="text-xl font-medium">{caregiver.email}</h2>
                  <p className="text-sm text-gray-500">{caregiver.role}</p>
                </div>
                <button
                  onClick={() => handleDelete(caregiver.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CaregiversList;
