require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ✅ Gemini AI Product Ranking Function
async function rankWithGemini(products) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  const prompt = `
You are a helpful assistant that ranks products based on price, rating, and overall value.

Here are the products in JSON format:

${JSON.stringify(products, null, 2)}

Your job:
- Rank them based on value (consider price, rating, discount, etc.)
- Add these badges where appropriate:
  - "Best Deal" for the best value
  - "Top Rated" for highest rating
  - "Under $100" if price is under 100

⚠️ Output only a valid JSON array. Do NOT include markdown formatting or \`\`\`. No comments, no explanation. Just a JSON array.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean markdown if present
    if (text.startsWith("```")) {
      text = text.replace(/```json|```/g, '').trim();
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Gemini response error:", err.message);
    throw new Error("Gemini response was not valid JSON");
  }
}

// ✅ POST /search route
app.post('/search', async (req, res) => {
  const { query, products } = req.body;

  if (!query || !Array.isArray(products)) {
    return res.status(400).json({ error: "Missing query or products" });
  }

  try {
    const ranked = await rankWithGemini(products);
    res.json({ deals: ranked });
  } catch (err) {
    console.error("🔥 Gemini failed:", err.message);
    res.status(500).json({
      error: "Gemini failed to rank products",
      details: err.message,
    });
  }
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
