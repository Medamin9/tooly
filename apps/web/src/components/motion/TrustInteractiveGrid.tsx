'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  Headphones,
  Check,
  MessageCircle,
  Coins,
} from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { BlurText } from './BlurText';
import { MobileCardCarousel } from '@/components/ui/MobileCardCarousel';
import './TrustInteractiveGrid.css';

export interface TrustInteractiveGridProps {
  dict: Dictionary['trustSection'];
  locale: Locale;
}

interface TrustCardData {
  id: string;
  badge: {
    ar: string;
    fr: string;
    en: string;
  };
  title: string;
  description: string;
  accent: string;
  glowColor: string;
  icon: React.ReactNode;
  tags: {
    ar: string[];
    fr: string[];
    en: string[];
  };
  highlightStat: {
    value: string;
    label: {
      ar: string;
      fr: string;
      en: string;
    };
  };
}

export function TrustInteractiveGrid({ dict, locale }: TrustInteractiveGridProps) {
  const cardsData: TrustCardData[] = [
    {
      id: 'pillar-1',
      badge: {
        ar: 'شفافية مالية 100%',
        fr: 'Transparence 100%',
        en: '100% Transparent',
      },
      title: dict.pillar1Title,
      description: dict.pillar1Desc,
      accent: '#F52F3D',
      glowColor: 'rgba(245, 47, 61, 0.22)',
      icon: <Coins className="w-6 h-6 text-tooly-red" />,
      tags: {
        ar: ['0% رسوم تحويل دولية', 'أسعار صافية بالدينار التونسي (TND)', 'فواتير موثقة'],
        fr: ['0% frais de change bancaire', 'Tarifs nets en Dinar Tunisien (TND)', 'Facturation claire'],
        en: ['0% bank exchange fees', 'Net prices in Tunisian Dinar (TND)', 'Clear invoices'],
      },
      highlightStat: {
        value: '0 TND',
        label: {
          ar: 'رسوم خفية أو مفاجئة',
          fr: 'Frais cachés ou surprises',
          en: 'Hidden or surprise fees',
        },
      },
    },
    {
      id: 'pillar-2',
      badge: {
        ar: 'فريق محلي بتونس',
        fr: 'Équipe en Tunisie',
        en: 'Local Tunisian Team',
      },
      title: dict.pillar2Title,
      description: dict.pillar2Desc,
      accent: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.22)',
      icon: <Headphones className="w-6 h-6 text-amber-500" />,
      tags: {
        ar: ['مرافقة خطوة بخطوة', 'دعم عبر واتساب وتيليغرام', 'توجيهات الاستخدام وحل المشكلات'],
        fr: ['Assistance pas à pas', 'Support WhatsApp & Telegram', 'Conseils et configuration'],
        en: ['Step-by-step assistance', 'WhatsApp & Telegram support', 'Setup & onboarding guidance'],
      },
      highlightStat: {
        value: '< 15 min',
        label: {
          ar: 'متوسط زمن الرد الأولي',
          fr: 'Temps de réponse moyen',
          en: 'Average first response time',
        },
      },
    },
    {
      id: 'pillar-3',
      badge: {
        ar: 'ضمان الاستمرارية',
        fr: 'Continuité garantie',
        en: 'Continuity guarantee',
      },
      title: dict.pillar3Title,
      description: dict.pillar3Desc,
      accent: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.22)',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      tags: {
        ar: ['تحديد نوع الحساب مسبقاً', 'دعوات رسمية ومساحات عمل آمنة', 'استبدال فوري عند أي طارئ'],
        fr: ['Spécification du compte à l’avance', 'Invitations d’équipe sécurisées', 'Remplacement garanti'],
        en: ['Account type stated upfront', 'Official team invites & secure seats', 'Instant replacement guarantee'],
      },
      highlightStat: {
        value: '100%',
        label: {
          ar: 'ضمان مدة الاشتراك كاملة',
          fr: 'Garantie durée complète',
          en: 'Full-term duration coverage',
        },
      },
    },
  ];

  return (
    <MobileCardCarousel
      desktopBreakpoint="lg"
      locale={locale}
      ariaLabel={dict.title}
    >
      {cardsData.map((card, idx) => (
        <InteractiveTrustCard key={card.id} card={card} locale={locale} index={idx} />
      ))}
    </MobileCardCarousel>
  );
}

function InteractiveTrustCard({
  card,
  locale,
  index,
}: {
  card: TrustCardData;
  locale: Locale;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return;
    let rect = rectRef.current;
    if (!rect) {
      rect = cardRef.current.getBoundingClientRect();
      rectRef.current = rect;
    }
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    rectRef.current = null;
    if (!cardRef.current || reduceMotion) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  const badgeText = card.badge[locale] || card.badge.en;
  const tagsList = card.tags[locale] || card.tags.en;
  const statLabel = card.highlightStat.label[locale] || card.highlightStat.label.en;

  return (
    <div className="trust-card-wrapper w-full h-full">
      <div
        ref={cardRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="trust-card h-full p-6 sm:p-8 flex flex-col justify-between text-start cursor-default select-none shadow-xl border border-white/10"
        style={
          {
            '--card-accent': card.accent,
            '--card-glow-color': card.glowColor,
          } as React.CSSProperties
        }
      >
        {/* Dynamic Spotlight Glare & Ambient Aura */}
        <div className="trust-card-glow" />
        <div className="trust-card-glare" />

        {/* Content layer (z-index 10) */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            {/* Top Row: Icon + Badge + Kinetic Motif */}
            <div className="flex items-center justify-between mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 8px 16px -6px ${card.glowColor}`,
                }}
              >
                {/* Micro orbit ring */}
                <div
                  className="absolute inset-0.5 rounded-2xl border border-dashed border-white/20 animate-trust-orbit"
                  style={{ animationDuration: `${16 + index * 4}s` }}
                />
                <div className="relative z-10">{card.icon}</div>
              </div>

              {/* Status pill with live glow */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: card.accent,
                  border: `1px solid ${card.accent}33`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-trust-pulse"
                  style={{ backgroundColor: card.accent }}
                />
                <BlurText
                  as="span"
                  text={badgeText}
                  delay={50}
                  animateBy="words"
                  direction="top"
                  className="inline"
                />
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3">
              <BlurText
                as="span"
                text={card.title}
                delay={65}
                animateBy="words"
                direction="top"
                className="inline"
              />
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-normal">
              <BlurText
                as="span"
                text={card.description}
                delay={35}
                animateBy="words"
                direction="top"
                className="inline"
              />
            </p>

            {/* Feature Checklist Tags */}
            <div className="space-y-2.5 mb-8">
              {tagsList.map((tag, tIdx) => (
                <div key={tIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: `${card.accent}25`,
                      color: card.accent,
                    }}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <BlurText
                    as="span"
                    text={tag}
                    delay={45}
                    animateBy="words"
                    direction="top"
                    className="font-medium inline"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Highlight Stat Box */}
          <div
            className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto rounded-xl p-3"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <div>
              <div
                dir="ltr"
                className="text-lg sm:text-xl font-black tracking-tight"
                style={{ color: card.accent }}
              >
                <BlurText
                  as="span"
                  text={card.highlightStat.value}
                  delay={60}
                  animateBy="words"
                  direction="top"
                  className="inline"
                />
              </div>
              <div className="text-[11px] text-neutral-400 font-medium">
                <BlurText
                  as="span"
                  text={statLabel}
                  delay={45}
                  animateBy="words"
                  direction="top"
                  className="inline"
                />
              </div>
            </div>

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `${card.accent}15`,
                color: card.accent,
              }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrustInteractiveGrid;
