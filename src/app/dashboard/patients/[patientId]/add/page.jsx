"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const RecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const { patientId } = useParams();
  const searchParams = useSearchParams();
  const patientName = searchParams.get("name");
  const router = useRouter();
  console.log(">>>", patientName);

  if (!patientId) {
    router.push("/dashboard");
  }

  // Start recording audio and timer
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimer(0);
      startTimer();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error(
        "🎙️ Microphone permission denied. Please allow access to record audio."
      );
    }
  };

  // Stop recording audio and timer
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = []; // Clear previous recording data
        setAudioBlob(blob);

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        stopTimer();
      };
    }

    // Stop all tracks to release the microphone
    const stream = mediaRecorderRef.current && mediaRecorderRef.current.stream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Timer functions
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const saveRecording = async () => {
    if (!audioBlob) return;

    try {
      // Step 1: Request a signed URL from the backend for file upload
      const response = await fetch("/api/signed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("❌ Error generating signed URL.");
        return;
      }

      const { signedUrl, fileName } = data;

      // Step 2: Upload the file to S3 using the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT", // Use PUT for uploading to signed URL
        body: audioBlob, // Send the audio file blob directly
        headers: {
          "Content-Type": "video/webm", // Set content type for .webm files
        },
      });

      if (!uploadResponse.ok) {
        toast.error("❌ Failed to upload audio.");
        return;
      }

      console.log("File uploaded successfully with filename:", fileName);

      // Step 3: Get the file URL (without query parameters) from the signed URL
      const audioLink = signedUrl.split("?")[0]; // Extract the actual file URL

      // Step 4: Save the metadata (patient_id and audio_link) in your database
      const postMetadataResponse = await fetch("/api/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          audio_link: audioLink,
        }),
      });

      if (postMetadataResponse.ok) {
        toast.success("✅ Audio saved successfully for this patient!");
        setAudioUrl(null); // Reset the audio URL after successful save
      } else {
        toast.error("❌ Failed to save audio metadata.");
      }
    } catch (error) {
      console.error("Error saving audio:", error);
      toast.error("❌ Error uploading audio.");
    }
  };

  // Reset function to clear everything
  const resetRecording = () => {
    // Clear the state and stop the recording
    setIsRecording(false);
    setAudioUrl(null);
    setAudioBlob(null);
    setTimer(0);
    stopTimer();
    // Stop microphone stream
    const stream = mediaRecorderRef.current && mediaRecorderRef.current.stream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Format timer to display as mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col p-4 space-y-4 border border-gray-300 rounded-lg m-4 max-w-xl mx-auto">
      <h2 className="text-lg font-semibold">Patient Name : {patientName}</h2>
      <div className="text-xs text-slate-500">Patient Id : {patientId}</div>

      {/* Timer Display */}
      <div className="text-2xl font-bold text-gray-700">
        ⏱️ {formatTime(timer)}
      </div>

      <div className="space-x-2">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          🎙️ Start
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          🛑 Stop
        </button>
        <button
          onClick={resetRecording}
          className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          🔄 Reset
        </button>
      </div>

      {audioUrl && (
        <div className="mt-4 space-y-2">
          <audio controls src={audioUrl} className="w-full" />
          <button
            onClick={saveRecording}
            className="block px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            💾 Save
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordAudio;
