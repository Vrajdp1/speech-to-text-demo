'use client';
import { useState, useRef } from 'react';
import { encodeWAV } from './utils/audioUtils';
import Header from './components/header/page';
import { AuthContextProvider } from './utils/auth-context';
import SearchBar from './searchBar/page';

export default function Page() {
  const [transcription, setTranscription] = useState(""); //stores transcript
  const recorderRef = useRef(null); //media recorder instance
  const streamRef = useRef(null); //microphone stream
  const audioChunksRef = useRef([]); //stores the audio chunks
  const audioContextRef = useRef(null); //stores the web audio api context

  //records audio from users mic
  const startRecording = async () => {
    try {
      // Request access to the user's microphone
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create a new MediaRecorder instance
      recorderRef.current = new MediaRecorder(streamRef.current);

      //collects recorded audio chunks
      recorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // Start recording
      recorderRef.current.start();
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  //stops the recording (processes audio, sends to the API)
  const stopRecording = async () => {
    if (!recorderRef.current) {
      console.error("No recorder instance available.");
      return;
    }

    // Stop the recording
    recorderRef.current.stop();

    // Stop all audio tracks from the stream
    streamRef.current.getTracks().forEach((track) => track.stop());

    // When the recording is stopped, process the audio data
    recorderRef.current.onstop = async () => {
      // Create a Blob from the collected audio chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

      // read the audio data
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioBlob);
      reader.onloadend = async () => {
        const audioBuffer = reader.result;

        // Use Web Audio API to resample to 16kHz
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        const decodedAudio = await audioContext.decodeAudioData(audioBuffer); //decodes the raw audio 

        // Resample audio to 16kHz
        const offlineContext = new OfflineAudioContext(
          1, // Mono audio
          decodedAudio.length,
          16000 // Target sample rate of 16kHz
        );
        const bufferSource = offlineContext.createBufferSource();
        bufferSource.buffer = decodedAudio;
        bufferSource.connect(offlineContext.destination);
        bufferSource.start();

        // Render the resampled audio
        offlineContext.startRendering().then(async (resampledBuffer) => {
          // Convert resampled audio to WAV

          const audioBlob = encodeWAV(resampledBuffer);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
          const base64data = reader.result.split(",")[1]; //extracts the base64 content 


          // Send the base64-encoded audio data to the API
          const response = await fetch("/api/speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioData: base64data }),
          });
        
          //gets response and updates transcription
          const data = await response.json();
          setTranscription(data.transcription || "No transcription found.");
        };
      });
    }
    };
  };

  return (
    <AuthContextProvider>
      <Header />
    <SearchBar />
    {/* anyone who is doing voice search go to /components/searchBar */}
    
      {/* Button to start and stop recording (just for testing)*/}
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 active:bg-blue-700 transition duration-150 ease-in-out"
      >
        Hold to Speak
      </button>

      {/* Display the transcription result */}
      <p>{transcription}</p>
    </AuthContextProvider>
  );
}
