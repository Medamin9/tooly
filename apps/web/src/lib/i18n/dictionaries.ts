import { Locale } from '@tooly/contracts';

export interface Dictionary {
  common: {
    brandName: string;
    tagline: string;
    searchPlaceholder: string;
    viewCatalog: string;
    howItWorks: string;
    faqs: string;
    contactSupport: string;
    currency: string;
    currencyFull: string;
    demoNotice: string;
    demoBadge: string;
    disclaimer: string;
    allCategories: string;
    viewDetails: string;
    requestPlan: string;
    close: string;
    back: string;
    loading: string;
    noResults: string;
    offlinePaymentNotice: string;
    totalPrice: string;
    orderStepsTitle: string;
    orderCodeLabel: string;
    deliveryMethodLabel: string;
    supportPaymentStep: string;
  };
  nav: {
    catalog: string;
    categories: string;
    howItWorks: string;
    trust: string;
    faq: string;
    contact: string;
    account: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    titlePart2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
  velocityGuarantee: {
    line1: string;
    line2: string;
  };
  heroScene: {
    statusBadge: string;
    currency: string;
    viewOffer: string;
    ariaLabel: string;
    offers: Record<
      string,
      {
        name: string;
        provider: string;
        badge: string;
        highlight: string;
        guarantee: string;
        period: string;
      }
    >;
  };
  categories: {
    badge: string;
    title: string;
    subtitle: string;
    exploreCta: string;
    feature1: string;
    feature2: string;
    feature3: string;
    viewTools: string;
    ai: { name: string; desc: string; badge: string };
    design: { name: string; desc: string; badge: string };
    video: { name: string; desc: string; badge: string };
    productivity: { name: string; desc: string; badge: string };
    developer: { name: string; desc: string; badge: string };
  };
  curated: {
    title: string;
    subtitle: string;
    perMonth: string;
    perQuarter: string;
    perYear: string;
    availability: string;
    inStock: string;
    deliveryTime: string;
    offerTypeLabel: string;
    featuresLabel: string;
    orderNow: string;
    viewDetails: string;
    deliveryBadge: string;
    guaranteeBadge: string;
    passHolder: string;
    prevCard: string;
    nextCard: string;
    interactiveHint: string;
  };
  howItWorksSection: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  trustSection: {
    badge: string;
    title: string;
    subtitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
  };
  faqSection: {
    title: string;
    subtitle: string;
    items: Array<{ q: string; a: string }>;
  };
  catalogPage: {
    title: string;
    subtitle: string;
    search: string;
    filterCategory: string;
    filterDuration: string;
    allDurations: string;
    foundCount: string;
    quickFilter: string;
    resetFilters: string;
    showing: string;
    emptySearchDesc: string;
    oneMonth: string;
    threeMonths: string;
    oneYear: string;
  };
  shapeHeroCta: {
    tagline: string;
    physicsHint: string;
  };
  productDetail: {
    overview: string;
    features: string;
    restrictions: string;
    deliveryMethod: string;
    termsTitle: string;
    offlineInstructionTitle: string;
    offlineInstructionBody: string;
    contactToOrder: string;
  };
  footer: {
    about: string;
    quickLinks: string;
    legal: string;
    legalTerms: string;
    privacyPolicy: string;
    refundPolicy: string;
    resaleDisclaimer: string;
    rightsReserved: string;
    popularToolsTitle: string;
    popularBadge: string;
    paymentMethodsTitle: string;
    paymentCib: string;
    paymentD17: string;
    paymentFlouci: string;
    paymentTransfer: string;
    supportGuarantee: string;
    transparencyTitle: string;
    officialCurrency: string;
    backToTop: string;
    trackOrder: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  ar: {
    common: {
      brandName: 'تولي — Tooly.tn',
      tagline: 'سوق الأدوات والاشتراكات الرقمية في تونس',
      searchPlaceholder: 'ابحث عن أداة، برنامج، أو اشتراك (مثل Claude, Canva, ChatGPT)...',
      viewCatalog: 'تصفح كافة الأدوات',
      howItWorks: 'كيف تعمل المنصة؟',
      faqs: 'الأسئلة الشائعة',
      contactSupport: 'تواصل مع الدعم الفني',
      currency: 'د.ت',
      currencyFull: 'دينار تونسي (TND)',
      demoBadge: 'بيانات تجريبية مصرحة',
      demoNotice: 'ملاحظة: هذه المعروضات كنماذج استعراضية للمرحلة التأسيسية لتوضيح هيكلية الخطط والأسعار.',
      disclaimer: 'Tooly.tn منصة مستقلة توفر حلول اشتراكات رقمية في تونس. جميع العلامات التجارية المعروضة ملك لأصحابها.',
      allCategories: 'جميع التصنيفات',
      viewDetails: 'عرض تفاصيل الخطة',
      requestPlan: 'طلب الاشتراك الآن',
      close: 'إغلاق',
      back: 'رجوع',
      loading: 'جاري التحميل...',
      noResults: 'لم يتم العثور على نتائج مطابقة لخيارات البحث.',
      offlinePaymentNotice: 'الدفع يتم مباشرة خارج المنصة عبر التحويل البنكي أو وسيلة الدفع المتفق عليها.',
      totalPrice: 'السعر الإجمالي:',
      orderStepsTitle: 'خطوات استكمال الطلب:',
      orderCodeLabel: 'رمز الطلب:',
      deliveryMethodLabel: 'طريقة التسليم:',
      supportPaymentStep: 'قم بالتواصل مع فريق الدعم لتأكيد وسيلة الدفع بالدينار التونسي (تحويل بنكي أو D17).',
    },
    nav: {
      catalog: 'الأدوات والخطط',
      categories: 'التصنيفات',
      howItWorks: 'كيف نعمل',
      trust: 'الضمان والشفافية',
      faq: 'الأسئلة المتكررة',
      contact: 'اتصل بنا',
      account: 'تسجيل الدخول',
    },
    hero: {
      badge: 'المنصة الأولى المخصصة للمحترفين في تونس',
      titlePart1: 'أدوات الذكاء الاصطناعي والإبداع،',
      titleHighlight: 'بالدينار التونسي ودعم محلي',
      titlePart2: 'بين يديك.',
      description: 'اكتشف خطط الاشتراكات الرقمية العالمية لأدوات الذكاء الاصطناعي، التصميم، وإنتاج المحتوى بكل شفافية، وبشروط واضحة تلائم السوق التونسي.',
      primaryCta: 'استكشف الاشتراكات المتاحة',
      secondaryCta: 'تعرف على خطوات التسليم',
      feature1: 'أسعار واضحة بالدينار التونسي (TND)',
      feature2: 'تسليم ومتابعة عبر الدعم المباشر',
      feature3: 'شروط استخدام ومدة اشتراك مضمونة',
    },
    velocityGuarantee: {
      line1: 'لا يعمل؟ نستبدله فوراً ✦ نصلحه أو نرسل لك حساباً جديداً للخطة نفسها التي اشتريتها',
      line2: 'أو نردّ لك المال ✦ إن لم نستطع إصلاحه، نردّ لك الجزء غير المستخدم، أو المبلغ كاملاً إن لم يعمل أبداً',
    },
    heroScene: {
      statusBadge: 'اشتراكات نشطة ومضمونة بالدينار',
      currency: 'د.ت',
      viewOffer: 'عرض الخطة',
      ariaLabel: 'عروض الاشتراكات الرقمية التفاعلية',
      offers: {
        'claude-pro': {
          name: 'Claude 3.5 Pro',
          provider: 'Anthropic',
          badge: 'Sonnet 3.5',
          highlight: 'تحليل دقيق وبرمجة وميزة Projects',
          guarantee: 'تفعيل فوري',
          period: 'شهر',
        },
        'chatgpt-plus': {
          name: 'ChatGPT Plus',
          provider: 'OpenAI',
          badge: 'GPT-4o & o1',
          highlight: 'توليد الصور وتصفح الويب الذكي',
          guarantee: 'ضمان 30 يوماً',
          period: 'شهر',
        },
        'canva-pro': {
          name: 'Canva Pro Team',
          provider: 'Canva',
          badge: '100M+ عنصر',
          highlight: 'إزالة خلفيات وتخزين 1TB سحابي',
          guarantee: 'دعوة رسمية',
          period: 'سنة',
        },
        'capcut-pro': {
          name: 'CapCut Pro',
          provider: 'ByteDance',
          badge: '4K 60fps',
          highlight: 'ترجمة تلقائية ومؤثرات AI حصرية',
          guarantee: 'بدون علامة مائية',
          period: 'سنة',
        },
        'cursor-pro': {
          name: 'Cursor Pro',
          provider: 'Anysphere',
          badge: 'Fast Sonnet',
          highlight: 'فهرسة كامل مستودع الأكواد بنقرة',
          guarantee: '500 طلب سريع',
          period: 'شهر',
        },
        'gemini-advanced': {
          name: 'Gemini Advanced',
          provider: 'Google AI',
          badge: '1M سياق',
          highlight: 'سياق فائق 1M رمز وتكامل Drive',
          guarantee: 'تفعيل معتمد',
          period: 'شهر',
        },
        'midjourney-std': {
          name: 'Midjourney v6',
          provider: 'Midjourney',
          badge: 'Photoreal',
          highlight: 'توليد فني واقعي وأسلوب إبداعي',
          guarantee: 'وصول مباشر',
          period: 'شهر',
        },
        'perplexity-pro': {
          name: 'Perplexity Pro',
          provider: 'Perplexity AI',
          badge: 'Pro Search',
          highlight: 'بحث استدلالي مع استشهادات موثقة',
          guarantee: '300+ بحث يومي',
          period: 'شهر',
        },
        'figma-pro': {
          name: 'Figma Professional',
          provider: 'Figma',
          badge: 'Dev Mode',
          highlight: 'مساحات عمل مشتركة ومكتبات تصميم',
          guarantee: 'دعوة رسمية',
          period: 'شهر',
        },
        'elevenlabs-creator': {
          name: 'ElevenLabs',
          provider: 'ElevenLabs',
          badge: 'Voice Clone',
          highlight: 'استنساخ أصوات ودبلجة ذكية',
          guarantee: '100k حرف/شهر',
          period: 'شهر',
        },
        'github-copilot': {
          name: 'GitHub Copilot',
          provider: 'GitHub',
          badge: 'AI Pair',
          highlight: 'مساعد كتابة الأكواد في VS Code',
          guarantee: 'حساب مفعل',
          period: 'شهر',
        },
        'notion-ai': {
          name: 'Notion AI',
          provider: 'Notion',
          badge: 'Q&A Hub',
          highlight: 'تلخيص الوثائق وإدارة مهام العمل',
          guarantee: 'ربط المساحة',
          period: 'شهر',
        },
        'grok-2': {
          name: 'Grok 2 / X Premium',
          provider: 'xAI',
          badge: 'Flux Art',
          highlight: 'توليد صور واقعية ومحادثة حية',
          guarantee: 'حساب مفعل',
          period: 'شهر',
        },
        'runway-gen3': {
          name: 'Runway Gen-3',
          provider: 'Runway AI',
          badge: 'AI Cinema',
          highlight: 'توليد سينمائي متقدم بالفيديو',
          guarantee: 'رصيد كامل',
          period: 'شهر',
        },
        'claude-team': {
          name: 'Claude Team Hub',
          provider: 'Anthropic',
          badge: 'Team 5x',
          highlight: 'مساحات مشتركة وأولوية قصوى',
          guarantee: 'دعم محلي',
          period: 'شهر',
        },
      },
    },
    categories: {
      badge: 'التصنيفات المعتمدة',
      title: 'أدوات تناسب كل مجالات العمل',
      subtitle: 'اختر مجالك وتعرف على أفضل البرمجيات المعتمدة لرفع إنتاجيتك وصناعة الفارق في مشاريعك.',
      exploreCta: 'تصفح كافة الأدوات والخطط',
      feature1: 'خطط فردية واشتراكات فرق عمل رسمية',
      feature2: 'تسليم ومتابعة عبر الدعم الفني المحلي',
      feature3: 'دفع بالدينار التونسي بدون رسوم صرف دولية',
      viewTools: 'استكشف الأدوات',
      ai: { name: 'الذكاء الاصطناعي', desc: 'مساعدات برمجية، محادثة متقدمة وتوليد محتوى ذكي', badge: 'AI & LLMs' },
      design: { name: 'التصميم والجرافيك', desc: 'قوالب احترافية وأدوات الإبداع البصري', badge: 'UI/UX & Graphics' },
      video: { name: 'المونتاج وصناعة الفيديو', desc: 'محررات فيديو سحابية ومؤثرات حديثة', badge: '4K & Motion' },
      productivity: { name: 'الإنتاجية والعمل الجماعي', desc: 'إدارة المهام ومساحات التعاون المؤسسي', badge: 'Workspace & Docs' },
      developer: { name: 'أدوات المطورين', desc: 'بيئات سحابية ومساعدات كتابة الكود', badge: 'IDE & Code' },
    },
    curated: {
      title: 'باقات واشتراكات مختارة',
      subtitle: 'خطط مدروسة وموثقة بأسعار تنافسية ومحددة المدة بدقة.',
      perMonth: 'شهرياً',
      perQuarter: 'كل 3 أشهر',
      perYear: 'سنوياً',
      availability: 'الحالة',
      inStock: 'متاح للطلب',
      deliveryTime: 'تسليم خلال 1–4 ساعات',
      offerTypeLabel: 'نوع العرض والتفاصيل',
      featuresLabel: 'الميزات والمواصفات المعتمدة',
      orderNow: 'طلب الاشتراك الآن',
      viewDetails: 'عرض التفاصيل الكاملة',
      deliveryBadge: 'تسليم مباشر وآمن',
      guaranteeBadge: 'ضمان استمرارية كامل',
      passHolder: 'حامل الاشتراك',
      prevCard: 'العرض السابق',
      nextCard: 'العرض التالي',
      interactiveHint: 'حرك المؤشر للتفاعل ثلاثي الأبعاد • اسحب أو تنقل بين البطاقات',
    },
    howItWorksSection: {
      badge: 'سهولة وأمان',
      title: 'تجربة طلب واضحة في 3 خطوات',
      subtitle: 'دون تعقيد بطاقات الدفع الدولية أو الحسابات المعلقة.',
      step1Title: '1. اختر الخطة المناسبة',
      step1Desc: 'تصفح شروط الخطة، مدتها، وميزاتها واطلع على السعر الصافي بالدينار التونسي.',
      step2Title: '2. تأكيد الطلب خارج المنصة',
      step2Desc: 'يتم تأكيد الطلب وترتيب وسيلة الدفع المفضلة محلياً (تحويل بنكي، D17، أو دفع مباشر).',
      step3Title: '3. استلام التعليمات والترقية',
      step3Desc: 'تصلك بيانات التفعيل أو دعوة مساحة العمل مباشرة مع توجيهات الاستخدام والدعم.',
    },
    trustSection: {
      badge: 'مبادئنا الأساسية',
      title: 'لماذا يختار المحترفون Tooly.tn؟',
      subtitle: 'نبني الثقة من خلال الشفافية التامة والالتزام بجودة الخدمة.',
      pillar1Title: 'تسعير صريح ومحلي',
      pillar1Desc: 'لا رسوم تحويل مفاجئة ولا أسعار متغيرة. تدفع بالدينار التونسي فقط.',
      pillar2Title: 'دعم محلي سريع',
      pillar2Desc: 'فريق دعم تونسي يجيب عن استفساراتك ويساعدك في ضبط حسابك خطوة بخطوة.',
      pillar3Title: 'شروط اشتراك موثقة',
      pillar3Desc: 'نوضح بالضبط نوع الحساب، مدته، وما إذا كان دعوة فريق أو حساباً مخصصاً.',
    },
    faqSection: {
      title: 'الأسئلة الشائعة حول الخدمة',
      subtitle: 'إجابات واضحة على كل ما قد تتساءل عنه قبل الطلب.',
      items: [
        {
          q: 'كيف يتم الدفع طالما أنه يتم خارج المنصة؟',
          a: 'بعد اختيار الخطة والضغط على طلب الاشتراك، يظهر لك رقم المرجع وتعليمات التحويل المحلي (تحويل بنكي مباشر أو وسائل الدفع الإلكتروني المحلية). بمجرد إرسال إشعار الدفع لفريق الدعم، يتم تفعيل اشتراكك.',
        },
        {
          q: 'هل الاشتراكات آمنة ومستمرة طيلة الفترة المتفق عليها؟',
          a: 'نعم، جميع الخطط المعروضة محددة المدة بشكل واضح وتخضع لضمان كامل طيلة مدة الاشتراك المتفق عليها.',
        },
        {
          q: 'ما هي طريقة التفعيل المتبعة؟',
          a: 'تختلف بحسب الأداة: إما عبر إرسال دعوة رسمية لبريدك الإلكتروني، أو تفعيل ترقية مباشرة، وتكون طريقة التسليم مبينة في صفحة كل منتج.',
        },
        {
          q: 'هل توفرون فواتير للشركات والعمل الحر؟',
          a: 'نعم، يمكن للشركات والمصممين المستقلين الحصول على بيان مفصل بالطلب والخدمة المقدمة.',
        },
      ],
    },
    catalogPage: {
      title: 'كتالوج الاشتراكات والأدوات',
      subtitle: 'استعرض جميع الأدوات المصنفة وقارن المزايا والأسعار.',
      search: 'بحث بالاسم...',
      filterCategory: 'حسب التصنيف',
      filterDuration: 'مدة الاشتراك',
      allDurations: 'جميع المدد',
      foundCount: 'خطة متوفرة',
      quickFilter: 'تصفية سريعة:',
      resetFilters: 'إعادة تعيين المرشحات',
      showing: 'عرض',
      emptySearchDesc: 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً لعرض الأدوات المتاحة.',
      oneMonth: '1 شهر',
      threeMonths: '3 أشهر',
      oneYear: '1 سنة',
    },
    shapeHeroCta: {
      tagline: 'سوق الاشتراكات الرقمية',
      physicsHint: '💡 حرّك أو ارمِ شارات الأدوات الرقمية للتفاعل الفيزيائي المباشر',
    },
    productDetail: {
      overview: 'نظرة عامة على الخطة',
      features: 'المزايا المضمنة',
      restrictions: 'الشروط والقيود المعمول بها',
      deliveryMethod: 'طريقة التسليم والتفعيل',
      termsTitle: 'الشروط والضمان',
      offlineInstructionTitle: 'خطوات إتمام الطلب محلياً',
      offlineInstructionBody: 'لإتمام طلبك، يرجى التواصل مع فريق العمل مع الإشارة لرمز الخطة. سيتم تزويدك بحساب التحويل فوراً.',
      contactToOrder: 'طلب الاشتراك والتفعيل',
    },
    footer: {
      about: 'Tooly.tn منصة تونسية متخصصة في توفير وتسهيل الوصول إلى أدوات العمل الرقمية والاشتراكات السحابية للمبدعين والشركات.',
      quickLinks: 'روابط سريعة',
      legal: 'الشؤون القانونية',
      legalTerms: 'شروط الاستخدام',
      privacyPolicy: 'سياسة الخصوصية',
      refundPolicy: 'سياسة الإلغاء والضمان',
      resaleDisclaimer: 'إشعار استقلالية: Tooly.tn ليست تابعة أو شريكة رسمية لأصحاب العلامات المعروضة ما لم ينص على ذلك صراحة.',
      rightsReserved: 'جميع الحقوق محفوظة لمنصة Tooly.tn © 2026.',
      popularToolsTitle: 'اشتراكات شائعة',
      popularBadge: 'الأكثر طلباً',
      paymentMethodsTitle: 'طرق الدفع المحلية المعتمدة في تونس:',
      paymentCib: '💳 بطاقة بنكية CIB',
      paymentD17: '📮 بريد تونس D17',
      paymentFlouci: '⚡ Flouci / Konnect',
      paymentTransfer: '🏦 تحويل بنكي فوري',
      supportGuarantee: 'دعم ومرافقة تونسية 100%',
      transparencyTitle: 'إشعار الشفافية والمسؤولية القانونية:',
      officialCurrency: 'العملة الرسمية:',
      backToTop: 'للأعلى',
      trackOrder: 'تتبع حالة طلبك',
    },
  },
  fr: {
    common: {
      brandName: 'Tooly.tn',
      tagline: 'Marketplace d’outils et abonnements digitaux en Tunisie',
      searchPlaceholder: 'Rechercher un outil (ex: Claude, Canva, ChatGPT)...',
      viewCatalog: 'Explorer le catalogue',
      howItWorks: 'Comment ça marche ?',
      faqs: 'Questions fréquentes',
      contactSupport: 'Contacter le support',
      currency: 'DT',
      currencyFull: 'Dinar Tunisien (TND)',
      demoBadge: 'Données de démonstration',
      demoNotice: 'Note : Ces offres sont présentées à titre illustratif pour valider la maquette de la phase initiale.',
      disclaimer: 'Tooly.tn est une plateforme indépendante. Les marques citées appartiennent à leurs propriétaires respectifs.',
      allCategories: 'Toutes les catégories',
      viewDetails: 'Détails du forfait',
      requestPlan: 'Commander ce forfait',
      close: 'Fermer',
      back: 'Retour',
      loading: 'Chargement en cours...',
      noResults: 'Aucun outil ne correspond à vos filtres de recherche.',
      offlinePaymentNotice: 'Le paiement s’effectue en dehors de la plateforme par virement bancaire ou accord direct.',
      totalPrice: 'Prix total :',
      orderStepsTitle: 'Étapes pour finaliser votre commande :',
      orderCodeLabel: 'Code référence :',
      deliveryMethodLabel: 'Mode d’activation :',
      supportPaymentStep: 'Contactez notre support pour confirmer le moyen de paiement en dinars tunisiens (virement ou D17).',
    },
    nav: {
      catalog: 'Outils & Forfaits',
      categories: 'Catégories',
      howItWorks: 'Fonctionnement',
      trust: 'Confiance & Garantie',
      faq: 'FAQ',
      contact: 'Aide',
      account: 'Connexion',
    },
    hero: {
      badge: 'La marketplace dédiée aux créateurs et pros en Tunisie',
      titlePart1: 'Accédez aux meilleurs outils d’IA & de design,',
      titleHighlight: 'en Dinars Tunisiens et avec support local.',
      titlePart2: '',
      description: 'Découvrez des abonnements numériques professionnels avec des durées garanties, des conditions transparentes et une tarification en TND adaptée.',
      primaryCta: 'Découvrir les forfaits',
      secondaryCta: 'Voir les étapes de livraison',
      feature1: 'Prix clairs en Dinars Tunisiens (TND)',
      feature2: 'Livraison accompagnée par notre support',
      feature3: 'Durées et conditions d’usage garanties',
    },
    velocityGuarantee: {
      line1: 'Ne fonctionne pas ? On le remplace immédiatement ✦ On le répare ou on vous envoie un nouveau compte pour la même formule',
      line2: 'Ou remboursement garanti ✦ Si nous ne pouvons pas réparer, remboursement de la période restante ou 100% intégral',
    },
    heroScene: {
      statusBadge: 'Abonnements vérifiés en Dinars (TND)',
      currency: 'TND',
      viewOffer: 'Voir l’offre',
      ariaLabel: 'Offres d’abonnements digitaux interactives',
      offers: {
        'claude-pro': {
          name: 'Claude 3.5 Pro',
          provider: 'Anthropic',
          badge: 'Sonnet 3.5',
          highlight: 'Raisonnement & Artifacts interactifs',
          guarantee: 'Activation directe',
          period: 'mois',
        },
        'chatgpt-plus': {
          name: 'ChatGPT Plus',
          provider: 'OpenAI',
          badge: 'GPT-4o & o1',
          highlight: 'Génération DALL·E 3 & navigation web',
          guarantee: 'Garantie 30j',
          period: 'mois',
        },
        'canva-pro': {
          name: 'Canva Pro Team',
          provider: 'Canva',
          badge: '100M+ éléments',
          highlight: 'Détourage magique & 1 To cloud',
          guarantee: 'Invitation officielle',
          period: 'an',
        },
        'capcut-pro': {
          name: 'CapCut Pro',
          provider: 'ByteDance',
          badge: '4K 60fps',
          highlight: 'Sous-titres IA & effets exclusifs',
          guarantee: 'Sans filigrane',
          period: 'an',
        },
        'cursor-pro': {
          name: 'Cursor Pro',
          provider: 'Anysphere',
          badge: 'Fast Sonnet',
          highlight: 'Indexation intégrale du code source',
          guarantee: '500 requêtes fast',
          period: 'mois',
        },
        'gemini-advanced': {
          name: 'Gemini Advanced',
          provider: 'Google AI',
          badge: '1M Contexte',
          highlight: 'Contexte 1M tokens & Workspace',
          guarantee: 'Licence certifiée',
          period: 'mois',
        },
        'midjourney-std': {
          name: 'Midjourney v6',
          provider: 'Midjourney',
          badge: 'Photoreal',
          highlight: 'Génération ultra-HD & mode Relax',
          guarantee: 'Accès direct',
          period: 'mois',
        },
        'perplexity-pro': {
          name: 'Perplexity Pro',
          provider: 'Perplexity AI',
          badge: 'Pro Search',
          highlight: 'Recherche avec sources fiables',
          guarantee: '300+ requêtes/j',
          period: 'mois',
        },
        'figma-pro': {
          name: 'Figma Professional',
          provider: 'Figma',
          badge: 'Dev Mode',
          highlight: 'Espaces collaboratifs & Dev Mode',
          guarantee: 'Invitation officielle',
          period: 'mois',
        },
        'elevenlabs-creator': {
          name: 'ElevenLabs',
          provider: 'ElevenLabs',
          badge: 'Voice Clone',
          highlight: 'Synthèse vocale & doublage IA',
          guarantee: '100k car./mois',
          period: 'mois',
        },
        'github-copilot': {
          name: 'GitHub Copilot',
          provider: 'GitHub',
          badge: 'AI Pair',
          highlight: 'Complétion intelligente VS Code',
          guarantee: 'Compte validé',
          period: 'mois',
        },
        'notion-ai': {
          name: 'Notion AI',
          provider: 'Notion',
          badge: 'Q&A Hub',
          highlight: 'Synthèse & gestion de projets',
          guarantee: 'Espace connecté',
          period: 'mois',
        },
        'grok-2': {
          name: 'Grok 2 / X Premium',
          provider: 'xAI',
          badge: 'Flux Art',
          highlight: 'Génération visuelle & analyses live',
          guarantee: 'Compte actif',
          period: 'mois',
        },
        'runway-gen3': {
          name: 'Runway Gen-3',
          provider: 'Runway AI',
          badge: 'AI Cinema',
          highlight: 'Rendu vidéo cinématique IA',
          guarantee: 'Crédits mensuels',
          period: 'mois',
        },
        'claude-team': {
          name: 'Claude Team Hub',
          provider: 'Anthropic',
          badge: 'Team 5x',
          highlight: 'Espaces partagés & priorité max',
          guarantee: 'Support Tooly',
          period: 'mois',
        },
      },
    },
    categories: {
      badge: 'Catégories Vérifiées',
      title: 'Des outils pour chaque métier',
      subtitle: 'Sélectionnez votre domaine pour booster votre productivité au quotidien et réussir vos projets.',
      exploreCta: 'Parcourir tous les forfaits',
      feature1: 'Licences individuelles et forfaits d’équipe',
      feature2: 'Livraison accompagnée par notre support local',
      feature3: 'Tarifs en Dinars Tunisiens sans frais de change',
      viewTools: 'Voir les outils',
      ai: { name: 'Intelligence Artificielle', desc: 'Assistants de code, génération de texte et modèles avancés', badge: 'AI & LLMs' },
      design: { name: 'Design & Graphisme', desc: 'Outils créatifs vectoriels et bibliothèques de modèles', badge: 'UI/UX & Graphics' },
      video: { name: 'Montage Vidéo', desc: 'Éditeurs vidéo en ligne et effets audiovisuels', badge: '4K & Motion' },
      productivity: { name: 'Productivité & Organisation', desc: 'Gestion de projets et espaces collaboratifs', badge: 'Workspace & Docs' },
      developer: { name: 'Outils Développeurs', desc: 'Environnements cloud et complétion de code', badge: 'IDE & Code' },
    },
    curated: {
      title: 'Offres & forfaits sélectionnés',
      subtitle: 'Des plans vérifiés avec une durée explicite et un prix sans frais cachés.',
      perMonth: '/ mois',
      perQuarter: '/ trimestre',
      perYear: '/ an',
      availability: 'Disponibilité',
      inStock: 'Disponible à la commande',
      deliveryTime: 'Livraison en 1 à 4 heures',
      offerTypeLabel: "Type d'offre & Formule",
      featuresLabel: 'Fonctionnalités & Avantages clés',
      orderNow: 'Commander maintenant',
      viewDetails: 'Voir les détails',
      deliveryBadge: 'Livraison rapide & vérifiée',
      guaranteeBadge: 'Garantie 100% Tooly.tn',
      passHolder: 'Titulaire du pass',
      prevCard: 'Offre précédente',
      nextCard: 'Offre suivante',
      interactiveHint: "Déplacez le curseur pour explorer l'effet 3D • Faites défiler les cartes",
    },
    howItWorksSection: {
      badge: 'Simple & Sécurisé',
      title: 'Un processus simple en 3 étapes',
      subtitle: 'Sans besoin de carte internationale complexe.',
      step1Title: '1. Choisissez votre formule',
      step1Desc: 'Consultez les détails, la durée exacte et le tarif fixé en TND.',
      step2Title: '2. Confirmation hors plateforme',
      step2Desc: 'Confirmez votre demande et effectuez le règlement local (virement ou D17).',
      step3Title: '3. Réception des accès',
      step3Desc: 'Recevez votre invitation ou vos accès avec les instructions d’utilisation détaillées.',
    },
    trustSection: {
      badge: 'Nos principes fondamentaux',
      title: 'Pourquoi faire confiance à Tooly.tn ?',
      subtitle: 'Transparence totale, conditions honnêtes et accompagnement personnalisé.',
      pillar1Title: 'Tarifs transparents en TND',
      pillar1Desc: 'Pas de frais de change imprévus. Vous payez exactement le montant affiché.',
      pillar2Title: 'Support local dédié',
      pillar2Desc: 'Une équipe en Tunisie disponible pour vous guider et répondre à vos besoins.',
      pillar3Title: 'Conditions claires',
      pillar3Desc: 'Chaque plan précise s’il s’agit d’une invitation d’équipe ou d’un compte dédié.',
    },
    faqSection: {
      title: 'Questions fréquemment posées',
      subtitle: 'Toutes les réponses pour commander en toute tranquillité.',
      items: [
        {
          q: 'Comment s’effectue le paiement hors plateforme ?',
          a: 'Après confirmation de votre commande, vous recevez les coordonnées de notre compte bancaire ou compte local. Une fois l’ordre transmis, votre abonnement est activé immédiatement.',
        },
        {
          q: 'Quelle est la durée de validité des abonnements ?',
          a: 'Chaque forfait stipule une durée fixe (1 mois, 3 mois, 1 an). La continuité du service est garantie sur toute cette période.',
        },
        {
          q: 'Comment s’active mon outil ?',
          a: 'Selon l’outil, il peut s’agir d’une invitation envoyée à votre email professionnel ou d’un code de licence.',
        },
        {
          q: 'Puis-je obtenir une facture professionnelle ?',
          a: 'Oui, une facture ou note récapitulative peut être émise pour vos dépenses d’entreprise ou de freelance.',
        },
      ],
    },
    catalogPage: {
      title: 'Catalogue des abonnements',
      subtitle: 'Parcourez l’ensemble des offres et comparez les formules disponibles.',
      search: 'Rechercher par nom...',
      filterCategory: 'Par catégorie',
      filterDuration: 'Durée du forfait',
      allDurations: 'Toutes les durées',
      foundCount: 'plans disponibles',
      quickFilter: 'Filtre rapide :',
      resetFilters: 'Réinitialiser les filtres',
      showing: 'Affichage de',
      emptySearchDesc: 'Essayez d’autres mots-clés ou sélectionnez une autre catégorie pour explorer les outils disponibles.',
      oneMonth: '1 mois',
      threeMonths: '3 mois',
      oneYear: '1 an',
    },
    shapeHeroCta: {
      tagline: 'Marketplace d’abonnements digitaux',
      physicsHint: '💡 Déplacez ou lancez les badges d’outils pour interagir avec la physique en temps réel',
    },
    productDetail: {
      overview: 'Aperçu du forfait',
      features: 'Fonctionnalités incluses',
      restrictions: 'Conditions et restrictions',
      deliveryMethod: 'Méthode d’activation',
      termsTitle: 'Garanties & Support',
      offlineInstructionTitle: 'Instructions de commande locale',
      offlineInstructionBody: 'Pour commander cette offre, contactez notre équipe en mentionnant la référence du plan. Nos coordonnées de paiement vous seront communiquées.',
      contactToOrder: 'Commander ce forfait',
    },
    footer: {
      about: 'Tooly.tn est le facilitateur tunisien pour l’accès aux technologies et abonnements numériques professionnels.',
      quickLinks: 'Liens utiles',
      legal: 'Mentions légales',
      legalTerms: 'Conditions Générales d’Utilisation',
      privacyPolicy: 'Politique de Confidentialité',
      refundPolicy: 'Politique de Remboursement',
      resaleDisclaimer: 'Avis : Tooly.tn est une entité indépendante sans affiliation officielle non déclarée.',
      rightsReserved: 'Tous droits réservés © 2026 Tooly.tn.',
      popularToolsTitle: 'Abonnements populaires',
      popularBadge: 'Populaire',
      paymentMethodsTitle: 'Paiements locaux acceptés en Tunisie :',
      paymentCib: '💳 Carte bancaire CIB',
      paymentD17: '📮 La Poste D17',
      paymentFlouci: '⚡ Flouci / Konnect',
      paymentTransfer: '🏦 Virement bancaire instantané',
      supportGuarantee: 'Accompagnement 100% tunisien',
      transparencyTitle: 'Transparence et mentions légales :',
      officialCurrency: 'Devise officielle :',
      backToTop: 'Haut de page',
      trackOrder: 'Suivi de votre commande',
    },
  },
  en: {
    common: {
      brandName: 'Tooly.tn',
      tagline: 'Digital Subscription Marketplace in Tunisia',
      searchPlaceholder: 'Search for a tool or subscription (e.g. Claude, Canva, ChatGPT)...',
      viewCatalog: 'Browse Catalog',
      howItWorks: 'How it works',
      faqs: 'FAQs',
      contactSupport: 'Contact Support',
      currency: 'TND',
      currencyFull: 'Tunisian Dinar (TND)',
      demoBadge: 'Demo Catalog Data',
      demoNotice: 'Notice: These listings serve as sample demonstration data for Phase 1 verification.',
      disclaimer: 'Tooly.tn is an independent marketplace. Trademarks belong to their respective owners.',
      allCategories: 'All Categories',
      viewDetails: 'View Plan Details',
      requestPlan: 'Order Plan',
      close: 'Close',
      back: 'Back',
      loading: 'Loading...',
      noResults: 'No tools match your current filter selections.',
      offlinePaymentNotice: 'Payment is arranged directly outside the platform via bank transfer or local arrangement.',
      totalPrice: 'Total price:',
      orderStepsTitle: 'Steps to complete your order:',
      orderCodeLabel: 'Order code:',
      deliveryMethodLabel: 'Delivery method:',
      supportPaymentStep: 'Contact our support team to confirm local payment in Tunisian Dinars (Bank transfer or D17).',
    },
    nav: {
      catalog: 'Tools & Plans',
      categories: 'Categories',
      howItWorks: 'How It Works',
      trust: 'Trust & Guarantee',
      faq: 'FAQ',
      contact: 'Support',
      account: 'Sign In',
    },
    hero: {
      badge: 'The Digital Subscription Marketplace for Tunisia',
      titlePart1: 'Empower your workflow with top AI & design tools,',
      titleHighlight: 'priced in Tunisian Dinars (TND)',
      titlePart2: 'with local support.',
      description: 'Discover verified digital subscription plans with transparent durations, explicit conditions, and zero foreign currency barriers.',
      primaryCta: 'Explore Available Plans',
      secondaryCta: 'See How Delivery Works',
      feature1: 'Transparent pricing in Tunisian Dinars (TND)',
      feature2: 'Direct delivery and local assistance',
      feature3: 'Documented eligibility and duration guarantee',
    },
    velocityGuarantee: {
      line1: "Doesn't work? We replace it immediately ✦ We fix it or send you a new one for the exact same plan",
      line2: "Or your money back ✦ If we can't fix it, we refund the unused portion, or full amount if it never worked",
    },
    heroScene: {
      statusBadge: 'Verified Subscriptions in TND',
      currency: 'TND',
      viewOffer: 'View Plan',
      ariaLabel: 'Interactive verified digital subscription offers',
      offers: {
        'claude-pro': {
          name: 'Claude 3.5 Pro',
          provider: 'Anthropic',
          badge: 'Sonnet 3.5',
          highlight: 'Deep reasoning & Artifacts code projects',
          guarantee: 'Instant setup',
          period: 'mo',
        },
        'chatgpt-plus': {
          name: 'ChatGPT Plus',
          provider: 'OpenAI',
          badge: 'GPT-4o & o1',
          highlight: 'DALL·E 3 generation & data analysis',
          guarantee: '30-day warranty',
          period: 'mo',
        },
        'canva-pro': {
          name: 'Canva Pro Team',
          provider: 'Canva',
          badge: '100M+ Assets',
          highlight: 'Magic background cutout & 1TB cloud',
          guarantee: 'Official workspace',
          period: 'year',
        },
        'capcut-pro': {
          name: 'CapCut Pro',
          provider: 'ByteDance',
          badge: '4K 60fps',
          highlight: 'AI auto-captions & premium transitions',
          guarantee: 'No watermark',
          period: 'year',
        },
        'cursor-pro': {
          name: 'Cursor Pro',
          provider: 'Anysphere',
          badge: 'Fast Sonnet',
          highlight: 'Full codebase indexing & multi-file edits',
          guarantee: '500 fast requests',
          period: 'mo',
        },
        'gemini-advanced': {
          name: 'Gemini Advanced',
          provider: 'Google AI',
          badge: '1M Context',
          highlight: '1M token ultra-long context & Drive sync',
          guarantee: 'Verified license',
          period: 'mo',
        },
        'midjourney-std': {
          name: 'Midjourney v6',
          provider: 'Midjourney',
          badge: 'Photoreal',
          highlight: 'Photorealistic creative art & Relax hours',
          guarantee: 'Direct access',
          period: 'mo',
        },
        'perplexity-pro': {
          name: 'Perplexity Pro',
          provider: 'Perplexity AI',
          badge: 'Pro Search',
          highlight: 'Multi-engine research with cited web sources',
          guarantee: '300+ daily queries',
          period: 'mo',
        },
        'figma-pro': {
          name: 'Figma Professional',
          provider: 'Figma',
          badge: 'Dev Mode',
          highlight: 'Team design libraries & Dev Mode inspect',
          guarantee: 'Official workspace',
          period: 'mo',
        },
        'elevenlabs-creator': {
          name: 'ElevenLabs',
          provider: 'ElevenLabs',
          badge: 'Voice Clone',
          highlight: 'Hyper-realistic voice synthesis & dubbing',
          guarantee: '100k chars/mo',
          period: 'mo',
        },
        'github-copilot': {
          name: 'GitHub Copilot',
          provider: 'GitHub',
          badge: 'AI Pair',
          highlight: 'Real-time pair programming completions',
          guarantee: 'Validated account',
          period: 'mo',
        },
        'notion-ai': {
          name: 'Notion AI',
          provider: 'Notion',
          badge: 'Q&A Hub',
          highlight: 'Workspace Q&A & project summaries',
          guarantee: 'Workspace synced',
          period: 'mo',
        },
        'grok-2': {
          name: 'Grok 2 / X Premium',
          provider: 'xAI',
          badge: 'Flux Art',
          highlight: 'Unfiltered analysis & Flux image generation',
          guarantee: 'Active account',
          period: 'mo',
        },
        'runway-gen3': {
          name: 'Runway Gen-3',
          provider: 'Runway AI',
          badge: 'AI Cinema',
          highlight: 'Next-gen text-to-video cinematic rendering',
          guarantee: 'Monthly credits',
          period: 'mo',
        },
        'claude-team': {
          name: 'Claude Team Hub',
          provider: 'Anthropic',
          badge: 'Team 5x',
          highlight: 'Shared workspaces & highest rate limits',
          guarantee: 'Tooly Support',
          period: 'mo',
        },
      },
    },
    categories: {
      badge: 'Verified Categories',
      title: 'Tools Tailored to Every Profession',
      subtitle: 'Pick your discipline and access the world’s leading digital tools with guaranteed terms and local support.',
      exploreCta: 'Browse All Categories & Plans',
      feature1: 'Individual licenses and team workspaces',
      feature2: 'Prompt delivery with dedicated local assistance',
      feature3: 'Clear TND pricing with zero currency conversion fees',
      viewTools: 'Explore Tools',
      ai: { name: 'Artificial Intelligence', desc: 'Code assistants, advanced LLMs, and intelligent workspaces', badge: 'AI & LLMs' },
      design: { name: 'Design & Graphics', desc: 'Vector suites, template libraries, and creative suites', badge: 'UI/UX & Graphics' },
      video: { name: 'Video Editing', desc: 'Cloud video editors, templates, and motion tools', badge: '4K & Motion' },
      productivity: { name: 'Productivity & Collaboration', desc: 'Team task managers and connected workspaces', badge: 'Workspace & Docs' },
      developer: { name: 'Developer Tools', desc: 'Cloud environments, IDEs, and code utilities', badge: 'IDE & Code' },
    },
    curated: {
      title: 'Featured Subscription Plans',
      subtitle: 'Curated plans with clear terms, honest pricing, and dedicated local fulfillment.',
      perMonth: '/ mo',
      perQuarter: '/ quarter',
      perYear: '/ yr',
      availability: 'Status',
      inStock: 'Available to order',
      deliveryTime: 'Delivery within 1–4 hours',
      offerTypeLabel: 'Offer Type & Overview',
      featuresLabel: 'Included Features & Perks',
      orderNow: 'Order Subscription Now',
      viewDetails: 'View Plan Details',
      deliveryBadge: 'Fast & Verified Delivery',
      guaranteeBadge: '100% Continuity Guarantee',
      passHolder: 'Pass Holder',
      prevCard: 'Previous Offer',
      nextCard: 'Next Offer',
      interactiveHint: 'Move cursor to explore 3D tilt • Scroll to browse passes',
    },
    howItWorksSection: {
      badge: 'Simple & Secure',
      title: 'Clear 3-Step Ordering Process',
      subtitle: 'Simple, direct, and free from international card issues.',
      step1Title: '1. Select Your Plan',
      step1Desc: 'Review the duration, features, restrictions, and guaranteed price in TND.',
      step2Title: '2. Offline Order Confirmation',
      step2Desc: 'Confirm your request and arrange payment locally via bank transfer or direct wire.',
      step3Title: '3. Receive Access & Instructions',
      step3Desc: 'Get your activation link, workspace invitation, or instructions with dedicated support.',
    },
    trustSection: {
      badge: 'Our Core Principles',
      title: 'Why Professionals Choose Tooly.tn',
      subtitle: 'We prioritize customer trust, upfront clarity, and responsive local support.',
      pillar1Title: 'Transparent TND Pricing',
      pillar1Desc: 'No surprise bank exchange fees or fluctuating conversion rates.',
      pillar2Title: 'Direct Local Support',
      pillar2Desc: 'A responsive team based in Tunisia ready to assist you anytime.',
      pillar3Title: 'Explicit Plan Terms',
      pillar3Desc: 'We disclose whether a plan is a team invite or dedicated seat before you order.',
    },
    faqSection: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about purchasing with Tooly.tn.',
      items: [
        {
          q: 'How does payment work outside the platform?',
          a: 'Once you select a plan, you receive reference details for a local Tunisian bank transfer or direct arrangement. Once submitted, our team activates your access.',
        },
        {
          q: 'Are the subscriptions guaranteed for the full duration?',
          a: 'Yes, every subscription purchased through Tooly comes with a full service guarantee for the specified period.',
        },
        {
          q: 'How is activation delivered?',
          a: 'Depending on the tool, activation is provided via an official email invitation to your workspace or direct license instructions.',
        },
        {
          q: 'Can invoices be provided for registered businesses?',
          a: 'Yes, invoices and receipts are issued upon request for freelancers and small businesses.',
        },
      ],
    },
    catalogPage: {
      title: 'Subscription Catalog',
      subtitle: 'Explore all available tools and compare plans and durations.',
      search: 'Search by tool name...',
      filterCategory: 'By Category',
      filterDuration: 'Plan Duration',
      allDurations: 'All Durations',
      foundCount: 'plans available',
      quickFilter: 'Quick filter:',
      resetFilters: 'Reset filters',
      showing: 'Showing',
      emptySearchDesc: 'Try searching with different keywords or pick another category to explore available tools.',
      oneMonth: '1 month',
      threeMonths: '3 months',
      oneYear: '1 year',
    },
    shapeHeroCta: {
      tagline: 'Digital Subscriptions Marketplace',
      physicsHint: '💡 Drag or toss digital tool badges for direct interactive physics',
    },
    productDetail: {
      overview: 'Plan Overview',
      features: 'Included Features',
      restrictions: 'Important Terms & Limitations',
      deliveryMethod: 'Fulfillment & Delivery Method',
      termsTitle: 'Guarantee & Support',
      offlineInstructionTitle: 'How to Order This Plan Locally',
      offlineInstructionBody: 'To order this subscription, contact our support team quoting the plan reference code. Local payment instructions will be provided.',
      contactToOrder: 'Request This Plan',
    },
    footer: {
      about: 'Tooly.tn is the Tunisian marketplace making global digital tools and subscriptions accessible with local support and TND pricing.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      legalTerms: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      refundPolicy: 'Refund & Cancellation Policy',
      resaleDisclaimer: 'Independent Notice: Tooly.tn is an independent provider and has no undeclared affiliation with third-party tool providers.',
      rightsReserved: 'All rights reserved © 2026 Tooly.tn.',
      popularToolsTitle: 'Popular Subscriptions',
      popularBadge: 'Most Requested',
      paymentMethodsTitle: 'Accepted Local Payments in Tunisia:',
      paymentCib: '💳 Bank Card CIB',
      paymentD17: '📮 Tunisia Post D17',
      paymentFlouci: '⚡ Flouci / Konnect',
      paymentTransfer: '🏦 Instant Bank Transfer',
      supportGuarantee: '100% Local Tunisian Support',
      transparencyTitle: 'Transparency & Legal Notice:',
      officialCurrency: 'Official Currency:',
      backToTop: 'Back to top',
      trackOrder: 'Track your order',
    },
  },
};
