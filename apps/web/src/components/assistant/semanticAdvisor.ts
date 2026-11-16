import { BotAnswer, RecommendedProductCard, ChatMessage } from './types';
import { SANJOUB_CATALOG, getRecommendedCards } from './sanjoubCatalog';

export type DetectedLanguage = 'ar' | 'arabizi' | 'fr' | 'en';

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

export function detectLanguage(text: string, currentLocale: string = 'ar'): DetectedLanguage {
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar';
  }

  const norm = ' ' + text.toLowerCase().replace(/[^a-z0-9]/g, ' ') + ' ';

  // Arabizi numerals (3 = ع, 7 = ح, 9 = ق, 5 = خ) and specific Tunisian words
  if (
    /[3795]/.test(norm) ||
    /\b(3aslema|aslema|ahla|b9adeh|kifech|chkoun|chnowa|chneya|n7eb|nheb|famma|flous|flouci|soum|soumou|tnasa7ni|tansahni|nechri|khedma|khedmtek|behi|hedha|hedhi|chouf|d17|brabbi|ye3tik|mte3|fel|chhar|chhour|anhouma|wala|walla|fih|fihom|lyoum|tawa)\b/.test(
      norm
    )
  ) {
    return 'arabizi';
  }

  // Count French vs English markers
  const frCount = (norm.match(/\b(bonjour|salut|prix|combien|comment|livraison|paiement|payer|delai|garantie|facture|commande|compte|abonnement|disponible|acheter|remboursement|developpeur|je|suis|quels|quelle|conseillez|vous|pour|avec|dans|est|les|des|une|mon|qui|creer|contenu)\b/g) || []).length;
  const enCount = (norm.match(/\b(how|what|when|where|which|price|cost|how much|buy|subscription|delivery|guarantee|refund|support|order|track|hello|hi|please|available|payment|i|am|should|best|recommend|can you|for|my|with)\b/g) || []).length;

  if (frCount > enCount) return 'fr';
  if (enCount > frCount) return 'en';

  if (currentLocale === 'fr') return 'fr';
  if (currentLocale === 'en') return 'en';
  return 'arabizi';
}

/**
 * Extract the last referenced product slug from conversation history to resolve anaphora
 * like "soumou" (his price), "it", "this one", "anhouma", etc.
 */
export function resolveContextualSubject(history: ChatMessage[] = []): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const text = history[i].text.toLowerCase();
    if (text.includes('cursor') || text.includes('كرسور')) return 'cursor-pro';
    if (text.includes('claude api') || text.includes('api anthropic')) return 'claude-api';
    if (text.includes('claude') || text.includes('كلود') || text.includes('sonnet')) return 'claude-pro';
    if (text.includes('chatgpt go') || text.includes('شات جي بي تي جو')) return 'chatgpt-go';
    if (text.includes('chatgpt') || text.includes('gpt') || text.includes('شات') || text.includes('openai')) return 'chatgpt-plus';
    if (text.includes('canva') || text.includes('كانفا')) return 'canva-pro';
    if (text.includes('adobe') || text.includes('ادوبي') || text.includes('firefly')) return 'adobe-express-premium';
    if (text.includes('capcut') || text.includes('كاب كات') || text.includes('كابكات')) return 'capcut-pro';
    if (text.includes('gemini') || text.includes('جيميني') || text.includes('جوجل ون')) return 'gemini-plus-family';
    if (text.includes('spotify') || text.includes('سبوتيفاي') || text.includes('موسيقى')) return 'spotify-premium';
  }
  return null;
}

function matchAny(norm: string, patterns: string[]): boolean {
  for (const p of patterns) {
    const normP = normalizeText(p);
    if (!normP) continue;
    if (normP.length <= 4) {
      const regex = new RegExp(`(^|\\s)${normP}(\\s|$)`, 'i');
      if (regex.test(norm)) return true;
    } else {
      if (norm.includes(normP)) return true;
    }
  }
  return false;
}

/**
 * Main Sanjoub Semantic Reasoning Engine
 */
export function getSanjoubSemanticResponse(
  userMessage: string,
  currentLocale: string = 'ar',
  history: ChatMessage[] = []
): BotAnswer {
  const raw = userMessage.trim();
  const norm = normalizeText(raw);
  const lang = detectLanguage(raw, currentLocale);
  const loc = currentLocale === 'en' ? 'en' : currentLocale === 'fr' ? 'fr' : 'ar';
  const lastContextProduct = resolveContextualSubject(history);

  // Helper builder for localized reply with quick replies, action, and optional product cards
  const buildReply = (
    arText: string,
    arabiziText: string,
    frText: string,
    enText: string,
    recommendedSlugs?: string[],
    customQuickReplies?: { ar: string[]; arabizi: string[]; fr: string[]; en: string[] },
    customAction?: { label: { ar: string; arabizi: string; fr: string; en: string }; href: string }
  ): BotAnswer => {
    let chosenText = arText;
    let chosenReplies = customQuickReplies?.ar || ['الاشتراكات المتوفرة', 'كيفاش نخلص بالـ D17؟', 'وقتاش يوصلني الطلب؟', 'فمّا ضمان؟'];
    let chosenAction = customAction
      ? { label: customAction.label.ar, href: customAction.href }
      : { label: 'تفرّج في الكتالوج كامل', href: `/${loc}/catalog` };

    if (lang === 'arabizi') {
      chosenText = arabiziText;
      chosenReplies = customQuickReplies?.arabizi || ['Abonnements disponibles', 'Kifech nkhallas b D17?', 'Waqtech tousel?', 'Thamma garantie?'];
      if (customAction) chosenAction = { label: customAction.label.arabizi, href: customAction.href };
      else chosenAction = { label: 'Chouf el Catalogue', href: `/${loc}/catalog` };
    } else if (lang === 'fr') {
      chosenText = frText;
      chosenReplies = customQuickReplies?.fr || ['Abonnements disponibles', 'Comment payer par D17 ?', 'Délai de livraison', 'Garantie'];
      if (customAction) chosenAction = { label: customAction.label.fr, href: customAction.href };
      else chosenAction = { label: 'Voir le catalogue complet', href: `/${loc}/catalog` };
    } else if (lang === 'en') {
      chosenText = enText;
      chosenReplies = customQuickReplies?.en || ['Available subscriptions', 'How to pay with D17?', 'Delivery time', 'Guarantee'];
      if (customAction) chosenAction = { label: customAction.label.en, href: customAction.href };
      else chosenAction = { label: 'View full catalog', href: `/${loc}/catalog` };
    }

    const cards = recommendedSlugs && recommendedSlugs.length > 0
      ? getRecommendedCards(recommendedSlugs, loc)
      : undefined;

    return {
      text: chosenText,
      quickReplies: chosenReplies,
      action: chosenAction,
      recommendedProducts: cards,
    };
  };

  // 1. GREETINGS (عسلامة, اهلا, سلام, ahla, aslema, cc, bonjour, salut, hello, hi...)
  const isGreeting =
    matchAny(norm, [
      'عسلامة', 'عسلامه', 'اهلا', 'اهلين', 'سلام', 'سلام عليكم', 'مرحبا', 'مرحبا بيك',
      'صباح الخير', 'مساء الخير', 'ahla', 'ahla bik', 'aslema', 'asslema', '3aslema', '3asslema',
      'cc', 'coucou', 'salut', 'bonjour', 'bonsoir', 'salam', 'slm', 'hello', 'hi', 'hey', 'cv', 'cava'
    ]) &&
    !matchAny(norm, [
      'claude', 'chatgpt', 'canva', 'capcut', 'cursor', 'd17', 'flouci', 'sobflous',
      'carte', 'b9adeh', 'soum', 'prix', 'combien', 'livraison', 'waqtech', 'garantie',
      'suivi', 'facture', 'kifech', 'chkoun', 'spotify', 'adobe', 'designer', 'developer',
      'video', 'etudiant', 'student', 'code', 'coding'
    ]);

  if (isGreeting || norm === 'ahla' || norm === 'aslema' || norm === 'cc' || norm === 'سلام' || norm === 'اهلا') {
    return buildReply(
      `مرحبا بيك في **Tooly.tn**! 🐿️ عسلامة يا باهي!

أنا **سنجوب (Sanjoub)**، المستشار الذكي للاشتراكات والمنتجات الرقمية في تونس. 🇹🇳
نعاونك تختار أحسن الأدوات لاحتياجاتك بأرخص الأسعار وبالدينار التونسي، وتخلص بطرق محلية سهلة (D17, Flouci, Carte Bancaire).

شنوة تخدم ولا شنوة نوع الأدوات اللي تلوج عليها اليوم؟ (تصميم، برمجة، مونتاج فيديو، ذكاء اصطناعي، قراية...) ✨`,
      `Mar7ba bik fi **Tooly.tn**! 🐿️ 3aslema ya ghali!

Ena **Sanjoub**, ton conseiller intelligent pour les abonnements et produits digitaux en Tunisie. 🇹🇳
N3awnek tekhtar a7sen les outils mte3ek b a9al les prix w bel Dinar Tounsi, w tkhallas b D17, Flouci walla Carte.

Chnowa tekhdem walla chnowa naw3 el tools elli tlawwej 3lihom lyoum? (Design, Dev, Montage Video, IA, 9raya...) ✨`,
      `Bienvenue sur **Tooly.tn** ! 🐿️ Bonjour !

Je suis **Sanjoub**, votre conseiller IA et spécialiste des abonnements digitaux en Tunisie. 🇹🇳
Je vous aide à trouver les meilleurs outils aux tarifs officiels en Dinars Tunisiens avec paiement 100% local (D17, Flouci, Carte bancaire).

Quel est votre domaine ou votre besoin du moment ? (Design graphique, développement, montage vidéo, IA générative, études...) ✨`,
      `Welcome to **Tooly.tn**! 🐿️ Hello!

I'm **Sanjoub**, your friendly digital subscriptions advisor for Tunisia. 🇹🇳
I help you discover and purchase top-tier digital tools at local TND rates with easy local payments (D17, Flouci, Bank Cards).

What is your primary goal or profession today? (Design, Programming, Video Editing, AI, Studies...) ✨`,
      ['claude-pro', 'canva-pro', 'chatgpt-plus'],
      {
        ar: ['أنا ديزاينر (Design)', 'أنا مبرمج (Dev & Code)', 'مونتاج وصناعة محتوى', 'طالب وأحتاج أدوات للدراسة', 'كيفاش نخلص بالـ D17؟'],
        arabizi: ['Ena designer', 'Ena developpeur (Code)', 'Montage & Content Creator', 'Ena etudiant', 'Kifech nkhallas b D17?'],
        fr: ['Je suis designer', 'Je suis développeur', 'Créateur de contenu vidéo', 'Je suis étudiant', 'Paiement D17'],
        en: ["I'm a designer", "I'm a developer", 'Video Content Creator', "I'm a student", 'Pay with D17'],
      }
    );
  }

  // 2. WHO ARE YOU / CAPABILITIES ("Chnowa tnajem ta3mel?", "Qui es-tu ?")
  if (
    matchAny(norm, [
      'chnowa tnajem ta3mel', 'chnowa ta3mel', 'qui es tu', 'qui est tu', 'chkoun enti', 'chkounik',
      'what can you do', 'who are you', 'presente toi', 'شنوة تنجم تعمل', 'شكون انت', 'عرفني بيك', 'شنوة خدمتك'
    ])
  ) {
    return buildReply(
      `أنا **سنجوب (Sanjoub)** 🐿️، المساعد والمستشار الذكي لمنصة **Tooly.tn**!

مهمتي نعاونك في:
1. 💡 **النصيحة والتوجيه**: ننصحك بأفضل الاشتراكات المناسبة لخدمتك وميزانيتك (ديزاين، برمجة، فيديو، تسويق، قراية).
2. ⚖️ **المقارنة الذكية**: نقارنلك بين الأدوات (مثال: Claude vs ChatGPT، Canva vs Adobe...).
3. 💰 **الأسعار الدقيقة**: نعطيك أسعار كل خطة بالدينار التونسي (TND) مع كامل التفاصيل.
4. 💳 **طرق الخلاص التونسية**: نوضحلك كيفاش تخلص بالـ D17، فلوسي، أو الكارطة البنكية بدون كارت دولية.
5. ⚡ **المتابعة والضمان**: نضمنلك وصول حسابك وتفعيله في أسرع وقت مع ضمان استمرارية كامل.

قلّي، شنوة مجالك باش نعطيك أحسن ترشيحات؟ 🚀`,
      `Ena **Sanjoub** 🐿️, ton conseiller digital w l'assistant intelligent mte3 **Tooly.tn**!

Najem n3awnek fi:
1. 💡 **Conseil personnalisé**: N9ollek chnowa ahsen tools l khdemtek (Design, Dev, Video, Marketing, 9raya).
2. ⚖️ **Comparaison**: N9arenlek bin les outils (Claude vs ChatGPT, Canva vs Adobe...).
3. 💰 **Les prix exacts**: Na3tik les prix bel Dinar Tounsi (TND) sans carte internationale.
4. 💳 **Paiement local**: Nfassarlek kifech tkhallas b D17, Flouci walla Carte.
5. ⚡ **Garantie**: Suivi mte3 el commande w garantie totale 3al durée kemla.

Chnowa domenek lyoum bech n3awnek? 🚀`,
      `Je suis **Sanjoub** 🐿️, votre conseiller digital et assistant officiel de **Tooly.tn** !

Voici ce que je peux faire pour vous :
1. 💡 **Recommandations sur-mesure** : Vous orienter vers les meilleurs abonnements selon votre profil (Design, Dev, Vidéo, Études, Business).
2. ⚖️ **Comparatifs précis** : Analyser les différences (Claude vs ChatGPT, Canva vs Adobe...).
3. 💰 **Tarifs officiels en TND** : Accéder aux vrais prix en Dinars Tunisiens sans carte internationale.
4. 💳 **Moyens de paiement locaux** : Vous guider pour payer facilement par D17, Flouci ou Carte bancaire.
5. ⚡ **Garantie & Support** : Vous accompagner de la commande à l'activation garantie.

Quel est votre projet ou votre métier actuel ? 🚀`,
      `I'm **Sanjoub** 🐿️, your digital tools advisor and official assistant at **Tooly.tn**!

Here is how I can assist you:
1. 💡 **Tailored Recommendations**: Guide you to the best subscriptions for your workflow (Design, Coding, Video, Studies).
2. ⚖️ **Smart Comparisons**: Compare tools head-to-head (Claude vs ChatGPT, Canva vs Adobe).
3. 💰 **Transparent TND Pricing**: Real-time prices in Tunisian Dinars with zero international card hurdles.
4. 💳 **Local Tunisian Payments**: Simple steps to pay with D17, Flouci, or Bank Cards.
5. ⚡ **Guaranteed Continuity**: Full-term warranty and prompt activation.

What is your current workflow or field? 🚀`,
      ['claude-pro', 'cursor-pro', 'canva-pro']
    );
  }

  // 3. PROFESSION: DESIGNER / GRAPHIC DESIGN / UI-UX / SOCIAL MEDIA
  if (
    matchAny(norm, [
      'designer', 'design', 'graphiste', 'graphic', 'social media', 'photoshop', 'illustrator',
      'logo', 'visuel', 'affiche', 'banniere', 'تصميم', 'ديزاينر', 'ديزاين', 'جرافيك', 'مصمم'
    ])
  ) {
    return buildReply(
      `مرحبا بيك يا فنان! 🎨 كـ **Designer**، هاذم أحسن الأدوات المتوفرة في **Tooly.tn** اللي يوفرولك وقت ويزيدوا في جودة خدمتك:

1. 🥇 **Canva Pro** (ابتداءً من **5 د.ت** شهرياً، أو **25 د.ت** لسنتين، أو **30 د.ت** لـ 3 سنوات):
   - تفعيل رسمي ومباشر على بريدك الشخصي.
   - تنحية خلفيات الصور والفيديوهات بضغطة واحدة، ذكاء اصطناعي Magic Studio، وملايين القوالب والخطوط المدفوعة.

2. 🥈 **Adobe Express Premium** (ابتداءً من **10 د.ت** لـ 6 أشهر / **20 د.ت** لسنة):
   - قوالب احترافية فائقة الجودة، خطوط Adobe Fonts كاملة، ومحرك Firefly للذكاء الاصطناعي التوليدي.

3. 🥉 **ChatGPT Plus** (**50 د.ت** شهرياً):
   - لتوليد صور خيالية عبر DALL-E 3، كتابة أفكار الحملات الإعلانية ومحتوى السوشيال ميديا.

اضغط على الروابط في الأسفل لمشاهدة التفاصيل أو إتمام الطلب مباشرة بالـ D17 أو الكارطة! ✨`,
      `Mar7ba bik ya artiste! 🎨 K **Designer**, hadhom a7sen les outils fi **Tooly.tn** elli ytayroulek el khedma:

1. 🥇 **Canva Pro** (men **5 TND** chhar, **25 TND** l 2 ans, walla **30 TND** l 3 snin Team Edu):
   - Activation direct 3la ton email personnel.
   - Background remover b clic wa7da, Magic Studio AI, w 100M+ templates pro.

2. 🥈 **Adobe Express Premium** (**10 TND** l 6 chhour / **20 TND** l 3am kemel):
   - Outils Adobe pro, bibliothéque Adobe Fonts kemla, w Generative AI Firefly.

3. 🥉 **ChatGPT Plus** (**50 TND** / mois):
   - Generation d'images DALL-E 3 tayara w conception de contenu publicitaire.

Chouf les cartes mte3hom louta bech t3adi commande b D17 walla Carte! ✨`,
      `Bienvenue cher designer ! 🎨 En tant que **Designer & Créatif**, voici les solutions phares disponibles sur **Tooly.tn** :

1. 🥇 **Canva Pro** (à partir de **5 TND** / mois, **25 TND** pour 2 ans, ou **30 TND** pour 3 ans Team Edu) :
   - Activé directement sur votre email personnel Canva.
   - Détourage 1-clic photos & vidéos, Magic Studio IA et 100M+ ressources premium.

2. 🥈 **Adobe Express Premium** (**10 TND** pour 6 mois / **20 TND** pour 1 an) :
   - Bibliothèque officielle Adobe Fonts, IA générative Firefly et templates certifiés Adobe.

3. 🥉 **ChatGPT Plus** (**50 TND** / mois) :
   - Idéal pour générer des visuels avec DALL-E 3 et rédiger les briefs créatifs.

Consultez les fiches produits ci-dessous pour commander directement par D17 ou Carte ! ✨`,
      `Welcome creator! 🎨 For **Designers and Graphic Artists**, here are the top recommended passes on **Tooly.tn**:

1. 🥇 **Canva Pro** (Starting at **5 TND** / month, **25 TND** for 2 years, or **30 TND** for 3 years) :
   - Activated on your own personal Canva email.
   - 1-click background remover, Magic Studio AI, and 100M+ assets.

2. 🥈 **Adobe Express Premium** (**10 TND** for 6 months / **20 TND** for 1 year) :
   - Adobe Fonts library, Firefly generative AI, and sleek branding kits.

3. 🥉 **ChatGPT Plus** (**50 TND** / month) :
   - Top-tier DALL-E 3 visual creation and campaign brainstorming.

Explore the product cards below to order with local Tunisian payment! ✨`,
      ['canva-pro', 'adobe-express-premium', 'chatgpt-plus']
    );
  }

  // 4. PROFESSION: DEVELOPER / PROGRAMMER / CODING
  if (
    matchAny(norm, [
      'developer', 'developpeur', 'dev', 'code', 'coding', 'programmeur', 'programmation',
      'python', 'react', 'javascript', 'nextjs', 'backend', 'frontend', 'fullstack', 'ide',
      'برمجة', 'مبرمج', 'كود', 'تطوير', 'اكواد'
    ])
  ) {
    return buildReply(
      `يا أهلاً بالمهندسين والمطورين! 💻 كـ **Developer**، هاذم أقوى 3 أدوات ذكاء اصطناعي للبرمجة في **Tooly.tn**:

1. 🥇 **Cursor Pro** (**89 د.ت** شهرياً):
   - المحرر الذكي رقم 1 في العالم حالياً مبني على VS Code.
   - يفهرس كامل مشروعك (Codebase Indexing)، 500 طلب سريع شهرياً لـ Claude 3.5 Sonnet، وإكمال تلقائي مذهل للأكواد (Multi-line Tab Autocomplete).

2. 🥈 **Claude API** (ابتداءً من **10 د.ت** لـ 10M Tokens / **35 د.ت** لـ 100M Tokens / **70 د.ت** لرصيد 100$):
   - مفتاح API رسمي لنماذج Anthropic (Sonnet 3.5 & Opus) لربط تطبيقاتك وإنشاء وكلاء ذكاء اصطناعي (AI Agents) بتسليم فوري.

3. 🥉 **Claude Pro** (**79 د.ت** شهرياً أو **225 د.ت** لـ 3 أشهر):
   - أفضل ذكاء اصطناعي في المنطق البرمجي وحل المشاكل المعقدة مع نافذة سياق ضخمة 200k وميزة Artifacts للمعاينة الفورية للواجهات.

اختر الأداة المناسبة لك من البطاقات أسفله لطلبها مباشرة! ⚡`,
      `Ahla b jma3et el Dev! 💻 K **Developpeur**, hadhom a9wa 3 outils AI lel coding fi **Tooly.tn**:

1. 🥇 **Cursor Pro** (**89 TND** / mois):
   - L'IDE numéro 1 fel 3alam tawa (built on VS Code).
   - Indexation kemla mte3 el codebase, 500 fast requests Sonnet 3.5, w tab autocomplete tayara.

2. 🥈 **Claude API** (men **10 TND** l 10M Tokens, **35 TND** l 100M Tokens, **70 TND** solde 100$):
   - Clé API officielle Anthropic bch terbot biha tes projets w agents AI b taslim fawri.

3. 🥉 **Claude Pro** (**79 TND** chhar / **225 TND** l 3 chhour):
   - A9wa model fel raisonnement w debug Sonnet 3.5 m3a 200k context w Artifacts.

Ekhtar el tool elli ysa3dek mel cartes louta bech t3adi commande direct! ⚡`,
      `Bienvenue dans l'espace Développeurs ! 💻 En tant que **Dev / Ingénieur**, voici les 3 indispensables sur **Tooly.tn** :

1. 🥇 **Cursor Pro** (**89 TND** / mois) :
   - L'éditeur IA de référence (fork de VS Code).
   - Indexation complète du codebase, 500 requêtes rapides Claude 3.5 Sonnet et autocomplétion intelligente.

2. 🥈 **Claude API** (dès **10 TND** pour 10M Tokens, **35 TND** pour 100M Tokens, ou **70 TND** pour 100$ de crédit) :
   - Clés officielles Anthropic pour intégrer Sonnet 3.5 à vos applications et agents backend.

3. 🥉 **Claude Pro** (**79 TND** / mois ou **225 TND** pour 3 mois) :
   - Le modèle champion en algorithmique, débogage et refactorisation avec le mode Artifacts.

Commandez votre pass ci-dessous pour une livraison rapide en Tunisie ! ⚡`,
      `Welcome developers! 💻 For **Engineers and Programmers**, here are the top 3 AI coding powerhouses on **Tooly.tn**:

1. 🥇 **Cursor Pro** (**89 TND** / month) :
   - The #1 AI code editor globally.
   - Deep codebase indexing, 500 fast Claude 3.5 Sonnet queries/mo, and intelligent tab completion.

2. 🥈 **Claude API** (From **10 TND** for 10M Tokens, **35 TND** for 100M Tokens, **70 TND** for $100 balance) :
   - Official Anthropic API keys for apps, workflows, and autonomous agents.

3. 🥉 **Claude Pro** (**79 TND** / month or **225 TND** for 3 months) :
   - Unmatched algorithmic reasoning with 200k context and interactive Artifacts.

Select your ideal tool below to place your order with D17 or Bank Card! ⚡`,
      ['cursor-pro', 'claude-pro', 'claude-api']
    );
  }

  // 5. PROFESSION: VIDEO CREATOR / TIKTOKER / YOUTUBER
  if (
    matchAny(norm, [
      'video', 'montage', 'capcut', 'tiktok', 'reels', 'youtube', 'vlog', '4k', 'subtitles',
      'content creator', 'creator', 'createur', 'createur de contenu', 'editing', 'edit',
      'فيديو', 'مونتاج', 'تيك توك', 'ريلز', 'يوتيوب', 'صناعة محتوى', 'صانع محتوى'
    ])
  ) {
    return buildReply(
      `يا مرحبا بصناع المحتوى! 🎬 لمونتاج الفيديوهات وصناعة الـ Reels والـ TikTok، هاذم الأدوات الأقوى في تونس:

1. 🥇 **CapCut Pro** (ابتداءً من **20 د.ت** لـ 800 AI Credits، **30 د.ت** لـ 1600 Credits، أو **40 د.ت** لحساب Admin Team مع 5 مقاعد):
   - تصدير الفيديوهات بجودة 4K 60fps بدون أي علامة مائية (Watermark).
   - تفريغ صوتي وترجمة تلقائية ذكية بالعربية والفرنسية (Auto-captions).
   - آلاف التأثيرات والفلاتر وأصوات VIP الحصرية.

2. 🥈 **Canva Pro** (ابتداءً من **5 د.ت** شهرياً / **25 د.ت** لسنتين):
   - لتصميم الصور المصغرة (Thumbnails)، قوالب الستوريات، وتنحية خلفية الفيديوهات بنقرة واحدة.

3. 🥉 **Gemini Plus (Family)** (**30 د.ت** لـ 6 أشهر / **40 د.ت** لسنة):
   - يعطيك **2TB مساحة تخزين سحابية ضخمة** على Google One لتخزين الفيديوهات وملفات المونتاج مع نماذج الذكاء الاصطناعي لكتابة السكربتات.

تفضل بتفقد البطاقات في الأسفل للطلب الفوري! 🌟`,
      `Mar7ba b jma3et el Content Creation! 🎬 Lel montage w reels w tiktoks, hadhom a7sen les tools:

1. 🥇 **CapCut Pro** (men **20 TND** l 800 Credits, **30 TND** l 1600 Credits, walla **40 TND** Admin Team 5 places):
   - Export 4K 60fps sans aucun watermark CapCut.
   - Sous-titrage automatique bil 3arbi w français (Auto-captions).
   - Tous les filtres w effets VIP ma7loulin.

2. 🥈 **Canva Pro** (men **5 TND** chhar / **25 TND** l 2 ans):
   - Miniature YouTube, stories Instagram, w background remover mte3 el video.

3. 🥉 **Gemini Plus (Family)** (**30 TND** l 6 chhour / **40 TND** l 3am):
   - M3ah **2TB stockage fi Google One** bch tsajjel fih tes rushs w videos, m3a AI bch tektob les scripts.

Chouf les cartes louta bech t3adi commande direct! 🌟`,
      `Bienvenue aux créateurs de contenu ! 🎬 Pour vos montages Reels, TikTok et YouTube, voici les indispensables :

1. 🥇 **CapCut Pro** (dès **20 TND** pour 800 Crédits IA, **30 TND** pour 1600 Crédits, ou **40 TND** Admin Team 5 sièges) :
   - Export 4K 60fps garanti sans filigrane.
   - Sous-titres automatiques synchronisés en arabe et français.
   - Tous les effets VIP, transitions et filtres débloqués.

2. 🥈 **Canva Pro** (dès **5 TND** / mois, **25 TND** pour 2 ans) :
   - Parfait pour vos miniatures YouTube, habillages et visuels de promotion.

3. 🥉 **Gemini Plus (Family)** (**30 TND** pour 6 mois / **40 TND** pour 1 an) :
   - Inclut **2 To de stockage Google One** pour archiver vos rushs vidéos et l'IA pour scénariser vos vidéos.

Découvrez les options ci-dessous et commandez en quelques clics ! 🌟`,
      `Welcome content creators! 🎬 For Reels, TikTok, and YouTube video editing, here are the top choices:

1. 🥇 **CapCut Pro** (From **20 TND** for 800 AI Credits, **30 TND** for 1600 Credits, or **40 TND** Team 5 seats) :
   - Watermark-free 4K 60fps export.
   - Smart auto-captions in Arabic, French, and English.
   - Full unlocked VIP effects library.

2. 🥈 **Canva Pro** (From **5 TND** / month, **25 TND** for 2 years) :
   - Stunning YouTube thumbnails and social overlays.

3. 🥉 **Gemini Plus (Family)** (**30 TND** for 6 months / **40 TND** for 1 year) :
   - Includes **2TB Google One cloud storage** for high-res video rushes and scriptwriting AI.

Check out the cards below to order with local payment! 🌟`,
      ['capcut-pro', 'canva-pro', 'gemini-plus-family']
    );
  }

  // 6. PROFESSION: STUDENT / RESEARCHER / EDUCATION
  if (
    matchAny(norm, [
      'student', 'etudiant', 'etudes', 'fac', 'recherche', 'pfe', 'revision', 'ecole', 'lycee',
      'طالب', 'قراية', 'دراسة', 'جامعة', 'بحوث', 'تخرج', 'امتحانات'
    ])
  ) {
    return buildReply(
      `أهلاً بكل الطلبة والباحثين! 🎓 كـ **طالب**، تحب أدوات ذكية قوية ولكن بسعر اقتصادي ومناسب، هاذم أفضل ما ننصحك به في **Tooly.tn**:

1. 🥇 **Gemini Plus (Family)** (**30 د.ت** لـ 6 أشهر / **40 د.ت** لـ 12 شهراً):
   - الصفقة الأفضل للطلبة: ذكاء Google الخارق لتلخيص الـ PDFs والبحوث، مع **2TB مساحة تخزين سحابية Google One** لكامل ملفات دراستك وصورك!

2. 🥈 **ChatGPT Go** (**40 د.ت** لـ 3 أشهر كاملة):
   - اشتراك اقتصادي مدته 3 أشهر كاملة مع سعة رسائل ممتازة، مساعدة في حل التمارين، وتوليد الأفكار.

3. 🥉 **ChatGPT Plus** (**50 د.ت** شهرياً) أو **Claude Pro** (**79 د.ت** شهرياً):
   - إذا كنت تخدم في مشروع تخرج (PFE) أو بحث معمق (Deep Research) يحتاج دقة عالية في المراجع وصياغة الفصول.

4. 🎨 **Canva Pro** (**25 د.ت** لسنتين):
   - لإعداد عروض تقديمية (Presentations / Slides) مذهلة لمشاريعك ودفاعك أمام اللجان.

اختر ما يناسبك واطلب بسهولة بالـ D17 أو الكارطة البنكية! 📚`,
      `Ahla b jma3et el Fac w les étudiants! 🎓 K **Etudiant**, t7eb a7sen tools b a9al soum momken:

1. 🥇 **Gemini Plus (Family)** (**30 TND** l 6 chhour / **40 TND** l 3am kemel):
   - A7sen affaire l etudiant: AI mte3 Google l telkhis el ksob w el PDFs, w m3ah **2TB stockage fi Google One** l tsawrek w dossiers mte3ek!

2. 🥈 **ChatGPT Go** (**40 TND** l 3 chhour kemlin):
   - Soum tayara l 3 chhour, y3awnek fel 9raya w les devoirs.

3. 🥉 **ChatGPT Plus** (**50 TND** / mois) walla **Claude Pro** (**79 TND** / mois):
   - Ken 3andek PFE walla recherche scientifique 3mi9a t7eb fiha a3la de99a.

4. 🎨 **Canva Pro** (**25 TND** l 2 ans):
   - Lel présentations PowerPoint mte3ek w les soutenances.

Chouf les options louta w 3addi commande b D17 walla Flouci! 📚`,
      `Bienvenue chers étudiants et chercheurs ! 🎓 Pour vos études, PFE et révisions, voici les formules les plus avantageuses :

1. 🥇 **Gemini Plus (Family)** (**30 TND** pour 6 mois / **40 TND** pour 1 an) :
   - Le meilleur rapport qualité/prix : synthèse de documents PDF, recherche avancée, et **2 To de stockage Google One** inclus pour vos cours et projets.

2. 🥈 **ChatGPT Go** (**40 TND** pour 3 mois complets) :
   - Très économique pour un usage quotidien tout au long du semestre.

3. 🥉 **ChatGPT Plus** (**50 TND** / mois) ou **Claude Pro** (**79 TND** / mois) :
   - Indispensable pour la rédaction d'un PFE, la programmation académique et les mémoires.

4. 🎨 **Canva Pro** (**25 TND** pour 2 ans) :
   - Pour créer des présentations orales percutantes sans effort.

Sélectionnez votre offre ci-dessous et réglez facilement par D17 ou Carte ! 📚`,
      `Welcome students and researchers! 🎓 For your academic studies, PFE, and research, here are the top cost-effective picks:

1. 🥇 **Gemini Plus (Family)** (**30 TND** for 6 months / **40 TND** for 1 year) :
   - The ultimate student value: deep document summarization plus **2TB Google One cloud storage**.

2. 🥈 **ChatGPT Go** (**40 TND** for 3 full months) :
   - Budget-friendly, extended access for coursework and semester revisions.

3. 🥉 **ChatGPT Plus** (**50 TND** / mo) or **Claude Pro** (**79 TND** / mo) :
   - Premier choice for thesis writing, rigorous coding, and complex research.

4. 🎨 **Canva Pro** (**25 TND** for 2 years) :
   - Outstanding visual presentations for your defenses and projects.

Order your student pass below with convenient local payment! 📚`,
      ['gemini-plus-family', 'chatgpt-go', 'canva-pro']
    );
  }

  // 7. PRODUCT COMPARISON: CLAUDE VS CHATGPT ("Chnowa lfar9 bin Claude w ChatGPT?", "Claude wala ChatGPT?")
  if (
    matchAny(norm, [
      'far9 bin claude', 'far9 mabin claude', 'difference entre claude', 'claude wala chatgpt',
      'claude walla chatgpt', 'chatgpt wala claude', 'difference between claude and chatgpt',
      'مقارنة بين كلود وشات', 'الفرق بين كلود وشات', 'كلود ولا شات جي بي تي', 'كلود ولا شات'
    ])
  ) {
    return buildReply(
      `سؤال ممتاز ومهم جداً! ⚖️ إليك المقارنة الدقيقة بين **Claude Pro** و **ChatGPT Plus** حسب استخدامك:

🧠 **Claude Pro (Anthropic) — 79 د.ت / شهر**:
- **الأقوى في**: البرمجة الدقيقة (Coding)، حل المشاكل المنطقية المعقدة، وتحليل الملفات والمستندات الضخمة (نافذة سياق 200,000 كلمة!).
- **الميزة الحصرية**: واجهة **Artifacts** التي تتيح لك معاينة الكود وتطبيقات React والـ SVGs مباشرة بجانب المحادثة.
- **الأنسب لـ**: المطورين، الباحثين، وكتاب المحتوى التحليلي المعقد.

🎨 **ChatGPT Plus (OpenAI) — 50 د.ت / شهر**:
- **الأقوى في**: التنوع الشامل، البحث المعمق على الويب (Deep Research)، وتوليد الصور فائقة الجودة عبر **DALL-E 3**.
- **الميزات الحصرية**: المحادثات الصوتية المباشرة (Advanced Voice Mode)، ومحرر النصوص والأكواد **Canvas**.
- **الأنسب لـ**: من يبحث عن أداة شاملة لكل شيء (كتابة، صور، صوت، وتوليد أفكار).

💡 **خلاصة سنجوب**: إذا كان تركيزك الأساسي على البرمجة والمنطق الدقيق اختر **Claude Pro**، وإذا تحب أداة متعددة المواهب مع توليد الصور اختر **ChatGPT Plus**!`,
      `Sou'el tayara barcha! ⚖️ Hak el comparaison el s7i7a bin **Claude Pro** w **ChatGPT Plus**:

🧠 **Claude Pro (Anthropic) — 79 TND / mois**:
- **A9wa fi**: Coding el s3ib, raisonnement logique, w analyse mte3 de gros documents (200k tokens context).
- **Mizet el Artifacts**: Ykhallik tchouf el code w les interfaces React direct 9odemik.
- **A7sen l**: Les développeurs, les ingénieurs, w les chercheurs.

🎨 **ChatGPT Plus (OpenAI) — 50 TND / mois**:
- **A9wa fi**: Polyvalence, recherche 3al web, w generation d'images tayara b **DALL-E 3**.
- **Options mouch normal**: Voice mode direct, w editor Canvas.
- **A7sen l**: Elli y7eb outil polyvalent l kol chay (tsawer, ktiba, vocal, w recherche).

💡 **Khlasset Sanjoub**: Ken khedmtek coding w raisonnement s3ib, khoudh **Claude Pro**. Ken t7eb kol chay fard waqt m3a tsawer DALL-E 3, khoudh **ChatGPT Plus**!`,
      `Excellente question comparative ! ⚖️ Voici la vraie différence entre **Claude Pro** et **ChatGPT Plus** :

🧠 **Claude Pro (Anthropic) — 79 TND / mois** :
- **Points forts** : Roi incontesté du code propre, logique mathématique, et analyse de très longs documents (contexte 200k tokens).
- **Fonctionnalité clé** : Le mode **Artifacts** pour tester vos composants et codes en temps réel.
- **Idéal pour** : Développeurs, architectes logiciels, chercheurs et analystes.

🎨 **ChatGPT Plus (OpenAI) — 50 TND / mois** :
- **Points forts** : Polyvalence maximale, génération d'images avec **DALL-E 3**, et navigation web avec Deep Research.
- **Fonctionnalités clés** : Mode vocal fluide et espace d'édition **Canvas**.
- **Idéal pour** : Créateurs de contenu, marketing, et utilisateurs polyvalents.

💡 **Le conseil de Sanjoub** : Pour le développement informatique et l'analyse poussée, choisissez **Claude Pro**. Pour la création multimédia et la polyvalence, optez pour **ChatGPT Plus** !`,
      `Great comparison question! ⚖️ Here is the exact breakdown between **Claude Pro** and **ChatGPT Plus**:

🧠 **Claude Pro (Anthropic) — 79 TND / month** :
- **Excels at**: Superior algorithmic reasoning, clean code generation, and massive 200k token context document digestion.
- **Exclusive Feature**: **Artifacts** for live code, SVG, and React UI rendering.
- **Best for**: Developers, engineers, researchers, and technical writers.

🎨 **ChatGPT Plus (OpenAI) — 50 TND / month** :
- **Excels at**: Overall versatility, web research, and vivid image generation with **DALL-E 3**.
- **Exclusive Features**: Advanced Voice Mode conversations and interactive Canvas editor.
- **Best for**: Content creators, marketers, and all-around daily productivity.

💡 **Sanjoub's Verdict**: Choose **Claude Pro** for serious programming and analytical depth; choose **ChatGPT Plus** for creative visuals and all-around tasks!`,
      ['claude-pro', 'chatgpt-plus']
    );
  }

  // 8. FOLLOW-UP COMPARISON FOR CODING ("Anhouma ahsen lel coding?")
  if (
    matchAny(norm, [
      'anhouma ahsen lel coding', 'anhouma ahsen fel code', 'lequel est meilleur pour coder',
      'which is better for coding', 'quel est le meilleur pour le code', 'شكون احسن في البرمجة', 'انهي افضل للكود'
    ])
  ) {
    return buildReply(
      `للبرمجة والكودينغ تحديداً، الإجابة واضحة وموثوقة! 💻⚡

🥇 **المرتبة الأولى عالمياً**: **Claude 3.5 Sonnet** (سواء عبر **Cursor Pro** بسعر 89 د.ت، أو **Claude Pro** بسعر 79 د.ت، أو **Claude API**):
- يفهم هيكلية المشاريع البرمجية بدقة لا تضاهى، ويكتب كوداً نظيفاً بدون أخطاء متكررة.
- مع **Cursor Pro** يندمج مباشرة في الـ IDE ويفهرس ملفات مشروعك بالكامل.

🥈 **المرتبة الثانية**: **ChatGPT Plus** (50 د.ت):
- ممتاز جداً مع ميزة **Canvas** ومفيد لشرح الأكواد والـ Scripting السريع، لكن في المشاريع الكبيرة Claude 3.5 Sonnet يتفوق عليه في المنطق.

💡 **نصيحة سنجوب**: للمطورين خذ **Cursor Pro** أو **Claude Pro**، وسترى فرقاً هائلاً في إنتاجيتك!`,
      `Lel coding w el programmation bel thadhet, l'ijaba wadh7a! 💻⚡

🥇 **Numéro 1 fel 3alam**: **Claude 3.5 Sonnet** (soit fi **Cursor Pro** b 89 TND, **Claude Pro** b 79 TND, walla **Claude API**):
- Yefhem el structure mte3 el code b de99a kbira w ya3tik code nthif min ghir aghlat.
- M3a **Cursor Pro** ykoun direct fel éditeur mte3ek w yefhem el projet kemel.

🥈 **Numéro 2**: **ChatGPT Plus** (50 TND):
- Tayara barcha b Canvas w y3awnek fel scripts el sghar, ama fel projets el kbar Claude Sonnet yourbou7.

💡 **Nsi7et Sanjoub**: Kenek dev, khoudh **Cursor Pro** walla **Claude Pro** w tfakkarni!`,
      `Pour le code et la programmation spécifiquement, voici le classement indiscutable ! 💻⚡

🥇 **N°1 Mondial** : **Claude 3.5 Sonnet** (accessible via **Cursor Pro** à 89 TND, **Claude Pro** à 79 TND, ou les **API Claude**) :
- Il surpasse tous ses rivaux en précision algorithmique, refactorisation et propreté de code.
- Dans **Cursor Pro**, il s'intègre nativement à votre flux de travail de développeur.

🥈 **N°2** : **ChatGPT Plus** (50 TND) :
- Très compétent avec son mode Canvas pour du prototypage, mais moins rigoureux que Sonnet sur les projets complexes.

💡 **Le conseil de Sanjoub** : Si vous écrivez du code quotidiennement, **Cursor Pro** ou **Claude Pro** est le choix évident !`,
      `For programming and software development, the verdict is definitive! 💻⚡

🥇 **The Gold Standard**: **Claude 3.5 Sonnet** (available via **Cursor Pro** at 89 TND, **Claude Pro** at 79 TND, or **Claude API**) :
- Consistently tops developer benchmarks for precision, edge-case handling, and zero-hallucination code.
- Coupled with **Cursor Pro**, it indexes your entire local codebase.

🥈 **Second Place**: **ChatGPT Plus** (50 TND) :
- Capable with its Canvas interface, but Sonnet remains superior on complex multi-file architectural tasks.

💡 **Sanjoub's Recommendation**: Grab **Cursor Pro** or **Claude Pro** for serious programming!`,
      ['cursor-pro', 'claude-pro']
    );
  }

  // 9. PRICE INQUIRY WITH ANAPHORA RESOLUTION ("9adech soumou?", "Combien ça coûte ?", "بقداش سومو؟")
  const isAnaphoraPrice =
    matchAny(norm, ['9adech soumou', '9adech soumo', 'soumou 9adech', 'b9adeh', 'combien coute', 'quel est son prix', 'how much is it', 'بقداش سومو', 'قداش سومو', 'قداش يعمل', 'شنوة سومو']) ||
    (norm.includes('9adech') && norm.split(' ').length <= 3) ||
    (norm.includes('soum') && norm.split(' ').length <= 3) ||
    (norm.includes('prix') && norm.split(' ').length <= 3);

  if (isAnaphoraPrice && lastContextProduct) {
    const prod = SANJOUB_CATALOG.find((p) => p.slug === lastContextProduct) || SANJOUB_CATALOG[0];
    const pricesListAr = prod.pricingVariants.map((v) => `• **${v.labelAr}**`).join('\n');
    const pricesListFr = prod.pricingVariants.map((v) => `• **${v.labelFr}**`).join('\n');
    const pricesListEn = prod.pricingVariants.map((v) => `• **${v.labelEn}**`).join('\n');

    return buildReply(
      `بالنسبة لاشتراك **${prod.name}**، هاذم الأسعار الرسمية المتوفرة في **Tooly.tn**:

${pricesListAr}

⚡ **طريقة التسليم**: ${prod.tagline.ar}
🛡️ **الضمان**: ضمان كامل وشامل على طول فترة الاشتراك مع دعم فني تونسي سريع 7/7!

تحب تطلب الآن بالـ D17 أو الكارطة البنكية؟ اضغط على البطاقة في الأسفل! ✨`,
      `Concernant l'abonnement **${prod.name}**, hadhom les prix officiels fi **Tooly.tn**:

${pricesListFr}

⚡ **Livraison**: ${prod.tagline.arabizi}
🛡️ **Garantie**: Garantie kemla 3al durée mte3 el abonnement w support tounsi 7/7!

T7eb t3addi commande direct b D17 walla Carte? Chouf el carte louta! ✨`,
      `Concernant l'abonnement **${prod.name}**, voici les tarifs officiels sur **Tooly.tn** :

${pricesListFr}

⚡ **Livraison** : ${prod.tagline.fr}
🛡️ **Garantie** : Remplacement garanti et assistance locale 7j/7 !

Vous pouvez commander directement via la carte ci-dessous : ✨`,
      `Regarding the **${prod.name}** subscription, here are the official prices on **Tooly.tn**:

${pricesListEn}

⚡ **Delivery** : ${prod.tagline.en}
🛡️ **Guarantee** : Full-term warranty and 7/7 local customer support!

Click below to place your order with local payment! ✨`,
      [prod.slug]
    );
  }

  // 10. SPECIFIC PRODUCT PRICING: CANVA PRO
  if (matchAny(norm, ['canva', 'كانفا'])) {
    return buildReply(
      `اشتراك **Canva Pro** في **Tooly.tn** من أكثر الاشتراكات طلباً وضماناً! 🎨

💰 **الأسعار المتوفرة**:
• **5.0 د.ت** / شهر واحد (1 mois)
• **25.0 د.ت** / سنتان (2 ans - العرض الأكثر توفيراً!)
• **30.0 د.ت** / 3 سنوات (Team Edu)

✨ **المزايا والتسليم**:
- التفعيل رسمي ومباشر على **بريدك الشخصي** المسجل في Canva دون تغيير حسابك.
- إزالة خلفيات الصور والفيديو بضغطة واحدة، ذكاء اصطناعي Magic Studio، وملايين القوالب المدفوعة.
- ضمان استمرارية كامل طيلة مدة الاشتراك!`,
      `L'abonnement **Canva Pro** fi **Tooly.tn** a7sen affaire momkna! 🎨

💰 **Les prix disponibles**:
• **5.0 TND** / mois (1 chhar)
• **25.0 TND** / 2 ans (L'offre la plus populaire!)
• **30.0 TND** / 3 ans (Team Edu)

✨ **Les avantages**:
- Activation officielle direct 3la **ton email personnel** fi Canva.
- Background remover mte3 tsawer w video, Magic Studio AI, w 100M+ templates.
- Garantie kemla 3al durée!`,
      `L'abonnement **Canva Pro** officiel sur **Tooly.tn** : 🎨

💰 **Tarifs disponibles** :
• **5.0 TND** / 1 mois
• **25.0 TND** / 2 ans (L'offre best-seller recommandée !)
• **30.0 TND** / 3 ans (Team Edu)

✨ **Avantages & Modalités** :
- Activé directement sur votre **adresse email personnelle** Canva.
- Détourage photo/vidéo en 1 clic, Magic Studio IA et ressources illimitées.
- Garantie intégrale pendant toute la durée souscrite.`,
      `Official **Canva Pro** subscription on **Tooly.tn**: 🎨

💰 **Available Plans**:
• **5.0 TND** / 1 month
• **25.0 TND** / 2 years (Best value package!)
• **30.0 TND** / 3 years (Team Edu)

✨ **Key Features**:
- Activated directly on your **existing personal Canva email**.
- One-click photo and video background remover & Magic Studio.
- Full duration continuity guarantee.`,
      ['canva-pro']
    );
  }

  // 11. SPECIFIC PRODUCT PRICING: CLAUDE PRO
  if (matchAny(norm, ['claude pro', 'كلود برو', 'claude sonnet']) || (norm.includes('claude') && !norm.includes('api'))) {
    return buildReply(
      `اشتراك **Claude Pro (Anthropic)** في **Tooly.tn**: 🧠

💰 **الأسعار**:
• **79.0 د.ت** / شهر واحد (1 mois)
• **225.0 د.ت** / 3 أشهر (3 mois)

✨ **المزايا والتسليم**:
- نموذج **Claude 3.5 Sonnet** الأقوى في التحليل والبرمجة وحل المشاكل المعقدة.
- نافذة سياق ضخمة 200,000 كلمة، مشاريع Projects، وميزة **Artifacts**.
- دعوة رسمية لمساحة عمل موثقة على إيميلك في أقل من 15 دقيقة بعد الخلاص!`,
      `Abonnement **Claude Pro (Anthropic)** fi **Tooly.tn**: 🧠

💰 **Les prix**:
• **79.0 TND** / mois
• **225.0 TND** / 3 mois

✨ **Les avantages**:
- Model **Claude 3.5 Sonnet** a9wa AI fel coding w raisonnement s3ib.
- 200,000 context window, mode Projects, w feature **Artifacts**.
- Invitation officielle 3la ton email fi a9al men 15 d9i9a avec garantie!`,
      `Abonnement **Claude Pro (Anthropic)** officiel sur **Tooly.tn** : 🧠

💰 **Tarifs** :
• **79.0 TND** / 1 mois
• **225.0 TND** / 3 mois

✨ **Avantages & Spécifications** :
- Accès illimité à **Claude 3.5 Sonnet**, champion du code et de l'analyse logique.
- Contexte géant de 200k tokens, mode Artifacts et espaces Projets.
- Invitation officielle livrée en moins de 15 minutes avec garantie complète.`,
      `Official **Claude Pro (Anthropic)** on **Tooly.tn**: 🧠

💰 **Pricing**:
• **79.0 TND** / 1 month
• **225.0 TND** / 3 months

✨ **Key Features**:
- Access to **Claude 3.5 Sonnet**, the world's finest coding & reasoning model.
- 200k tokens context window, Projects spaces, and interactive Artifacts.
- Official invite delivered in under 15 minutes with full guarantee.`,
      ['claude-pro']
    );
  }

  // 12. SPECIFIC PRODUCT PRICING: CHATGPT PLUS & GO
  if (matchAny(norm, ['chatgpt', 'gpt 4', 'gpt4', 'chat gpt', 'شات جي بي تي', 'شات'])) {
    return buildReply(
      `اشتراكات **ChatGPT (OpenAI)** الرسمية في **Tooly.tn**: 🤖

💰 **الخطط والأسعار المتوفرة**:
• **ChatGPT Plus**: **50.0 د.ت** / شهر واحد (حساب خاص Email + Password + 2FA مع مزايا GPT-4o، توليد الصور DALL-E 3، محادثات صوتية فورية، وأداة Canvas).
• **ChatGPT Go**: **40.0 د.ت** / 3 أشهر كاملة (خطة اقتصادية بسعة استخدام ممتازة للطلبة والأعمال اليومية).

⚡ **التسليم**: تسليم فوري لبيانات الحساب الخاص مع ضمان 100% طوال المدة!`,
      `Les abonnements **ChatGPT (OpenAI)** fi **Tooly.tn**: 🤖

💰 **Les offres disponibles**:
• **ChatGPT Plus**: **50.0 TND** / mois (Compte privé Email + Password + 2FA avec GPT-4o, DALL-E 3, Voice Mode w Canvas).
• **ChatGPT Go**: **40.0 TND** / 3 chhour kemlin (Solution économique tayara).

⚡ **Livraison**: Compte privé sécurisé fi a9al men 30 minutes avec garantie kemla!`,
      `Abonnements officiels **ChatGPT (OpenAI)** sur **Tooly.tn** : 🤖

💰 **Formules disponibles** :
• **ChatGPT Plus** : **50.0 TND** / mois (Compte dédié Email + MDP + 2FA, GPT-4o, DALL-E 3, mode vocal avancé et Canvas).
• **ChatGPT Go** : **40.0 TND** pour 3 mois complets (Idéal pour un usage régulier économique).

⚡ **Livraison** : Compte sécurisé livré rapidement avec garantie intégrale.`,
      `Official **ChatGPT (OpenAI)** packages on **Tooly.tn**: 🤖

💰 **Available Plans**:
• **ChatGPT Plus**: **50.0 TND** / month (Private account with GPT-4o, DALL-E 3, Voice Mode, and Canvas).
• **ChatGPT Go**: **40.0 TND** for 3 months (Cost-effective extended plan).

⚡ **Delivery**: Fast delivery with 100% continuity guarantee!`,
      ['chatgpt-plus', 'chatgpt-go']
    );
  }

  // 13. SPECIFIC PRODUCT PRICING: CAPCUT PRO
  if (matchAny(norm, ['capcut', 'كاب كات', 'كابكات'])) {
    return buildReply(
      `اشتراك **CapCut Pro** الرسمي في **Tooly.tn**: 🎬

💰 **الأسعار المتوفرة**:
• **20.0 د.ت** (~800 AI Credits)
• **30.0 د.ت** (1600 AI Credits)
• **40.0 د.ت** Admin Team (5 مقاعد / 5 Seats)

✨ **الميزات**:
- تصدير 4K 60fps بدون علامة مائية نهائياً.
- تفريغ صوتي وترجمة ذكية تلقائية باللغة العربية والفرنسية (Auto-captions).
- فتح جميع فلاتر وتأثيرات وأصوات VIP الحصرية مع ضمان 30 يوماً!`,
      `L'abonnement **CapCut Pro** fi **Tooly.tn**: 🎬

💰 **Les prix disponibles**:
• **20.0 TND** (~800 Crédits IA)
• **30.0 TND** (1600 Crédits IA)
• **40.0 TND** Admin Team (5 places)

✨ **Les avantages**:
- Export 4K 60fps sans watermark CapCut.
- Sous-titres automatiques bil 3arbi w français.
- Tous les effets w filtres VIP ma7loulin avec garantie!`,
      `L'abonnement **CapCut Pro** officiel sur **Tooly.tn** : 🎬

💰 **Tarifs disponibles** :
• **20.0 TND** (~800 Crédits IA)
• **30.0 TND** (1600 Crédits IA)
• **40.0 TND** Formule Admin Team (5 comptes)

✨ **Fonctionnalités** :
- Exportation 4K 60fps sans filigrane.
- Sous-titrage automatique intelligent en arabe et français.
- Tous les filtres et effets VIP débloqués avec garantie.`,
      `Official **CapCut Pro** on **Tooly.tn**: 🎬

💰 **Pricing**:
• **20.0 TND** (~800 AI Credits)
• **30.0 TND** (1600 AI Credits)
• **40.0 TND** Admin Team (5 seats)

✨ **Features**:
- Watermark-free 4K 60fps export.
- Auto-captions in Arabic, French, and English.
- Full VIP transition and effects library with warranty.`,
      ['capcut-pro']
    );
  }

  // 14. SPECIFIC PRODUCT PRICING: CURSOR PRO
  if (matchAny(norm, ['cursor', 'كرسور', 'ide'])) {
    return buildReply(
      `محرر الأكواد الذكي **Cursor Pro** في **Tooly.tn**: ⚡💻

💰 **السعر**: **89.0 د.ت** / شهر واحد (1 mois)

✨ **المزايا**:
- بيئة التطوير رقم 1 عالمياً المبنية على VS Code لزيادة إنتاجية المبرمجين بنسبة 300%.
- 500 طلب سريع شهرياً لنموذج **Claude 3.5 Sonnet**.
- فهرسة ذكية لكامل مشروعك البرمجي (Full Codebase Indexing) وإكمال تلقائي مذهل للأكواد.`,
      `L'éditeur de code **Cursor Pro** fi **Tooly.tn**: ⚡💻

💰 **Le prix**: **89.0 TND** / mois

✨ **Les options**:
- L'IDE AI numéro 1 fel 3alam (VS Code fork).
- 500 fast requests fi chhar b Claude 3.5 Sonnet.
- Full codebase indexing w multi-line tab autocomplete tayara barcha!`,
      `L'éditeur IA révolutionnaire **Cursor Pro** sur **Tooly.tn** : ⚡💻

💰 **Tarif** : **89.0 TND** / mois

✨ **Points forts** :
- L'IDE n°1 des développeurs mondiaux basé sur VS Code.
- 500 requêtes ultra-rapides chaque mois sur Claude 3.5 Sonnet.
- Indexation complète du codebase et autocomplétion multi-lignes.`,
      `The premier AI code editor **Cursor Pro** on **Tooly.tn**: ⚡💻

💰 **Price**: **89.0 TND** / month

✨ **Highlights**:
- World's top AI-native IDE built on VS Code.
- 500 fast monthly queries powered by Claude 3.5 Sonnet.
- Whole codebase indexing and smart multi-line autocomplete.`,
      ['cursor-pro']
    );
  }

  // 15. PAYMENT METHODS: D17, FLOUCI, CARTE BANCAIRE, SOBFLOUS
  if (
    matchAny(norm, [
      'd17', 'd 17', 'flouci', 'sobflous', 'carte', 'paiement', 'payer', 'kifech nkhallas',
      'kifech n5allas', 'tari9at el daf3', 'moyen de paiement', 'payment method', 'خلاص', 'دفع', 'كيفاش نخلص', 'طرق الدفع'
    ])
  ) {
    return buildReply(
      `طرق الدفع في **Tooly.tn** محلية 100% ومصممة باش تناسب أي مواطن في تونس دون الحاجة لبطاقة بنكية دولية! 🇹🇳💳

1. 📮 **D17 (البريد التونسي)**:
   - عبر تطبيق D17 في ثوانٍ معدودة، أو تحويل مباشر في أقرب مكتب بريد (Mandat Minute).
2. 📱 **فلوسي (Flouci)**:
   - مسح رمز الـ QR Code أو تحويل فوري ومجاني عبر تطبيق Flouci على هاتفك.
3. 💳 **البطاقات البنكية التونسية**:
   - بطاقات ClicToPay، بنك الزيتونة، BIAT، Attijari، UIB، Visa، Mastercard المحلية، وبطاقة e-Dinar.
4. 🪙 **Sobflous**:
   - شحن واقتطاع فوري عبر محفظتك على Sobflous.
5. 🏦 **التحويلات البنكية (Virement Bancaire)**:
   - متاح للشركات والوكالات مع توفير فاتورة رسمية (Facture légale).

بعد إتمام الدفع، يتم تفعيل اشتراكك في غضون 5 إلى 60 دقيقة! ✨`,
      `Les moyens de paiement fi **Tooly.tn** 100% tounsiya men ghir carte internationale! 🇹🇳💳

1. 📮 **D17 (La Poste Tunisienne)**:
   - Directement 3al application D17 walla fi a9reb bureau de poste.
2. 📱 **Flouci**:
   - Scan QR Code walla virement direct via l'application Flouci.
3. 💳 **Cartes Bancaires Tunisiennes**:
   - ClicToPay, e-Dinar, Visa w Mastercard mte3 les banques tunisiennes.
4. 🪙 **Sobflous**:
   - Paiement direct via ton solde Sobflous.
5. 🏦 **Virement Bancaire**:
   - Pour les sociétés w freelances avec facture légale officielle.

Ba3d el khlas, el compte mte3ek yethal fi bin 5 w 60 d9i9a! ✨`,
      `Modes de paiement sur **Tooly.tn** : 100% locaux sans carte internationale ! 🇹🇳💳

1. 📮 **D17 (Poste Tunisienne)** :
   - Via l'application D17 en quelques secondes ou mandat en bureau de poste.
2. 📱 **Flouci** :
   - Par scan de QR Code instantané ou transfert in-app.
3. 💳 **Cartes bancaires tunisiennes** :
   - ClicToPay, e-Dinar, cartes Visa/Mastercard de toutes les banques tunisiennes.
4. 🪙 **Sobflous** :
   - Débit direct sécurisé via votre compte Sobflous.
5. 🏦 **Virement bancaire** :
   - Facturation conforme pour entreprises, agences et indépendants.

Votre commande est validée et livrée sous 5 à 60 minutes ! ✨`,
      `Payment methods on **Tooly.tn** are 100% local with zero international card barriers! 🇹🇳💳

1. 📮 **D17 (Tunisia Post)**:
   - Instant transfer via the D17 mobile app or local post office wire.
2. 📱 **Flouci**:
   - Fast QR code scan or direct in-app transfer.
3. 💳 **Tunisian Bank Cards**:
   - ClicToPay, e-Dinar, and domestic Visa/Mastercard.
4. 🪙 **Sobflous**:
   - Seamless debit from your Sobflous digital wallet.
5. 🏦 **Bank Wire**:
   - Official tax invoices provided for agencies and businesses.

Activation is delivered within 5 to 60 minutes after confirmation! ✨`,
      undefined,
      {
        ar: ['الاشتراكات المتوفرة', 'وقت التسليم', 'فمّا ضمان؟', 'واتساب الدعم'],
        arabizi: ['Abonnements disponibles', 'Delai livraison', 'Thamma garantie?', 'Support WhatsApp'],
        fr: ['Abonnements disponibles', 'Délai de livraison', 'Garantie', 'Support WhatsApp'],
        en: ['Available subscriptions', 'Delivery time', 'Guarantee', 'WhatsApp Support'],
      }
    );
  }

  // 16. DELIVERY TIME & GUARANTEE ("Waqtech tousel?", "Famma garantie?", "Livraison")
  if (
    matchAny(norm, [
      'livraison', 'waqtech', 'delai', 'wa9tech', 'waqt', 'toussel', 'garantie', 'dhaman',
      'remboursement', 'ارسال', 'توصيل', 'وقتاش', 'ضمان', 'استرجاع', 'امان'
    ])
  ) {
    return buildReply(
      `في **Tooly.tn**، نعتمد على أعلى معايير الأمان والسرعة في تونس: 🛡️⚡

⏱️ **أوقات التسليم**:
- أغلب الاشتراكات يتم تفعيلها بين **5 و 60 دقيقة** بعد تأكيد الخلاص.
- الحد الأقصى الاستثنائي لا يتجاوز 4 ساعات (خدمة دعم متواصلة 7 أيام في الأسبوع من 09:00 إلى 23:00).

🛡️ **الضمان الحقيقي (100% Full Continuity Guarantee)**:
- كامل فترة اشتراكك مضمونة ومحمية من قبل Tooly.tn.
- في حال حدوث أي انقطاع غير متوقع، فريقنا يقوم بالتعويض الفوري لحسابك أو استرجاع أموالك.

📦 **تتبع الطلبات**:
- يمكنك متابعة حالة طلبك مباشرة على صفحة التتبع: \`/order/lookup\` بإدخال رقم الطلب ورقم هاتفك أو إيميلك.`,
      `Fi **Tooly.tn**, el confiance w el rapidite houma el asess: 🛡️⚡

⏱️ **Delai de livraison**:
- Akthariyat les abonnements yetfashlou bin **5 w 60 d9i9a** ba3d el khlas.
- Maximum absolu 4h fi les cas exceptionnels (support dispo 7/7 men 09:00 l 23:00).

🛡️ **Garantie kemla (100% Continuity)**:
- Toute la période de ton abonnement est garantie par Tooly.tn.
- Ken ysiir ay mochkel fi ay waqt, na3mloulek remplacement immédiat walla remboursement.

📦 **Suivi de commande**:
- Tnajjem ttabba3 commande mte3ek direct 3al lien: \`/order/lookup\`!`,
      `Chez **Tooly.tn**, la réactivité et la garantie sont au cœur de nos engagements : 🛡️⚡

⏱️ **Délais de livraison** :
- La grande majorité des abonnements sont activés en **5 à 60 minutes**.
- Délai maximal garanti de 4 heures (équipe de support joignable 7j/7 de 09h00 à 23h00).

🛡️ **Garantie de continuité à 100%** :
- Chaque jour de votre abonnement est couvert et garanti.
- En cas de souci technique avec l'éditeur, remplacement immédiat sans frais ou remboursement.

📦 **Suivi de commande en temps réel** :
- Vérifiez l'avancement de votre commande sur \`/order/lookup\` avec votre référence.`,
      `At **Tooly.tn**, security and speed are our highest commitments: 🛡️⚡

⏱️ **Delivery Timeframes**:
- Most subscriptions are activated within **5 to 60 minutes**.
- Guaranteed maximum turnaround of 4 hours (support available 7/7 from 09:00 to 23:00).

🛡️ **100% Continuity Warranty**:
- Every day of your plan is fully backed and supported by Tooly.tn.
- Instant replacement or full refund if any vendor disruption occurs.

📦 **Live Order Tracking**:
- Check status anytime at \`/order/lookup\` with your Order ID.`,
      undefined,
      {
        ar: ['تتبع الطلب', 'الاشتراكات المتوفرة', 'كيفاش نخلص بالـ D17؟', 'تواصل عبر واتساب'],
        arabizi: ['Suivi de commande', 'Abonnements disponibles', 'Paiement D17', 'WhatsApp Support'],
        fr: ['Suivre ma commande', 'Abonnements disponibles', 'Comment payer par D17 ?', 'Support WhatsApp'],
        en: ['Track order', 'Available subscriptions', 'Pay with D17', 'WhatsApp Support'],
      },
      {
        label: {
          ar: 'تتبع طلبي الآن',
          arabizi: 'Taba3 commande mte3i',
          fr: 'Suivre ma commande',
          en: 'Track my order',
        },
        href: `/${loc}/order/lookup`,
      }
    );
  }

  // 17. PRODUCTS NOT OFFICIALLY CATALOGUED (Netflix, Midjourney, Grammarly, Zoom, etc.)
  if (
    matchAny(norm, [
      'netflix', 'midjourney', 'grammarly', 'zoom', 'prime video', 'nordvpn', 'expressvpn',
      'office 365', 'windows', 'adobe full', 'creative cloud', 'coursera', 'linkedin'
    ])
  ) {
    return buildReply(
      `أهلاً بك! بخصوص استفسارك حول توفر هذا الحساب أو الاشتراك:

نعم! في **Tooly.tn** يمكننا توفير اشتراكات خاصة عند الطلب (Sur Demande) لعدة خدمات مثل Midjourney, Netflix, Grammarly, LinkedIn وغيرها، مع ضمان كامل وخلاص بالدينار التونسي.

تفضل بمراسلة فريق الدعم المباشر على **الواتساب (+216 50 000 000)** أو عبر صفحة **الاتصال بنا** (\`/contact\`) وسنوفر لك الحساب والسعر المناسب في دقائق! ✨`,
      `Ahla bik! Concernant cet abonnement ou service particulier:

Ey! Fi **Tooly.tn** najmou nwafrourlik des abonnements sur demande (Midjourney, Netflix, Grammarly, LinkedIn...) avec garantie kemla w khlas bel Dinar Tounsi!

Ab3ath l'équipe mte3na direct 3al **WhatsApp (+216 50 000 000)** walla via el page **Contact** (\`/contact\`) w yjawbouk fi d9aye9! ✨`,
      `Bonjour ! Concernant votre demande pour cet abonnement spécifique :

Oui ! Chez **Tooly.tn**, nous pouvons fournir des abonnements sur-mesure sur demande (Midjourney, Netflix, Grammarly, LinkedIn...) avec garantie complète et paiement local en TND.

Contactez directement notre équipe sur **WhatsApp au +216 50 000 000** ou via notre page **Contact** (\`/contact\`) pour obtenir votre accès sur mesure ! ✨`,
      `Hello! Regarding this specific subscription request:

Yes! At **Tooly.tn**, we provide custom subscriptions on demand (Midjourney, Netflix, Grammarly, LinkedIn...) with full warranties and local TND payments.

Message our team on **WhatsApp (+216 50 000 000)** or visit our **Contact** page (\`/contact\`) to get set up! ✨`,
      undefined,
      {
        ar: ['واتساب الدعم المباشر', 'صفحة الاتصال', 'تفرّج في الكتالوج'],
        arabizi: ['WhatsApp Support', 'Page Contact', 'Chouf el Catalogue'],
        fr: ['Support WhatsApp', 'Page Contact', 'Voir le catalogue'],
        en: ['WhatsApp Support', 'Contact Page', 'View catalog'],
      },
      {
        label: {
          ar: 'تواصل عبر واتساب',
          arabizi: 'Contact WhatsApp',
          fr: 'Contacter sur WhatsApp',
          en: 'Chat on WhatsApp',
        },
        href: 'https://wa.me/21650000000',
      }
    );
  }

  // 18. GRATITUDE / CLOSING ("3aychek", "merci", "chokran")
  if (
    matchAny(norm, [
      '3aychek', 'chokran', 'merci', 'sa77a', 'ya3tik sa77a', 'parfait', 'top',
      'شكرا', 'يعيشك', 'يعطيك الصحة', 'بارك الله فيك', 'thanks', 'thank you'
    ])
  ) {
    return buildReply(
      `من عينيّ يا باهي! 🫶 يعطيك الصحة ومرحباً بيك في أي وقت في **Tooly.tn**!
أنا ديما هوني باش نعاونك تختار أحسن الأدوات. جوّك باهي ونهارك زين! 🐿️✨🇹🇳`,
      `Men 3inayya ya ghali! 🫶 Ya3tik essa7a w mar7ba bik fi ay waqt fi **Tooly.tn**!
Ena dima houni pour t'aider. Jawwek behi w nharek zine! 🐿️✨🇹🇳`,
      `Avec grand plaisir ! 🫶 Toute l'équipe de **Tooly.tn** et moi-même restons à votre entière disposition.
Passez une excellente journée productive ! 🐿️✨🇹🇳`,
      `You are most welcome! 🫶 The entire **Tooly.tn** team and I are always here to help.
Have a wonderful, productive day! 🐿️✨🇹🇳`,
      ['claude-pro', 'canva-pro', 'chatgpt-plus']
    );
  }

  // 19. UNCLEAR / VERY SHORT / GENERIC INPUT
  if (!norm || norm.length < 3) {
    return buildReply(
      `مرحبا بيك في **Tooly.tn**! 🐿️ تفضل اسألني على أي اشتراك أو أداة تحب تعرف سومها أو مميزاتها، ونعاونك تختار الأنسب لك! ✨`,
      `Mar7ba bik fi **Tooly.tn**! 🐿️ TFaddal es'elni 3la ay abonnement t7eb ta3ref soumou walla les options mte3ou, w n3awnek tekhtar el a7sen! ✨`,
      `Bienvenue sur **Tooly.tn** ! 🐿️ N'hésitez pas à me poser n'importe quelle question sur nos abonnements, tarifs ou modes de paiement ! ✨`,
      `Welcome to **Tooly.tn**! 🐿️ Feel free to ask me anything about our digital passes, pricing, or payment options! ✨`,
      ['claude-pro', 'canva-pro', 'capcut-pro']
    );
  }

  // 20. SMART COMPREHENSIVE FALLBACK FOR OPEN-ENDED / UNSTRUCTURED QUESTIONS
  return buildReply(
    `أهلاً بك يا باهي! 💡 بخصوص استفسارك حول **«${raw}»**:

أنا **سنجوب (Sanjoub)** 🐿️، المستشار الذكي لمنصة **Tooly.tn** (سوق الاشتراكات الرقمية الأول في تونس):
- 🤖 **أهم الاشتراكات المتوفرة**: Claude Pro (79 د.ت)، Cursor Pro (89 د.ت)، ChatGPT Plus (50 د.ت)، Canva Pro (من 5 د.ت)، CapCut Pro (من 20 د.ت)، Gemini Plus (30 د.ت).
- 💳 **الخلاص 100% تونسي**: بالـ D17، فلوسي، البطاقة البنكية، أو Sobflous دون بطاقة دولية.
- ⚡ **التسليم والضمان**: تفعيل سريع في أقل من ساعة مع ضمان استمرارية كامل 100%.
- 📞 **تحتاج مساعدة خاصة؟**: فريقنا معك مباشرة على الواتساب **(+216 50 000 000)**!`,
    `Ahla bik ya behi! 💡 Concernant sou'elek 3la **«${raw}»**:

Ena **Sanjoub** 🐿️, ton conseiller digital fi **Tooly.tn** (1ère Marketplace d'abonnements digitaux fi Tounes):
- 🤖 **Abonnements top**: Claude Pro (79 TND), Cursor Pro (89 TND), ChatGPT Plus (50 TND), Canva Pro (men 5 TND), CapCut Pro (men 20 TND), Gemini Plus (30 TND).
- 💳 **Khlas 100% tounsi**: D17, Flouci, Carte Bancaire, Sobflous sans carte internationale.
- ⚡ **Livraison & Garantie**: Activation fi a9al men se3a avec garantie totale 100%.
- 📞 **7achtek b 7aja spécifique?**: L'équipe m3ak direct 3al **WhatsApp (+216 50 000 000)**!`,
    `Bonjour ! 💡 Concernant votre demande à propos de **« ${raw} »** :

Je suis **Sanjoub** 🐿️, le conseiller digital officiel de **Tooly.tn** (marketplace n°1 d'abonnements digitaux en Tunisie) :
- 🤖 **Nos abonnements phares** : Claude Pro (79 TND), Cursor Pro (89 TND), ChatGPT Plus (50 TND), Canva Pro (dès 5 TND), CapCut Pro (dès 20 TND), Gemini Plus (30 TND).
- 💳 **Paiement 100% local** : D17, Flouci, Sobflous, Carte bancaire tunisienne.
- ⚡ **Livraison & Garantie** : Activation en moins d'une heure et garantie de continuité intégrale.
- 📞 **Besoin d'un accompagnement personnalisé ?** : Écrivez-nous sur **WhatsApp au +216 50 000 000** !`,
    `Hello! 💡 Regarding your message about **« ${raw} »**:

I'm **Sanjoub** 🐿️, your official digital subscriptions advisor at **Tooly.tn** (Tunisia's digital subscriptions marketplace):
- 🤖 **Top Passes**: Claude Pro (79 TND), Cursor Pro (89 TND), ChatGPT Plus (50 TND), Canva Pro (from 5 TND), CapCut Pro (from 20 TND), Gemini Plus (30 TND).
- 💳 **100% Local Payments**: D17, Flouci, Sobflous, and Tunisian bank cards.
- ⚡ **Rapid Delivery & Warranty**: Handled within an hour with complete continuous warranty.
- 📞 **Need personal support?**: Reach us directly on **WhatsApp (+216 50 000 000)**!`,
    ['claude-pro', 'canva-pro', 'chatgpt-plus', 'capcut-pro'],
    {
      ar: ['الاشتراكات المتوفرة بالأسعار', 'كيفاش نخلص بالـ D17؟', 'تواصل عبر واتساب', 'تتبع الطلب'],
      arabizi: ['Abonnements w les prix', 'Paiement D17', 'WhatsApp Support', 'Suivi commande'],
      fr: ['Catalogue des abonnements', 'Comment payer par D17 ?', 'Support WhatsApp', 'Suivi commande'],
      en: ['Subscriptions & prices', 'Pay with D17', 'WhatsApp Support', 'Track order'],
    }
  );
}
