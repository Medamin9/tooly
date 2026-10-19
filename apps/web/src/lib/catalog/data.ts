export interface DemoPlan {
  id: string;
  slug: string;
  name: string;
  provider: string;
  category: 'ai' | 'design' | 'video' | 'productivity' | 'developer';
  tagline: {
    ar: string;
    fr: string;
    en: string;
  };
  description: {
    ar: string;
    fr: string;
    en: string;
  };
  duration: '1_month' | '3_months' | '1_year';
  durationLabel: {
    ar: string;
    fr: string;
    en: string;
  };
  priceTND: number;
  deliveryMethod: {
    ar: string;
    fr: string;
    en: string;
  };
  features: {
    ar: string[];
    fr: string[];
    en: string[];
  };
  restrictions: {
    ar: string[];
    fr: string[];
    en: string[];
  };
  isFeatured?: boolean;
}

export const DEMO_PLANS: DemoPlan[] = [
  {
    id: 'plan-claude-pro-1m',
    slug: 'claude-pro',
    name: 'Claude Pro',
    provider: 'Anthropic',
    category: 'ai',
    tagline: {
      ar: 'مساعد الذكاء الاصطناعي الأفضل في التحليل الدقيق وصياغة الأكواد',
      fr: 'Assistant IA de pointe pour l’analyse complexe et le code',
      en: 'Advanced AI assistant with high-reasoning and coding power',
    },
    description: {
      ar: 'وصول متميز إلى نماذج Claude 3.5 Sonnet مع سعة استخدام مضاعفة 5 مرات في أوقات الذروة.',
      fr: 'Accès prioritaire à Claude 3.5 Sonnet avec 5x plus d’utilisation pendant les heures de pointe.',
      en: 'Priority access to Claude 3.5 Sonnet with 5x higher usage limits during peak hours.',
    },
    duration: '1_month',
    durationLabel: {
      ar: 'شهر واحد',
      fr: '1 mois',
      en: '1 month',
    },
    priceTND: 79.0,
    deliveryMethod: {
      ar: 'دعوة مباشرة للبريد الإلكتروني أو حساب جاهز',
      fr: 'Invitation directe par email ou compte pré-configuré',
      en: 'Direct email workspace invitation or prepared account',
    },
    features: {
      ar: [
        'وصول كامل لنموذج Claude 3.5 Sonnet',
        'ميزة Projects لتنظيم المستندات والملفات',
        'ميزات Artifacts التفاعلية لتطوير واجهات الويب',
        'دعم فني محلي من Tooly.tn طيلة فترة الاشتراك',
      ],
      fr: [
        'Accès complet au modèle Claude 3.5 Sonnet',
        'Espaces Projects pour organiser documents et code',
        'Fonctionnalité interactive Artifacts pour le web',
        'Support technique local Tooly.tn durant toute la période',
      ],
      en: [
        'Full access to Claude 3.5 Sonnet model',
        'Projects workspaces for organizing code and docs',
        'Interactive Artifacts for real-time frontend generation',
        'Local technical support by Tooly.tn throughout the period',
      ],
    },
    restrictions: {
      ar: [
        'يخضع لحدود الاستخدام القياسية الخاصة بشركة Anthropic',
        'لا يتيح مشاركة الحساب مع أكثر من مستخدم واحد في وقت متزامن',
      ],
      fr: [
        'Soumis aux limites d’utilisation standard d’Anthropic',
        'Compte personnel non partageable simultanément',
      ],
      en: [
        'Subject to Anthropic standard fair usage limits',
        'Single concurrent user access policy',
      ],
    },
    isFeatured: true,
  },
  {
    id: 'plan-canva-pro-1y',
    slug: 'canva-pro',
    name: 'Canva Pro',
    provider: 'Canva',
    category: 'design',
    tagline: {
      ar: 'منصة التصميم الجرافيكي المتكاملة للشركات والمصممين',
      fr: 'La suite créative tout-en-un pour designers et équipes',
      en: 'All-in-one graphic design suite for creators and teams',
    },
    description: {
      ar: 'ملايين القوالب الاحترافية، إزالة الخلفيات بنقرة واحدة، ومكتبة خطوط وصور استثنائية.',
      fr: 'Des millions de templates pro, suppression d’arrière-plan en 1 clic et bibliothèque géante.',
      en: 'Millions of premium templates, one-click background remover, and cloud asset library.',
    },
    duration: '1_year',
    durationLabel: {
      ar: 'سنة كاملة (12 شهراً)',
      fr: '1 an (12 mois)',
      en: '1 year (12 months)',
    },
    priceTND: 149.0,
    deliveryMethod: {
      ar: 'دعوة انضمام لمساحة عمل فريق Canva على بريدك الشخصي',
      fr: 'Invitation officielle d’équipe Canva sur votre email personnel',
      en: 'Official Canva Team workspace invitation sent to your email',
    },
    features: {
      ar: [
        'أكثر من 100 مليون صورة ومقطع فيديو وقالب مميز',
        'أداة Magic Resizer ومزيل الخلفيات الذكي',
        'مساحة تخزين سحابية 1TB لحفظ كافة تصميماتك',
        'تفعيل مباشر على بريدك الإلكتروني الشخصي',
      ],
      fr: [
        'Plus de 100M d’éléments premium (photos, vidéos, polices)',
        'Outil Magic Switch et détourage automatique en 1 clic',
        '1 To de stockage cloud pour vos créations',
        'Activation directe sur votre adresse email personnelle',
      ],
      en: [
        '100M+ premium stock photos, videos, and graphics',
        'Magic Switch tool and instant background remover',
        '1 TB cloud storage for all your creative projects',
        'Direct activation on your personal email address',
      ],
    },
    restrictions: {
      ar: ['استخدام شخصي أو تجاري متوافق مع شروط استخدام Canva'],
      fr: ['Usage personnel ou commercial conforme aux CGU de Canva'],
      en: ['Personal or commercial use compliant with Canva terms'],
    },
    isFeatured: true,
  },
  {
    id: 'plan-chatgpt-plus-1m',
    slug: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    provider: 'OpenAI',
    category: 'ai',
    tagline: {
      ar: 'المساعد الذكي الأكثر انتشاراً عالمياً مع نموذج GPT-4o المتقدم',
      fr: 'L’assistant IA de référence mondial avec GPT-4o',
      en: 'Leading conversational AI model powered by GPT-4o',
    },
    description: {
      ar: 'وصول أسرع لنموذج GPT-4o، توليد الصور بـ DALL·E 3، وتحليل البيانات المتقدم.',
      fr: 'Accès prioritaire à GPT-4o, génération d’images DALL·E 3 et analyse de données.',
      en: 'Priority access to GPT-4o, DALL·E 3 image generation, and data analysis.',
    },
    duration: '1_month',
    durationLabel: {
      ar: 'شهر واحد',
      fr: '1 mois',
      en: '1 month',
    },
    priceTND: 85.0,
    deliveryMethod: {
      ar: 'ترقية حساب موجود أو حساب جاهز مستقل',
      fr: 'Mise à niveau de compte existant ou compte dédié',
      en: 'Account upgrade or prepared dedicated account',
    },
    features: {
      ar: [
        'وصول لأحدث نماذج OpenAI (GPT-4o و o1-preview)',
        'تصفح الويب المباشر وتوليد الصور',
        'تحليل مستندات Excel و PDF المعقدة',
        'ضمان استمرارية الخدمة طيلة الـ 30 يوماً',
      ],
      fr: [
        'Accès aux derniers modèles (GPT-4o et o1-preview)',
        'Navigation web en temps réel et création d’images DALL-E 3',
        'Analyse de fichiers Excel et documents PDF complexes',
        'Garantie de continuité de service sur 30 jours',
      ],
      en: [
        'Access to latest OpenAI models (GPT-4o and o1-preview)',
        'Real-time web browsing and DALL-E 3 image generation',
        'Advanced data and complex spreadsheet analysis',
        'Full 30-day continuous service warranty',
      ],
    },
    restrictions: {
      ar: ['تطبق سياسات الاستخدام العادل المقررة من OpenAI'],
      fr: ['Soumis aux règles de fair-use d’OpenAI'],
      en: ['Subject to standard OpenAI fair-use policies'],
    },
    isFeatured: true,
  },
  {
    id: 'plan-capcut-pro-1y',
    slug: 'capcut-pro',
    name: 'CapCut Pro',
    provider: 'ByteDance',
    category: 'video',
    tagline: {
      ar: 'مونتاج الفيديو السريع والاحترافي لصناع المحتوى والشبكات الاجتماعية',
      fr: 'Montage vidéo dynamique et intuitif pour créateurs de contenu',
      en: 'Smart video editing suite for creators and social media teams',
    },
    description: {
      ar: 'مؤثرات ذكية بالذكاء الاصطناعي، تفريغ صوتي آلي متعدد اللغات، وتصدير بجودة 4K.',
      fr: 'Sous-titres automatiques multi-langues, effets IA et export 4K haute résolution.',
      en: 'Auto captions in multiple languages, AI video effects, and 4K export.',
    },
    duration: '1_year',
    durationLabel: {
      ar: 'سنة كاملة',
      fr: '1 an',
      en: '1 year',
    },
    priceTND: 129.0,
    deliveryMethod: {
      ar: 'تسجيل حساب معتمد مع تفعيل الاشتراك',
      fr: 'Compte validé avec licence annuelle activée',
      en: 'Validated account with 1-year active subscription',
    },
    features: {
      ar: [
        'إزالة الخلفيات التلقائية للفيديو بنقرة واحدة',
        'توليد الترجمة التلقائية باللغة العربية والفرنسية',
        'مكتبة مؤثرات وانتقالات حصرية غير محدودة',
        'تصدير بدون علامة مائية بدقة 4K بمعدل 60 إطاراً',
      ],
      fr: [
        'Suppression automatique de fond vidéo en un clic',
        'Génération automatique de sous-titres FR/AR',
        'Bibliothèque complète d’effets et transitions pro',
        'Export sans watermark en 4K 60fps',
      ],
      en: [
        'One-click instant video background cutout',
        'Auto subtitle captioning for Arabic, French & English',
        'Full library of premium transitions and sound effects',
        'Watermark-free 4K export at 60fps',
      ],
    },
    restrictions: {
      ar: ['يتطلب تثبيت تطبيق CapCut على الحاسوب أو الهاتف'],
      fr: ['Nécessite l’application officielle CapCut sur PC ou mobile'],
      en: ['Requires official CapCut app on desktop or mobile device'],
    },
    isFeatured: true,
  },
  {
    id: 'plan-cursor-pro-1m',
    slug: 'cursor-pro',
    name: 'Cursor Pro',
    provider: 'Anysphere',
    category: 'developer',
    tagline: {
      ar: 'محرر الأكواد الذكي المدعوم بالذكاء الاصطناعي الأقوى عالمياً',
      fr: 'L’éditeur de code nouvelle génération alimenté par l’IA',
      en: 'AI-first code editor designed for pair-programming and refactoring',
    },
    description: {
      ar: 'تعديل كامل مستودع الأكواد (Codebase Indexing) ومساعد محادثة ذكي داخل المحرر.',
      fr: 'Indexation complète de votre base de code et complétion intelligente en ligne.',
      en: 'Full codebase indexing, multi-file edits, and ultra-fast completions.',
    },
    duration: '1_month',
    durationLabel: {
      ar: 'شهر واحد',
      fr: '1 mois',
      en: '1 month',
    },
    priceTND: 89.0,
    deliveryMethod: {
      ar: 'تفعيل حساب عبر البريد الإلكتروني',
      fr: 'Activation par email développeur',
      en: 'Direct developer email activation',
    },
    features: {
      ar: [
        '500 طلب سريع لنموذج Claude 3.5 Sonnet شهرياً',
        'استخدام غير محدود للنماذج القياسية',
        'فهم وفهرسة كامل مستودع الأكواد الخاص بمشروعك',
        'تعديل ملفات متعددة في وقت واحد بنقرة واحدة',
      ],
      fr: [
        '500 requêtes prioritaires Claude 3.5 Sonnet par mois',
        'Requêtes illimitées sur les modèles standard',
        'Compréhension contextuelle de l’ensemble de votre code',
        'Éditions multi-fichiers instantanées',
      ],
      en: [
        '500 fast requests to Claude 3.5 Sonnet per month',
        'Unlimited slow/standard model requests',
        'Complete context indexation of your codebase',
        'Multi-file instantaneous diff edits',
      ],
    },
    restrictions: {
      ar: ['مخصص لمطور واحد ولا يسمح بمشاركة جلسات العمل'],
      fr: ['Réservé à un développeur unique'],
      en: ['Single developer license policy'],
    },
    isFeatured: false,
  },
];
