import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

const cohere = new CohereClient(); // Uses CO_API_KEY from env

export const generateText = async (req, res) => {
  try {
    const { prompt, maxTokens = 80 } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await cohere.generate({
      model: "command", // ✅ valid model
      prompt,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const text = response.generations[0].text;
    res.status(200).json({ result: text });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message || "Failed to generate text" });
  }
};
