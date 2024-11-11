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
  const stopTimeoutRef = useRef(null);

  const { patientId } = useParams();
  const searchParams = useSearchParams();
  const patientName = searchParams.get("name");
  const router = useRouter();

  if (!patientId) {
    router.push("/dashboard");
  }

  // Start recording audio and timer
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        audioChunksRef.current = [];
        if (blob.size > 0) {
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        } else {
          toast.error("❌ No audio data recorded.");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimer(0);
      startTimer();

      stopTimeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 20000);
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
      setIsRecording(false);
      stopTimer();
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
    }

    const stream = mediaRecorderRef.current && mediaRecorderRef.current.stream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime >= 20) {
          clearInterval(timerRef.current);
          return 20;
        }
        return prevTime + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const saveRecording = async () => {
    if (!audioBlob) return;

    if (navigator.onLine) {
      await uploadAudio(); // Upload if online
    } else {
      queueAudio(); // Queue if offline
    }
  };

  // Queue the audio in localStorage if offline
  const queueAudio = () => {
    const queuedRecordings = JSON.parse(localStorage.getItem("queuedRecordings") || "[]");

    queuedRecordings.push({
      patient_id: patientId,
      blob: audioBlob,
      timestamp: Date.now(),
    });

    localStorage.setItem("queuedRecordings", JSON.stringify(queuedRecordings));
    toast.success("Audio queued and will be uploaded when online.");
  };

  // Upload the audio to server
  const uploadAudio = async () => {
    try {
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

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: audioBlob,
        headers: {
          "Content-Type": "audio/wav",
        },
      });

      if (!uploadResponse.ok) {
        toast.error("❌ Failed to upload audio.");
        return;
      }

      const audioLink = signedUrl.split("?")[0];

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
        toast.success("✅ Audio saved successfully!");
        setAudioUrl(null);
      } else {
        toast.error("❌ Failed to save audio metadata.");
      }
    } catch (error) {
      console.error("Error saving audio:", error);
      toast.error("❌ Error uploading audio.");
    }
  };

  const processQueue = async () => {
    const queuedRecordings = JSON.parse(localStorage.getItem("queuedRecordings") || "[]");
  
    for (const recording of queuedRecordings) {
      let audioBlob = recording.blob; // Use 'let' to allow reassignment
      let patientId = recording.patient_id; // Use 'let' to allow reassignment
      await uploadAudio();
    }
  
    localStorage.removeItem("queuedRecordings");
    toast.success("Queued audios uploaded successfully.");
  };
  

  // Listen for network status changes
  useEffect(() => {
    if (navigator.onLine) {
      processQueue(); // Attempt to upload queued audios when coming online
    }

    window.addEventListener("online", processQueue);
    return () => window.removeEventListener("online", processQueue);
  }, []);

  const resetRecording = () => {
    setIsRecording(false);
    setAudioUrl(null);
    setAudioBlob(null);
    setTimer(0);
    stopTimer();
    const stream = mediaRecorderRef.current && mediaRecorderRef.current.stream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

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
      <h2 className="text-lg font-semibold">Patient Name : {patientName}</h2>
      <div className="text-xs text-slate-500">Patient Id : {patientId}</div>

      <div className="text-2xl font-bold text-gray-700">
        ⏱️ {formatTime(timer)} [Max : 20sec]
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
