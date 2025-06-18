const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint: POST /api/chat (auto-routed via netlify.toml)
app.post("/.netlify/functions/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("OpenRouter Error:", err.message);
    res.status(500).send("Failed to get response");
  }
});

module.exports.handler = serverless(app);
