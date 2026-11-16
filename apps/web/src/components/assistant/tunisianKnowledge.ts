export type { BotAnswer, ChatMessage, RecommendedProductCard } from './types';
import type { BotAnswer, ChatMessage } from './types';
import { getSanjoubSemanticResponse } from './semanticAdvisor';

// Exact catalog data of Tooly.tn
export const TOOLY_CATALOG = {
  gemini: {
    name: 'Gemini Plus (Family)',
    provider: 'Google',
    category: 'ai',
    price6m: '30.0 د.ت / 6 أشهر (TND)',
    price12m: '40.0 د.ت / 12 شهراً (TND)',
    highlights: 'نماذج Gemini المتطورة، توليد وتعديل الصور والفيديوهات، تلخيص المستندات، مساحة Google One',
    deliveryTime: 'رابط تفعيل رسمي (Lien d’activation) مع ضمان صلاحية 12 ساعة',
    slug: 'gemini-plus-family',
  },
  claudeApi: {
    name: 'Claude API',
    provider: 'Anthropic',
    category: 'developer',
    price100usd: '70.0 د.ت / شهر (رصيد 100$)',
    price100m: '35.0 د.ت / 3 أيام (100M Tokens)',
    price10m: '10.0 د.ت / يوم (10M Tokens)',
    highlights: 'مفتاح API رسمي لنماذج Claude Sonnet و Opus لربطها بالتطبيقات وإنشاء AI Agents',
    deliveryTime: 'تسليم فوري لمفتاح الـ API',
    slug: 'claude-api',
  },
  chatgpt: {
    name: 'ChatGPT Plus',
    provider: 'OpenAI',
    category: 'ai',
    price1m: '50.0 د.ت / شهر (TND)',
    highlights: 'نماذج GPT المتطورة، DALL-E 3، أداة Canvas، محادثات صوتية، تحليل ملفات وبحث عميق Deep Research',
    deliveryTime: 'حساب خاص (Email + Password + 2FA) مع ضمان 30 يوماً',
    slug: 'chatgpt-plus',
  },
  chatgptGo: {
    name: 'ChatGPT Go',
    provider: 'OpenAI',
    category: 'ai',
    price3m: '40.0 د.ت / 3 أشهر (TND)',
    highlights: 'وصول موسع لنماذج GPT، سعة رسائل وتوليد صور أعلى، تحليل الملفات والبيانات',
    deliveryTime: 'حساب خاص (Email + Password + 2FA)',
    slug: 'chatgpt-go',
  },
  canva: {
    name: 'Canva Pro',
    provider: 'Canva',
    category: 'design',
    price1m: '5.0 د.ت / شهر (TND)',
    price2y: '25.0 د.ت / سنتان (TND)',
    price3y: '30.0 د.ت / 3 سنوات Team Edu (TND)',
    highlights: 'ملايين القوالب، تنحية خلفية الصور والفيديوهات، Magic Studio، وتفعيل على حسابك الشخصي',
    deliveryTime: 'تفعيل مباشر على بريدك الإلكتروني في كانفا',
    slug: 'canva-pro',
  },
  spotify: {
    name: 'Spotify Premium',
    provider: 'Spotify',
    category: 'entertainment',
    price3m: '30.0 د.ت / 3 أشهر (TND)',
    highlights: 'ملايين الأغاني العربية والأجنبية بدون إعلانات، تحميل واستماع دون إنترنت، صوت فائق النقاء',
    deliveryTime: 'دعوة عائلية رسمية على حسابك الشخصي',
    slug: 'spotify-premium',
  },
  adobeExpress: {
    name: 'Adobe Express Premium',
    provider: 'Adobe',
    category: 'design',
    price6m: '10.0 د.ت / 6 أشهر (TND)',
    price12m: '20.0 د.ت / 12 شهراً (TND)',
    highlights: 'أدوات التصميم الاحترافي، مكتبة Adobe Fonts، الذكاء الاصطناعي Generative AI بدون بطاقة بنكية',
    deliveryTime: 'كوبون ورابط تفعيل مباشر على حساب Adobe',
    slug: 'adobe-express-premium',
  },
  capcut: {
    name: 'CapCut Pro',
    provider: 'ByteDance',
    category: 'video',
    price800cr: '20.0 د.ت (~800 AI Credits)',
    price1600cr: '30.0 د.ت (1600 AI Credits)',
    priceTeam: '40.0 د.ت Admin Team (5 Seats)',
    highlights: 'مونتاج فيديو 4K بدون علامة مائية، تفريغ صوتي وترجمة تلقائية، فلاتر ومؤثرات VIP حصرية',
    deliveryTime: 'Email + Password + Invite Link مع ضمان 30 يوماً',
    slug: 'capcut-pro',
  },
  claude: {
    name: 'Claude Pro',
    provider: 'Anthropic',
    category: 'ai',
    price1m: '79.0 د.ت / شهر (TND)',
    price3m: '225.0 د.ت / 3 أشهر (TND)',
    highlights: 'Claude 3.5 Sonnet، مساحات Projects، ميزة Artifacts للبرمجة، 5x سعة استخدام',
    deliveryTime: 'دعوة رسمية مباشرة على إيميلك في أقل من 15 دقيقة',
    slug: 'claude-pro',
  },
  cursor: {
    name: 'Cursor Pro',
    provider: 'Anysphere',
    category: 'developer',
    price1m: '89.0 د.ت / شهر (TND)',
    highlights: 'محرر الأكواد الذكي للمطورين، 500 طلب سريع شهرياً لـ Claude 3.5 Sonnet، فهرسة كامل الكود',
    deliveryTime: 'تفعيل في أقل من 15 دقيقة',
    slug: 'cursor-pro',
  },
};

// Tooly Contact Info
export const TOOLY_CONTACT = {
  whatsapp: '+216 50 000 000',
  whatsappUrl: 'https://wa.me/21650000000',
  email: 'contact@tooly.tn',
  address: 'تونس العاصمة، الجمهورية التونسية (Tunis, Tunisie)',
  workingHours: '09:00 - 23:00 (7 أيام في الأسبوع)',
};

/**
 * Text normalizer for multi-lingual and Arabizi search
 */
export function normalizeText(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u')
    .replace(/[îï]/g, 'i')
    .replace(/[ç]/g, 'c')
    .replace(/['"’`]/g, '')
    .replace(/[.,/#!$%^&*;:{}=\-_~()?]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Check if normalized input contains any of the pattern strings
 */
function matchAny(norm: string, patterns: string[]): boolean {
  for (const p of patterns) {
    const normPattern = normalizeText(p);
    if (normPattern && norm.includes(normPattern)) {
      return true;
    }
  }
  return false;
}

/**
 * Detect language style of message:
 * 'ar' (Arabic script)
 * 'arabizi' (Tunisian Latin numerals like 3, 7, 9)
 * 'fr' (French)
 * 'en' (English)
 */
export function detectLanguage(text: string, currentLocale: string = 'ar'): 'ar' | 'arabizi' | 'fr' | 'en' {
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar';
  }

  const norm = text.toLowerCase();

  // Arabizi specific markers (3 = ع, 7 = ح, 9 = ق, 5 = خ, words like kifech, b9adeh, flous...)
  if (
    /[3795]/.test(norm) ||
    /\b(3aslema|aslema|ahla|b9adeh|kifech|chkoun|chnowa|chneya|n7eb|famma|famachi|mouch|flous|flouci|jawwek|behi|m3ak|brabbi|ye3tik|hedha|hedhi|chouf|ken|faddlik|noukta|d17|cc)\b/.test(
      norm
    )
  ) {
    return 'arabizi';
  }

  // English markers
  if (
    /\b(how|what|when|where|which|price|cost|how much|buy|subscription|delivery|guarantee|refund|support|order|track|hello|hi|please|available|payment)\b/.test(
      norm
    )
  ) {
    return 'en';
  }

  // French markers
  if (
    /\b(bonjour|salut|prix|combien|comment|livraison|paiement|payer|delai|garantie|facture|commande|compte|abonnement|disponible|acheter|remboursement|svp|merci)\b/.test(
      norm
    )
  ) {
    return 'fr';
  }

  if (currentLocale === 'en') return 'en';
  if (currentLocale === 'fr') return 'fr';
  return 'ar';
}

/**
 * Extract topic memory from recent chat history
 */
export function extractHistoryTopic(history: ChatMessage[] = []): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const text = history[i].text.toLowerCase();
    if (text.includes('claude') || text.includes('كلود') || text.includes('sonnet')) return 'claude';
    if (text.includes('chatgpt') || text.includes('gpt') || text.includes('شات') || text.includes('openai')) return 'chatgpt';
    if (text.includes('canva') || text.includes('كانفا')) return 'canva';
    if (text.includes('capcut') || text.includes('كاب كات') || text.includes('كابكات')) return 'capcut';
    if (text.includes('cursor') || text.includes('كرسور')) return 'cursor';
    if (text.includes('d17') || text.includes('paiement') || text.includes('خلاص') || text.includes('payer')) return 'payment';
    if (text.includes('livraison') || text.includes('توصيل') || text.includes('وقتاش')) return 'delivery';
    if (text.includes('suivi') || text.includes('تتبع') || text.includes('lookup')) return 'tracking';
  }
  return null;
}

/**
 * Main Tunisian AI Knowledge Engine
 */
export function getTunisianBotResponse(
  userMessage: string,
  currentLocale: string = 'ar',
  history: ChatMessage[] = []
): BotAnswer {
  return getSanjoubSemanticResponse(userMessage, currentLocale, history);
}
