/* JAI-VERSE BACKEND - v3.1 (Serverless API Bridge)
   Target: Vercel Serverless Function
   Lead AI Co-Pilot: Gemini
*/

export default async function handler(req, res) {
    // Method Guard: Only allow POST requests from the Smile App
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed.' });
    }

    // Secure Vault Access: Grabbing the key from Vercel's Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Vault Error: GEMINI_API_KEY is missing in Vercel settings.");
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        // Corrected Model: Using the high-speed gemini-1.5-flash
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        // Return the clean JSON response to the CHUWI or mobile device
        return res.status(200).json(data);

    } catch (error) {
        console.error("Bridge Error:", error);
        return res.status(500).json({ error: 'Failed to connect to the Jai-Verse brain.' });
    }
}