import 'dotenv/config'
// test-rest.mjs
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY missing");

const model = "gemini-2.5-flash";
const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

export async function test() {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Say status: OK" }] }]
      })
    });

    const data = await res.json();
    if (res.ok) {
      console.log("✅ SUCCESS (via REST v1):", data.candidates[0].content.parts[0].text.trim());
    } else {
      console.error("❌ REST ERROR:", data.error?.message || data);
    }
  } catch (err) {
    console.error("💥 Network error:", err.message);
  }
}

test();