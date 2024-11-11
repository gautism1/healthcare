"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function PatientRecordings() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { patientId } = useParams();
  const searchParams = useSearchParams();
  const patientName = searchParams.get("name");
  const router = useRouter();

  if (!patientId) {
    router.push("/dashboard");
  }

  useEffect(() => {
    async function fetchRecordings() {
      setLoading(true);
      try {
        const response = await fetch(`/api/audio?patient_id=${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recordings");
        }

        const data = await response.json();
        setRecordings(data.recordings); // Ensure this matches the API response structure
      } catch (error) {
        console.error("Failed to fetch recordings:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecordings();
  }, [patientId]);

  return (
    <div className="flex flex-col p-4 space-y-4 border border-gray-300 rounded-lg m-4 max-w-xl mx-auto">
      <button
        onClick={() => {
          router.back();
        }}
        className="border rounded-xl w-fit px-2 py-1 bg-slate-100"
      >
        Back
      </button>

      <h2>Patient Recordings 🎧</h2>
      <h2 className="text-lg font-semibold">Patient Name: {patientName}</h2>
      <div className="text-xs text-slate-500">Patient ID: {patientId}</div>

      <ul className="flex flex-col gap-2">
        {recordings.length === 0 && (
          <p>No recordings found for this patient 😢</p>
        )}
        Total audio recordings : {recordings.length}
        {recordings.map((recording, index) => (
          <li key={index} className="flex items-center gap-2">
            {index + 1}
            <audio controls>
              <source src={recording.audio_link} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
}
