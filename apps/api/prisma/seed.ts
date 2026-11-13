import { PrismaClient, DeliveryMethod, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Tooly.tn database with demo catalog data...');

  // 1. Clean existing demo data safely
  await prisma.localizedContent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.fulfillment.deleteMany();
  await prisma.planVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Seed Categories
  const categoriesData = [
    { slug: 'ai', sortOrder: 1, imageUrl: '/images/categories/ia.jpg' },
    { slug: 'design', sortOrder: 2, imageUrl: '/images/categories/design.jpg' },
    { slug: 'video', sortOrder: 3, imageUrl: '/images/categories/video.jpg' },
    { slug: 'productivity', sortOrder: 4, imageUrl: '/images/categories/productivity.jpg' },
    { slug: 'developer', sortOrder: 5, imageUrl: '/images/categories/devtools.jpg' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  // 3. Seed Category Localized Content
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
    productivity: {
      ar: 'الإنتاجية والعمل الجماعي',
      fr: 'Productivité & Organisation',
      en: 'Productivity & Collaboration',
    },
    developer: {
      ar: 'أدوات المطورين',
      fr: 'Outils Développeurs',
      en: 'Developer Tools',
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

  // 4. Seed Products and Plans (Clearly marked as Demo per requirements)
  const productsSeed = [
    {
      slug: 'claude-pro',
      categorySlug: 'ai',
      provider: 'Anthropic',
      deliveryMethod: DeliveryMethod.OFFLINE_TRANSFER,
      isPublished: true,
      isDemo: true,
      sortOrder: 1,
      translations: {
        ar: {
          name: 'Claude Pro',
          tagline: 'مساعد الذكاء الاصطناعي الأفضل في التحليل الدقيق وصياغة الأكواد',
          description: 'وصول متميز إلى نماذج Claude 3.5 Sonnet مع سعة استخدام مضاعفة 5 مرات في أوقات الذروة.',
        },
        fr: {
          name: 'Claude Pro',
          tagline: 'Assistant IA de pointe pour l’analyse complexe et le code',
          description: 'Accès prioritaire à Claude 3.5 Sonnet avec 5x plus d’utilisation pendant les heures de pointe.',
        },
        en: {
          name: 'Claude Pro',
          tagline: 'Advanced AI assistant with high-reasoning and coding power',
          description: 'Priority access to Claude 3.5 Sonnet with 5x higher usage limits during peak hours.',
        },
      },
      variants: [
        {
          slug: 'claude-pro-1m',
          duration: '1_month',
          price: 79.0,
          features: [
            'وصول كامل لنموذج Claude 3.5 Sonnet',
            'ميزة Projects لتنظيم المستندات والملفات',
            'ميزات Artifacts التفاعلية لتطوير واجهات الويب',
            'دعم فني محلي من Tooly.tn طيلة فترة الاشتراك',
          ],
          restrictions: [
            'يخضع لحدود الاستخدام القياسية الخاصة بشركة Anthropic',
            'حساب شخصي غير قابل للمشاركة المتزامنة',
          ],
        },
        {
          slug: 'claude-pro-3m',
          duration: '3_months',
          price: 225.0,
          features: [
            'اشتراك فصلي موفر لمدة 3 أشهر',
            'ضمان كامل طيلة 90 يوماً',
            'أولوية الدعم والتجديد التلقائي',
          ],
          restrictions: ['يخضع لسياسات Anthropic القياسية'],
        },
      ],
    },
    {
      slug: 'canva-pro',
      categorySlug: 'design',
      provider: 'Canva',
      deliveryMethod: DeliveryMethod.TEAM_INVITE,
      isPublished: true,
      isDemo: true,
      sortOrder: 2,
      translations: {
        ar: {
          name: 'Canva Pro',
          tagline: 'منصة التصميم الجرافيكي المتكاملة للشركات والمصممين',
          description: 'ملايين القوالب الاحترافية، إزالة الخلفيات بنقرة واحدة، ومكتبة خطوط وصور استثنائية.',
        },
        fr: {
          name: 'Canva Pro',
          tagline: 'La suite créative tout-en-un pour designers et équipes',
          description: 'Des millions de templates pro, suppression d’arrière-plan en 1 clic et bibliothèque géante.',
        },
        en: {
          name: 'Canva Pro',
          tagline: 'All-in-one graphic design suite for creators and teams',
          description: 'Millions of premium templates, one-click background remover, and cloud asset library.',
        },
      },
      variants: [
        {
          slug: 'canva-pro-1y',
          duration: '1_year',
          price: 149.0,
          features: [
            'أكثر من 100 مليون صورة ومقطع فيديو وقالب مميز',
            'أداة Magic Resizer ومزيل الخلفيات الذكي',
            'مساحة تخزين سحابية 1TB لحفظ كافة تصميماتك',
            'تفعيل مباشر على بريدك الإلكتروني الشخصي',
          ],
          restrictions: ['استخدام شخصي أو تجاري متوافق مع شروط استخدام Canva'],
        },
      ],
    },
    {
      slug: 'chatgpt-plus',
      categorySlug: 'ai',
      provider: 'OpenAI',
      deliveryMethod: DeliveryMethod.OFFLINE_TRANSFER,
      isPublished: true,
      isDemo: true,
      sortOrder: 3,
      translations: {
        ar: {
          name: 'ChatGPT Plus',
          tagline: 'المساعد الذكي الأكثر انتشاراً عالمياً مع نموذج GPT-4o المتقدم',
          description: 'وصول أسرع لنموذج GPT-4o، توليد الصور بـ DALL·E 3، وتحليل البيانات المتقدم.',
        },
        fr: {
          name: 'ChatGPT Plus',
          tagline: 'L’assistant IA de référence mondial avec GPT-4o',
          description: 'Accès prioritaire à GPT-4o, génération d’images DALL·E 3 et analyse de données.',
        },
        en: {
          name: 'ChatGPT Plus',
          tagline: 'Leading conversational AI model powered by GPT-4o',
          description: 'Priority access to GPT-4o, DALL·E 3 image generation, and data analysis.',
        },
      },
      variants: [
        {
          slug: 'chatgpt-plus-1m',
          duration: '1_month',
          price: 85.0,
          features: [
            'وصول لأحدث نماذج OpenAI (GPT-4o و o1-preview)',
            'تصفح الويب المباشر وتوليد الصور',
            'تحليل مستندات Excel و PDF المعقدة',
            'ضمان استمرارية الخدمة طيلة الـ 30 يوماً',
          ],
          restrictions: ['تطبق سياسات الاستخدام العادل المقررة من OpenAI'],
        },
      ],
    },
    {
      slug: 'capcut-pro',
      categorySlug: 'video',
      provider: 'ByteDance',
      deliveryMethod: DeliveryMethod.CREDENTIALS_PROVISION,
      isPublished: true,
      isDemo: true,
      sortOrder: 4,
      translations: {
        ar: {
          name: 'CapCut Pro',
          tagline: 'مونتاج الفيديو السريع والاحترافي لصناع المحتوى والشبكات الاجتماعية',
          description: 'مؤثرات ذكية بالذكاء الاصطناعي، تفريغ صوتي آلي متعدد اللغات، وتصدير بجودة 4K.',
        },
        fr: {
          name: 'CapCut Pro',
          tagline: 'Montage vidéo dynamique et intuitif pour créateurs de contenu',
          description: 'Sous-titres automatiques multi-langues, effets IA et export 4K haute résolution.',
        },
        en: {
          name: 'CapCut Pro',
          tagline: 'Smart video editing suite for creators and social media teams',
          description: 'Auto captions in multiple languages, AI video effects, and 4K export.',
        },
      },
      variants: [
        {
          slug: 'capcut-pro-1y',
          duration: '1_year',
          price: 129.0,
          features: [
            'إزالة الخلفيات التلقائية للفيديو بنقرة واحدة',
            'توليد الترجمة التلقائية باللغة العربية والفرنسية',
            'مكتبة مؤثرات وانتقالات حصرية غير محدودة',
            'تصدير بدون علامة مائية بدقة 4K بمعدل 60 إطاراً',
          ],
          restrictions: ['يتطلب تطبيق CapCut الرسمي على الحاسوب أو الهاتف'],
        },
      ],
    },
    {
      slug: 'cursor-pro',
      categorySlug: 'developer',
      provider: 'Anysphere',
      deliveryMethod: DeliveryMethod.OFFLINE_TRANSFER,
      isPublished: true,
      isDemo: true,
      sortOrder: 5,
      translations: {
        ar: {
          name: 'Cursor Pro',
          tagline: 'محرر الأكواد الذكي المدعوم بالذكاء الاصطناعي الأقوى عالمياً',
          description: 'تعديل كامل مستودع الأكواد (Codebase Indexing) ومساعد محادثة ذكي داخل المحرر.',
        },
        fr: {
          name: 'Cursor Pro',
          tagline: 'L’éditeur de code nouvelle génération alimenté par l’IA',
          description: 'Indexation complète de votre base de code et complétion intelligente en ligne.',
        },
        en: {
          name: 'Cursor Pro',
          tagline: 'AI-first code editor designed for pair-programming and refactoring',
          description: 'Full codebase indexing, multi-file edits, and ultra-fast completions.',
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
          ],
          restrictions: ['مخصص لمطور واحد ولا يسمح بمشاركة جلسات العمل'],
        },
      ],
    },
  ];

  for (const prodData of productsSeed) {
    const categoryId = categoryMap.get(prodData.categorySlug);
    if (!categoryId) continue;

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

    // Localized content for product
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
          isDemo: true,
          features: vData.features,
          restrictions: vData.restrictions,
        },
      });
    }
  }

  // 5. Seed a demo customer account
  await prisma.user.create({
    data: {
      email: 'demo-customer@tooly.tn',
      name: 'Amine Ben Salah',
      phone: '+21698000000',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhashforseed$demo',
      role: Role.CUSTOMER,
      isActive: true,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
