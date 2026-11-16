export interface RecommendedProductCard {
  id: string;
  slug: string;
  name: string;
  provider: string;
  category?: string;
  priceTND: number | string;
  durationLabel: string;
  tagline: string;
  highlights?: string;
  productUrl: string;
  checkoutUrl: string;
  iconUrl?: string | null;
}

export interface BotAction {
  label: string;
  href: string;
}

export interface BotAnswer {
  text: string;
  quickReplies?: string[];
  action?: BotAction;
  recommendedProducts?: RecommendedProductCard[];
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  action?: BotAction;
  recommendedProducts?: RecommendedProductCard[];
}

export interface AssistantAIParams {
  userMessage: string;
  history?: ChatMessage[];
  locale?: string;
}
