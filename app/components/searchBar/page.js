"use client";

import React, { useRef, useState, useEffect } from "react";
import { Mic, Search } from "lucide-react";
import { useRouter } from "next/navigation";

// 🔁 Animated dots for "Processing..."
const useDotAnimation = () => {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return dots;
};

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");

  const router = useRouter();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const processingDots = useDotAnimation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.replace(`/components/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const startRecording = async () => {
    try {
      setShowVoiceUI(true);
      setTranscription("");
      setIsRecording(true);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          setIsRecording(false);
          setTranscription(""); // Clear it so dots animate

          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

          const formData = new FormData();
          formData.append("audio", audioBlob, "voice.webm");

          const response = await fetch("/api/speech/", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          const transcript = data.transcription || "";

          if (transcript) {
            setTranscription("✔️ Done Listening");
            setSearchQuery(transcript);

            setTimeout(() => {
              setShowVoiceUI(false);
              router.replace(`/components/search?q=${encodeURIComponent(transcript.trim())}`);
            }, 2000);
          } else {
            setTranscription("❌ Couldn't understand audio");
            setTimeout(() => setShowVoiceUI(false), 2000);
          }
        } catch (err) {
          console.error("Transcription error:", err);
          setTranscription("❌ Something went wrong");
          setTimeout(() => setShowVoiceUI(false), 2000);
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Recording error:", err);
      setShowVoiceUI(false);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-5">
      <form onSubmit={handleSearch}>
        <div className="flex items-center border rounded-full shadow-md p-4 bg-gray-200">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow outline-none px-3 text-lg"
          />
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className="ml-2"
          >
            <Mic className={`text-gray-500 hover:text-black cursor-pointer ${isRecording ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </form>

      {showVoiceUI && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white transition-opacity duration-300">
          <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center mb-10">
            <Mic className="h-20 w-20 text-white animate-pulse" />
          </div>

          <p className="text-2xl font-semibold text-center px-6 transition-all duration-300">
            {isRecording
              ? "🎙️ Listening..."
              : transcription
              ? transcription
              : `⏳ Processing${processingDots}`}
          </p>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="mt-10 px-8 py-3 bg-white text-black text-lg rounded-full hover:bg-gray-300 transition"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
