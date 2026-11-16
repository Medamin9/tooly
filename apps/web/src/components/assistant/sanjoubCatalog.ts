import { RecommendedProductCard } from './types';

export interface SanjoubProductMeta {
  id: string;
  slug: string;
  name: string;
  provider: string;
  category: 'ai' | 'design' | 'video' | 'developer' | 'productivity' | 'entertainment';
  startingPriceTND: number;
  durationLabel: {
    ar: string;
    arabizi: string;
    fr: string;
    en: string;
  };
  pricingVariants: Array<{
    duration: string;
    priceTND: number;
    labelAr: string;
    labelFr: string;
    labelEn: string;
  }>;
  tagline: {
    ar: string;
    arabizi: string;
    fr: string;
    en: string;
  };
  highlights: {
    ar: string;
    arabizi: string;
    fr: string;
    en: string;
  };
  bestForProfessions: Array<'designer' | 'developer' | 'video_creator' | 'student' | 'marketer' | 'music' | 'general'>;
  deliveryType: string;
}

export const SANJOUB_CATALOG: SanjoubProductMeta[] = [
  {
    id: 'claude-pro',
    slug: 'claude-pro',
    name: 'Claude Pro',
    provider: 'Anthropic',
    category: 'ai',
    startingPriceTND: 79,
    durationLabel: {
      ar: 'شهر واحد',
      arabizi: '1 chhar',
      fr: '1 mois',
      en: '1 month',
    },
    pricingVariants: [
      { duration: '1_month', priceTND: 79, labelAr: '79.0 د.ت / شهر', labelFr: '79.0 TND / mois', labelEn: '79.0 TND / month' },
      { duration: '3_months', priceTND: 225, labelAr: '225.0 د.ت / 3 أشهر', labelFr: '225.0 TND / 3 mois', labelEn: '225.0 TND / 3 months' },
    ],
    tagline: {
      ar: 'الذكاء الاصطناعي الأقوى في التحليل العميق والبرمجة وكتابة المحتوى المعقد',
      arabizi: 'A9wa AI fel tahlil, el programmation w el khedma el s3iba',
      fr: 'La référence absolue en raisonnement logique, code et analyse approfondie',
      en: 'The industry-leading AI for deep analytical reasoning and code generation',
    },
    highlights: {
      ar: 'Claude 3.5 Sonnet، نافذة سياق 200k، ميزة Artifacts ومشاريع Projects',
      arabizi: 'Claude 3.5 Sonnet, 200k context, Artifacts w Projects',
      fr: 'Claude 3.5 Sonnet, contexte 200k, mode Artifacts et gestion de Projets',
      en: 'Claude 3.5 Sonnet, 200k context window, Artifacts & Projects workspace',
    },
    bestForProfessions: ['developer', 'student', 'marketer', 'general'],
    deliveryType: 'workspace_invite',
  },
  {
    id: 'cursor-pro',
    slug: 'cursor-pro',
    name: 'Cursor Pro',
    provider: 'Anysphere',
    category: 'developer',
    startingPriceTND: 89,
    durationLabel: {
      ar: 'شهر واحد',
      arabizi: '1 chhar',
      fr: '1 mois',
      en: '1 month',
    },
    pricingVariants: [
      { duration: '1_month', priceTND: 89, labelAr: '89.0 د.ت / شهر', labelFr: '89.0 TND / mois', labelEn: '89.0 TND / month' },
    ],
    tagline: {
      ar: 'بيئة البرمجة الذكية الأفضل عالمياً للمطورين والمهندسين',
      arabizi: 'Ahsen IDE mte3 coding bel AI fel 3alam lel developpeurs',
      fr: "L'éditeur de code IA ultime pour booster la productivité des développeurs",
      en: 'The premier AI-first code editor designed to supercharge developer workflows',
    },
    highlights: {
      ar: 'فهرسة كامل المشروع Codebase Indexing، طلبات Claude 3.5 Sonnet سريعة، وإكمال ذكي للأكواد',
      arabizi: 'Indexing l tout le projet, Sonnet 3.5 fast requests w tab autocomplete',
      fr: 'Indexation de tout votre codebase, requêtes rapides Sonnet 3.5 et autocomplétion intelligente',
      en: 'Full codebase indexing, 500 fast Claude 3.5 Sonnet queries/mo, smart tab autocomplete',
    },
    bestForProfessions: ['developer'],
    deliveryType: 'private_account',
  },
  {
    id: 'claude-api',
    slug: 'claude-api',
    name: 'Claude API',
    provider: 'Anthropic',
    category: 'developer',
    startingPriceTND: 10,
    durationLabel: {
      ar: '10M Tokens',
      arabizi: '10M Tokens',
      fr: '10M Tokens',
      en: '10M Tokens',
    },
    pricingVariants: [
      { duration: '10m_tokens', priceTND: 10, labelAr: '10.0 د.ت (10M Tokens)', labelFr: '10.0 TND (10M Tokens)', labelEn: '10.0 TND (10M Tokens)' },
      { duration: '100m_tokens', priceTND: 35, labelAr: '35.0 د.ت (100M Tokens)', labelFr: '35.0 TND (100M Tokens)', labelEn: '35.0 TND (100M Tokens)' },
      { duration: '100usd_credit', priceTND: 70, labelAr: '70.0 د.ت (رصيد 100$)', labelFr: '70.0 TND (Crédit 100$)', labelEn: '70.0 TND ($100 Balance)' },
    ],
    tagline: {
      ar: 'مفتاح API رسمي لنماذج Anthropic لربطه بتطبيقاتك وأنظمة الذكاء الاصطناعي',
      arabizi: 'Clé API officielle Anthropic bch terbot biha tes apps w agents AI',
      fr: "Clés API officielles Anthropic pour intégrer l'IA dans vos logiciels et agents",
      en: 'Official Anthropic API keys to connect Claude models to apps and agents',
    },
    highlights: {
      ar: 'تسليم فوري لمفتاح API، استهلاك آمن ومراقب، دعم Sonnet و Haiku و Opus',
      arabizi: 'Taslim fawri lel clé API, support Sonnet w Haiku',
      fr: 'Livraison immédiate, tokens officiels, support complet Sonnet et Opus',
      en: 'Instant API key delivery, official usage credits, supports Sonnet & Opus',
    },
    bestForProfessions: ['developer'],
    deliveryType: 'api_key',
  },
  {
    id: 'chatgpt-plus',
    slug: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    provider: 'OpenAI',
    category: 'ai',
    startingPriceTND: 50,
    durationLabel: {
      ar: 'شهر واحد',
      arabizi: '1 chhar',
      fr: '1 mois',
      en: '1 month',
    },
    pricingVariants: [
      { duration: '1_month', priceTND: 50, labelAr: '50.0 د.ت / شهر', labelFr: '50.0 TND / mois', labelEn: '50.0 TND / month' },
    ],
    tagline: {
      ar: 'حساب رسمي مع كامل مزايا GPT-4o وتوليد الصور والبحث المعمق',
      arabizi: 'Kamel les options mte3 GPT-4o, DALL-E 3 w recherche 3mi9a',
      fr: 'Accès prioritaire à GPT-4o, génération DALL-E 3, Canvas et Deep Research',
      en: 'Full access to GPT-4o, DALL-E 3 image generation, Canvas, and Deep Research',
    },
    highlights: {
      ar: 'أداة Canvas، محادثات صوتية فورية، تحليل جداول وبيانات، وبحث على الويب',
      arabizi: 'Canvas, vocal direct, analyse des fichiers w recherche web',
      fr: 'Mode Canvas, conversation vocale avancée, analyse de documents et web browsing',
      en: 'Canvas editor, Advanced Voice Mode, data file analysis, web browsing',
    },
    bestForProfessions: ['student', 'marketer', 'designer', 'general'],
    deliveryType: 'private_account',
  },
  {
    id: 'chatgpt-go',
    slug: 'chatgpt-go',
    name: 'ChatGPT Go',
    provider: 'OpenAI',
    category: 'ai',
    startingPriceTND: 40,
    durationLabel: {
      ar: '3 أشهر',
      arabizi: '3 chhour',
      fr: '3 mois',
      en: '3 months',
    },
    pricingVariants: [
      { duration: '3_months', priceTND: 40, labelAr: '40.0 د.ت / 3 أشهر', labelFr: '40.0 TND / 3 mois', labelEn: '40.0 TND / 3 months' },
    ],
    tagline: {
      ar: 'اشتراك اقتصادي موسع لنماذج الذكاء الاصطناعي مع مدة ممتدة 3 أشهر',
      arabizi: 'Abonnement économique 3 chhour b soum tayara',
      fr: 'Solution économique 3 mois pour profiter des capacités avancées de GPT',
      en: 'Cost-effective 3-month package with expanded GPT capacity and limits',
    },
    highlights: {
      ar: 'سعة رسائل عالية، توليد صور، وتحليل ملفات بسعر 40 د.ت فقط لـ 3 أشهر كاملة',
      arabizi: '40 DT l 3 chhour kemlin, taslim officiel',
      fr: 'Excellente autonomie, analyse de documents et génération de visuels',
      en: 'High message limits, image creation, and document insights for 3 full months',
    },
    bestForProfessions: ['student', 'general'],
    deliveryType: 'private_account',
  },
  {
    id: 'canva-pro',
    slug: 'canva-pro',
    name: 'Canva Pro',
    provider: 'Canva',
    category: 'design',
    startingPriceTND: 5,
    durationLabel: {
      ar: 'شهر أو سنتان',
      arabizi: '1 mois walla 2 ans',
      fr: '1 mois ou 2 ans',
      en: '1 month or 2 years',
    },
    pricingVariants: [
      { duration: '1_month', priceTND: 5, labelAr: '5.0 د.ت / شهر', labelFr: '5.0 TND / mois', labelEn: '5.0 TND / month' },
      { duration: '2_years', priceTND: 25, labelAr: '25.0 د.ت / سنتان', labelFr: '25.0 TND / 2 ans', labelEn: '25.0 TND / 2 years' },
      { duration: '3_years', priceTND: 30, labelAr: '30.0 د.ت / 3 سنوات Team Edu', labelFr: '30.0 TND / 3 ans Team Edu', labelEn: '30.0 TND / 3 years Team Edu' },
    ],
    tagline: {
      ar: 'منصة التصميم الجرافيكي الأولى: ملايين القوالب وإزالة الخلفيات بنقرة واحدة',
      arabizi: 'A7sen outil mte3 design: qwalib, background remover w Magic Studio',
      fr: 'La suite de création graphique incontournable pour visuels et réseaux sociaux',
      en: 'The ultimate graphic design platform with background remover and Magic Studio',
    },
    highlights: {
      ar: 'تفعيل على بريدك الشخصي، تنحية خلفيات الصور والفيديو، Magic Studio و 100M+ عنصر',
      arabizi: 'Activation 3la comptek el personnel, tan7iya mte3 background, 100M+ designs',
      fr: 'Activé directement sur votre email personnel, détourage en 1 clic et Magic Studio',
      en: 'Activated directly on personal email, 1-click background eraser, Magic Studio AI',
    },
    bestForProfessions: ['designer', 'marketer', 'student', 'video_creator', 'general'],
    deliveryType: 'direct_email',
  },
  {
    id: 'adobe-express-premium',
    slug: 'adobe-express-premium',
    name: 'Adobe Express Premium',
    provider: 'Adobe',
    category: 'design',
    startingPriceTND: 10,
    durationLabel: {
      ar: '6 أشهر',
      arabizi: '6 chhour',
      fr: '6 mois',
      en: '6 months',
    },
    pricingVariants: [
      { duration: '6_months', priceTND: 10, labelAr: '10.0 د.ت / 6 أشهر', labelFr: '10.0 TND / 6 mois', labelEn: '10.0 TND / 6 months' },
      { duration: '12_months', priceTND: 20, labelAr: '20.0 د.ت / 12 شهراً', labelFr: '20.0 TND / 12 mois', labelEn: '20.0 TND / 12 months' },
    ],
    tagline: {
      ar: 'أدوات Adobe الاحترافية مع مكتبة الخطوط الكاملة ومزايا الذكاء الاصطناعي Firefly',
      arabizi: 'Outils Adobe pro m3a Adobe Fonts w generative AI Firefly',
      fr: 'La puissance créative Adobe avec polices premium et IA générative Firefly',
      en: 'Adobe creative power with Adobe Fonts library and Firefly generative AI',
    },
    highlights: {
      ar: 'تعديل صور وفيديوهات بجودة Adobe، قوالب سوشيال ميديا احترافية بدون بطاقة دولية',
      arabizi: 'Khedma pro b 10 DT kahaw l 6 chhour',
      fr: 'Génération Firefly illimitée, intégration Photoshop/Illustrator, templates premium',
      en: 'Adobe Firefly generative AI, full Adobe Fonts library, professional templates',
    },
    bestForProfessions: ['designer', 'marketer'],
    deliveryType: 'coupon_link',
  },
  {
    id: 'capcut-pro',
    slug: 'capcut-pro',
    name: 'CapCut Pro',
    provider: 'ByteDance',
    category: 'video',
    startingPriceTND: 20,
    durationLabel: {
      ar: 'AI Credits أو Team',
      arabizi: 'Credits walla Team',
      fr: 'Crédits IA ou Team',
      en: 'AI Credits or Team',
    },
    pricingVariants: [
      { duration: '800_credits', priceTND: 20, labelAr: '20.0 د.ت (~800 AI Credits)', labelFr: '20.0 TND (~800 Crédits IA)', labelEn: '20.0 TND (~800 AI Credits)' },
      { duration: '1600_credits', priceTND: 30, labelAr: '30.0 د.ت (1600 AI Credits)', labelFr: '30.0 TND (1600 Crédits IA)', labelEn: '30.0 TND (1600 AI Credits)' },
      { duration: 'team_admin', priceTND: 40, labelAr: '40.0 د.ت Admin Team (5 مقاعد)', labelFr: '40.0 TND Admin Team (5 sièges)', labelEn: '40.0 TND Admin Team (5 seats)' },
    ],
    tagline: {
      ar: 'برنامج المونتاج الأكثر طلباً في تونس: تصدير 4K، تفريغ صوتي، وتأثيرات VIP حصرية',
      arabizi: 'Montage video 4K sans watermark, sous-titres automatiques bil 3arbi w effets VIP',
      fr: 'Le logiciel de montage vidéo vidéo par excellence : export 4K sans filigrane et sous-titres automatiques',
      en: 'The essential video editing suite: 4K 60fps export without watermark & auto captions',
    },
    highlights: {
      ar: 'ترجمة تلقائية عربية/فرنسية، تنحية الضوضاء، ومؤثرات صوتية ومرئية VIP كاملة',
      arabizi: 'Sous-titrage automatique, video 4K, sans logo CapCut',
      fr: 'Sous-titrage automatique bilingue, suppression du bruit et effets VIP débloqués',
      en: 'Auto captions, noise reduction, 4K export with zero watermark, full VIP effects',
    },
    bestForProfessions: ['video_creator', 'marketer', 'student'],
    deliveryType: 'private_account',
  },
  {
    id: 'gemini-plus-family',
    slug: 'gemini-plus-family',
    name: 'Gemini Plus (Family)',
    provider: 'Google',
    category: 'ai',
    startingPriceTND: 30,
    durationLabel: {
      ar: '6 أشهر',
      arabizi: '6 chhour',
      fr: '6 mois',
      en: '6 months',
    },
    pricingVariants: [
      { duration: '6_months', priceTND: 30, labelAr: '30.0 د.ت / 6 أشهر', labelFr: '30.0 TND / 6 mois', labelEn: '30.0 TND / 6 months' },
      { duration: '12_months', priceTND: 40, labelAr: '40.0 د.ت / 12 شهراً', labelFr: '40.0 TND / 12 mois', labelEn: '40.0 TND / 12 months' },
    ],
    tagline: {
      ar: 'ذكاء Google الخارق مع مساحة تخزين سحابية ضخمة 2TB على Google One',
      arabizi: 'AI mte3 Google m3a 2TB stockage fi Google One',
      fr: 'Le meilleur de Google IA avec 2 To de stockage Google One inclus',
      en: 'Google Advanced AI ecosystem bundled with 2TB Google One cloud storage',
    },
    highlights: {
      ar: 'توليد الصور والفيديوهات، تلخيص المستندات الكبيرة، وربط مع Gmail و Docs و Drive',
      arabizi: '2TB stockage Google Drive w Photos, telkhis les documents el kbar',
      fr: 'Analyse de documents volumineux, intégration Gmail/Drive et 2 To de stockage',
      en: 'Huge context document analysis, Gmail & Docs integration, 2TB Google One storage',
    },
    bestForProfessions: ['student', 'general', 'marketer'],
    deliveryType: 'direct_invite',
  },
  {
    id: 'spotify-premium',
    slug: 'spotify-premium',
    name: 'Spotify Premium',
    provider: 'Spotify',
    category: 'entertainment',
    startingPriceTND: 30,
    durationLabel: {
      ar: '3 أشهر',
      arabizi: '3 chhour',
      fr: '3 mois',
      en: '3 months',
    },
    pricingVariants: [
      { duration: '3_months', priceTND: 30, labelAr: '30.0 د.ت / 3 أشهر', labelFr: '30.0 TND / 3 mois', labelEn: '30.0 TND / 3 months' },
    ],
    tagline: {
      ar: 'ملايين الأغاني والبودكاست بدون إعلانات مع إمكانية التحميل والاستماع دون إنترنت',
      arabizi: 'Ghnayet w podcasts sans pub w telechargement offline',
      fr: 'Musique et podcasts illimités sans publicité avec écoute hors ligne en haute qualité',
      en: 'Unlimited ad-free music and podcasts with offline download and lossless audio',
    },
    highlights: {
      ar: 'تفعيل رسمي على حسابك الشخصي، صوت فائق النقاء، تخطي لا محدود للأغاني',
      arabizi: '3la comptek el personnel, sans pub, qualite soute hbeul',
      fr: 'Activé sur votre compte personnel, qualité sonore maximale, zapping illimité',
      en: 'Family invite applied to your existing personal account, extreme quality audio',
    },
    bestForProfessions: ['music', 'student', 'general'],
    deliveryType: 'direct_invite',
  },
];

export function getRecommendedCards(
  slugs: string[],
  locale: string = 'ar'
): RecommendedProductCard[] {
  const normLocale = locale === 'fr' ? 'fr' : locale === 'en' ? 'en' : 'ar';
  const langKey = normLocale === 'fr' ? 'fr' : normLocale === 'en' ? 'en' : 'ar';

  const matched = SANJOUB_CATALOG.filter((p) => slugs.includes(p.slug));

  return matched.map((p) => {
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      provider: p.provider,
      category: p.category,
      priceTND: p.startingPriceTND,
      durationLabel: p.durationLabel[langKey],
      tagline: p.tagline[langKey],
      highlights: p.highlights[langKey],
      productUrl: `/${normLocale}/product/${p.slug}`,
      checkoutUrl: `/${normLocale}/checkout?plan=${p.slug}`,
    };
  });
}

export function formatCatalogForPrompt(locale: string = 'ar'): string {
  const normLocale = locale === 'fr' ? 'fr' : locale === 'en' ? 'en' : 'ar';
  return SANJOUB_CATALOG.map((p, idx) => {
    const prices = p.pricingVariants.map((v) => `${v.duration}: ${v.priceTND} TND`).join(', ');
    return `${idx + 1}. **${p.name}** (Provider: ${p.provider}, Slug: ${p.slug})
   - Prices: ${prices}
   - Best For: ${p.bestForProfessions.join(', ')}
   - Summary (${normLocale}): ${p.tagline[normLocale]}
   - Features: ${p.highlights[normLocale]}
   - URL: /${normLocale}/product/${p.slug} | Checkout: /${normLocale}/checkout?plan=${p.slug}`;
  }).join('\n\n');
}
