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
  categories: {
    title: string;
    subtitle: string;
    ai: { name: string; desc: string };
    design: { name: string; desc: string };
    video: { name: string; desc: string };
    productivity: { name: string; desc: string };
    developer: { name: string; desc: string };
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
  };
  howItWorksSection: {
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
    },
    nav: {
      catalog: 'الأدوات والخطط',
      categories: 'التصنيفات',
      howItWorks: 'كيف نعمل',
      trust: 'الضمان والشفافية',
      faq: 'الأسئلة المتكررة',
      contact: 'مساعدة',
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
    categories: {
      title: 'أدوات تناسب كل مجالات العمل',
      subtitle: 'اختر مجالك وتعرف على أفضل البرمجيات المعتمدة لرفع إنتاجيتك.',
      ai: { name: 'الذكاء الاصطناعي', desc: 'مساعدات برمجية، محادثة متقدمة وتوليد محتوى ذكي' },
      design: { name: 'التصميم والجرافيك', desc: 'قوالب احترافية وأدوات الإبداع البصري' },
      video: { name: 'المونتاج وصناعة الفيديو', desc: 'محررات فيديو سحابية ومؤثرات حديثة' },
      productivity: { name: 'الإنتاجية والعمل الجماعي', desc: 'إدارة المهام ومساحات التعاون المؤسسي' },
      developer: { name: 'أدوات المطورين', desc: 'بيئات سحابية ومساعدات كتابة الكود' },
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
    },
    howItWorksSection: {
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
    categories: {
      title: 'Des outils pour chaque métier',
      subtitle: 'Sélectionnez votre domaine pour booster votre productivité au quotidien.',
      ai: { name: 'Intelligence Artificielle', desc: 'Assistants de code, génération de texte et modèles avancés' },
      design: { name: 'Design & Graphisme', desc: 'Outils créatifs vectoriels et bibliothèques de modèles' },
      video: { name: 'Montage Vidéo', desc: 'Éditeurs vidéo en ligne et effets audiovisuels' },
      productivity: { name: 'Productivité & Organisation', desc: 'Gestion de projets et espaces collaboratifs' },
      developer: { name: 'Outils Développeurs', desc: 'Environnements cloud et complétion de code' },
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
    },
    howItWorksSection: {
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
    categories: {
      title: 'Tools Tailored to Every Profession',
      subtitle: 'Pick your discipline and access the world’s leading digital tools.',
      ai: { name: 'Artificial Intelligence', desc: 'Code assistants, advanced LLMs, and intelligent workspaces' },
      design: { name: 'Design & Graphics', desc: 'Vector suites, template libraries, and creative suites' },
      video: { name: 'Video Editing', desc: 'Cloud video editors, templates, and motion tools' },
      productivity: { name: 'Productivity & Collaboration', desc: 'Team task managers and connected workspaces' },
      developer: { name: 'Developer Tools', desc: 'Cloud environments, IDEs, and code utilities' },
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
    },
    howItWorksSection: {
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
    },
  },
};
