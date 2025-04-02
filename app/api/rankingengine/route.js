import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { query, products } = await req.json();

    if (!query || !Array.isArray(products)) {
      return new Response(JSON.stringify({ error: "Missing query or products" }), { status: 400 });
    }

    // ✅ Step 1: Limit and compact
    const limitedProducts = products.slice(0, 40);

    const minimalProducts = limitedProducts.map((p) => ({
      name: p.name,
      price: p.price,
      rating: p.rating,
      total_ratings: p.total_ratings,
    }));

    // ✅ Step 2: Prompt
    const systemPrompt = `
You are a product ranking assistant.

Sort the following products by best value (price + rating + total_ratings).
Add up to 2 badges:
- "Best Deal" for best value
- "Top Rated" for high rating + reviews
- "Under $100" if price < 100

⚠️ Return a valid JSON array. Each item must include:
{
  "name": "...",
  "badges": [ ... ]
}

⚠️ Do NOT include markdown, comments, or any extra text.
    `.trim();

    const userPrompt = `Products:\n${JSON.stringify(minimalProducts, null, 2)}`;

    // ✅ Step 3: GPT Call
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const rankedList = JSON.parse(chatResponse.choices[0].message.content); // [{ name: "...", badges: [...] }, ...]

    // ✅ Step 4: Map badges onto original full product objects
    const rankedProducts = rankedList
      .map(({ name, badges }) => {
        const match = limitedProducts.find((p) => p.name === name);
        if (!match) return null;

        return {
          ...match,
          badges,
        };
      })
      .filter(Boolean); // remove any unmatched

    return new Response(JSON.stringify({ deals: rankedProducts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GPT ranking error:", err.message);
    return new Response(JSON.stringify({ error: "Failed to rank with GPT" }), {
      status: 500,
    });
  }
}
