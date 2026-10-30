const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const message = req.body.message;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Provide valid message' });
    }

    // Using the Lite model for instant responses
    const MODEL = 'gemini-flash-lite-latest'; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: message }] }
                ],
                // Tell the model to be concise and not show its work
                systemInstruction: {
                    parts: [{ text: "You are a helpful assistant. Answer concisely. Do not show step-by-step calculations or derivations unless the user explicitly asks for them. Provide only the final answer." }]
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google API Error:', response.status, errorText);
            return res.status(response.status).json({ error: `Google API Error: ${response.status}` });
        }

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); 
        res.flushHeaders();

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const rawLine of lines) {
                const line = rawLine.trim();
                if (!line.startsWith('data:')) continue;

                const dataStr = line.slice(5).trim();
                if (!dataStr || dataStr === '[DONE]') continue;

                try {
                    const data = JSON.parse(dataStr);
                    
                    // Standard API structure
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    
                    if (text) {
                        res.write(`data: ${JSON.stringify({ text })}\n\n`);
                    }
                } catch (e) {
                    // Ignore incomplete JSON chunks
                }
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Server Error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to connect to Gemini.' });
        } else {
            res.end();
        }
    }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));