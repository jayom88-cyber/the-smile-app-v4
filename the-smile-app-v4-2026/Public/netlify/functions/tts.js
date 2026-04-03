// public/netlify/functions/tts.js
exports.handler = async function(event, context) {
    try {
        // 1. Check for correct request type
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        // 2. Unpack the user's prompt from the frontend
        const { text } = JSON.parse(event.body);

        // 3. THE BRAIN: Send prompt to Google Gemini
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const geminiReq = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: text }] }] })
        });
        
        if (!geminiReq.ok) throw new Error('Gemini Vault failed to respond.');
        const geminiData = await geminiReq.json();
        const aiResponseText = geminiData.candidates[0].content.parts[0].text;

        // 4. Return ONLY the pure text to the frontend
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: aiResponseText 
            })
        };

    } catch (error) {
        console.error("Vault Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Vault Error' })
        };
    }
};