const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: "Tu es MarcGPT, un assistant en français, chaleureux, drôle et intelligent. Tu aides avec précision, que ce soit pour apprendre, coder, écrire ou répondre à tout type de question."
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.9,
      max_tokens: 512
    })
  });

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "Pas de réponse.";

  res.json({ response: content });
});

app.listen(3000, () => {
  console.log("MarcGPT backend lancé sur http://localhost:3000");
});
