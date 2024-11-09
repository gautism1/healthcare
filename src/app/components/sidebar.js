// components/Sidebar.js
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Sidebar({ role }) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <ul>
        <li>
          <Link href="/" className="text-lg">
            Home
          </Link>
        </li>
        {role === "admin" && (
          <li>
            <Link href="/dashboard/caregivers" className="text-lg">
              Manage Caregivers
            </Link>
          </li>
        )}
        {role === "caregiver" && (
          <li>
            <Link href="/dashboard/patients" className="text-lg">
              Manage Patients
            </Link>
          </li>
        )}
      </ul>
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white p-2 rounded mt-4 w-full"
      >
        Log Out
      </button>
    </div>
  );
}
