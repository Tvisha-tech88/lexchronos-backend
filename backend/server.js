import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LexChronos backend running 🚀");
});

app.post("/summarize", async (req, res) => {
  try {
    const { textBatch } = req.body;

    const prompt = `
You are a legal assistant.

Summarize each event into 1-2 clear sentences.

${textBatch.map((t, i) => `Event ${i + 1}: ${t}`).join("\n")}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const output =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ result: output });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});