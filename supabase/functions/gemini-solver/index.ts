// Supabase Edge Function: Gemini Solver
// Deploy with: supabase functions deploy gemini-solver --no-verify-jwt

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

interface SolverRequestBody {
  problem: string;
  level?: string;
}

interface SolverSuccessResponse {
  solution: unknown;
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing GEMINI_API_KEY secret" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let body: SolverRequestBody;
  try {
    body = await req.json();
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const problem = body.problem?.trim();
  const level = body.level?.trim() || "TYT";

  if (!problem) {
    return new Response(
      JSON.stringify({ error: "Problem text is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const prompt = `Sen bir fizik öğretmenisin. Aşağıdaki ${level} seviyesindeki fizik problemini DETAYLI ve AÇIKLAYICI şekilde çöz.\n\nProblem: ${problem}\n\nÖNEMLİ KURALLAR:\n1. Her adımı DETAYLI açıkla\n2. Formülleri AÇIK yaz (örn: F = m × a)\n3. Sayıları formüle YERLEŞTİR\n4. HESAPLA ve sonucu yaz\n5. Eğer çoktan seçmeli ise hangi şıkkın doğru olduğunu BUL\n6. Açıklaman öğretici olsun, sadece formül yazma\n\nÇözümü şu formatta JSON olarak ver:\n{\n  "topic": "Konu adı (Dinamik, Kinematik, vb)",\n  "level": "${level}",\n  "steps": [\n    {\n      "number": 1,\n      "title": "Adım Başlığı",\n      "content": "DETAYLI açıklama ve hesaplama",\n      "type": "analysis"\n    }\n  ],\n  "formulas": [\n    {\n      "name": "Formül Adı",\n      "formula": "Matematiksel ifade",\n      "description": "Formülün açıklaması"\n    }\n  ],\n  "explanation": "Genel açıklama",\n  "result": "SONUÇ ve hangi şık (varsa)",\n  "relatedTopics": ["İlgili konular"]\n}\n\nSADECE JSON döndür, başka açıklama yapma.`;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: "Gemini API request failed",
          status: response.status,
          details: errorPayload,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      return new Response(
        JSON.stringify({ error: "Gemini response was empty" }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const jsonMatch =
      aiText.match(/```json\n([\s\S]*?)\n```/) ?? aiText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[1] ?? jsonMatch[0] : aiText;

    let solution: unknown;
    try {
      solution = JSON.parse(jsonText);
    } catch (_error) {
      return new Response(
        JSON.stringify({
          error: "Gemini response was not valid JSON",
          raw: aiText,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const successPayload: SolverSuccessResponse = {
      solution: {
        ...solution,
        usedAI: true,
        aiModel: "Gemini Pro",
        generatedAt: new Date().toISOString(),
      },
    };

    return new Response(JSON.stringify(successPayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini edge function error", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
