import React, { useState } from "react";
import { apis } from "../utils/apis";

const HuggingFaceAI = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setGeneratedText("");

    try {
      const res = await fetch(apis().huggingFaceGenerate, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.result) {
        setGeneratedText(data.result);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("No response from API.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch generated text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-light text-center">
      <div className="container">
        <h2 className="mb-4 text-primary">🍽️ AI Food Reviews</h2>

        <div className="d-flex flex-column align-items-center">
          <input
            type="text"
            placeholder="Enter a food item or prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="form-control mb-3"
            style={{ maxWidth: "600px", borderRadius: "10px", padding: "0.75rem" }}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-danger mb-3"
            style={{ minWidth: "180px" }}
          >
            {loading ? "Generating..." : "Generate Review"}
          </button>

          {error && <p className="text-danger fw-bold">{error}</p>}

          {generatedText && (
            <div
              className="p-4 bg-white shadow rounded"
              style={{ maxWidth: "700px", textAlign: "left" }}
            >
              <p>{generatedText}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HuggingFaceAI;
