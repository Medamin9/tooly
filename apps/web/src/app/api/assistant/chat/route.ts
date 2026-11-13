import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are Tooly Bot, the friendly, highly intelligent AI assistant of Tooly.tn (Tunisia's premier digital subscription marketplace).
Your mission is to help visitors choose subscriptions, understand pricing in Tunisian Dinars (TND), learn payment methods in Tunisia (D17, Flouci, Sobflous, Carte Bancaire), and answer ANY question they ask with charm, accuracy, and local Tunisian warmth.

Languages:
- When locale is 'ar' or user writes in Arabic, respond in authentic Tunisian Arabic in Arabic script (الدارجة التونسية بالحروف العربية: عسلامة، يا باهي، ما تحيرش، جوك باهي، الخلاص بـ D17...).
- When locale is 'fr' or 'en' or user writes in Latin Arabizi, respond in Latin Tunisian Arabizi (3aslema, kifech, b9adeh, flousek...).
- If the user asks in formal French or English, respond politely with a welcoming Tunisian touch.

Key Facts about Tooly.tn:
- Claude Pro: 79 TND/month (official workspace invitation within 15 min).
- ChatGPT Plus: 75 TND/month (GPT-4o, Canvas, image gen).
- Canva Pro: 35 TND/year (full team features on personal account).
- CapCut Pro: 49 TND (VIP editing, auto-subtitles).
- Payments: D17 (Poste), Flouci (app), Sobflous, Tunisian Bank Cards (ClicToPay, E-Dinar), Bank Wire. No international card needed.
- Delivery: 5 to 60 minutes after payment.
- Guarantee: 100% full duration replacement or money-back.
- Local human support on WhatsApp (+216 50 000 000) and email (contact@tooly.tn).

Keep answers clear, helpful, concise, well-formatted, and encouraging.
`;

export async function POST(req: Request) {
  try {
    const { message, history = [], locale = 'ar' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    // 1. Google Gemini API integration (if configured in .env)
    if (geminiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

      const contents = [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\nCurrent language locale: ${locale}` }],
        },
        ...history.map((h: { role: string; content: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const gRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (gRes.ok) {
        const data = await gRes.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ text });
        }
      }
    }

    // 2. OpenAI API integration (if configured in .env)
    if (openAiKey) {
      const openAiUrl = 'https://api.openai.com/v1/chat/completions';

      const messages = [
        { role: 'system', content: `${SYSTEM_PROMPT}\nCurrent language locale: ${locale}` },
        ...history.map((h: { role: string; content: string }) => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content,
        })),
        { role: 'user', content: message },
      ];

      const oRes = await fetch(openAiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 600,
        }),
      });

      if (oRes.ok) {
        const data = await oRes.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          return NextResponse.json({ text });
        }
      }
    }

    // If no external LLM key is configured, return null to fallback to local Tunisian AI engine
    return NextResponse.json({ text: null });
  } catch (err) {
    return NextResponse.json({ text: null, error: String(err) }, { status: 200 });
  }
}

