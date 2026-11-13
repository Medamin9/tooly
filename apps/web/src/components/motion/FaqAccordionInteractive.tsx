'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Headphones,
} from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BlurText } from './BlurText';

export interface FaqAccordionInteractiveProps {
  dict: Dictionary['faqSection'];
  locale: Locale;
}

const FAQ_METADATA: Record<
  number,
  {
    icon: string;
    tag: { ar: string; fr: string; en: string };
  }
> = {
  0: {
    icon: '',
    tag: {
      ar: 'طرق الدفع المحلية',
      fr: 'Paiement local',
      en: 'Local payment',
    },
  },
  1: {
    icon: '',
    tag: {
      ar: 'ضمان الاستمرارية',
      fr: 'Garantie continue',
      en: 'Continuity guarantee',
    },
  },
  2: {
    icon: '',
    tag: {
      ar: 'طريقة التفعيل',
      fr: 'Activation & Accès',
      en: 'Activation & Access',
    },
  },
  3: {
    icon: '',
    tag: {
      ar: 'الفواتير والشركات',
      fr: 'Factures professionnelles',
      en: 'Business invoices',
    },
  },
};

const SIDEBAR_TEXT: Record<
  Locale,
  {
    helpTitle: string;
    helpDesc: string;
    whatsappCta: string;
    supportAvailable: string;
    badge: string;
  }
> = {
  ar: {
    helpTitle: 'هل لديك سؤال غير مدرج؟',
    helpDesc: 'فريقنا في تونس جاهز للإجابة فوراً على استفساراتك حول أي أداة أو خطة.',
    whatsappCta: 'تواصل عبر واتساب',
    supportAvailable: 'متاح الآن • رد خلال دقائق',
    badge: 'إجابات واضحة ومباشرة',
  },
  fr: {
    helpTitle: 'Une question spécifique ?',
    helpDesc: 'Notre équipe locale en Tunisie vous répond rapidement sur WhatsApp pour tout besoin.',
    whatsappCta: 'Discuter sur WhatsApp',
    supportAvailable: 'En ligne • Réponse en quelques minutes',
    badge: 'Réponses claires & directes',
  },
  en: {
    helpTitle: 'Have an unlisted question?',
    helpDesc: 'Our local team in Tunisia is ready to answer questions about any tool or custom plan.',
    whatsappCta: 'Chat on WhatsApp',
    supportAvailable: 'Online now • Reply within minutes',
    badge: 'Clear & transparent answers',
  },
};

export function FaqAccordionInteractive({ dict, locale }: FaqAccordionInteractiveProps) {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sidebar = SIDEBAR_TEXT[locale] || SIDEBAR_TEXT.ar;

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* 1. Left Editorial Sidebar */}
      <div className="lg:col-span-5 text-start space-y-6 lg:sticky lg:top-28">
        <div>
          <Badge variant="accent" size="sm" className="mb-3">
            <Sparkles className="w-3.5 h-3.5 me-1.5" />
            <BlurText
              as="span"
              text={sidebar.badge}
              delay={55}
              animateBy="words"
              direction="top"
              className="inline"
            />
          </Badge>
          <BlurText
            as="h2"
            text={dict.title}
            delay={70}
            animateBy="words"
            direction="top"
            className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight mb-3"
          />
          <BlurText
            as="p"
            text={dict.subtitle}
            delay={40}
            animateBy="words"
            direction="top"
            className="text-sm sm:text-base text-muted leading-relaxed"
          />
        </div>

        {/* Artistic Contact Help Box */}
        <div className="relative rounded-2xl p-6 bg-surface border border-line shadow-sm overflow-hidden group hover:border-tooly-red/30 transition-all duration-300">
          <div className="absolute top-0 end-0 w-32 h-32 bg-tooly-soft-red rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform duration-500" />

          {/* Online status indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <BlurText
              as="span"
              text={sidebar.supportAvailable}
              delay={45}
              animateBy="words"
              direction="top"
              className="inline"
            />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-ink mb-2">
            <BlurText
              as="span"
              text={sidebar.helpTitle}
              delay={60}
              animateBy="words"
              direction="top"
              className="inline"
            />
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed mb-5">
            <BlurText
              as="span"
              text={sidebar.helpDesc}
              delay={35}
              animateBy="words"
              direction="top"
              className="inline"
            />
          </p>

          <a
            href="https://wa.me/21600000000?text=Bonjour%20Tooly%20j'ai%20une%20question"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 font-semibold rounded-control transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2.5 shadow-sm hover:shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <BlurText
              as="span"
              text={sidebar.whatsappCta}
              delay={55}
              animateBy="words"
              direction="top"
              className="inline"
            />
          </a>
        </div>
      </div>

      {/* 2. Right Interactive Accordion Stack */}
      <div className="lg:col-span-7 space-y-4 text-start">
        {dict.items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const meta = FAQ_METADATA[idx] || {
            icon: '✨',
            tag: { ar: 'معلومة عامة', fr: 'Information', en: 'Info' },
          };
          const tagLabel = meta.tag[locale] || meta.tag.en;
          const numStr = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 border ${isOpen
                  ? 'bg-surface border-tooly-red/40 shadow-lg ring-1 ring-tooly-red/15'
                  : 'bg-surface/80 hover:bg-surface border-line hover:border-line/80 shadow-xs'
                }`}
            >
              {/* Question Trigger Button */}
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-tooly-red rounded-2xl select-none"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                  {/* Number pill */}
                  <span
                    className={`text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg transition-colors ${isOpen
                        ? 'bg-tooly-soft-red text-tooly-red'
                        : 'bg-paper text-muted'
                      }`}
                  >
                    <BlurText
                      as="span"
                      text={numStr}
                      delay={50}
                      animateBy="words"
                      direction="top"
                      className="inline"
                    />
                  </span>

                  {/* Question Title & Tag */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-muted flex items-center gap-1.5">
                      <BlurText
                        as="span"
                        text={tagLabel}
                        delay={45}
                        animateBy="words"
                        direction="top"
                        className="inline"
                      />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold transition-colors ${isOpen ? 'text-tooly-red' : 'text-ink'
                        }`}
                    >
                      <BlurText
                        as="span"
                        text={item.q}
                        delay={50}
                        animateBy="words"
                        direction="top"
                        className="inline"
                      />
                    </h3>
                  </div>
                </div>

                {/* Animated Rotating Toggle Indicator */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen
                      ? 'bg-tooly-red text-white rotate-180 shadow-sm'
                      : 'bg-paper text-muted border border-line group-hover:border-tooly-red/40'
                    }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Collapsible Answer Content with Smooth Grid Transition */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-ink-light leading-relaxed border-t border-line/60">
                    <p className="mt-2">
                      <BlurText
                        as="span"
                        text={item.a}
                        delay={30}
                        threshold={0}
                        animateBy="words"
                        direction="top"
                        className="inline"
                      />
                    </p>

                    {/* Trust confirmation footer inside open answer */}
                    <div className="mt-4 pt-3 border-t border-line/40 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <BlurText
                        as="span"
                        text={sidebar.supportAvailable}
                        delay={40}
                        threshold={0}
                        animateBy="words"
                        direction="top"
                        className="inline"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FaqAccordionInteractive;
