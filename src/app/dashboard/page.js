"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter in App Router
import Link from "next/link";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const router = useRouter(); // Use router from next/navigation

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      // Redirect to login page if no token
      router.push("/auth/login");
      return;
    }

    // Fetch user data with the token if it exists
    const fetchData = async () => {
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        // Token is invalid; redirect to login
        localStorage.removeItem("jwtToken");
        router.push("/auth/login");
      } else {
        const data = await res.json();
        setUserData(data);

        if (data.user.role === "admin") {
          const caregiverRes = await fetch("/api/caregivers", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const caregiversData = await caregiverRes.json();
          setCaregivers(caregiversData);
        }
      }
    };

    fetchData();
  }, [router]); // Make sure to include router as a dependency

  if (!userData) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return <div>JSON.stringify(userData)</div>;
}
