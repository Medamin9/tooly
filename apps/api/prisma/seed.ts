import { PrismaClient, DeliveryMethod, Role, CatalogOptionKind } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Tooly.tn database with complete multilingual catalog data...');

  // 1. Clean existing catalog data safely (preserve users and admin credentials)
  await prisma.localizedContent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.fulfillment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.planVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.catalogOption.deleteMany();

  // 2. Seed Catalog Options (Durations and Delivery Methods for Admin and Frontend)
  const durationOptions = [
    { code: '1_day', labelAr: 'يوم واحد (24 ساعة)', labelFr: '1 Jour (24h)', labelEn: '1 Day (24h)', sortOrder: 1 },
    { code: '3_days', labelAr: '3 أيام', labelFr: '3 Jours', labelEn: '3 Days', sortOrder: 2 },
    { code: '1_month', labelAr: 'شهر واحد (30 يوماً)', labelFr: '1 Mois (30 jours)', labelEn: '1 Month (30 days)', sortOrder: 3 },
    { code: '3_months', labelAr: '3 أشهر (فصلي)', labelFr: '3 Mois (Trimestriel)', labelEn: '3 Months (Quarterly)', sortOrder: 4 },
    { code: '6_months', labelAr: '6 أشهر (نصف سنوي)', labelFr: '6 Mois (Semestriel)', labelEn: '6 Months (Semi-annual)', sortOrder: 5 },
    { code: '1_year', labelAr: 'سنة واحدة (12 شهراً)', labelFr: '1 An (12 mois)', labelEn: '1 Year (12 months)', sortOrder: 6 },
    { code: '2_years', labelAr: 'سنتان (24 شهراً)', labelFr: '2 Ans (24 mois)', labelEn: '2 Years (24 months)', sortOrder: 7 },
    { code: '3_years', labelAr: '3 سنوات (36 شهراً)', labelFr: '3 Ans (36 mois)', labelEn: '3 Years (36 months)', sortOrder: 8 },
  ];

  for (const opt of durationOptions) {
    await prisma.catalogOption.create({
      data: {
        kind: CatalogOptionKind.DURATION,
        code: opt.code,
        labelAr: opt.labelAr,
        labelFr: opt.labelFr,
        labelEn: opt.labelEn,
        sortOrder: opt.sortOrder,
      },
    });
  }

  const deliveryOptions = [
    { code: 'TEAM_INVITE', labelAr: 'دعوة فريق / رابط تفعيل رسمي', labelFr: 'Invitation d’équipe / Lien d’activation', labelEn: 'Team Invite / Activation Link', sortOrder: 1 },
    { code: 'CREDENTIALS_PROVISION', labelAr: 'بيانات حساب خاص ومحمي (Email + Password + 2FA)', labelFr: 'Identifiants privés (Email + Mot de passe + 2FA)', labelEn: 'Private Credentials (Email + Password + 2FA)', sortOrder: 2 },
    { code: 'OFFLINE_TRANSFER', labelAr: 'مفتاح API / تسليم مباشر ومتابعة', labelFr: 'Clé API / Transfert et suivi direct', labelEn: 'API Key / Direct Transfer & Follow-up', sortOrder: 3 },
    { code: 'VOUCHER_CODE', labelAr: 'كوبون تفعيل / قسيمة رسمية', labelFr: 'Code d’activation / Coupon officiel', labelEn: 'Activation Code / Official Voucher', sortOrder: 4 },
    { code: 'MANUAL_SUPPORT', labelAr: 'تفعيل ومرافقة يدوية عبر الدعم', labelFr: 'Activation manuelle via support', labelEn: 'Manual Support Activation', sortOrder: 5 },
  ];

  for (const opt of deliveryOptions) {
    await prisma.catalogOption.create({
      data: {
        kind: CatalogOptionKind.DELIVERY_METHOD,
        code: opt.code,
        labelAr: opt.labelAr,
        labelFr: opt.labelFr,
        labelEn: opt.labelEn,
        sortOrder: opt.sortOrder,
      },
    });
  }

  // 3. Seed Categories
  const categoriesData = [
    { slug: 'ai', sortOrder: 1, imageUrl: '/images/categories/ia.jpg' },
    { slug: 'design', sortOrder: 2, imageUrl: '/images/categories/design.jpg' },
    { slug: 'video', sortOrder: 3, imageUrl: '/images/categories/video.jpg' },
    { slug: 'developer', sortOrder: 4, imageUrl: '/images/categories/devtools.jpg' },
    { slug: 'productivity', sortOrder: 5, imageUrl: '/images/categories/productivity.jpg' },
    { slug: 'entertainment', sortOrder: 6, imageUrl: '/images/categories/productivity.jpg' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  // 4. Seed Category Localized Content (3 Languages: AR, FR, EN)
  const categoryTranslations: Record<string, { ar: string; fr: string; en: string }> = {
    ai: {
      ar: 'الذكاء الاصطناعي',
      fr: 'Intelligence Artificielle',
      en: 'Artificial Intelligence',
    },
    design: {
      ar: 'التصميم والجرافيك',
      fr: 'Design & Graphisme',
      en: 'Design & Graphics',
    },
    video: {
      ar: 'المونتاج وصناعة الفيديو',
      fr: 'Montage Vidéo',
      en: 'Video Editing',
    },
    developer: {
      ar: 'أدوات المطورين والبرمجة',
      fr: 'Outils Développeurs & Code',
      en: 'Developer Tools & Code',
    },
    productivity: {
      ar: 'الإنتاجية والعمل الجماعي',
      fr: 'Productivité & Organisation',
      en: 'Productivity & Collaboration',
    },
    entertainment: {
      ar: 'الموسيقى والترفيه',
      fr: 'Musique & Divertissement',
      en: 'Music & Entertainment',
    },
  };

  for (const [slug, trans] of Object.entries(categoryTranslations)) {
    const catId = categoryMap.get(slug);
    if (!catId) continue;
    for (const locale of ['ar', 'fr', 'en'] as const) {
      await prisma.localizedContent.create({
        data: {
          entityType: 'category',
          entityId: catId,
          locale,
          name: trans[locale],
        },
      });
    }
  }

  // 5. Products & Variants Catalog Data (with 3-Language metadata)
  const productsSeed = [
    // 1) Gemini Plus (Family)
    {
      slug: 'gemini-plus-family',
      categorySlug: 'ai',
      provider: 'Google',
      deliveryMethod: 'TEAM_INVITE',
      isPublished: true,
      isDemo: false,
      sortOrder: 1,
      translations: {
        ar: {
          name: 'Gemini Plus (Family)',
          tagline: 'اشتراك Google One مع Gemini بموديلات الذكاء الاصطناعي المتطورة',
          description:
            'استعمال نماذج Gemini المتقدمة من Google مع ميزات توليد الصور والفيديوهات، تلخيص المستندات، مساعدة برمجية متطورة، ومساحة تخزين سحابية إضافية عبر Google One. تسليم فوري عبر رابط تفعيل مضمون الصلاحية لمدة 12 ساعة.',
        },
        fr: {
          name: 'Gemini Plus (Family)',
          tagline: 'Abonnement Google One avec modèles IA avancés Gemini',
          description:
            'Accédez aux modèles d’intelligence artificielle de pointe de Google : génération et retouche d’images et vidéos IA, analyse de documents et PDF, assistance au code et stockage cloud Google One supplémentaire. Activation immédiate via lien d’invitation sécurisé garanti 12 heures.',
        },
        en: {
          name: 'Gemini Plus (Family)',
          tagline: 'Google One subscription powered by advanced Gemini AI models',
          description:
            'Leverage Google’s cutting-edge Gemini AI models with AI image and video creation, deep document summarization, coding assistance, and extra Google One cloud storage. Instant delivery via activation link with a 12-hour validity guarantee.',
        },
      },
      variants: [
        {
          slug: 'gemini-plus-family-6m',
          duration: '6_months',
          price: 30.0,
          features: [
            'استعمال Gemini بموديلات ذكاء اصطناعي متطوّرة',
            '🖼️ إنشاء وتعديل الصور بالذكاء الاصطناعي',
            '🎬 إنشاء فيديوهات بالذكاء الاصطناعي عبر أدوات Google المدعومة',
            '📚 تلخيص وتحليل ملفات PDF والوثائق',
            '✍️ كتابة النصوص والإيميلات والمحتوى بطريقة احترافية',
            '💻 المساعدة في البرمجة وإنشاء المواقع',
            '🔍 البحث والتحليل بقدرات متقدّمة',
            '☁️ مساحة تخزين سحابية إضافية عبر Google One',
            '🔗 طريقة التسليم: عبر رابط تفعيل (Lien d’activation)',
            '🛡️ ضمان صلاحية الرابط لمدة 12 ساعة',
          ],
          restrictions: ['يتطلب حساب Google شخصي متوافق مع مجموعات العائلة'],
        },
        {
          slug: 'gemini-plus-family-12m',
          duration: '1_year',
          price: 40.0,
          features: [
            'استعمال Gemini بموديلات ذكاء اصطناعي متطوّرة لمدة سنة كاملة (12 شهراً)',
            '🖼️ إنشاء وتعديل الصور بالذكاء الاصطناعي',
            '🎬 إنشاء فيديوهات بالذكاء الاصطناعي عبر أدوات Google المدعومة',
            '📚 تلخيص وتحليل ملفات PDF والوثائق',
            '✍️ كتابة النصوص والإيميلات والمحتوى بطريقة احترافية',
            '💻 المساعدة في البرمجة وإنشاء المواقع',
            '🔍 البحث والتحليل بقدرات متقدّمة',
            '☁️ مساحة تخزين سحابية إضافية عبر Google One',
            '🔗 طريقة التسليم: عبر رابط تفعيل (Lien d’activation)',
            '🛡️ ضمان صلاحية الرابط لمدة 12 ساعة',
          ],
          restrictions: ['يتطلب حساب Google شخصي متوافق مع مجموعات العائلة'],
        },
      ],
    },

    // 2) Claude API (Family / Developer)
    {
      slug: 'claude-api',
      categorySlug: 'developer',
      provider: 'Anthropic',
      deliveryMethod: 'OFFLINE_TRANSFER',
      isPublished: true,
      isDemo: false,
      sortOrder: 2,
      translations: {
        ar: {
          name: 'Claude API',
          tagline: 'مفتاح API رسمي لنماذج Anthropic Claude للمطورين وأتمتة المهام',
          description:
            'وصول مباشر للـ API الخاص بنماذج Claude المتطورة (Sonnet و Opus) لربطها بالتطبيقات والمواقع، إنشاء AI Agents، وأتمتة العمليات البرمجية مع لوحة تحكم Dashboard لمتابعة الاستهلاك.',
        },
        fr: {
          name: 'Claude API',
          tagline: 'Clé API officielle Anthropic Claude pour développeurs et automatisation IA',
          description:
            'Accès API direct aux modèles Claude avancés (Sonnet et Opus selon disponibilité) pour intégrer l’IA dans vos applications, automatiser vos workflows, concevoir des agents IA et suivre votre consommation via dashboard.',
        },
        en: {
          name: 'Claude API',
          tagline: 'Official Anthropic Claude API key for developers and AI automation',
          description:
            'Direct API access to advanced Claude models (Sonnet and Opus subject to availability) to power applications, build autonomous AI agents, automate workflows, and track consumption via dashboard.',
        },
      },
      variants: [
        {
          slug: 'claude-api-100usd-1m',
          duration: '1_month',
          price: 70.0,
          features: [
            '✅ رصيد 100$ API رسمي',
            '✅ الوصول إلى أحدث نماذج Claude المتطورة',
            '✅ Claude Sonnet & Opus حسب التوفّر',
            '✅ استعمال API في البرمجة والتطوير',
            '✅ ربط Claude بالتطبيقات والمواقع',
            '✅ إنشاء AI Agents وأتمتة المهام',
            '✅ مناسب للمطورين والـ AI Automation',
            '✅ متابعة استهلاك الرصيد عبر Dashboard',
            '🔑 طريقة التسليم: مفتاح API Key مباشر',
            '🛡️ ضمان كامل لمدة شهر (1 Month Warranty)',
          ],
          restrictions: ['يخضع لسياسات الاستهلاك ومعدل الطلبات المقررة من Anthropic'],
        },
        {
          slug: 'claude-api-100m-tokens-3d',
          duration: '3_days',
          price: 35.0,
          features: [
            '✅ حزمة 100 مليون توكن (100M Tokens)',
            '✅ مدة الصلاحية: 3 أيام كاملة',
            '✅ وصول لنماذج Claude Sonnet و Opus',
            '✅ مناسب للمشاريع المكثفة ومعالجة البيانات الضخمة',
            '🔑 طريقة التسليم: مفتاح API Key',
            '🛡️ ضمان الصلاحية طيلة 3 أيام',
          ],
          restrictions: ['صلاحية الاستخدام محددة بـ 72 ساعة من وقت التسليم'],
        },
        {
          slug: 'claude-api-10m-tokens-1d',
          duration: '1_day',
          price: 10.0,
          features: [
            '✅ حزمة 10 مليون توكن (10M Tokens)',
            '✅ مدة الصلاحية: يوم واحد (24 ساعة)',
            '✅ وصول لنماذج Claude المتطورة',
            '✅ مثالي للتجارب السريعة واختبار الأكواد',
            '🔑 طريقة التسليم: مفتاح API Key',
            '🛡️ ضمان الصلاحية طيلة 24 ساعة',
          ],
          restrictions: ['صلاحية الاستخدام محددة بـ 24 ساعة من وقت التسليم'],
        },
      ],
    },

    // 3) ChatGPT Plus
    {
      slug: 'chatgpt-plus',
      categorySlug: 'ai',
      provider: 'OpenAI',
      deliveryMethod: 'CREDENTIALS_PROVISION',
      isPublished: true,
      isDemo: false,
      sortOrder: 3,
      translations: {
        ar: {
          name: 'ChatGPT Plus',
          tagline: 'المساعد الذكي الأقوى عالمياً مع وصول حصري لأحدث نماذج OpenAI',
          description:
            'وصول متميز للجيل الجديد من نماذج الذكاء الاصطناعي GPT مع توليد الصور بدقة فائقة، تحليل البيانات والملفات، واستخدام Deep Research و Codex للبرمجة والمحادثات الصوتية المتقدمة.',
        },
        fr: {
          name: 'ChatGPT Plus',
          tagline: 'L’assistant IA le plus puissant avec accès exclusif aux derniers modèles OpenAI',
          description:
            'Accédez en priorité aux modèles GPT de nouvelle génération, génération d’images DALL-E, analyse de données Excel/PDF, Deep Research, mode vocal avancé et assistance au code avec Codex.',
        },
        en: {
          name: 'ChatGPT Plus',
          tagline: 'The world’s leading AI assistant with exclusive access to the latest OpenAI models',
          description:
            'Get priority access to next-gen GPT models with high-res image generation, advanced file and data analysis, Deep Research, natural voice mode, and code refactoring.',
        },
      },
      variants: [
        {
          slug: 'chatgpt-plus-1m',
          duration: '1_month',
          price: 50.0,
          features: [
            '🤖 الوصول إلى نماذج ذكاء اصطناعي متقدمة GPT',
            '🧠 تحليل المواضيع المعقدة والإجابة بدقة أكبر',
            '🎨 إنشاء صور بجودة فائقة وتعديل الصور',
            '📄 تحليل ملفات PDF وExcel وWord',
            '📊 تحليل البيانات وإنشاء الرسوم البيانية',
            '💻 استخدام Codex للمساعدة في البرمجة',
            '🔎 البحث العميق Deep Research',
            '🎙️ محادثات صوتية متقدمة (Advanced Voice)',
            '📁 إنشاء المشاريع وتنظيم الملفات والمحادثات',
            '⚡ حدود استخدام أعلى من النسخة المجانية',
            '🔐 نوع الحساب: Email + Password + 2FA',
            '🛡️ ضمان استمرارية كامل طيلة 30 يوماً',
          ],
          restrictions: ['حساب خاص للاستخدام الفردي'],
        },
      ],
    },

    // 4) ChatGPT Go
    {
      slug: 'chatgpt-go',
      categorySlug: 'ai',
      provider: 'OpenAI',
      deliveryMethod: 'CREDENTIALS_PROVISION',
      isPublished: true,
      isDemo: false,
      sortOrder: 4,
      translations: {
        ar: {
          name: 'ChatGPT Go',
          tagline: 'اشتراك اقتصادي موسّع لمدة 3 أشهر مع سعة رسائل وتوليد صور إضافية',
          description:
            'باقة موفرة توفر وصولاً موسّعاً لنماذج GPT مع عدد أكبر من الرسائل، رفع الملفات والتحليلات الحسابية وذاكرة سياق أكبر، مخصصة للمهام اليومية المستمرة.',
        },
        fr: {
          name: 'ChatGPT Go',
          tagline: 'Formule économique 3 mois avec quotas de messages et d’images élargis',
          description:
            'Un forfait étendu sur 3 mois offrant un accès élargi aux modèles GPT, davantage de messages et d’images, l’analyse de fichiers et une mémoire de contexte augmentée pour le travail quotidien.',
        },
        en: {
          name: 'ChatGPT Go',
          tagline: 'Budget-friendly 3-month plan with expanded messaging and image limits',
          description:
            'A 3-month cost-effective plan offering expanded access to GPT models, higher message and image quotas, document analysis, and extended context memory.',
        },
      },
      variants: [
        {
          slug: 'chatgpt-go-3m',
          duration: '3_months',
          price: 40.0,
          features: [
            'وصول موسّع إلى أحدث نماذج GPT',
            '💬 عدد أكبر من الرسائل مقارنة بالنسخة المجانية',
            '🎨 إنشاء صور بالذكاء الاصطناعي بعدد أكبر',
            '📎 رفع وتحليل ملفات PDF وWord وExcel',
            '📊 تحليل البيانات وإنجاز المهام الحسابية',
            '🧠 ذاكرة أكبر لتذكّر سياق محادثاتك',
            '🔎 استعمال أدوات البحث وتحليل المعلومات',
            '📁 تنظيم المحادثات والمشاريع',
            '⚡ حدود استخدام أعلى للمهام اليومية',
            '🔐 تسليم الحساب: Email + Password + 2FA',
            '🛡️ ضمان كامل طيلة فترة الـ 3 أشهر',
          ],
          restrictions: ['حساب خاص مسبق الإعداد والتهيئة'],
        },
      ],
    },

    // 5) Canva Pro
    {
      slug: 'canva-pro',
      categorySlug: 'design',
      provider: 'Canva',
      deliveryMethod: 'TEAM_INVITE',
      isPublished: true,
      isDemo: false,
      sortOrder: 5,
      translations: {
        ar: {
          name: 'Canva Pro',
          tagline: 'المنصة المتكاملة للتصميم الجرافيكي وصناعة المحتوى الرقمي',
          description:
            'الوصول غير المحدود إلى ملايين القوالب والصور والخطوط الاحترافية، إزالة خلفيات الصور والفيديوهات بضغطة واحدة، وأدوات الذكاء الاصطناعي Magic Studio مع التفعيل على حسابك الشخصي.',
        },
        fr: {
          name: 'Canva Pro',
          tagline: 'La suite de design graphique et création de contenu de référence',
          description:
            'Accès illimité à des millions de templates, photos et polices Pro, détourage d’arrière-plan en un clic, studio d’IA Magic Studio et activation directe sur votre compte e-mail personnel.',
        },
        en: {
          name: 'Canva Pro',
          tagline: 'All-in-one graphic design and digital content creation suite',
          description:
            'Unlimited access to millions of premium templates, photos, fonts, one-click background remover, and Magic Studio AI tools applied directly to your existing account.',
        },
      },
      variants: [
        {
          slug: 'canva-pro-1m',
          duration: '1_month',
          price: 5.0,
          features: [
            'ملايين الصور والفيديوهات والعناصر Premium',
            '✨ إزالة خلفية الصور والفيديوهات بضغطة واحدة',
            '🤖 أدوات الذكاء الاصطناعي Magic Studio',
            '📐 تغيير حجم التصاميم تلقائياً Magic Resize',
            '🔤 خطوط وألوان وقوالب حصرية',
            '🎬 تصميم ومونتاج فيديوهات Reels وTikTok',
            '🧰 Brand Kit لإنشاء هوية بصرية احترافية',
            '☁️ مساحة تخزين سحابية أكبر',
            '📱 تصاميم احترافية للإعلانات والسوشيال ميديا',
          ],
          restrictions: ['تفعيل مباشر على بريدك الإلكتروني في كانفا'],
        },
        {
          slug: 'canva-pro-2y',
          duration: '2_years',
          price: 25.0,
          features: [
            '🎨 الوصول إلى ملايين الصور والفيديوهات والعناصر Premium لمدة سنتين (24 شهراً)',
            '✨ إزالة خلفية الصور بضغطة واحدة',
            '🤖 أدوات الذكاء الاصطناعي Magic Studio',
            '📐 تغيير حجم التصميم تلقائياً Magic Resize',
            '🔤 استعمال خطوط وألوان احترافية',
            '🎬 مونتاج الفيديوهات وتصميم Reels وStories',
            '🧰 Brand Kit لتنظيم هوية علامتك التجارية',
            '☁️ مساحة تخزين سحابية كبيرة 1TB',
            '👥 مشاركة التصاميم والتعاون مع الفريق',
            '📱 قوالب احترافية للـ Instagram وFacebook وTikTok',
            '🛡️ ضمان استمرارية الخدمة لمدة عامين',
          ],
          restrictions: ['تفعيل مباشر على حسابك الشخصي بدون فقدان تصميماتك السابقة'],
        },
        {
          slug: 'canva-pro-3y-team-edu',
          duration: '3_years',
          price: 30.0,
          features: [
            '✨ تصميم احترافي بلا حدود لمدة 3 سنوات (36 شهراً)',
            '🖼️ مكتبة ضخمة من القوالب الجاهزة للإعلانات والعروض التقديمية',
            '🤖 أدوات الذكاء الاصطناعي المتقدمة Canva AI',
            '📸 صور وعناصر Premium وخطوط حصرية غير محدودة',
            '✂️ أدوات تعديل متقدمة وإزالة الخلفية السحرية',
            '👥 العمل الجماعي ومشاركة التصاميم مع أعضاء الفريق',
            '☁️ حفظ وتنظيم التصاميم داخل مساحة عمل آمنة',
            '🛡️ ضمان كامل طيلة فترة الاشتراك (3 سنوات)',
          ],
          restrictions: ['اشتراك Team Edu رسمي على بريدك الإلكتروني الشخصي'],
        },
      ],
    },

    // 6) Spotify Premium
    {
      slug: 'spotify-premium',
      categorySlug: 'entertainment',
      provider: 'Spotify',
      deliveryMethod: 'TEAM_INVITE',
      isPublished: true,
      isDemo: false,
      sortOrder: 6,
      translations: {
        ar: {
          name: 'Spotify Premium',
          tagline: 'استماع غير محدود للموسيقى والبودكاست بدون إعلانات وبجودة صوت عالية',
          description:
            'استمتع بملايين الأغاني العربية والعالمية، بدون أي إعلانات مزعجة، مع إمكانية التحميل والاستماع دون إنترنت، واقتراحات ذكية متوافقة مع ذوقك الموسيقي.',
        },
        fr: {
          name: 'Spotify Premium',
          tagline: 'Musique et podcasts illimités sans publicité en haute fidélité',
          description:
            'Écoutez des millions de titres arabes et internationaux, sans coupures publicitaires, avec téléchargement hors-connexion et recommandations intelligentes.',
        },
        en: {
          name: 'Spotify Premium',
          tagline: 'Unlimited ad-free music and podcasts in high fidelity audio',
          description:
            'Enjoy millions of songs and podcasts ad-free, download tracks for offline listening anywhere, and get smart personalized music recommendations.',
        },
      },
      variants: [
        {
          slug: 'spotify-premium-3m',
          duration: '3_months',
          price: 30.0,
          features: [
            '🎧 مكتبة موسيقية ضخمة: ملايين الأغاني العربية والأجنبية',
            '🚫 استماع بدون إعلانات: استمتع بموسيقاك المفضلة دون مقاطعة',
            '📥 الاستماع دون إنترنت: حمّل أغانيك واستمع في أي وقت وأي مكان',
            '🔊 جودة صوت فائقة النقاء (High Fidelity Audio)',
            '❤️ قوائم تشغيل خاصة وتخطي غير محدود للأغاني',
            '🤖 اقتراحات موسيقية ذكية مبنية على ذوقك',
            '🛡️ ضمان استمرارية طيلة 3 أشهر',
          ],
          restrictions: ['تفعيل عبر دعوة عائلة رسمية على حسابك الشخصي'],
        },
      ],
    },

    // 7) Adobe Express Premium
    {
      slug: 'adobe-express-premium',
      categorySlug: 'design',
      provider: 'Adobe',
      deliveryMethod: 'VOUCHER_CODE',
      isPublished: true,
      isDemo: false,
      sortOrder: 7,
      translations: {
        ar: {
          name: 'Adobe Express Premium',
          tagline: 'أدوات التصميم الاحترافي والذكاء الاصطناعي من Adobe بدون بطاقة بنكية',
          description:
            'تفعيل اشتراك Adobe Express Premium على حساب Adobe الخاص بك للاستفادة من ملايين القوالب، خطوط Adobe Fonts، أدوات الذكاء الاصطناعي Generative AI، بدون الحاجة لإضافة وسيلة دفع دولية.',
        },
        fr: {
          name: 'Adobe Express Premium',
          tagline: 'La puissance créative et l’IA générative d’Adobe sans carte bancaire',
          description:
            'Activez Adobe Express Premium directement sur votre compte Adobe personnel pour profiter des templates premium, de la bibliothèque Adobe Fonts, de l’IA générative Firefly, sans aucune carte bancaire requise.',
        },
        en: {
          name: 'Adobe Express Premium',
          tagline: 'Professional design tools and Adobe Firefly AI with no credit card required',
          description:
            'Activate Adobe Express Premium on your own Adobe account to unlock premium templates, Adobe Fonts, Firefly Generative AI, and brand kits without needing an international credit card.',
        },
      },
      variants: [
        {
          slug: 'adobe-express-6m',
          duration: '6_months',
          price: 10.0,
          features: [
            '✨ اشتراك Premium لمدة 6 أشهر كاملة',
            '👤 تفعيل على حساب Adobe الخاص بك (جديد أو موجود مسبقاً)',
            '💳 بدون بطاقة بنكية: لا حاجة لإضافة أي وسيلة دفع',
            '🔄 متاح للمشتركين الجدد والحاليين مع إمكانية التمديد',
            '🖼️ تصاميم احترافية للمنشورات والإعلانات بسهولة',
            '🤖 أدوات الذكاء الاصطناعي Firefly لتوليد وتعديل المحتوى الإبداعي',
            '🛡️ ضمان التفعيل الرسمي طيلة 6 أشهر',
          ],
          restrictions: ['لا يتطلب بطاقة بنكية دولية للتفعيل'],
        },
        {
          slug: 'adobe-express-12m',
          duration: '1_year',
          price: 20.0,
          features: [
            '✨ اشتراك Premium لمدة 12 شهراً (سنة كاملة)',
            '👤 تفعيل على حساب Adobe الخاص بك (جديد أو موجود مسبقاً)',
            '💳 بدون بطاقة بنكية: لا حاجة لإضافة وسيلة دفع لإتمام التفعيل',
            '🔄 متاح للمشتركين الحاليين مع إمكانية تمديد الاشتراك حسب سياسة Adobe',
            '🚀 تصميم احترافي بسهولة: منشورات وإعلانات وتصاميم مميزة',
            '🤖 أدوات الذكاء الاصطناعي الإبداعية ومكتبة خطوط Adobe Fonts',
            '🛡️ ضمان التفعيل الرسمي طيلة سنة كاملة',
          ],
          restrictions: ['لا يتطلب بطاقة بنكية دولية للتفعيل'],
        },
      ],
    },

    // 8) CapCut Pro
    {
      slug: 'capcut-pro',
      categorySlug: 'video',
      provider: 'ByteDance',
      deliveryMethod: 'CREDENTIALS_PROVISION',
      isPublished: true,
      isDemo: false,
      sortOrder: 8,
      translations: {
        ar: {
          name: 'CapCut Pro',
          tagline: 'برنامج المونتاج السريع وصناعة الفيديوهات الاحترافية للشبكات الاجتماعية',
          description:
            'الوصول الكامل لمميزات CapCut Pro الاحترافية، تفريغ صوتي وترجمة تلقائية بعدة لغات، تصدير 4K 60fps بدون علامة مائية، مؤثرات وفلاتر VIP حصرية، وأدوات الذكاء الاصطناعي للمونتاج.',
        },
        fr: {
          name: 'CapCut Pro',
          tagline: 'La suite de montage vidéo dynamique pour créateurs de contenu',
          description:
            'Profitez de toutes les fonctionnalités VIP de CapCut Pro : sous-titrage automatique multi-langues, export 4K haute résolution sans filigrane, effets VIP exclusifs et outils de retouche par IA.',
        },
        en: {
          name: 'CapCut Pro',
          tagline: 'Smart video editing powerhouse for social media creators',
          description:
            'Full access to CapCut Pro features: automatic multi-language captions, crisp 4K 60fps exports without watermark, exclusive VIP transitions and effects, and AI video generators.',
        },
      },
      variants: [
        {
          slug: 'capcut-pro-800cr-1m',
          duration: '1_month',
          price: 20.0,
          features: [
            '✅ الوصول الكامل إلى مميزات CapCut Pro الاحترافية',
            '⚡ رصيد ~800 كوينز ذكاء اصطناعي (800 AI Credits)',
            '🎥 أدوات احترافية لتحرير ومونتاج الفيديوهات وتصدير 4K',
            '✨ مؤثرات وفلاتر وانتقالات VIP حصرية بدون علامة مائية',
            '📝 أدوات متقدمة لإضافة النصوص والترجمة التلقائية (Auto-captions)',
            '🎵 مكتبة موسيقى ومؤثرات صوتية مرخصة',
            '🚀 أدوات الذكاء الاصطناعي (AI) المتاحة ضمن الاشتراك',
            '🛡️ ضمان استمرارية كامل لمدة 30 يوماً',
            '📩 التسليم: Email + Password + Invite Link',
          ],
          restrictions: ['متوافق مع أجهزة الكمبيوتر والهواتف الذكية'],
        },
        {
          slug: 'capcut-pro-1600cr-1m',
          duration: '1_month',
          price: 30.0,
          features: [
            '✅ الوصول الكامل إلى مميزات CapCut Pro الاحترافية',
            '⚡ رصيد مضاعف ~1600 كوينز ذكاء اصطناعي (1600 AI Credits)',
            '🎥 أدوات احترافية لتحرير ومونتاج الفيديوهات وتصدير 4K 60fps',
            '✨ مؤثرات وفلاتر وانتقالات VIP حصرية',
            '📝 أدوات متقدمة لإضافة النصوص وتوليد الترجمة التلقائية',
            '🎵 مكتبة صوتيات وموسيقى شاملة',
            '🚀 أدوات الذكاء الاصطناعي للمونتاج وتصفية الصوت',
            '🛡️ ضمان استمرارية كامل لمدة 30 يوماً',
            '📩 التسليم: Email + Password + Invite Link',
          ],
          restrictions: ['متوافق مع أجهزة الكمبيوتر والهواتف الذكية'],
        },
        {
          slug: 'capcut-pro-team-5seats-1m',
          duration: '1_month',
          price: 40.0,
          features: [
            '✅ حساب Admin Team CapCut Pro كامل الصلاحيات',
            '👥 إمكانية إضافة حتى 5 مستخدمين مستقلين (5 Seats)',
            '🎥 أدوات احترافية لتحرير ومونتاج الفيديوهات بدقة 4K',
            '✨ مكتبة كاملة من المؤثرات والفلاتر والانتقالات VIP',
            '📝 تفريغ صوتي وترجمة تلقائية بالعربية والفرنسية والإنجليزية',
            '🎵 مكتبة موسيقى ومؤثرات صوتية للأعمال التجارية',
            '🚀 كافة أدوات الذكاء الاصطناعي (AI) المتاحة لفريق العمل',
            '🛡️ ضمان استبدال ودعم فني كامل طيلة 30 يوماً',
            '📩 التسليم: Email + Password + Invite Link',
          ],
          restrictions: ['لوحة تحكم إدارية مخصصة لفريق عمل حتى 5 أفراد'],
        },
      ],
    },

    // 9) Claude Pro (Anthropic)
    {
      slug: 'claude-pro',
      categorySlug: 'ai',
      provider: 'Anthropic',
      deliveryMethod: 'OFFLINE_TRANSFER',
      isPublished: true,
      isDemo: false,
      sortOrder: 9,
      translations: {
        ar: {
          name: 'Claude Pro',
          tagline: 'مساعد الذكاء الاصطناعي الأفضل في التحليل الدقيق وصياغة الأكواد',
          description:
            'وصول متميز إلى نماذج Claude 3.5 Sonnet مع سعة استخدام مضاعفة 5 مرات في أوقات الذروة، ومساحات عمل Projects و ميزة Artifacts التفاعلية.',
        },
        fr: {
          name: 'Claude Pro',
          tagline: 'Assistant IA de pointe pour l’analyse complexe et le code',
          description:
            'Accès prioritaire à Claude 3.5 Sonnet avec 5x plus d’utilisation pendant les heures de pointe, espaces de travail Projects et Artifacts interactifs.',
        },
        en: {
          name: 'Claude Pro',
          tagline: 'Advanced AI assistant with high-reasoning and coding power',
          description:
            'Priority access to Claude 3.5 Sonnet with 5x higher usage limits during peak hours, Projects workspaces, and interactive Artifacts.',
        },
      },
      variants: [
        {
          slug: 'claude-pro-1m',
          duration: '1_month',
          price: 79.0,
          features: [
            'وصول كامل لنموذج Claude 3.5 Sonnet الأحدث عالمياً',
            'ميزة Projects لتنظيم المستندات والملفات الكبيرة',
            'ميزات Artifacts التفاعلية لتطوير واجهات الويب',
            'دعم فني محلي من Tooly.tn طيلة فترة الاشتراك',
            'دعوة رسمية على بريدك الإلكتروني في أقل من 15 دقيقة',
          ],
          restrictions: ['يخضع لحدود الاستخدام القياسية الخاصة بشركة Anthropic'],
        },
        {
          slug: 'claude-pro-3m',
          duration: '3_months',
          price: 225.0,
          features: [
            'اشتراك فصلي موفر لمدة 3 أشهر كاملة',
            'وصول كامل لنموذج Claude 3.5 Sonnet',
            'مساحات Projects و Artifacts',
            'ضمان كامل طيلة 90 يوماً مع أولوية الدعم والتجديد',
          ],
          restrictions: ['يخضع لسياسات Anthropic القياسية'],
        },
      ],
    },

    // 10) Cursor Pro (Anysphere)
    {
      slug: 'cursor-pro',
      categorySlug: 'developer',
      provider: 'Anysphere',
      deliveryMethod: 'OFFLINE_TRANSFER',
      isPublished: true,
      isDemo: false,
      sortOrder: 10,
      translations: {
        ar: {
          name: 'Cursor Pro',
          tagline: 'محرر الأكواد الذكي المدعوم بالذكاء الاصطناعي الأقوى عالمياً',
          description:
            'تعديل كامل مستودع الأكواد (Codebase Indexing) ومساعد محادثة ذكي داخل المحرر مع 500 طلب سريع لـ Claude 3.5 Sonnet شهرياً.',
        },
        fr: {
          name: 'Cursor Pro',
          tagline: 'L’éditeur de code nouvelle génération alimenté par l’IA',
          description:
            'Indexation complète de votre base de code et complétion intelligente en ligne avec 500 requêtes rapides Claude 3.5 Sonnet par mois.',
        },
        en: {
          name: 'Cursor Pro',
          tagline: 'AI-first code editor designed for pair-programming and refactoring',
          description:
            'Full codebase indexing, multi-file edits, ultra-fast completions, and 500 fast Claude 3.5 Sonnet requests per month.',
        },
      },
      variants: [
        {
          slug: 'cursor-pro-1m',
          duration: '1_month',
          price: 89.0,
          features: [
            '500 طلب سريع لنموذج Claude 3.5 Sonnet شهرياً',
            'استخدام غير محدود للنماذج القياسية',
            'فهم وفهرسة كامل مستودع الأكواد الخاص بمشروعك',
            'تعديل ملفات متعددة في وقت واحد بنقرة واحدة',
            'تفعيل في أقل من 15 دقيقة مع ضمان كامل',
          ],
          restrictions: ['مخصص لمطور واحد ولا يسمح بمشاركة جلسات العمل'],
        },
      ],
    },
  ];

  for (const prodData of productsSeed) {
    const categoryId = categoryMap.get(prodData.categorySlug);
    if (!categoryId) {
      console.warn(`Category slug not found: ${prodData.categorySlug}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        slug: prodData.slug,
        categoryId,
        provider: prodData.provider,
        deliveryMethod: prodData.deliveryMethod,
        isPublished: prodData.isPublished,
        isDemo: prodData.isDemo,
        sortOrder: prodData.sortOrder,
      },
    });

    // Localized content for product (3 languages)
    for (const locale of ['ar', 'fr', 'en'] as const) {
      const trans = prodData.translations[locale];
      await prisma.localizedContent.create({
        data: {
          entityType: 'product',
          entityId: product.id,
          locale,
          name: trans.name,
          tagline: trans.tagline,
          description: trans.description,
        },
      });
    }

    // Variants for product
    for (const vData of prodData.variants) {
      await prisma.planVariant.create({
        data: {
          productId: product.id,
          slug: vData.slug,
          duration: vData.duration,
          price: vData.price,
          currency: 'TND',
          isAvailable: true,
          isDemo: false,
          features: vData.features,
          restrictions: vData.restrictions,
        },
      });
    }
  }

  // 6. Ensure default demo customer exists
  await prisma.user.upsert({
    where: { email: 'demo-customer@tooly.tn' },
    update: {},
    create: {
      email: 'demo-customer@tooly.tn',
      name: 'Amine Ben Salah',
      phone: '+21698000000',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhashforseed$demo',
      role: Role.CUSTOMER,
      isActive: true,
    },
  });

  console.log(`✅ Seeding completed successfully!`);
  console.log(`   - 6 Categories created`);
  console.log(`   - 13 Catalog options created (Durations + Delivery methods)`);
  console.log(`   - ${productsSeed.length} Products created with 3-language localized contents`);
  const totalVariants = productsSeed.reduce((acc, p) => acc + p.variants.length, 0);
  console.log(`   - ${totalVariants} Plan Variants created`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
