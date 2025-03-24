"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, Search } from "lucide-react";
import { encodeWAV } from "@/app/utils/audioUtils";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [transcription, setTranscription] = useState("");
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const router = useRouter();
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const speakingCheckInterval = useRef(null);

  const startRecording = async () => {
    try {
      setTranscription("");
      setShowVoiceUI(true);
      audioChunksRef.current = [];

      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(streamRef.current);

      recorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorderRef.current.start();

      // Volume monitoring
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(streamRef.current);
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;

      source.connect(analyserRef.current);
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      speakingCheckInterval.current = setInterval(() => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setIsSpeaking(average > 20);
      }, 100);
    } catch (err) {
      console.error("Error starting recording:", err);
      setShowVoiceUI(false);
    }
  };

  const stopRecording = async () => {
    clearInterval(speakingCheckInterval.current);
    setIsSpeaking(false);

    if (!recorderRef.current) {
      setShowVoiceUI(false);
      return;
    }

    recorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());

    recorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioBlob);

      reader.onloadend = async () => {
        const audioBuffer = reader.result;
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const decodedAudio = await audioContextRef.current.decodeAudioData(audioBuffer);
        const offlineContext = new OfflineAudioContext(1, decodedAudio.length, 16000);
        const bufferSource = offlineContext.createBufferSource();
        bufferSource.buffer = decodedAudio;
        bufferSource.connect(offlineContext.destination);
        bufferSource.start();

        offlineContext.startRendering().then(async (resampledBuffer) => {
          const resampledBlob = encodeWAV(resampledBuffer);
          const base64Reader = new FileReader();

          base64Reader.readAsDataURL(resampledBlob);
          base64Reader.onloadend = async () => {
            const base64data = base64Reader.result.split(",")[1];

            const response = await fetch("/api/speech", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audioData: base64data }),
            });

            const data = await response.json();
            const transcript = data.transcription || "No transcription found.";

            setTranscription(transcript);
            setSearchQuery(transcript);
            setShowVoiceUI(false);

            if (data.transcription) {
              router.replace(`../components/search?q=${encodeURIComponent(data.transcription)}`);
            }
          };
        });
      };
    };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.replace(`../components/search?q=${encodeURIComponent(searchQuery)}`);
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
            <Mic className="text-gray-500 hover:text-black cursor-pointer" />
          </button>
        </div>
      </form>

      {showVoiceUI && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white transition-opacity duration-300">
          {isSpeaking ? (
            <div className="flex items-end h-40 space-x-2 mb-10">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`waveform-bar ${isSpeaking ? "animate" : ""}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center mb-10">
              <Mic className="h-20 w-20 text-white" />
            </div>
          )}

          <p className="text-3xl font-semibold text-center max-w-2xl px-6 tracking-wide animate-fade-in min-h-[48px]">
            {transcription
              ? transcription
              : isSpeaking
              ? "Listening..."
              : (
                <span className="flex justify-center items-center space-x-2 text-2xl text-gray-300">
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              )}
          </p>

          <button
            onClick={() => {
              setShowVoiceUI(false);
              setIsSpeaking(false);
              if (recorderRef.current?.state === "recording") {
                recorderRef.current.stop();
                streamRef.current?.getTracks().forEach((t) => t.stop());
              }
              clearInterval(speakingCheckInterval.current);
            }}
            className="mt-10 px-8 py-3 bg-white text-black text-lg rounded-full hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
