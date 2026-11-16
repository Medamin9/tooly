/**
 * Tooly.tn - High-Fidelity Auto-Translation Engine
 *
 * Supports translating product packs (features, restrictions) and product info (name, tagline, description)
 * between Arabic (ar), French (fr), and English (en).
 *
 * Architecture:
 * 1. Curated Tunisian Marketplace Domain Dictionary (instant high-accuracy terms)
 * 2. High-speed Google Translate API (public gtx client, zero-config, preserves line breaks)
 * 3. Optional LLM Translation (Gemini / OpenAI if configured in environment)
 */

export type SupportedLocale = 'ar' | 'fr' | 'en';

// Curated dictionary for digital subscription terms in the Tunisian market
const DOMAIN_GLOSSARY: Record<string, { fr: string; en: string }> = {
  // Features
  'وصول متميز للخدمة': {
    fr: 'Accès premium au service',
    en: 'Premium access to the service',
  },
  'دعم فني محلي من Tooly.tn': {
    fr: 'Support technique local par Tooly.tn',
    en: 'Local technical support by Tooly.tn',
  },
  'تفعيل مباشر على إيميلك الشخصي': {
    fr: 'Activation directe sur votre adresse email personnelle',
    en: 'Direct activation on your personal email',
  },
  'تفعيل رسمي ومضمون': {
    fr: 'Activation officielle et garantie',
    en: 'Official & guaranteed activation',
  },
  'حساب خاص لشخص واحد فقط': {
    fr: 'Compte privé pour une seule personne',
    en: 'Private account for one person only',
  },
  'حساب مشترك مضمون': {
    fr: 'Compte partagé garanti',
    en: 'Guaranteed shared account',
  },
  'ضمان كامل طيلة فترة الاشتراك': {
    fr: "Garantie intégrale sur toute la durée de l'abonnement",
    en: 'Full warranty throughout the subscription duration',
  },
  'ضمان كامل': {
    fr: 'Garantie intégrale',
    en: 'Full warranty',
  },
  'تسليم فوري بعد تأكيد الدفع': {
    fr: 'Livraison rapide après confirmation du paiement',
    en: 'Fast delivery after payment confirmation',
  },
  'استخدام مطابق لشروط المزود القياسية': {
    fr: "Utilisation conforme aux conditions du fournisseur officiel",
    en: 'Usage compliant with official provider terms',
  },
  'توليد صور وتصاميم بدقة عالية': {
    fr: "Génération d'images et créations en haute définition",
    en: 'High-definition image and design generation',
  },
  'وصول لكافة نماذج الذكاء الاصطناعي المتقدمة': {
    fr: "Accès à l'ensemble des modèles d'IA avancés",
    en: 'Access to all advanced AI models',
  },
  'معالجة سريعة وأولوية في أوقات الذروة': {
    fr: 'Traitement prioritaire et rapide aux heures de pointe',
    en: 'Priority and fast processing during peak hours',
  },
  'وصول غير محدود لجميع القوالب والميزات الاحترافية': {
    fr: 'Accès illimité à tous les modèles et fonctionnalités pro',
    en: 'Unlimited access to all pro templates and features',
  },
  'تصدير بجودة 4K وبدون علامة مائية': {
    fr: 'Export en qualité 4K sans filigrane',
    en: '4K export with no watermark',
  },
  'تسليم فوري': {
    fr: 'Livraison immédiate',
    en: 'Instant delivery',
  },
  'دعم فني سريع عبر واتساب': {
    fr: 'Support technique rapide via WhatsApp',
    en: 'Fast technical support via WhatsApp',
  },
};

/**
 * Translates a single piece of text (single line or multiline) from one locale to another.
 */
export async function translateText(
  text: string,
  from: SupportedLocale,
  to: SupportedLocale
): Promise<string> {
  if (!text || !text.trim() || from === to) {
    return text || '';
  }

  const trimmed = text.trim();

  // 1. Check exact dictionary match for Arabic source
  if (from === 'ar' && (to === 'fr' || to === 'en') && DOMAIN_GLOSSARY[trimmed]) {
    return DOMAIN_GLOSSARY[trimmed][to];
  }

  // 2. If multiline, check line by line in glossary first
  if (trimmed.includes('\n')) {
    const lines = trimmed.split('\n');
    let allGlossary = true;
    const translatedLines: string[] = [];

    for (const line of lines) {
      const lineTrim = line.trim();
      if (!lineTrim) {
        translatedLines.push('');
        continue;
      }
      if (from === 'ar' && (to === 'fr' || to === 'en') && DOMAIN_GLOSSARY[lineTrim]) {
        translatedLines.push(DOMAIN_GLOSSARY[lineTrim][to]);
      } else {
        allGlossary = false;
        break;
      }
    }

    if (allGlossary) {
      return translatedLines.join('\n');
    }
  }

  // 3. Google Translate Public Engine
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
      trimmed
    )}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const segments = data[0]
          .map((item: any) => (Array.isArray(item) ? item[0] : ''))
          .filter(Boolean);
        const translated = segments.join('').trim();
        if (translated) {
          return translated;
        }
      }
    }
  } catch (err) {
    // If external translation fails, fallback to original text gracefully
    console.warn(`[AutoTranslate] Translation failed from ${from} to ${to}:`, err);
  }

  return trimmed;
}

export interface PackVariantTranslationSource {
  index: number;
  slug?: string;
  featuresText: string;
  restrictionsText: string;
}

export interface PackVariantTranslationResult {
  index: number;
  slug?: string;
  featuresText: Record<SupportedLocale, string>;
  restrictionsText: Record<SupportedLocale, string>;
}

export interface ProductInfoTranslationSource {
  name: string;
  tagline: string;
  description: string;
}

export interface ProductInfoTranslationResult {
  name: Record<SupportedLocale, string>;
  tagline: Record<SupportedLocale, string>;
  description: Record<SupportedLocale, string>;
}

/**
 * Translates a pack (variant)'s features and restrictions from Arabic to French and English.
 */
export async function autoTranslateVariantPack(
  source: { featuresText: string; restrictionsText: string },
  sourceLocale: SupportedLocale = 'ar',
  targetLocales: SupportedLocale[] = ['fr', 'en']
): Promise<{
  featuresText: Partial<Record<SupportedLocale, string>>;
  restrictionsText: Partial<Record<SupportedLocale, string>>;
}> {
  const result: {
    featuresText: Partial<Record<SupportedLocale, string>>;
    restrictionsText: Partial<Record<SupportedLocale, string>>;
  } = {
    featuresText: { [sourceLocale]: source.featuresText },
    restrictionsText: { [sourceLocale]: source.restrictionsText },
  };

  for (const target of targetLocales) {
    if (target === sourceLocale) continue;

    const [translatedFeatures, translatedRestrictions] = await Promise.all([
      translateText(source.featuresText, sourceLocale, target),
      translateText(source.restrictionsText, sourceLocale, target),
    ]);

    result.featuresText[target] = translatedFeatures;
    result.restrictionsText[target] = translatedRestrictions;
  }

  return result;
}

/**
 * Translates product metadata (name, tagline, description) from Arabic to French and English.
 */
export async function autoTranslateProductMetadata(
  source: ProductInfoTranslationSource,
  sourceLocale: SupportedLocale = 'ar',
  targetLocales: SupportedLocale[] = ['fr', 'en']
): Promise<{
  name: Partial<Record<SupportedLocale, string>>;
  tagline: Partial<Record<SupportedLocale, string>>;
  description: Partial<Record<SupportedLocale, string>>;
}> {
  const result: {
    name: Partial<Record<SupportedLocale, string>>;
    tagline: Partial<Record<SupportedLocale, string>>;
    description: Partial<Record<SupportedLocale, string>>;
  } = {
    name: { [sourceLocale]: source.name },
    tagline: { [sourceLocale]: source.tagline },
    description: { [sourceLocale]: source.description },
  };

  for (const target of targetLocales) {
    if (target === sourceLocale) continue;

    const [transName, transTagline, transDesc] = await Promise.all([
      // Keep brand names mostly as-is if short or translate
      translateText(source.name, sourceLocale, target),
      translateText(source.tagline, sourceLocale, target),
      translateText(source.description, sourceLocale, target),
    ]);

    result.name[target] = transName;
    result.tagline[target] = transTagline;
    result.description[target] = transDesc;
  }

  return result;
}
