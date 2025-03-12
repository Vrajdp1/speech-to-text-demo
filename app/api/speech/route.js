import { SpeechClient } from "@google-cloud/speech";

const client = new SpeechClient();

export async function POST(req) {
  try {
    // Get the audio data from the request body
    const { audioData } = await req.json();

    // Decode the base64-encoded audio data
    const audioBuffer = Buffer.from(audioData, "base64");

    // Prepare the request for the Google Speech API
    const request = {
      audio: {
        content: audioBuffer.toString("base64"),  // Send the audio as base64
      },
      config: {
        encoding: "LINEAR16",        // Ensure the encoding is LINEAR16
        languageCode: "en-US",       // Language code (US English)
      },
    };

    // Call the Google Speech API to process the audio
    const [response] = await client.recognize(request);
    console.log('Google Speech API response:', response); //debugging

    // Process the transcription result
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    console.log('Transcription:', transcription);

    // Return the transcription to the frontend
    return new Response(JSON.stringify({ transcription }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
