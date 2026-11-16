import { NextResponse } from 'next/server';
import { getSanjoubSemanticResponse } from '@/components/assistant/semanticAdvisor';
import { formatCatalogForPrompt, getRecommendedCards } from '@/components/assistant/sanjoubCatalog';
import { BotAnswer } from '@/components/assistant/types';

function buildSanjoubSystemPrompt(locale: string = 'ar'): string {
  const catalogContext = formatCatalogForPrompt(locale);

  return `You are **Sanjoub (سنجوب)** 🐿️, the friendly, highly intelligent AI assistant and digital products advisor of Tooly.tn (Tunisia's premier digital subscription marketplace).

YOUR IDENTITY & MISSION:
- Your name is Sanjoub (سنجوب). You are an expert advisor in digital subscriptions, AI tools, design suites, developer IDEs, and video editing.
- You speak with authentic Tunisian warmth, charm, intelligence, and clarity.
- You guide Tunisian visitors to choose the best digital subscription for their profession (designer, developer, video creator, student, agency, etc.), budget, and specific needs.

LANGUAGE & COMMUNICATION RULES:
1. When the user sends a greeting (e.g., "عسلامة", "اهلا", "سلام", "ahla", "aslema", "cc", "salut", "bonjour", "hello"), ALWAYS start your response with:
   - In Arabic script: "مرحبا بيك في Tooly.tn! 🐿️ ..."
   - In Latin Arabizi: "Mar7ba bik fi Tooly.tn! 🐿️ ..."
   - In French: "Bienvenue sur Tooly.tn ! 🐿️ ..."
   - In English: "Welcome to Tooly.tn! 🐿️ ..."
2. If the user writes in Tunisian Arabic (Derja in Arabic letters), reply in natural, friendly Tunisian Derja in Arabic letters.
3. If the user writes in Tunisian Arabizi (Latin numbers & letters like 3, 7, 9, kifech, chnowa, b9adeh, nheb...), understand it completely and reply in authentic, natural Tunisian Arabizi.
4. If the user writes in French, reply in clear, professional French.
5. If the user writes in English, reply in friendly, helpful English.
6. If the user mixes languages (e.g. "Ena developper w nheb AI tool lel coding"), understand the intent naturally and reply in the same mixed Tunisian style.
7. Avoid overly stiff or formal Classical Arabic unless the user explicitly requests it.
8. Use emojis naturally but moderately (🐿️, ✨, 🚀, 💡, 💳, ⚡).

VERIFIED TOOLY.TN CATALOG & PRICING (ALL IN TUNISIAN DINARS - TND):
${catalogContext}

IMPORTANT BUSINESS FACTS:
- Payments: 100% Tunisian local payment methods without international cards! D17 (Poste Tunisienne), Flouci (in-app & QR), Sobflous, Tunisian Bank Cards (ClicToPay, Visa, Mastercard, e-Dinar), and Bank Wire for companies.
- Delivery: 5 to 60 minutes after payment confirmation (maximum 4 hours).
- Warranty: 100% full duration continuity replacement or money-back guarantee.
- Invoices: Official company invoices provided with tax ID (matricule fiscal).
- Uncatalogued tools (Netflix, Midjourney, Grammarly, Zoom...): Can be provided on-demand! Direct the user to WhatsApp (+216 50 000 000) or /contact.
- Order Tracking: Live at /order/lookup.
- Customer Support: WhatsApp (+216 50 000 000) available 7/7 from 09:00 to 23:00, email (contact@tooly.tn), Tunis.

RECOMMENDATIONS & CONTEXT:
- Maintain context across the conversation. If the user previously talked about Canva Pro and asks "9adech soumou?" (How much is it?), answer for Canva Pro.
- If the user asks for coding tools ("Anhouma ahsen lel coding?"), recommend Cursor Pro (#1 AI IDE) and Claude 3.5 Sonnet (Claude Pro / Claude API).
- Recommend products by identifying the user's domain (Designer -> Canva Pro, Adobe Express; Developer -> Cursor Pro, Claude Pro; Video Creator -> CapCut Pro; Student -> Gemini Plus, ChatGPT Go).

OUTPUT FORMAT:
Respond with a JSON object with this exact structure:
{
  "text": "Your markdown-formatted text response with bold **prices** and bullet points",
  "quickReplies": ["Short reply 1", "Short reply 2", "Short reply 3"],
  "recommendedSlugs": ["slug-1", "slug-2"]
}
Only output the JSON object, with no markdown codeblock wraps if possible.`;
}

export async function POST(req: Request) {
  try {
    const { message, history = [], locale = 'ar' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const trimmed = message.trim();
    if (!trimmed) {
      return NextResponse.json(getSanjoubSemanticResponse('', locale, history));
    }

    // Safety check for length
    const sanitizedMessage = trimmed.slice(0, 2000);

    const systemPrompt = buildSanjoubSystemPrompt(locale);

    // Multi-provider LLM Configuration
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const genericAiKey = process.env.AI_API_KEY;
    const genericAiBaseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
    const genericAiModel = process.env.AI_MODEL || 'gpt-4o-mini';

    // 1. Google Gemini API (if key provided)
    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

        const contents = [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\nUser locale: ${locale}` }],
          },
          ...history.slice(-8).map((h: { role: string; content: string }) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          })),
          {
            role: 'user',
            parts: [{ text: sanitizedMessage }],
          },
        ];

        const gRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 800,
            },
          }),
        });

        if (gRes.ok) {
          const data = await gRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = parseLLMResponse(rawText, locale);
            if (parsed) return NextResponse.json(parsed);
          }
        }
      } catch (geminiError) {
        console.warn('Gemini chat request error:', geminiError);
      }
    }

    // 2. OpenAI or OpenAI-compatible API (if key provided)
    const activeKey = openAiKey || genericAiKey;
    if (activeKey) {
      try {
        const targetUrl = openAiKey
          ? 'https://api.openai.com/v1/chat/completions'
          : `${genericAiBaseUrl.replace(/\/$/, '')}/chat/completions`;
        const targetModel = openAiKey ? 'gpt-4o-mini' : genericAiModel;

        const messages = [
          { role: 'system', content: `${systemPrompt}\nUser locale: ${locale}` },
          ...history.slice(-8).map((h: { role: string; content: string }) => ({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.content,
          })),
          { role: 'user', content: sanitizedMessage },
        ];

        const oRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeKey}`,
          },
          body: JSON.stringify({
            model: targetModel,
            messages,
            temperature: 0.6,
            max_tokens: 800,
          }),
        });

        if (oRes.ok) {
          const data = await oRes.json();
          const rawText = data?.choices?.[0]?.message?.content;
          if (rawText) {
            const parsed = parseLLMResponse(rawText, locale);
            if (parsed) return NextResponse.json(parsed);
          }
        }
      } catch (openAiError) {
        console.warn('OpenAI/Generic AI chat request error:', openAiError);
      }
    }

    // 3. High-Intelligence Built-in Sanjoub Semantic Engine
    // (Guarantees zero-failure, instant, authentic Tunisian and multilingual advice)
    const formattedHistory = history.map((h: { role: string; content: string }) => ({
      id: `h-${Math.random()}`,
      sender: (h.role === 'user' ? 'user' : 'bot') as 'user' | 'bot',
      text: h.content,
      timestamp: '',
    }));

    const fallbackAnswer = getSanjoubSemanticResponse(sanitizedMessage, locale, formattedHistory);
    return NextResponse.json(fallbackAnswer);
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json(
      getSanjoubSemanticResponse('عسلامة', 'ar', []),
      { status: 200 }
    );
  }
}

function parseLLMResponse(rawText: string, locale: string): BotAnswer | null {
  try {
    // Strip code fences if present
    const cleaned = rawText
      .replace(/^```json/im, '')
      .replace(/^```/im, '')
      .replace(/```$/im, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed.text === 'string') {
      const slugs: string[] = Array.isArray(parsed.recommendedSlugs) ? parsed.recommendedSlugs : [];
      const recommendedProducts = slugs.length > 0 ? getRecommendedCards(slugs, locale) : undefined;

      return {
        text: parsed.text,
        quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : undefined,
        action: parsed.action || {
          label: locale === 'fr' ? 'Voir le catalogue' : locale === 'en' ? 'View catalog' : 'تفرّج في الكتالوج',
          href: `/${locale}/catalog`,
        },
        recommendedProducts,
      };
    }
  } catch {
    // If output is plain markdown text rather than JSON
    return {
      text: rawText,
      quickReplies: [
        locale === 'fr' ? 'Abonnements IA' : locale === 'en' ? 'AI Subscriptions' : 'اشتراكات الذكاء الاصطناعي',
        locale === 'fr' ? 'Paiement D17' : locale === 'en' ? 'Pay with D17' : 'كيفاش نخلص بالـ D17؟',
        locale === 'fr' ? 'Suivi commande' : locale === 'en' ? 'Track order' : 'تتبع الطلب',
      ],
      action: {
        label: locale === 'fr' ? 'Voir le catalogue' : locale === 'en' ? 'View catalog' : 'تفرّج في الكتالوج',
        href: `/${locale}/catalog`,
      },
    };
  }
  return null;
}
