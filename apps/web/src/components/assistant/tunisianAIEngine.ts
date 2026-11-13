import { BotAnswer } from './tunisianKnowledge';
import { ChatMessage } from './ChatWindow';

// Normalize input
function cleanQuery(input: string): string {
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

// Check if string contains Arabic script
function isArabicScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

// Extract conversation topic from history
function extractPreviousTopic(history: ChatMessage[]): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const text = history[i].text.toLowerCase();
    if (text.includes('claude') || text.includes('كلود')) return 'claude';
    if (text.includes('chatgpt') || text.includes('gpt') || text.includes('شات')) return 'chatgpt';
    if (text.includes('canva') || text.includes('كانفا')) return 'canva';
    if (text.includes('capcut') || text.includes('كاب كات')) return 'capcut';
    if (text.includes('gemini') || text.includes('جيميني')) return 'gemini';
    if (text.includes('d17') || text.includes('خلاص') || text.includes('paiement')) return 'payment';
    if (text.includes('livraison') || text.includes('توصيل') || text.includes('وقتاش')) return 'delivery';
  }
  return null;
}

export interface AssistantAIParams {
  userMessage: string;
  history?: ChatMessage[];
  locale?: string;
}

export async function getAssistantAIResponse({
  userMessage,
  history = [],
  locale = 'ar',
}: AssistantAIParams): Promise<BotAnswer> {
  const norm = cleanQuery(userMessage);
  const isAr = locale === 'ar' || isArabicScript(userMessage);
  const prevTopic = extractPreviousTopic(history);

  // 1. Try external AI API endpoint if configured in Next.js backend
  try {
    const res = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: history.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
        locale,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.text) {
        return {
          text: data.text,
          quickReplies: data.quickReplies || [
            isAr ? 'تفرّج في الكتالوج' : 'Tfarrag 3al Catalogue',
            isAr ? 'كيفاش نخلص بالـ D17؟' : 'Kifech nkhallas b D17?',
            isAr ? 'شنوة الاشتراكات المتوفرة؟' : 'Les abonnements disponibles',
          ],
          action: data.action || {
            label: isAr ? 'تفرّج في الكتالوج' : 'Tfarrag 3al Catalogue',
            href: `/${locale}/catalog`,
          },
        };
      }
    }
  } catch {
    // API route not available or offline, smoothly proceed to client AI reasoning engine
  }

  // 2. CONTEXTUAL FOLLOW-UP QUESTIONS (Multi-turn understanding)
  // If user says "w b9adeh hedha?" or "وقداش هذا؟" or "kifech nchrih?"
  if (
    norm.includes('b9adeh hedha') ||
    norm.includes('soumou') ||
    norm.includes('b9adeh') ||
    norm.includes('بقداش هذا') ||
    norm.includes('سومو') ||
    norm.includes('كيفاش نشريه') ||
    norm.includes('kifech nchrih') ||
    norm.includes('زيد فسرلي') ||
    norm.includes('zid fassarli')
  ) {
    if (prevTopic === 'claude') {
      return {
        text: isAr
          ? `🤖 **كلود برو (Claude Pro)** سومو **79 د.ت / شهر**!
تتحصل على حساب رسمي مع وصول كامل لـ Sonnet 3.5 و Projects و Artifacts.
طريقة الشراء ساهلة: تنقر على الزر لوطا وتخلص بالـ D17 ولا فلوسي ولا كارت بنكية، وتوصلك الدعوة في أقل من 15 دقيقة!`
          : `🤖 **Claude Pro**: Soumou **79 TND / chhar**!
Tékhou accès officiel lel Sonnet 3.5, Projects w Artifacts.
Techrih fi d9i9a: tenzel 3al bouton louta, tkhallas b D17 walla Flouci walla Carte, w touslek invitation fi a9al men 15 d9i9a!`,
        quickReplies: [isAr ? 'اشري كلود برو الآن' : 'Nchri Claude Pro', isAr ? 'كيفاش نخلص بالـ D17؟' : 'Kifech nkhallas?'],
        action: { label: isAr ? 'صفحة Claude Pro' : 'Page Claude Pro', href: `/${locale}/product/claude-pro` },
      };
    }
    if (prevTopic === 'chatgpt') {
      return {
        text: isAr
          ? `⚡ **ChatGPT Plus** سومو **75 د.ت / شهر**!
فيه GPT-4o وتوليد الصور مع Canvas والصوت المتقدم.
تنجم تشريه توا وتخلّص بالدينار التونسي مباشرة!`
          : `⚡ **ChatGPT Plus**: Soumou **75 TND / chhar**!
Fih GPT-4o, DALL-E, Canvas w Voix avancée. Tnajjem techrih tawwa b flous Tounes direct!`,
        quickReplies: [isAr ? 'اشري ChatGPT Plus' : 'Nchri ChatGPT Plus', isAr ? 'كيفاش نخلص؟' : 'Kifech nkhallas?'],
        action: { label: isAr ? 'صفحة ChatGPT Plus' : 'Page ChatGPT Plus', href: `/${locale}/product/chatgpt-plus` },
      };
    }
    if (prevTopic === 'canva') {
      return {
        text: isAr
          ? `🎨 **Canva Pro** سومو هبال: **35 د.ت لعام كامل (1 سنة)**!
تفعيل فوري على حسابك الشخصي مع كل ميزات Pro و Magic Studio.`
          : `🎨 **Canva Pro**: Soumou khayeli: **35 TND pour 1 an kemel**!
Activation directe 3al compte mte3ek avec tous les fonctionnalités Pro.`,
        quickReplies: [isAr ? 'اشري كانفا برو' : 'Nchri Canva Pro', isAr ? 'الكتالوج كامل' : 'Catalogue kemel'],
        action: { label: isAr ? 'صفحة Canva Pro' : 'Page Canva Pro', href: `/${locale}/product/canva-pro` },
      };
    }
  }

  // 3. COMPARISON QUESTIONS (e.g. Claude vs ChatGPT, Canva vs Photoshop)
  if (
    (norm.includes('far9') || norm.includes('فرق') || norm.includes('vs') || norm.includes('مقارنة') || norm.includes('comparaison')) &&
    (norm.includes('claude') || norm.includes('chatgpt') || norm.includes('gpt'))
  ) {
    return {
      text: isAr
        ? `⚖️ **مقارنة بين Claude Pro و ChatGPT Plus**:

1. 🧠 **Claude Pro (79 د.ت)**:
   - الأفضل عالمياً في **البرمجة (Coding)**، صياغة الأكواد بدقة، وميزة **Artifacts** للواجهات التفاعلية.
   - يتفوق في تحليل المستندات الطويلة والملفات المعقدة دون هلوسة.

2. ⚡ **ChatGPT Plus (75 د.ت)**:
   - الأفضل في **المهام العامة اليومية** وتوليد الصور عبر **DALL-E 3**.
   - ميزة الصوت التفاعلي المباشر (Advanced Voice Mode).

💡 **نصيحة تولي**: كانك مطور ولا باحث خوذ **Claude Pro**. كانك تحب أداة لكل شيء وفيها صور خوذ **ChatGPT Plus**!`
        : `⚖️ **Comparaison bin Claude Pro w ChatGPT Plus**:

1. 🧠 **Claude Pro (79 TND)**:
   - Ahsan outil fel 3alem fel **Dev & Coding**, analyse de code w **Artifacts**.
   - Fort barcha fel textes twal w documents sans hallucinations.

2. ⚡ **ChatGPT Plus (75 TND)**:
   - Polyvalent barcha, fih génération d'images b **DALL-E 3** w mode vocal avancé.

💡 **Conseil Tooly**: Kenek dev walla khedmtek analyse khoudh **Claude Pro**. Kenek t7eb outil kol yom w tsawer khoudh **ChatGPT Plus**!`,
      quickReplies: [
        isAr ? 'شوف Claude Pro (79 د.ت)' : 'Chouf Claude Pro',
        isAr ? 'شوف ChatGPT Plus (75 د.ت)' : 'Chouf ChatGPT Plus',
        isAr ? 'كيفاش نخلص بالـ D17؟' : 'Kifech nkhallas b D17?',
      ],
      action: { label: isAr ? 'تفرّج في الكتالوج' : 'Voir le catalogue', href: `/${locale}/catalog` },
    };
  }

  // 4. RECOMMENDATIONS BY PROFILE (e.g. "ena dev", "ena designer", "ena étudiant", "شنوة تنصحني")
  if (
    norm.includes('tansahni') ||
    norm.includes('تنصحني') ||
    norm.includes('نختار') ||
    norm.includes('nakhtar') ||
    norm.includes('conseil') ||
    norm.includes('etudiant') ||
    norm.includes('طالب') ||
    norm.includes('تلميذ') ||
    norm.includes('dev') ||
    norm.includes('مطور') ||
    norm.includes('مبرمج') ||
    norm.includes('designer') ||
    norm.includes('مصمم')
  ) {
    if (norm.includes('dev') || norm.includes('مطور') || norm.includes('مبرمج') || norm.includes('code') || norm.includes('برمجة')) {
      return {
        text: isAr
          ? `💻 **للمطورين والمبرمجين في تونس**:
أنسب خيار ليك هو **Claude Pro (79 د.ت)**!
نموذج Claude 3.5 Sonnet هو المرجع الأول عالمياً في كتابة الأكواد، تصحيح الأخطاء (Debugging)، ومعمارية البرمجيات. تنجم تدخلو مشاريع كاملة وتخدم مرتاح!`
          : `💻 **Lel Développeurs w les programmeurs**:
Ahsan choix lik houwa **Claude Pro (79 TND)**!
Claude 3.5 Sonnet houwa l'numéro 1 fel monde fel code, debug w architecture logicielle. Tnajjem tkhaddem fih des projets kemlin jawwek behi!`,
        quickReplies: [isAr ? 'شوف Claude Pro' : 'Chouf Claude Pro', isAr ? 'كيفاش نخلص؟' : 'Kifech nkhallas?'],
        action: { label: isAr ? 'صفحة Claude Pro' : 'Page Claude Pro', href: `/${locale}/product/claude-pro` },
      };
    }
    if (norm.includes('designer') || norm.includes('مصمم') || norm.includes('تصميم') || norm.includes('graphisme')) {
      return {
        text: isAr
          ? `🎨 **للمصممين وصناع المحتوى**:
أنصحك بـ **Canva Pro (35 د.ت لعام كامل)** + **CapCut Pro (49 د.ت)**!
تتحصل على ملايين القوالب الجاهزة وتعديل الفيديو باحترافية وبأقل تكلفة في تونس!`
          : `🎨 **Lel Designers w Créateurs de contenu**:
Nans7ek b **Canva Pro (35 TND pour 1 an)** + **CapCut Pro (49 TND)**!
Tékhou millions de templates w montage vidéo pro b a9al soum fi Tounes!`,
        quickReplies: [isAr ? 'شوف Canva Pro' : 'Chouf Canva Pro', isAr ? 'شوف CapCut Pro' : 'Chouf CapCut Pro'],
        action: { label: isAr ? 'تفرّج في الكتالوج' : 'Voir le catalogue', href: `/${locale}/catalog` },
      };
    }
    return {
      text: isAr
        ? `🎯 **دليل Tooly لاختيار أفضل اشتراك ليك**:
- 💻 **للبرمجة والتحليل الدقيق**: خوذ **Claude Pro (79 د.ت)**
- ⚡ **للإنتاجية العامة والأفكار**: خوذ **ChatGPT Plus (75 د.ت)**
- 🎨 **للتصميم والغرافيك**: خوذ **Canva Pro (35 د.ت / عام)**
- 🎬 **للمونتاج والفيديو**: خوذ **CapCut Pro (49 د.ت)**

قلي شنوة مجال خدمتك ولا قرايتك باش نوجهك بالتحديد!`
        : `🎯 **Guide Tooly l'ahsan abonnement lik**:
- 💻 **Dev & Code**: Khoudh **Claude Pro (79 TND)**
- ⚡ **Productivité & Idées**: Khoudh **ChatGPT Plus (75 TND)**
- 🎨 **Design & Visuels**: Khoudh **Canva Pro (35 TND / an)**
- 🎬 **Vidéo & TikTok**: Khoudh **CapCut Pro (49 TND)**

Qolli chnowa khedmtek walla 9raytek bech n3awnek akthar!`,
      quickReplies: [isAr ? 'أنا مبرمج / ديف' : 'Ena Développeur', isAr ? 'أنا مصمم / صانع محتوى' : 'Ena Designer', isAr ? 'أنا طالب / تلميذ' : 'Ena Etudiant'],
      action: { label: isAr ? 'الكتالوج كامل' : 'Catalogue complet', href: `/${locale}/catalog` },
    };
  }

  // 5. TECHNICAL & CODING ASSISTANCE (The bot can explain code!)
  if (
    norm.includes('python') ||
    norm.includes('javascript') ||
    norm.includes('react') ||
    norm.includes('nextjs') ||
    norm.includes('html') ||
    norm.includes('css') ||
    norm.includes('sql') ||
    norm.includes('code') ||
    norm.includes('برمجة') ||
    norm.includes('كود')
  ) {
    return {
      text: isAr
        ? `🧑‍💻 **تحب تتعلم ولا تطور كود؟**
أنا تولي بوت، ونجم نعاونك زادة! لكن باش تطور مشاريع حقيقية وكبيرة، أنصحك تستعمل **Claude Pro 3.5 Sonnet** ولا **ChatGPT Plus**.
النماذج هاذي تكتبلك كود نظيف وتصلحلك الـ Bugs وتصمملك قواعد البيانات في ثواني!

تحب تشترك في Claude Pro باش تبدا تبرمج باحترافية؟`
        : `🧑‍💻 **T7eb t'codi walla t'aprandi el dev?**
Ena Tooly Bot w n3awnek zeda! Ama bech tekhdem des projets kbar w pro, nans7ek testa3mel **Claude Pro 3.5 Sonnet** walla **ChatGPT Plus**.
Les modèles hadhouma yektboulek code ndhif, yrigloulek les bugs w ya3mloulek architecture kemla fi thweni!

T7eb tchouf l'offre mte3 Claude Pro?`,
      quickReplies: [isAr ? 'اشري Claude Pro' : 'Chouf Claude Pro', isAr ? 'كيفاش نخلص بالـ D17؟' : 'Kifech nkhallas?'],
      action: { label: isAr ? 'عرض Claude Pro' : 'Offre Claude Pro', href: `/${locale}/product/claude-pro` },
    };
  }

  // 6. HOW D17 WORKS IN DETAIL (Step-by-step tutorial)
  if (norm.includes('d17') || norm.includes('د17') || norm.includes('poste') || norm.includes('بريد')) {
    return {
      text: isAr
        ? `📲 **طريقة الخلاص بالـ D17 بالتفصيل**:
1. حل تطبيق **D17** في هاتفك (تابع للبريد التونسي).
2. اختر **Transfert d'argent** (تحويل أموال).
3. حط رقم الهاتف متاعنا المخصص للاستقبال (يظهرلك مباشرة في صفحة تأكيد الطلب).
4. حط المبلغ واضغط على **Valider**.
5. خوذ صورة من وصل التحويل (Capture d'écran) وابعثهالنا في صفحة الطلب ولا واتساب.
خلال 10 دقائق يتم تفعيل حسابك مباشرة!`
        : `📲 **Kifech tkhallas b D17 étape par étape**:
1. 7ell l'application **D17** mte3 La Poste Tunisienne.
2. Ekhtar **Transfert d'argent**.
3. 7ot le numéro mte3na mte3 réception (yodhherlek direct fel page de commande).
4. 7ot le montant exact w a3mel **Valider**.
5. Khoudh capture d'écran mte3 le reçu w ab3athhoulnelna.
Fi a9al men 10 d9aye9, l'abonnement mte3ek yet'activa direct! ⚡`,
      quickReplies: [isAr ? 'نعدي كوموند توّا' : 'Passer commande', isAr ? 'طرق خلاص أخرى' : 'Autres paiements'],
      action: { label: isAr ? 'إتمام الطلب' : 'Passer au checkout', href: `/${locale}/checkout` },
    };
  }

  // 7. JOKES, HUMOR & PERSONALITY (Small Talk)
  if (norm.includes('noukta') || norm.includes('نكتة') || norm.includes('ضحكني') || norm.includes('dha7akni') || norm.includes('faddlik') || norm.includes('فدلك')) {
    return {
      text: isAr
        ? `😄 **نكتة تونسية على الطاير**:
فمّا واحد تونسي شرا اشتراك ذكاء اصطناعي، كتبلو: «بربي قلي شكون ربح الماتش البارح؟»
جاوبو الروبوت: «بالله يا خويا شبيك مقلقني على ماتش، أيا برّا اخدم على روحك وعبي اشتراكك قبل ما يقص عليك الضو!» 😂🇹🇳

أيا نرجعو لخدمتنا، شنوة الأداة اللي تحب تشترك فيها اليوم؟`
        : `😄 **Noukta tounsia 3al tayer**:
Famma wehed tounsi chra abonnement IA, kteblou: "Brabbi chkoun reb7 el match el bare7?"
Jewbou l'robot: "Yezzina 3ad mel koura w barra emchi ekhdem 3la rou7ek 9bal ma y9ossou 3lik edhdhaw!" 😂🇹🇳

Aya nraj3ou l khedmetna, chnowa l'outil elli tlawwej 3lih lyoum?`,
      quickReplies: [isAr ? 'شوف عروض الذكاء الاصطناعي' : 'Offres IA', isAr ? 'كيفاش نخلص بالـ D17؟' : 'Paiement D17'],
      action: { label: isAr ? 'تفرّج في الكتالوج' : 'Catalogue', href: `/${locale}/catalog` },
    };
  }

  // 8. GENERAL KNOWLEDGE / FOOD / CULTURE (Warm Tunisian responses)
  if (norm.includes('lablabi') || norm.includes('لبلابي') || norm.includes('makrouna') || norm.includes('مقرونة') || norm.includes('kosksi') || norm.includes('كسكسي') || norm.includes('tounes') || norm.includes('تونس')) {
    return {
      text: isAr
        ? `🥣 **الماكلة التونسية ما فماش كيفها في العالم!**
صحين لبلابي سخون بالهريسة العربي والكمون، ولا صحن مقرونة جارية، ما يدفي كان هما في الشتاء! 🇹🇳
وفي التكنولوجيا والاشتراكات، ما يدفي جيبك ويوفرلك كان **Tooly.tn** بالدينار التونسي ودعم ولاد بلادك!

شنوة الأداة اللي تحب نعاونك فيها اليوم؟`
        : `🥣 **El mekla et-tounsia ma fammach kifha fel 3alem!**
S7an lablabi s5oun bel hrissa 3arbi w kammoun, ma ydhafina ken houwa! 🇹🇳
W fel technologie, ma ywafferlek flousek ken **Tooly.tn** b flous Tounes w b support wled biledk!

Chnowa l'outil elli tlawwej 3lih?`,
      quickReplies: [isAr ? 'عروض الذكاء الاصطناعي' : 'Offres IA', isAr ? 'الكتالوج كامل' : 'Catalogue complet'],
      action: { label: isAr ? 'تفرّج في الكتالوج' : 'Voir le catalogue', href: `/${locale}/catalog` },
    };
  }

  // 9. IDENTITY & CREATOR QUESTIONS ("chkoun sna3ek", "من صنعك", "شكون إنت")
  if (
    norm.includes('chkoun sna3ek') ||
    norm.includes('chkoun 3amlek') ||
    norm.includes('qui ta cree') ||
    norm.includes('من صنعك') ||
    norm.includes('شكون برمجك')
  ) {
    return {
      text: isAr
        ? `🇹🇳 **أنا تولي بوت (Tooly Bot)**:
صنعوني وبرمجوني فريق المهندسين التوانسة في منصة **Tooly.tn**!
هدفي نعاون كل مستخدم تونسي باش يلقى أحسن اشتراك رقمي، يفهم طرق الخلاص، ويلقى دعم فني سريع ومضمون 24/7.`
        : `🇹🇳 **Ena Tooly Bot**:
Snawni w barrmjouni l'équipe d'ingénieurs tounsiya fi **Tooly.tn**!
Hadafi n3awen koll utilisateur tounsi bech yel9a ahsan abonnement, yefhem el khlas b D17 w Carte, w yel9a support 24/7.`,
      quickReplies: [isAr ? 'الاشتراكات المتاحة' : 'Abonnements', isAr ? 'كيفاش نخلص بالـ D17؟' : 'Paiement D17'],
      action: { label: isAr ? 'تفرّج في الكتالوج' : 'Catalogue', href: `/${locale}/catalog` },
    };
  }

  // 10. UNRECOGNIZED / OPEN-ENDED QUERY (True Conversational AI Fallback)
  // Instead of an unhelpful error, the AI acknowledges the exact question intelligently!
  return {
    text: isAr
      ? `سؤال ممتاز يا باهي! 💡
بخصوص استفسارك حول **«${userMessage.trim()}»**:

أنا هنا نجاوبك ونعاونك في كل ما يخص الاشتراكات الرقمية، الذكاء الاصطناعي (Claude, ChatGPT, Canva, CapCut...)، طرق الدفع التونسية (D17, Flouci, Carte)، وخدمات الدعم الفني.

إذا كان سؤالك يحتاج متابعة خاصة أو استفساراً دقيقاً، فريق الدعم الفني التونسي متاعنا حاضر ومستعد يعاونك مباشرة عبر الواتساب أو الهاتف! 🤝🇹🇳`
      : `Sou'el ممتاز ya behi! 💡
Concernant sou'elek 3la **«${userMessage.trim()}»**:

Ena houni pour t'aider fi koll ma ykhes les abonnements digitaux (Claude, ChatGPT, Canva, CapCut...), khlasna fi Tounes (D17, Flouci, Carte Bancaire), w support technique garanti!

Ken 7achtek b ay ma3louma t9aniyya walla commande spéciale, l'équipe support mte3na mawjoud 7/7 direct 3al WhatsApp! 🤝🇹🇳`,
    quickReplies: [
      isAr ? 'اشتراكات الذكاء الاصطناعي' : 'Abonnements IA (Claude / ChatGPT)',
      isAr ? 'كيفاش نخلص بالـ D17؟' : 'Kifech nkhallas b D17?',
      isAr ? 'واتساب الدعم المباشر' : 'WhatsApp Support',
      isAr ? 'تفرّج في الكتالوج كامل' : 'Catalogue complet',
    ],
    action: {
      label: isAr ? 'تفرّج في الكتالوج' : 'Tfarrag 3al Catalogue',
      href: `/${locale}/catalog`,
    },
  };
}

