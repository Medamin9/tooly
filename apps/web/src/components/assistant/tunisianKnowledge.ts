export interface BotAnswer {
  text: string;
  quickReplies?: string[];
  action?: {
    label: string;
    href: string;
  };
}

// Normalize user query by handling Arabizi numerals, diacritics, and case
function normalizeQuery(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u')
    .replace(/[îï]/g, 'i')
    .replace(/[ç]/g, 'c')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function getTunisianBotResponse(userMessage: string, currentLocale: string = 'ar'): BotAnswer {
  const norm = normalizeQuery(userMessage);
  const isAr = currentLocale === 'ar';

  // 1. GREETINGS & SALUTATIONS
  if (
    norm.includes('3aslema') ||
    norm.includes('aslema') ||
    norm.includes('asslema') ||
    norm.includes('ahla') ||
    norm.includes('salam') ||
    norm.includes('sbe7') ||
    norm.includes('msa') ||
    norm.includes('chne7welek') ||
    norm.includes('cv') ||
    norm.includes('cava') ||
    norm.includes('bonjour') ||
    norm.includes('salut') ||
    norm.includes('hello') ||
    norm.includes('hi') ||
    norm.includes('عسلامة') ||
    norm.includes('اهلا') ||
    norm.includes('مرحبا') ||
    norm.includes('سلام') ||
    norm.includes('صباح الخير') ||
    norm.includes('مساء الخير')
  ) {
    if (isAr) {
      return {
        text: `عسلامة يا باهي! 👋 مرحباً بيك في **Tooly.tn** (سوق الاشتراكات الرقمية في تونس)!

أنا المساعد التونسي الذكي متاعك. نعاونك باش تعرف أسعار الاشتراكات (Claude, ChatGPT, Canva...)، كيفاش تخلص بالـ D17 ولا Carte، ووقتاش يوصلك الطلب متاعك.

شنوة تحب تعرف اليوم؟ 🇹🇳`,
        quickReplies: [
          'اشتراكات الذكاء الاصطناعي (Claude, ChatGPT)',
          'كيفاش نخلص بالـ D17؟',
          'وقتاش يوصلني الطلب؟',
          'فمّا ضمان؟',
        ],
        action: {
          label: 'تفرّج في الكتالوج',
          href: `/${currentLocale}/catalog`,
        },
      };
    }

    return {
      text: `3aslema ya behi! 👋 Mar7ba bik fi **Tooly.tn** (سوق الاشتراكات الرقمية في تونس)!

Ena l'assistant mte3ek. N3awnek ta3ref les prix mte3 les abonnements (Claude, ChatGPT, Canva...), kifech tkhallas b D17 walla Carte, w waqtech touslek el commande.

Chnowa t7eb na3rfou lyoum? 🇹🇳`,
      quickReplies: [
        'Abonnements IA (Claude, ChatGPT)',
        'Kifech nkhallas b D17?',
        'Waqtech touselni el commande?',
        'Thamma garantie?',
      ],
      action: {
        label: 'Tfarrag 3al Catalogue',
        href: `/${currentLocale}/catalog`,
      },
    };
  }

  // 2. CLAUDE PRO
  if (norm.includes('claude') || norm.includes('كلود') || norm.includes('sonnet') || norm.includes('anthropic')) {
    if (isAr) {
      return {
        text: `🤖 **كلود برو (Claude Pro - Anthropic)**:
أحسن أداة ذكاء اصطناعي للتحليل، صياغة الأكواد والبرمجة الاحترافية!

- **السوم**: **79.0 د.ت / شهر** (بالدينار التونسي عوض الدفع بالعملة الصعبة).
- **الميزات**: وصول كامل لنموذج Claude 3.5 Sonnet، مساحات Projects لتنظيم المشاريع، وميزة Artifacts التفاعلية.
- **التوصيل**: دعوة رسمية مباشرة على الإيميل متاعك في أقل من 15 دقيقة!
- **الخلاص**: D17، فلوسي، كارت بنكية تونسية ولا سوب فلوس.`,
        quickReplies: ['نحب نشري Claude Pro', 'كيفاش نخلص؟', 'اشتراكات أخرى'],
        action: {
          label: 'شوف كلود برو بالتفصيل',
          href: `/${currentLocale}/product/claude-pro`,
        },
      };
    }

    return {
      text: `🤖 **Claude Pro (Anthropic)**:
Ahsan outil IA l'tahlel el khedma, redaction w dev!

- **Soum**: **79.0 TND / chhar** (au lieu de payer en devises).
- **Mizet**: Accès illimité lel Claude 3.5 Sonnet, Projects workspaces, w Artifacts interactifs.
- **Livraison**: Invitation directe 3al email mte3ek fi a9al men 15 d9i9a!
- **Khlas**: D17, Flouci, Carte Bancaire walla Sobflous.`,
      quickReplies: ['N7eb nchri Claude Pro', 'Kifech nkhallas?', 'Abonnements ekhrin'],
      action: {
        label: 'Chouf Claude Pro',
        href: `/${currentLocale}/product/claude-pro`,
      },
    };
  }

  // 3. CHATGPT PLUS
  if (norm.includes('chatgpt') || norm.includes('gpt') || norm.includes('openai') || norm.includes('شات جي بي تي') || norm.includes('شات')) {
    if (isAr) {
      return {
        text: `⚡ **شات جي بي تي بلس (ChatGPT Plus - OpenAI)**:
الأداة الأكثر شهرة واستعمالاً في العالم!

- **السوم**: **75.0 د.ت / شهر** بفلوس تونس ديركت!
- **الميزات**: نموذج GPT-4o، توليد الصور بـ DALL-E 3، أداة Canvas، تحليل المستندات وميزة الصوت المتقدم.
- **التوصيل**: حساب مفعّل وجاهز ولا دعوة خاصة في وقت قياسي.
- **الضمان**: 100% على طول مدة الاشتراك!`,
        quickReplies: ['كيفاش نعدي كوموند؟', 'الخلاص بـ D17', 'شوف كانفا برو'],
        action: {
          label: 'شوف ChatGPT Plus',
          href: `/${currentLocale}/product/chatgpt-plus`,
        },
      };
    }

    return {
      text: `⚡ **ChatGPT Plus (OpenAI)**:
L'outil l'akthar chehra fel 3alem!

- **Soum**: **75.0 TND / chhar** b flous Tounes direct!
- **Mizet**: GPT-4o, génération d'images b DALL-E, Canvas, analyse de données w voix avancée.
- **Livraison**: Compte pré-configuré walla invitation privée fi waqt 9sir.
- **Garantie**: 100% 3al durée kemla mte3 l'abonnement!`,
      quickReplies: ['Kifech npassi commande?', 'Paiement D17', 'Chouf Canva Pro'],
      action: {
        label: 'Chouf ChatGPT Plus',
        href: `/${currentLocale}/product/chatgpt-plus`,
      },
    };
  }

  // 4. CANVA PRO
  if (norm.includes('canva') || norm.includes('كانفا') || norm.includes('design') || norm.includes('تصميم') || norm.includes('graphisme')) {
    if (isAr) {
      return {
        text: `🎨 **كانفا برو (Canva Pro - اشتراك سنوي)**:
الأداة رقم 1 للتصميم والـ Social Media في تونس والعالم!

- **سوم استثنائي**: **35.0 د.ت / عام كامل (1 سنة)**!
- **الميزات**: تنحية خلفية الصور بنقرة واحدة، ملايين القوالب والخطوط الاحترافية، و Magic Studio بالذكاء الاصطناعي.
- **التوصيل**: تفعيل فوري ومباشر على حسابك العادي في كانفا!`,
        quickReplies: ['نشري كانفا برو (35 د.ت)', 'الخلاص بـ D17', 'الكتالوج كامل'],
        action: {
          label: 'شوف كانفا برو (35 د.ت)',
          href: `/${currentLocale}/product/canva-pro`,
        },
      };
    }

    return {
      text: `🎨 **Canva Pro (Équipe / Individuel)**:
L'outil numéro 1 l'design w social media fi Tounes!

- **Soum khesoussi**: **35.0 TND / 3am kemel (1 an)**!
- **Mizet**: Suppression d'arrière-plan b clique wa7da, millions de templates premium, Magic Studio IA.
- **Livraison**: Activation directe 3al compte Canva mte3ek el 3adi!`,
      quickReplies: ['Nchri Canva Pro', 'Twaslou b D17?', 'Catalogue kemel'],
      action: {
        label: 'Chouf Canva Pro (35 TND)',
        href: `/${currentLocale}/product/canva-pro`,
      },
    };
  }

  // 5. CAPCUT PRO
  if (norm.includes('capcut') || norm.includes('كاب كات') || norm.includes('video') || norm.includes('فيديو') || norm.includes('مونتاج') || norm.includes('tiktok')) {
    if (isAr) {
      return {
        text: `🎬 **كاب كات برو (CapCut Pro - PC & Mobile)**:
أحسن برنامج مونتاج فيديو لصناع المحتوى في تيك توك وإنستغرام!

- **السوم**: **49.0 د.ت** لحساب VIP مميز.
- **الميزات**: ترجمة صوتية وكتابية تلقائية بالعربي والفرنسي، مؤثرات VIP، وتصدير 4K بلا علامة مائية.
- **التوصيل**: تفعيل فوري مع دعم فني مضمون.`,
        quickReplies: ['كيفاش نخلص؟', 'الكتالوج كامل', 'واتساب الدعم'],
        action: {
          label: 'شوف CapCut Pro',
          href: `/${currentLocale}/catalog`,
        },
      };
    }

    return {
      text: `🎬 **CapCut Pro (PC & Mobile)**:
Ahsen logiciel de montage vidéo lel créateurs de contenu fi TikTok w Instagram!

- **Soum**: **49.0 TND** pour l'accès VIP.
- **Mizet**: Sous-titres automatiques bel 3arbi w français, effets VIP w export 4K sans filigrane.
- **Livraison**: Activation instantanée avec support technique garanti.`,
      quickReplies: ['Kifech nkhallas?', 'Catalogue kemel', 'Support WhatsApp'],
      action: {
        label: 'Chouf CapCut Pro',
        href: `/${currentLocale}/catalog`,
      },
    };
  }

  // 6. PAYMENT METHODS (D17, Flouci, Carte, Sobflous)
  if (
    norm.includes('kifech nkhallas') ||
    norm.includes('khlas') ||
    norm.includes('paiement') ||
    norm.includes('payer') ||
    norm.includes('d17') ||
    norm.includes('flouci') ||
    norm.includes('sobflous') ||
    norm.includes('edinar') ||
    norm.includes('carte') ||
    norm.includes('virement') ||
    norm.includes('poste') ||
    norm.includes('د17') ||
    norm.includes('كيفاش نخلص') ||
    norm.includes('خلاص') ||
    norm.includes('دفع') ||
    norm.includes('فلوسي') ||
    norm.includes('بطاقة') ||
    norm.includes('سوب فلوس')
  ) {
    if (isAr) {
      return {
        text: `💳 **كيفاش تخلص في Tooly.tn؟**
الخلاص 100% تونسي وساهل برشا، ما تستحقش كارت دولية!

1. 📲 **D17**: تحويل فوري من تطبيق البريد التونسي.
2. ⚡ **فلوسي (Flouci)**: تحويل سريع بالـ QR Code ولا بالرقم.
3. 🟡 **سوب فلوس (Sobflous)**: بالرصيد المباشر.
4. 💳 **بطاقة بنكية تونسية** (Visa, Mastercard, ClicToPay, E-Dinar).
5. 🏦 **تحويل بنكي (Virement)**: عبر RIB تونسي رسمي.

👉 بعد ما تعدي الكوموند، تجيك تعليمات الخلاص مباشرة وتأكيد فوري وفلوسك في أمان! 🔒`,
        quickReplies: [
          'وقتاش يوصلني الطلب؟',
          'تفرّج في الكتالوج',
          'فمّا فاتورة؟',
        ],
        action: {
          label: 'شوف السلة / إتمام الطلب',
          href: `/${currentLocale}/checkout`,
        },
      };
    }

    return {
      text: `💳 **Kifech tkhallas fi Tooly.tn?**
Khlasna 100% tounsi w sehla barcha, ma 7achtekch b carte internationale!

1. 📲 **D17**: Transfert instantané men l'application mte3 La Poste Tunisienne.
2. ⚡ **Flouci**: Transfert mobile rapide b QR code walla numéro.
3. 🟡 **Sobflous**: B solde Sobflous direct.
4. 💳 **Carte Bancaire Tunisienne** (Visa, Mastercard, ClicToPay, E-Dinar).
5. 🏦 **Virement Bancaire**: RIB tounsi officiel.

👉 Ba3d ma t3addi el commande, tjik les détails mte3 el paiement w confirmation fi da9ayeq!`,
      quickReplies: [
        'Waqtech touselni el commande?',
        'Tfarrag 3al Catalogue',
        'Thamma facture?',
      ],
      action: {
        label: 'Chouf el Panier / Checkout',
        href: `/${currentLocale}/checkout`,
      },
    };
  }

  // 7. DELIVERY TIME & PROCEDURE
  if (
    norm.includes('waqtech') ||
    norm.includes('waqt') ||
    norm.includes('delai') ||
    norm.includes('livraison') ||
    norm.includes('touselni') ||
    norm.includes('twsal') ||
    norm.includes('wa9tech') ||
    norm.includes('duree') ||
    norm.includes('temps') ||
    norm.includes('وقتاش') ||
    norm.includes('وقت') ||
    norm.includes('توصيل') ||
    norm.includes('مدة') ||
    norm.includes('يوصلني')
  ) {
    if (isAr) {
      return {
        text: `⏱️ **وقتاش يوصلك الطلب متاعك؟**
توصيل سريع ومضمون على الآخر!

- **الوقت**: بين **5 دقائق وساعة ماكس** بعد ما نثبتو الخلاص متاعك!
- **كيفاش يوصلك؟**:
  1. دعوة رسمية على الإيميل متاعك (مثل Claude Pro / Canva Pro).
  2. ولا بيانات الحساب مباشرة على صفحة الطلب متاعك والواتساب!
- وفريق الدعم الفني يبقى معاك حتى لين تشغل الأداة وجوّك باهي! 🚀`,
        quickReplies: ['كيفاش نتبع طلبي؟', 'فمّا ضمان؟', 'الأسعار متاعكم'],
        action: {
          label: 'تتبّع الطلب متاعك',
          href: `/${currentLocale}/order/lookup`,
        },
      };
    }

    return {
      text: `⏱️ **Waqtech touslek el commande?**
Livraison rapide w madhmouna 3al lekher!

- **Délai**: Mabin **5 d9aye9 w se3a max** ba3d ma nverifiw el khlas mte3ek!
- **Kifech touslek?**:
  1. Invitation officielle 3al email mte3ek (ex: Claude Pro / Canva Pro).
  2. Walla identifiants sécurisés 3al page de commande mte3ek w WhatsApp!
- W l'équipe technique yab9a m3ak 7atta lin tchaghal l'outil jawwek behi!`,
      quickReplies: ['Kifech ntaba3 commande?', 'Thamma garantie?', 'Les prix mte3kom'],
      action: {
        label: 'Taba3 el commande mte3ek',
        href: `/${currentLocale}/order/lookup`,
      },
    };
  }

  // 8. GUARANTEE, TRUST & LEGITIMACY
  if (
    norm.includes('garantie') ||
    norm.includes('dhaman') ||
    norm.includes('thi9a') ||
    norm.includes('arnaque') ||
    norm.includes('serieux') ||
    norm.includes('madhmoun') ||
    norm.includes('officiel') ||
    norm.includes('ضمان') ||
    norm.includes('ثقة') ||
    norm.includes('مضمون') ||
    norm.includes('أمان')
  ) {
    if (isAr) {
      return {
        text: `🛡️ **ضمان Tooly.tn 100% مضمون!**
ما تحيرش جملة يا غالي:

- **ضمان كامل**: على طول مدة الاشتراك متاعك.
- **استبدال فوري**: كان صار أي مشكل تقني ولا بلوكاج، نبدلوهولك ديركت في دقائق!
- **استرجاع الأموال**: كان ما نجمناش نحلو المشكلة، نرجعولك فلوسك مباشرة.
- **دعم محلي**: فريق تونسي موجود 7/7 بالواتساب والتليفون.`,
        quickReplies: ['نحب نشري توّا', 'رقم الواتساب', 'كيفاش نخلص؟'],
        action: {
          label: 'تفرّج في الكتالوج',
          href: `/${currentLocale}/catalog`,
        },
      };
    }

    return {
      text: `🛡️ **Garantie Tooly.tn 100% Madhmouna!**
Ma t7irech jemla ya ghali:

- **Garantie kemla**: 3la toul periode mte3 l'abonnement mte3ek.
- **Remplacement immédiat**: Ken sar ay mouchkel fi compte, nbadlouhlek direct fi d9aye9!
- **Remboursement garanti**: Ken ma najjamnech n7ellou el mochkla, trajjellek flousek direct.
- **Support local**: Équipe tounsiya mawjouda 7/7 b WhatsApp w téléphone.`,
      quickReplies: ['N7eb nchri tawwa', 'Numéro WhatsApp', 'Kifech nkhallas?'],
      action: {
        label: 'Tfarrag 3al Catalogue',
        href: `/${currentLocale}/catalog`,
      },
    };
  }

  // 9. ORDER TRACKING (Suivi)
  if (
    norm.includes('suivi') ||
    norm.includes('taba3') ||
    norm.includes('commande') ||
    norm.includes('code commande') ||
    norm.includes('recherche') ||
    norm.includes('lookup') ||
    norm.includes('تتبع') ||
    norm.includes('طلبي') ||
    norm.includes('وين وصل') ||
    norm.includes('الطلب')
  ) {
    if (isAr) {
      return {
        text: `📦 **تتبّع الطلب متاعك**:
تنجم تشوف حالة التوصيل متاعك مباشرة!

فقط دخل:
1. **رقم الطلب** (مثال: \`ORD-2026-...\`)
2. **الإيميل** ولا **رقم الهاتف** متاعك

وتشوف ديركت هل قيد التجهيز ولا تم التوصيل!`,
        quickReplies: ['الخلاص بـ D17', 'الاتصال بالدعم'],
        action: {
          label: 'ادخل لصفحة التتبع',
          href: `/${currentLocale}/order/lookup`,
        },
      };
    }

    return {
      text: `📦 **Taba3 el Commande mte3ek**:
Tnajjem tchouf l'état de livraison mte3ek en direct!

Faqat dakhkhel:
1. **Numéro de commande** (ex: \`ORD-2026-...\`)
2. **Email** walla **Numéro de téléphone** mte3ek

W tchouf direct est-ce que en cours de préparation walla livrée!`,
      quickReplies: ['Paiement D17', 'Contacter le support'],
      action: {
        label: 'Odkhol l Suivi Commande',
        href: `/${currentLocale}/order/lookup`,
      },
    };
  }

  // 10. CONTACT, PHONE, WHATSAPP, SUPPORT
  if (
    norm.includes('contact') ||
    norm.includes('support') ||
    norm.includes('whatsapp') ||
    norm.includes('telephone') ||
    norm.includes('tel') ||
    norm.includes('numero') ||
    norm.includes('humain') ||
    norm.includes('reclamation') ||
    norm.includes('اتصال') ||
    norm.includes('واتساب') ||
    norm.includes('هاتف') ||
    norm.includes('رقم') ||
    norm.includes('دعم')
  ) {
    if (isAr) {
      return {
        text: `📞 **فريق الدعم Tooly.tn**:
احنا معاك 7/7 لأي استفسار ولا مساعدة!

- 🟢 **واتساب مباشر**: +216 50 000 000 *(مساعدة فورية)*
- ✉️ **الإيميل**: contact@tooly.tn
- 🕒 **التوقيت**: من 09:00 لـ 23:00 كل يوم.
- 📍 **المقر**: تونس العاصمة.`,
        quickReplies: ['شوف الاشتراكات', 'كيفاش نخلص؟'],
        action: {
          label: 'الأسئلة الشائعة والدعم',
          href: `/${currentLocale}#faq`,
        },
      };
    }

    return {
      text: `📞 **Equipe Support Tooly.tn**:
A7na m3ak 7/7 l'ay istifsar walla moussa3ada!

- 🟢 **WhatsApp Direct**: +216 50 000 000 *(assistance instantanée)*
- ✉️ **Email**: contact@tooly.tn
- 🕒 **Horaire**: Men 09:00 l 23:00 koll yom.
- 📍 **Localisation**: Tunis, Tunisie.`,
      quickReplies: ['Chouf les abonnements', 'Kifech nkhallas?'],
      action: {
        label: 'Chouf el FAQ w Support',
        href: `/${currentLocale}#faq`,
      },
    };
  }

  // 11. WHO IS TOOLY.TN?
  if (
    norm.includes('chkoun entouma') ||
    norm.includes('chkoun tooly') ||
    norm.includes('c quoi tooly') ||
    norm.includes('qui etes vous') ||
    norm.includes('about') ||
    norm.includes('chkounk') ||
    norm.includes('شكون انتوما') ||
    norm.includes('من انتم') ||
    norm.includes('شكون تولي')
  ) {
    if (isAr) {
      return {
        text: `🇹🇳 **Tooly.tn — أول منصة رقمية في تونس**:
احنا منصة تونسية تخليك تشري الأدوات والاشتراكات الرقمية (ذكاء اصطناعي، تصميم، برمجة، فيديو) بسوم تونسي، بلا كارت دولية وبطريقة 100% قانونية ومضمونة!

هذا كلو بخلاص محلي (D17، فلوسي، كارت بنكية) ودعم فني تونسي!`,
        quickReplies: ['الاشتراكات المتوفرة', 'كيفاش نخلص؟'],
        action: {
          label: 'تفرّج في الكتالوج',
          href: `/${currentLocale}/catalog`,
        },
      };
    }

    return {
      text: `🇹🇳 **Tooly.tn — Première Marketplace Digitale fi Tounes**:
A7na plateforme tounsia tkhallik techri les outils w les abonnements digitaux (IA, Design, Dev, Vidéo) b soum tounsi, bla carte internationale w b tari9a 100% légale w madhmouna!

Hedha kollou b khlas local (D17, Flouci, Carte bancaire) w support technique tounsi!`,
      quickReplies: ['Abonnements disponibles', 'Kifech nkhallas?'],
      action: {
        label: 'Tfarrag 3al Catalogue',
        href: `/${currentLocale}/catalog`,
      },
    };
  }

  // 12. GRATITUDE / POLITE / CLOSING
  if (
    norm.includes('3aychek') ||
    norm.includes('chokran') ||
    norm.includes('merci') ||
    norm.includes('sa77a') ||
    norm.includes('ya3tik sa77a') ||
    norm.includes('parfait') ||
    norm.includes('top') ||
    norm.includes('شكرا') ||
    norm.includes('يعيشك') ||
    norm.includes('يعطيك الصحة') ||
    norm.includes('بارك الله فيك')
  ) {
    if (isAr) {
      return {
        text: `من عينيّ يا غالي! 🫶 يعطيك الصحة ومرحباً بيك في أي وقت في **Tooly.tn**!

كان عندك أي سؤال آخر، أنا ديما هوني 24/7 باش نعاونك! جوّك باهي! ✨`,
        quickReplies: ['ورّيني العروض', 'كيفاش نخلص؟'],
      };
    }

    return {
      text: `Men 3inayya ya ghali! 🫶 Ya3tik essa7a w mar7ba bik fi ay waqt fi **Tooly.tn**!

Ken 3andek ay sou'el ekher, ena dima houni 24/7 pour t'aider! Jawwek behi! ✨`,
      quickReplies: ['Tawwerrni les offres', 'Kifech nkhallas?'],
    };
  }

  // 13. FALLBACK (Natural Tunisian Derja Assistance)
  if (isAr) {
    return {
      text: `فهمتك يا باهي! 🤝 أنا هوني نعاونك بكل ما يخص **Tooly.tn**:

- 🤖 **اشتراكات الذكاء الاصطناعي والتصميم**: Claude Pro, ChatGPT Plus, Canva Pro, CapCut...
- 💳 **الخلاص**: D17، فلوسي، سوب فلوس، بطاقة بنكية.
- ⚡ **الوقت**: توصيل بين 5 دقائق وساعة ماكس.
- 📦 **التتبع**: تتبع الطلب متاعك مباشرة.

تفضل اختر سؤال من لوطا ولا اكتبلي شنوة تلوّج! 🇹🇳`,
      quickReplies: [
        'اشتراكات الذكاء الاصطناعي',
        'كانفا برو (35 د.ت)',
        'كيفاش نخلص بالـ D17؟',
        'وقتاش يوصلني الطلب؟',
      ],
      action: {
        label: 'شوف الكتالوج كامل',
        href: `/${currentLocale}/catalog`,
      },
    };
  }

  return {
    text: `Fhemttek ya behi! 🤝 Ena houni n3awnek b koll ma ykhes **Tooly.tn**:

- 🤖 **Abonnements IA & Design**: Claude Pro, ChatGPT Plus, Canva Pro, CapCut...
- 💳 **Khlas**: D17, Flouci, Sobflous, Carte Bancaire.
- ⚡ **Délai**: Livraison fi mabin 5 d9aye9 w se3a max.
- 📦 **Suivi**: Taba3 commande mte3ek en direct.

TFaddal ekhtar sou'el men louta walla iktebli b dharba wa7da chnowa tlawwej! 🇹🇳`,
    quickReplies: [
      'Abonnements IA (Claude, ChatGPT)',
      'Canva Pro (35 TND)',
      'Kifech nkhallas b D17?',
      'Waqtech tousel el commande?',
    ],
    action: {
      label: 'Chouf el Catalogue kemel',
      href: `/${currentLocale}/catalog`,
    },
  };
}
