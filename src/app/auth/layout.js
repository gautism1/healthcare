"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isClient } from "../lib/utils";

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter();

  useEffect(() => {
    let token = "";
    if (isClient) {
      token = localStorage.getItem("jwtToken");
    }

    if (token) {
      // Redirect to dashboard if token exists
      router.push("/dashboard");
    } else {
      // Set loading to false once the check is complete
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Optional: Show loading spinner or placeholder
  }

  // Only render children if the user is not logged in
  return <div>{children}</div>;
}
