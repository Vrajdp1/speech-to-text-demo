import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set in .env.local
});

export async function POST(req) {
  try {
    const { query, products } = await req.json();

    if (!query || !Array.isArray(products)) {
      return new Response(JSON.stringify({ error: "Missing query or products" }), {
        status: 400,
      });
    }

    const systemPrompt = `
You are a helpful assistant that ranks products based on price, rating, and value.

Instructions:
- Sort the products from best value to worst.
- Add optional "badges" to each:
  - "Best Deal" for best price-to-rating ratio
  - "Top Rated" for highest rated
  - "Under $100" for price < 100

Return ONLY a valid JSON array of products with badges. No extra text.
    `;

    const userPrompt = `Products:\n${JSON.stringify(products)}`;
console.log("User Prompt:", userPrompt); // Debugging line  
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-3.5-turbo
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const rankedProducts = JSON.parse(chatResponse.choices[0].message.content);

    return new Response(JSON.stringify({ deals: rankedProducts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GPT ranking error:", err.message);
    return new Response(JSON.stringify({ error: "Failed to rank with GPT" }), { status: 500 });
  }
}
