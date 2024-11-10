"use client"; // Ensures the file runs on the client-side

import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { decodeJWT } from "../../lib/utils";

const PatientsList = () => {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for new patient form
  const [newPatientName, setNewPatientName] = useState("");

  // Fetch patients from the API
  const fetchPatients = async () => {
    const decodedPayload = decodeJWT(localStorage.getItem("jwtToken"));

    setLoading(true);
    try {
      const response = await fetch(
        `/api/patients?caregiver_id=${decodedPayload.userId}`
      );
      const data = await response.json();

      setPatients(data || []); // Set patients or an empty list
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of patients when the component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  // Function to handle adding a new patient
  const handleAddPatient = async () => {
    const decodedPayload = decodeJWT(localStorage.getItem("jwtToken"));
    const newPatient = {
      name: newPatientName,
      caregiver_id: decodedPayload.userId,
    };
    try {
      // Send the new patient data to the API
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });

      if (res.ok) {
        setNewPatientName(""); // Reset form

        toast.success("Added New Patient");
        fetchPatients(); // Refresh list
      } else {
        toast.error("Please try again");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Send delete request to the API with correct headers and method
      const response = await fetch(`/api/patients`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to delete patient");
      }

      // Refresh the list after successful deletion
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error.message);
      alert(`Error deleting patient: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={() => {
            router.back();
          }}
          className="border rounded-xl w-fit px-2 py-1 bg-slate-100"
        >
          Back to dashboard
        </button>
        <h1 className="text-2xl font-semibold my-6">Patients</h1>

        {/* Add Patient Form */}
        <div className="mb-6 border max-w-xl p-2 rounded-xl">
          <h2 className="font-medium mb-4">Add New Patient</h2>
          <input
            type="text"
            placeholder="Patient Name"
            value={newPatientName}
            onChange={(e) => setNewPatientName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />

          <button
            onClick={handleAddPatient}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            Add Patient
          </button>
        </div>

        {/* List of Patients */}
        {loading ? (
          <p className="text-center text-gray-500">Loading patients...</p>
        ) : patients.length === 0 ? (
          <p className="text-center text-gray-500">
            No patients added till now.
          </p>
        ) : (
          <ul className="space-y-4">
            {patients.map((patient) => (
              <li
                key={patient.id}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
              >
                <div className="flex flex-col">
                  <h2 className="text-xl font-medium">{patient.name}</h2>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        router.push(
                          `/dashboard/patients/${patient.id}/add?name=${patient.name}`
                        );
                      }}
                      className="text-xs text-left my-3 rounded-xl text-blue-500 hover:text-red-700 transition border-2 px-2 py-1"
                    >
                      🎙️ Add New Audio
                    </button>
                    <button
                      onClick={() => {
                        router.push(
                          `/dashboard/patients/${patient.id}/recordings?name=${patient.name}`
                        );
                      }}
                      className="text-xs text-left my-3 rounded-xl text-blue-500 bg-slate-200  hover:text-red-700 transition border-2 px-2 py-1"
                    >
                      🎧 All Recordings
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  ❌
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

export default PatientsList;
