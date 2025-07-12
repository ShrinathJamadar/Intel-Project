
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    try {
        // Instruct Ollama to act like a CSE tutor and summarize precisely
        const enhancedPrompt = `
You are an expert Computer Science tutor.
Answer the following question clearly and concisely, suitable for a B.Tech student.
Avoid long paragraphs or unnecessary repetition.

Question: ${question}
`;

        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'mistral', // or any local model like llama2 if downloaded
            prompt: enhancedPrompt,
            stream: false
        });

        const answer = response.data.response?.trim() || "⚠️ No response generated.";
        res.json({ answer });

    } catch (error) {
        console.error("Ollama error:", error.response?.data || error.message);
        res.status(500).json({ error: "❌ Failed to fetch answer from Ollama" });
    }
});

app.listen(3000, () => {
    console.log("✅ Backend server running at http://localhost:3000");
});




