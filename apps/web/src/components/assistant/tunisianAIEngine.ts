import { BotAnswer, ChatMessage, AssistantAIParams } from './types';
import { getTunisianBotResponse } from './tunisianKnowledge';

export type { AssistantAIParams };

export async function getAssistantAIResponse({
  userMessage,
  history = [],
  locale = 'ar',
}: AssistantAIParams): Promise<BotAnswer> {
  // 1. Try server-side AI endpoint first
  try {
    const res = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: history.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
        locale,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.text) {
        return {
          text: data.text,
          quickReplies: data.quickReplies,
          action: data.action,
          recommendedProducts: data.recommendedProducts,
        };
      }
    }
  } catch {
    // API route not reachable or network issue, proceed to client AI reasoning engine
  }

  // 2. Client-side semantic intelligence engine
  return getTunisianBotResponse(userMessage, locale, history);
}
