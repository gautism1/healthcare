"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeJWT } from "../lib/utils";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const router = useRouter(); // Use router from next/navigation

  const decodedPayload = decodeJWT(localStorage.getItem("jwtToken"));

  if (!decodedPayload) {
    // Redirect to login page if no token
    router.push("/auth/login");
    return;
  }

  return (
    <div className="container mx-auto p-6">
      {decodedPayload.role === null ? (
        <div>
          <h1 className=" font-bold text-red-500 mb-6">
            Dashboard Permision Denied ,Please Contact Admin
          </h1>
          <button
            className="w-fit text-xs py-2 px-4 bg-red-600 text-white rounded-lg mb-6"
            onClick={() => {
              localStorage.removeItem("jwtToken");
              router.push("/auth/login");
              toast.success("Logged Out Successfully");
            }}
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-xl p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <button
              className="w-fit text-xs py-2 px-4 bg-red-600 text-white rounded-lg mb-6"
              onClick={() => {
                localStorage.removeItem("jwtToken");
                router.push("/auth/login");
                toast.success("Logged Out Successfully");
              }}
            >
              Log out
            </button>
          </div>

          <div className="bg-zinc-100 p-4 rounded-xl border mb-6 ">
            <h2 className="text-xl font-semibold text-gray-700">
              User Details
            </h2>
            <div className="text-gray-600 mt-2">
              <div>
                Email:{" "}
                <span className="font-medium text-gray-800">
                  {decodedPayload.userName}
                </span>
              </div>
              <div>
                Role:{" "}
                <span className="font-medium text-gray-800">
                  {decodedPayload.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <h2 className="text-xl font-semibold text-gray-700  mb-4">
              Actions
            </h2>
            <div className="flex gap-2">
              {decodedPayload.role === "admin" ? (
                <div className="space-y-3">
                  <button
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => {
                      router.push("/dashboard/caregivers");
                    }}
                  >
                    Add & View Caregivers
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    Add New Patient
                  </button>
                  <button
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => {
                      router.push("/dashboard/patients");
                    }}
                  >
                    View Patient Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
