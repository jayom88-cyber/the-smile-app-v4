/**
 * THE SMILE APP v3.0 - The Secure Bridge (Vault)
 * This handles the Google Cloud TTS handshake securely on Vercel.
 */

export default async function handler(req, res) {
  const { text } = req.body;

  // This pulls the key from the Vercel Environment Variables we set earlier
  const apiKey = process.env.GOOGLE_TTS_API_KEY;

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const payload = {
    input: { text },
    voice: { languageCode: 'en-US', name: 'en-US-Neural2-F' },
    audioConfig: { audioEncoding: 'MP3' }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // Return the audio data directly to our script.js
    res.status(200).json({ audioContent: data.audioContent });
  } catch (error) {
    res.status(500).json({ error: "Vault Handshake Failed" });
  }
}