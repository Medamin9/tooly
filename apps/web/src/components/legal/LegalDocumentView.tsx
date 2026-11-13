'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  Lock,
  RotateCcw,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  Mail,
  Coins,
  BadgeCheck,
} from 'lucide-react';
import type { Locale } from '@tooly/contracts';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CtaArrow } from '@/components/ui/CtaArrow';

export type LegalDocSlug = 'terms' | 'privacy' | 'refund';

interface LegalDocSection {
  title: string;
  content: string[];
  callout?: {
    type: 'info' | 'guarantee' | 'warning';
    title: string;
    text: string;
  };
}

interface LegalDocContent {
  title: string;
  badge: string;
  subtitle: string;
  lastUpdated: string;
  readingTime: string;
  sections: LegalDocSection[];
}

const LEGAL_DATA: Record<Locale, Record<LegalDocSlug, LegalDocContent>> = {
  ar: {
    terms: {
      title: 'شروط الاستخدام والخدمة',
      badge: 'الوثيقة القانونية الرسمية',
      subtitle:
        'تحدد هذه الشروط الأحكام المنظمة لشراء واستخدام الاشتراكات والأدوات الرقمية المعروضة على منصة Tooly.tn داخل الجمهورية التونسية.',
      lastUpdated: 'نوفمبر 2026',
      readingTime: '5 دقائق قراءة',
      sections: [
        {
          title: '1. التعريف بالمنصة وطبيعة الخدمات',
          content: [
            'منصة Tooly.tn هي سوق رقمي تونسي مستقل مخصص لتسهيل وصول المهنيين، المطورين، صناع المحتوى والشركات الناشئة في تونس إلى الأدوات والاشتراكات السحابية المدفوعة.',
            'تعتبر Tooly.tn وسيطاً رقمياً مستقلاً لتوفير التراخيص والمقاعد الرسمية في مساحات العمل الجماعية أو الحسابات المخصصة، ولا تدعي أي تمثيل حصري أو انتماء رسمي للمزودين العالميين مثل OpenAI أو Anthropic أو Canva. العلامات التجارية المذكورة ملك لأصحابها وتُستخدم فقط للتعريف بالخدمة.',
          ],
          callout: {
            type: 'info',
            title: 'سوق محلي مستقل',
            text: 'جميع المسميات والشعارات مستخدمة لأغراض التوصيف التقني للمنتج فقط دون أي ادعاء بالتبعية الرسمية.',
          },
        },
        {
          title: '2. الأسعار، العملة، وطرق الدفع المحلية',
          content: [
            'يتم عرض جميع الأسعار على المنصة بشكل صافٍ بالدينار التونسي (TND)، دون أي رسوم خفية أو عمولات تحويل عملة دولية.',
            'نقبل وسائل الدفع المعتمدة محلياً في تونس بما في ذلك البطاقات البنكية CIB، البطاقة التكنولوجية CTI، بطاقة D17 التابعة للبريد التونسي، المحافظ الإلكترونية المرخصة مثل Flouci وKonnect، والتحويل البنكي المباشر.',
            'يتم تأكيد الطلب فور استلام إشعار الدفع من مزود الخدمة المعتمد.',
          ],
          callout: {
            type: 'guarantee',
            title: 'شفافية مالية 100%',
            text: 'السعر الظاهر هو السعر النهائي الصافي بالدينار التونسي دون أي مفاجآت بنكية.',
          },
        },
        {
          title: '3. التسليم والتفعيل الرقمي',
          content: [
            'يتم تسليم الاشتراكات رقمياً بشكل فوري أو في غضون 15 إلى 30 دقيقة عبر البريد الإلكتروني أو الواتساب المسجل في تفاصيل الطلب.',
            'قد يتضمن التسليم إما دعوة رسمية لمساحة عمل فريق (Team Seat Invite)، أو ترقية لحساب العميل الشخصي، أو تزويده ببيانات دخول مؤمنة وخاصة وفقاً لنوع الخطة الموضحة مسبقاً قبل الشراء.',
          ],
        },
        {
          title: '4. التزامات العميل والاستخدام المقبول',
          content: [
            'يلتزم العميل بتقديم بريد إلكتروني ورقم هاتف صحيحين لضمان وصول التفعيل والدعم الفني دون تأخير.',
            'يُمنع منعاً باتاً إعادة بيع بيانات الحسابات، أو محاولة تغيير البريد الأساسي للحسابات المشتركة، أو استخدام الأدوات لأي أغراض تخالف القوانين التونسية أو الدولية.',
            'يتحمل العميل مسؤولية الحفاظ على سرية معلومات الوصول المسلمة إليه.',
          ],
          callout: {
            type: 'warning',
            title: 'حظر إعادة البيع',
            text: 'إساءة استخدام الحسابات أو محاولة تعديل بيانات الأمان يؤدي إلى إلغاء الاشتراك فوراً دون استرجاع.',
          },
        },
        {
          title: '5. ضمان الاستمرارية والدعم الفني',
          content: [
            'تضمن Tooly.tn استمرارية تفعيل الاشتراك طوال المدة المحددة (شهر، 3 أشهر، سنة).',
            'في حال حدوث أي انقطاع تقني أو تحديث من المزود الأصلي، يوفر فريق الدعم التونسي استبدالاً فورياً أو معالجة في أقل من 24 ساعة.',
          ],
        },
        {
          title: '6. القانون الواجب التطبيق وحل النزاعات',
          content: [
            'تخضع شروط هذه الاتفاقية للقوانين السارية في الجمهورية التونسية.',
            'في حال حدوث أي نزاع، يلتزم الطرفان بالسعي أولاً لحل ودي عبر خدمة العملاء على البريد contact@tooly.tn أو عبر رقم الواتساب المعتمد.',
          ],
        },
      ],
    },
    privacy: {
      title: 'سياسة الخصوصية وحماية البيانات',
      badge: 'حماية وأمان معتمد',
      subtitle:
        'نلتزم بأعلى معايير حماية بياناتك الشخصية واحترام خصوصيتك. توضح هذه الوثيقة ما نجمعه وكيفية استخدامه.',
      lastUpdated: 'نوفمبر 2026',
      readingTime: '4 دقائق قراءة',
      sections: [
        {
          title: '1. البيانات التي نجمعها',
          content: [
            'نجمع فقط الحد الأدنى من المعلومات الضرورية لمعالجة طلبك وتسليم اشتراكك الرقمي، وتشمل: الاسم، عنوان البريد الإلكتروني، رقم الهاتف (للتواصل عبر واتساب للتسليم والدعم)، وسجل المعاملات.',
            'لا نطلب أبداً معلومات شخصية غير مرتبطة بخدماتنا.',
          ],
        },
        {
          title: '2. أمان المعاملات المالية وعدم تخزين البطاقات',
          content: [
            'تتم معالجة جميع المدفوعات عبر بوابات دفع تونسية معتمدة ومرخصة من البنك المركزي التونسي (مثل Konnect وFlouci).',
            'منصة Tooly.tn لا تقوم بتخزين أو معالجة أو الاطلاع على أرقام بطاقاتك البنكية أو كلمات السر الخاصة بها على الإطلاق.',
          ],
          callout: {
            type: 'guarantee',
            title: 'معاملات بنكية مشفرة',
            text: 'بيانات الدفع البنكي تظل مشفرة لدى مزودي الدفع المعتمدين ولا تمر أبداً عبر خوادم Tooly.',
          },
        },
        {
          title: '3. استخدام البيانات ومشاركتها',
          content: [
            'تُستخدم بياناتك فقط للأغراض التالية: تفعيل اشتراكك، إرسال إشعارات حالة الطلب، تقديم الدعم الفني، وإخطارك بموعد التجديد.',
            'نلتزم التزاماً قاطعاً بعدم بيع أو تأجير أو مشاركة بياناتك الشخصية مع أي أطراف ثالثة لأغراض إعلانية أو تجارية.',
          ],
        },
        {
          title: '4. تخزين وحماية المعلومات',
          content: [
            'تُخزن البيانات على خوادم سحابية مؤمنة بأحدث بروتوكولات التشفير (SSL/TLS)، مع حصر الوصول إلى المعلومات على موظفي الدعم الفني المصرح لهم فقط وبصلاحيات مقيدة.',
          ],
        },
        {
          title: '5. حقوقك في تعديل أو حذف البيانات',
          content: [
            'يحق لك في أي وقت طلب نسخة من بياناتك المخزنة لدينا، أو تعديلها، أو حذف حسابك نهائياً من سجلاتنا.',
            'يمكنك تقديم طلب الحذف أو التعديل عبر مراسلتنا على contact@tooly.tn وسيتم التنفيذ خلال 48 ساعة عمل.',
          ],
        },
      ],
    },
    refund: {
      title: 'سياسة الاسترجاع والضمان',
      badge: 'ضمان الاستمرارية 100%',
      subtitle:
        'حقوقك مضمونة بالكامل. نلتزم باستبدال فوري أو استرجاع نقدي عادل وفق شروط واضحة ومحددة.',
      lastUpdated: 'نوفمبر 2026',
      readingTime: '4 دقائق قراءة',
      sections: [
        {
          title: '1. ضمان الاستمرارية الكاملة (100% Full Duration)',
          content: [
            'كل اشتراك تشتريه من Tooly.tn مغطى بضمان استمرارية طوال المدة المحددة (شهر كامل = 30 يوماً، سنة = 365 يوماً).',
            'إذا واجهت أي انقطاع في الخدمة أو تعطل في الحساب، فإننا نلتزم بإصلاح المشكلة أو استبدال الحساب في أسرع وقت.',
          ],
          callout: {
            type: 'guarantee',
            title: 'استبدال سريع',
            text: 'فريق الدعم المحلي جاهز لحل أي طارئ واستبدال المقعد أو الحساب خلال ساعات قليلة.',
          },
        },
        {
          title: '2. الحالات المؤهلة للاسترجاع المالي (Refund)',
          content: [
            'عدم استلام تفاصيل الاشتراك خلال المدة المعلنة (أقصى حد 24 ساعة من تأكيد الدفع).',
            'وجود عائق تقني يحول دون استفادتك من الخدمة في تونس ولم يتمكن فريق الدعم من حله.',
            'تعطل الحساب وتعذر توفير حساب بديل ملائم خلال 24 ساعة من إبلاغ الدعم الفني.',
            'في حال تم استخدام جزء من مدة الاشتراك، يتم احتساب المبلغ المسترد بما يتناسب مع الفترة المتبقية (Pro-rata).',
          ],
        },
        {
          title: '3. الحالات المستثناة من الاسترجاع',
          content: [
            'مخالفة العميل لشروط الاستخدام، مثل محاولة تغيير كلمة مرور الحساب المشترك أو إعادة بيعه.',
            'الحظر الناتج عن استخدام غير مصرح به أو انتهاك لسياسات المنصة الأصلية من طرف العميل.',
            'العدول عن الشراء بعد تفعيل وتسليم الحساب الرقمي دون وجود أي عيب تقني أو انقطاع.',
          ],
          callout: {
            type: 'warning',
            title: 'شروط تفعيل الحسابات',
            text: 'نظراً للطبيعة الرقمية الفورية للاشتراكات، لا يمكن إلغاء الطلب بعد الاستلام ما دامت الخدمة تعمل بكفاءة.',
          },
        },
        {
          title: '4. طريقة ومدة استرداد الأموال',
          content: [
            'يتم إرجاع المبالغ المستحقة عبر وسيلة الدفع الأصلية التي استخدمها العميل (عبر محفظة Flouci، بطاقة بنكية، D17، أو تحويل بنكي).',
            'تتم معالجة طلبات الاسترجاع خلال 24 إلى 48 ساعة عمل من تاريخ الموافقة على الطلب.',
          ],
        },
        {
          title: '5. كيفية تقديم طلب الضمان أو الاسترجاع',
          content: [
            'لتقديم طلب، تواصل مع فريق خدمة العملاء عبر الواتساب على الرقم 21696707406+ أو عبر البريد الإلكتروني contact@tooly.tn مع إرفاق رقم الطلب.',
            'يقوم فريقنا بمراجعة الحالة والرد خلال أقل من 15 دقيقة في أوقات العمل الرسمية.',
          ],
        },
      ],
    },
  },
  fr: {
    terms: {
      title: 'Conditions Générales d’Utilisation',
      badge: 'Document Légal Officiel',
      subtitle:
        'Les présentes conditions régissent l’achat et l’accès aux abonnements digitaux et outils professionnels proposés sur Tooly.tn en Tunisie.',
      lastUpdated: 'Novembre 2026',
      readingTime: '5 min de lecture',
      sections: [
        {
          title: '1. Objet et Nature de la Plateforme',
          content: [
            'Tooly.tn est une place de marché numérique tunisienne indépendante permettant aux créateurs, développeurs, agences et professionnels d’accéder à des abonnements logiciels internationaux.',
            'Tooly.tn opère en tant qu’intermédiaire technique et facilitateur d’accès. La plateforme n’est ni affiliée, ni partenaire exclusif des éditeurs tiers (OpenAI, Anthropic, Canva, etc.). Les marques déposées appartiennent à leurs propriétaires légitimes respectifs.',
          ],
          callout: {
            type: 'info',
            title: 'Place de marché indépendante',
            text: 'Les noms de marques et logos sont utilisés exclusivement à titre descriptif et informatif.',
          },
        },
        {
          title: '2. Tarifs, Devise et Paiements Locaux',
          content: [
            'Tous les prix sont affichés en Dinars Tunisiens (TND) nets de toute taxe de change ou frais bancaires internationaux.',
            'Les paiements sont réalisés via les solutions agréées en Tunisie : cartes bancaires nationales CIB / CTI, carte D17 de La Poste Tunisienne, portefeuilles électroniques Flouci et Konnect, ainsi que par virement bancaire.',
          ],
          callout: {
            type: 'guarantee',
            title: 'Zéro frais caché',
            text: 'Facturation 100% transparente en Dinar Tunisien sans surprise de change.',
          },
        },
        {
          title: '3. Livraison et Activation Digitale',
          content: [
            'La livraison des accès s’effectue de manière dématérialisée, sous 15 à 30 minutes en moyenne, par email et WhatsApp.',
            'Selon la formule choisie, l’accès est fourni sous forme d’invitation d’équipe officielle (Team Workspace Seat), d’activation sur le compte personnel du client, ou d’accès dédié sécurisé.',
          ],
        },
        {
          title: '4. Obligations du Client et Usage Loyal',
          content: [
            'Le client s’engage à fournir des coordonnées exactes et à préserver la stricte confidentialité des identifiants remis.',
            'Toute tentative de revente, de modification abusive des paramètres de sécurité ou d’utilisation à des fins malveillantes entraîne la résiliation immédiate de l’accès sans droit à remboursement.',
          ],
        },
        {
          title: '5. Garantie de Continuité et Support',
          content: [
            'Tooly.tn garantit la validité de l’abonnement sur toute la durée souscrite (1 mois, 3 mois, 1 an).',
            'En cas d’interruption technique imputable au fournisseur tiers, notre équipe s’engage à rétablir ou remplacer l’accès sous 24h ouvrées.',
          ],
        },
        {
          title: '6. Droit Applicable et Résolution des Litiges',
          content: [
            'Les présentes CGU sont soumises à la législation tunisienne. Tout différend fait l’objet en priorité d’une tentative de médiation amiable auprès de notre service client.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Politique de Confidentialité',
      badge: 'Protection des Données',
      subtitle:
        'Tooly.tn s’engage à protéger la vie privée de ses utilisateurs et à traiter leurs données personnelles avec la plus stricte rigueur.',
      lastUpdated: 'Novembre 2026',
      readingTime: '4 min de lecture',
      sections: [
        {
          title: '1. Données Personnelles Collectées',
          content: [
            'Nous recueillons uniquement les informations indispensables à l’exécution de votre commande : nom complet, adresse email, numéro de téléphone (pour la livraison et l’assistance WhatsApp), et historique d’achat.',
          ],
        },
        {
          title: '2. Sécurité des Paiements et Absence de Stockage Bancaire',
          content: [
            'Les transactions financières sont traitées de bout en bout par des établissements de paiement certifiés (Konnect, Flouci, etc.).',
            'Tooly.tn ne conserve, ne visualise et ne stocke à aucun moment les numéros de vos cartes bancaires ni vos codes de sécurité.',
          ],
          callout: {
            type: 'guarantee',
            title: 'Paiement 100% sécurisé',
            text: 'Vos données financières sont traitées selon les standards bancaires les plus stricts sans transiter par nos serveurs.',
          },
        },
        {
          title: '3. Finalité du Traitement des Données',
          content: [
            'Vos informations personnelles sont utilisées pour : activer vos abonnements, assurer le support client, vous envoyer les preuves de transaction et vous alerter avant l’expiration de votre service.',
            'Nous ne commercialisons, ne louons et ne cédons aucune donnée personnelle à des fins publicitaires.',
          ],
        },
        {
          title: '4. Vos Droits',
          content: [
            'Conformément aux réglementations sur la protection des données, vous disposez d’un droit d’accès, de rectification et de suppression de vos données personnelles.',
            'Pour exercer ces droits, contactez notre délégué à la protection des données à contact@tooly.tn.',
          ],
        },
      ],
    },
    refund: {
      title: 'Politique de Remboursement et Garantie',
      badge: 'Garantie Continuité 100%',
      subtitle:
        'Votre satisfaction et la pérennité de vos outils sont notre priorité. Découvrez nos engagements de remplacement et de remboursement.',
      lastUpdated: 'Novembre 2026',
      readingTime: '4 min de lecture',
      sections: [
        {
          title: '1. Garantie Intégrale de Continuité',
          content: [
            'Chaque pass ou abonnement souscrit sur Tooly.tn bénéficie d’une garantie de fonctionnement sur l’intégralité de la période achetée.',
            'En cas d’anomalie ou de désactivation prématurée, notre équipe locale intervient en priorité pour remplacer ou réparer votre compte.',
          ],
          callout: {
            type: 'guarantee',
            title: 'Continuité assurée',
            text: 'Support réactif 7j/7 avec remplacement garanti sous quelques heures en cas d’aléa technique.',
          },
        },
        {
          title: '2. Cas Éligibles au Remboursement',
          content: [
            'Non-livraison du service dans un délai supérieur à 24 heures après confirmation du paiement.',
            'Incompatibilité technique avérée ne pouvant être résolue par notre assistance.',
            'Impossibilité de remplacer un abonnement interrompu dans un délai de 24 heures après signalement.',
            'En cas d’interruption partielle, le remboursement est calculé au prorata des jours restants.',
          ],
        },
        {
          title: '3. Exclusions de Garantie',
          content: [
            'Violation caractérisée des règles d’utilisation de l’éditeur tiers ou de Tooly.tn.',
            'Partage non autorisé ou revente des identifiants fournis.',
            'Changement d’avis après activation et livraison conforme d’un produit digital opérationnel.',
          ],
        },
        {
          title: '4. Modalités de Remboursement',
          content: [
            'Le remboursement est effectué vers le mode de paiement initial utilisé (portefeuille Flouci, carte bancaire, D17 ou virement).',
            'Le traitement est opéré sous 24 à 48 heures ouvrées après validation par notre support.',
          ],
        },
        {
          title: '5. Procédure de Réclamation',
          content: [
            'Pour toute demande, adressez simplement votre numéro de commande à notre support WhatsApp (+216 96 707 406) ou par email à contact@tooly.tn.',
          ],
        },
      ],
    },
  },
  en: {
    terms: {
      title: 'Terms of Service',
      badge: 'Official Legal Document',
      subtitle:
        'These terms govern the purchase and digital delivery of subscriptions and creator tools available on Tooly.tn in Tunisia.',
      lastUpdated: 'November 2026',
      readingTime: '5 min read',
      sections: [
        {
          title: '1. Platform Overview & Nature of Service',
          content: [
            'Tooly.tn is an independent Tunisian digital marketplace designed to help local creators, engineers, and businesses purchase verified access to international digital tools.',
            'Tooly.tn operates as an independent technical reseller and facilitator. Tooly.tn is not officially affiliated with or endorsed by third-party providers (OpenAI, Anthropic, Canva, etc.). All trademarks remain the property of their respective holders.',
          ],
          callout: {
            type: 'info',
            title: 'Independent Marketplace',
            text: 'All product marks and logos are used strictly for nominative identification purposes.',
          },
        },
        {
          title: '2. Pricing, Currency & Local Payments',
          content: [
            'All prices are listed net in Tunisian Dinars (TND) with zero foreign exchange surcharges.',
            'We support trusted local Tunisian payment methods including CIB/CTI bank cards, La Poste D17 cards, certified digital wallets (Flouci, Konnect), and direct bank transfers.',
          ],
          callout: {
            type: 'guarantee',
            title: 'Transparent Pricing',
            text: 'The price you see is the net price in Tunisian Dinars with no unexpected fees.',
          },
        },
        {
          title: '3. Digital Fulfillment & Activation',
          content: [
            'Orders are delivered digitally within 15 to 30 minutes on average via email and WhatsApp.',
            'Depending on the plan, access is delivered via an official team invite (Team Seat), activation on your personal account, or a dedicated secure login.',
          ],
        },
        {
          title: '4. Customer Conduct & Fair Use',
          content: [
            'Customers must provide accurate contact details and maintain the security of credentials received.',
            'Any resale of access, unauthorized credential alteration, or malicious use will result in immediate termination of service without refund.',
          ],
        },
        {
          title: '5. Continuity Guarantee & Support',
          content: [
            'Tooly.tn guarantees active status for the full duration of your purchased plan (1 month, 3 months, 1 year).',
            'In case of any unexpected disruption, our local support team replaces or restores your access within 24 hours.',
          ],
        },
        {
          title: '6. Governing Law & Dispute Resolution',
          content: [
            'These terms are governed by the laws of the Republic of Tunisia. Any disputes will be resolved through amicable mediation with our customer support.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      badge: 'Data Protection & Trust',
      subtitle:
        'Tooly.tn is committed to strict privacy standards. This policy details how your information is handled with care and integrity.',
      lastUpdated: 'November 2026',
      readingTime: '4 min read',
      sections: [
        {
          title: '1. Information We Collect',
          content: [
            'We collect only essential details required to process your order: your name, email address, WhatsApp phone number (for delivery and support), and order history.',
          ],
        },
        {
          title: '2. Payment Security & Zero Card Storage',
          content: [
            'All payment transactions are handled exclusively by licensed, certified Tunisian payment gateways (Konnect, Flouci).',
            'Tooly.tn never stores, processes, or views your credit card numbers or private security codes.',
          ],
          callout: {
            type: 'guarantee',
            title: 'Tokenized Security',
            text: 'Your financial credentials never touch our servers.',
          },
        },
        {
          title: '3. Use & Confidentiality of Data',
          content: [
            'Your data is used solely to deliver subscriptions, provide support, and send order notifications.',
            'We strictly never sell, trade, or share your personal data with third-party advertising brokers.',
          ],
        },
        {
          title: '4. Your Privacy Rights',
          content: [
            'You have the right to inspect, update, or request the deletion of your personal records at any time by contacting contact@tooly.tn.',
          ],
        },
      ],
    },
    refund: {
      title: 'Refund & Continuity Policy',
      badge: '100% Continuity Guarantee',
      subtitle:
        'Your investment is fully protected. Learn how our replacement guarantee and refund policies safeguard every purchase.',
      lastUpdated: 'November 2026',
      readingTime: '4 min read',
      sections: [
        {
          title: '1. 100% Full-Term Coverage Guarantee',
          content: [
            'Every subscription on Tooly.tn is backed for its full purchased duration.',
            'If your seat or login encounters any technical issue, we diagnose and provide an immediate replacement seat.',
          ],
          callout: {
            type: 'guarantee',
            title: 'Prompt Replacement',
            text: 'Our local support team replaces or fixes interrupted accounts within hours.',
          },
        },
        {
          title: '2. Refund Eligibility Criteria',
          content: [
            'Non-delivery of credentials within 24 hours of payment verification.',
            'Technical incompatibility that cannot be resolved by our support team.',
            'Inability to provide a replacement seat within 24 hours of a reported disruption.',
            'In case of partial period usage, refunds are calculated pro-rata for remaining days.',
          ],
        },
        {
          title: '3. Non-Refundable Scenarios',
          content: [
            'Customer violation of fair use or third-party platform terms.',
            'Attempted reselling or credential sharing.',
            'Change of mind once credentials have been successfully delivered and verified operational.',
          ],
        },
        {
          title: '4. Refund Processing & Timelines',
          content: [
            'Approved refunds are returned to the original payment method (Flouci, bank card, D17, or bank transfer).',
            'Processing is completed within 24 to 48 business hours.',
          ],
        },
        {
          title: '5. How to Submit a Claim',
          content: [
            'Reach out directly to our WhatsApp support at +216 96 707 406 or email contact@tooly.tn with your order reference.',
          ],
        },
      ],
    },
  },
};

const DOC_NAV: Array<{ slug: LegalDocSlug; icon: React.ReactNode; labels: Record<Locale, string> }> = [
  {
    slug: 'terms',
    icon: <FileText className="w-4 h-4" />,
    labels: {
      ar: 'شروط الاستخدام',
      fr: 'Conditions Générales',
      en: 'Terms of Service',
    },
  },
  {
    slug: 'privacy',
    icon: <Lock className="w-4 h-4" />,
    labels: {
      ar: 'سياسة الخصوصية',
      fr: 'Confidentialité',
      en: 'Privacy Policy',
    },
  },
  {
    slug: 'refund',
    icon: <RotateCcw className="w-4 h-4" />,
    labels: {
      ar: 'الاسترجاع والضمان',
      fr: 'Remboursement & Garantie',
      en: 'Refund Policy',
    },
  },
];

export interface LegalDocumentViewProps {
  locale: Locale;
  slug: LegalDocSlug;
}

export function LegalDocumentView({ locale, slug }: LegalDocumentViewProps) {
  const isAr = locale === 'ar';
  const data = LEGAL_DATA[locale]?.[slug] || LEGAL_DATA.ar[slug];

  const homeLabel = isAr ? 'الرئيسية' : locale === 'fr' ? 'Accueil' : 'Home';
  const legalSectionLabel = isAr ? 'الوثائق القانونية' : locale === 'fr' ? 'Légal' : 'Legal';

  return (
    <div className="w-full bg-paper min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted mb-8"
        >
          <Link href={`/${locale}`} className="hover:text-ink transition-colors">
            {homeLabel}
          </Link>
          <span className="text-muted/40">/</span>
          <span className="text-muted">{legalSectionLabel}</span>
          <span className="text-muted/40">/</span>
          <span className="text-ink font-semibold">{data.title}</span>
        </nav>

        {/* Hero Header */}
        <header className="mb-10 pb-8 border-b border-line">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="accent" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
              <span>{data.badge}</span>
            </Badge>
            <div className="flex items-center gap-2 text-xs text-muted font-mono">
              <Clock className="w-3.5 h-3.5 text-muted/70" />
              <span>{data.readingTime}</span>
              <span>•</span>
              <span>{isAr ? `آخر تحديث: ${data.lastUpdated}` : `Mise à jour : ${data.lastUpdated}`}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-4 leading-tight">
            {data.title}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
            {data.subtitle}
          </p>
        </header>

        {/* Tab Navigation between Legal Documents */}
        <div
          role="tablist"
          aria-label="Legal Documents"
          className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-surface border border-line mb-12"
        >
          {DOC_NAV.map((item) => {
            const isActive = item.slug === slug;
            return (
              <Link
                key={item.slug}
                href={`/${locale}/${item.slug}`}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                  isActive
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.labels[locale]}</span>
              </Link>
            );
          })}
        </div>

        {/* Document Content Sections */}
        <article className="space-y-10">
          {data.sections.map((section, idx) => (
            <section
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-card text-start transition-colors"
            >
              <h2 className="text-lg sm:text-xl font-extrabold text-ink mb-4 tracking-tight flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-tooly-red shrink-0" />
                <span>{section.title}</span>
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {section.callout && (
                <div
                  className={`mt-5 p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                    section.callout.type === 'guarantee'
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-950 dark:text-emerald-300'
                      : section.callout.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/25 text-amber-950 dark:text-amber-300'
                        : 'bg-tooly-red/10 border-tooly-red/25 text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  {section.callout.type === 'guarantee' ? (
                    <BadgeCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : section.callout.type === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-tooly-red shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block font-bold mb-0.5">
                      {section.callout.title}
                    </strong>
                    <span>{section.callout.text}</span>
                  </div>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* Bottom Support and Help Contact Card */}
        <aside className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c0d12] to-[#161820] text-white border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-tooly-red font-semibold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>
                  {isAr
                    ? 'هل لديك أي استفسار قانوني أو فني؟'
                    : locale === 'fr'
                      ? 'Une question juridique ou technique ?'
                      : 'Have questions about these terms?'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {isAr
                  ? 'فريق الدعم التونسي جاهز لمساعدتك 7/7'
                  : locale === 'fr'
                    ? 'Notre équipe en Tunisie vous répond 7j/7'
                    : 'Our Tunisian support team is here 7/7'}
              </h3>
              <p className="text-xs text-neutral-300 max-w-md leading-relaxed">
                {isAr
                  ? 'نحن هنا لتوضيح أي نقطة وضمان حصولك على تجربة آمنة وشفافة بالكامل.'
                  : locale === 'fr'
                    ? 'Contactez-nous directement pour toute précision ou assistance sur vos abonnements.'
                    : 'Reach out to our team anytime for clarification on subscriptions or guarantees.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <a
                href="https://wa.me/21696707406"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-900/30 border-none">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp (+216 96 707 406)</span>
                </Button>
              </a>

              <a href="mailto:contact@tooly.tn">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 text-xs gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>contact@tooly.tn</span>
                </Button>
              </a>
            </div>
          </div>
        </aside>

        {/* Back Link to Catalog */}
        <div className="mt-8 flex justify-center">
          <Link href={`/${locale}/catalog`}>
            <Button variant="ghost" size="sm" className="text-xs text-muted hover:text-ink gap-2">
              <span>{isAr ? 'العودة إلى الكتالوج' : locale === 'fr' ? 'Retour au catalogue' : 'Back to catalog'}</span>
              <CtaArrow className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LegalDocumentView;

