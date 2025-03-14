  //helper function to write text values (for the wav header)
export function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

//encode WAV function

//google api relies on SoX to do what we are doing below, but we don't want to rely on SoX so it's easier to distribute and don't need to worry about downloading windows binaries and ensuring everyone has that working.
  // 
  // 
  // https://cloud.google.com/speech-to-text/docs/transcribe-streaming-audio#perform_streaming_speech_recognition_on_an_audio_stream

  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API

  //https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer

  //encodes audiobuffer to WAV file, converts the raw audio data into WAV file format so google can process it. Google wants 16bit PCM, mono and 16hz audio for best results.
export function encodeWAV(audioBuffer) {
    const numOfChannels = audioBuffer.numberOfChannels; //number of audio channel
    const sampleRate = audioBuffer.sampleRate; //sample rate of the audio.
    const samples = audioBuffer.getChannelData(0); // Get first channel data (mono)
  
    //buffer to store WAV file data (44 bytes for the WAV header, then space for the PCM data)
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
  
    //https://docs.fileformat.com/audio/wav/

    // WAV file header
    writeString(view, 0, "RIFF"); // "RIFF" chunk descriptor
    view.setUint32(4, 36 + samples.length * 2, true); // File size (minus 8 bytes)
    writeString(view, 8, "WAVE"); // Format
    writeString(view, 12, "fmt "); // Subchunk identifier
    view.setUint32(16, 16, true); // PCM format chunk size (16 for PCM)
    view.setUint16(20, 1, true); // Audio format (1 = PCM)
    view.setUint16(22, numOfChannels, true); // Number of channels (1 = mono, 2 = stereo)
    view.setUint32(24, sampleRate, true); // Sample rate (16000 Hz for google api)
    view.setUint32(28, sampleRate * numOfChannels * 2, true); // Byte rate
    view.setUint16(32, numOfChannels * 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample (16-bit audio)
    writeString(view, 36, "data"); // "data" chunk header
    view.setUint32(40, samples.length * 2, true); // Data chunk size (size of the audio file)
  

    // Write PCM data
    let offset = 44; //data starts after 44-byte wav header (wav files begin with 44-byte header always, offset of 2 since each sample is 2 bytes)
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i])); //ensures sample is within -1.0 to 1.0 (audio buffer stores values as floating points, WAV needs 16 bit.) 
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true); //converts float to 16-bit
    }
  
    return new Blob([buffer], { type: "audio/wav" }); //returns WAV as Blob (binary large object)
  }