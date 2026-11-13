export interface LocalizedOptionLabels {
  ar: string;
  fr: string;
  en: string;
}

export const DEFAULT_DELIVERY_OPTIONS: Array<{
  code: string;
  sortOrder: number;
  label: LocalizedOptionLabels;
}> = [
  {
    code: 'OFFLINE_TRANSFER',
    sortOrder: 1,
    label: {
      ar: 'طلب عبر التحويل أو الدفع المحلي (تونس)',
      fr: 'Commande par transfert ou virement local (Tunisie)',
      en: 'Local transfer / Tunisia manual order confirmation',
    },
  },
  {
    code: 'MANUAL_SUPPORT',
    sortOrder: 2,
    label: {
      ar: 'تفعيل يدوي سريع عبر دعم Tooly.tn',
      fr: 'Activation manuelle rapide via le support Tooly.tn',
      en: 'Fast manual activation via Tooly.tn support',
    },
  },
  {
    code: 'TEAM_INVITE',
    sortOrder: 3,
    label: {
      ar: 'دعوة مساحة عمل رسمية على بريدك الشخصي',
      fr: 'Invitation officielle sur votre e-mail personnel',
      en: 'Official workspace invite sent to your email',
    },
  },
  {
    code: 'CREDENTIALS_PROVISION',
    sortOrder: 4,
    label: {
      ar: 'إعداد وتسليم بيانات حساب مخصص وآمن',
      fr: 'Fourniture dédiée d’identifiants sécurisés',
      en: 'Dedicated provisioned account credentials',
    },
  },
  {
    code: 'VOUCHER_CODE',
    sortOrder: 5,
    label: {
      ar: 'تسليم كود تفعيل فوري عبر البريد',
      fr: 'Livraison d’un code d’activation par e-mail',
      en: 'Instant activation voucher code delivered by email',
    },
  },
];

export const DEFAULT_DURATION_OPTIONS: Array<{
  code: string;
  sortOrder: number;
  label: LocalizedOptionLabels;
}> = [
  {
    code: '1_month',
    sortOrder: 1,
    label: { ar: 'شهر واحد', fr: '1 mois', en: '1 month' },
  },
  {
    code: '3_months',
    sortOrder: 2,
    label: { ar: '3 أشهر', fr: '3 mois', en: '3 months' },
  },
  {
    code: '6_months',
    sortOrder: 3,
    label: { ar: '6 أشهر', fr: '6 mois', en: '6 months' },
  },
  {
    code: '1_year',
    sortOrder: 4,
    label: { ar: 'سنة كاملة', fr: '1 an', en: '1 year' },
  },
  {
    code: 'lifetime',
    sortOrder: 5,
    label: { ar: 'مدى الحياة', fr: 'À vie', en: 'Lifetime' },
  },
];

export function buildDefaultDeliveryMap(): Map<string, LocalizedOptionLabels> {
  return new Map(DEFAULT_DELIVERY_OPTIONS.map((o) => [o.code, o.label]));
}

export function buildDefaultDurationMap(): Map<string, LocalizedOptionLabels> {
  return new Map(DEFAULT_DURATION_OPTIONS.map((o) => [o.code, o.label]));
}

