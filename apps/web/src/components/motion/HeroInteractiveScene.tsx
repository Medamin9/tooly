'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, Code2, Palette, Video, Cpu, ShieldCheck } from 'lucide-react';

export function HeroInteractiveScene({ locale }: { locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      // Floating gentle animation for cards
      gsap.to(card1Ref.current, {
        y: -12,
        rotation: 1,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(card2Ref.current, {
        y: 10,
        rotation: -1.5,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });

      gsap.to(card3Ref.current, {
        y: -8,
        rotation: 1.2,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.9,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center p-4 select-none"
      aria-hidden="true"
    >
      {/* Background ambient decorative shapes */}
      <div className="absolute inset-0 bg-gradient-to-tr from-tooly-soft-red/40 via-paper to-amber-50/30 rounded-feature -z-10 border border-line/60" />
      <div className="absolute w-72 h-72 bg-tooly-red/5 rounded-full blur-3xl -top-10 -right-10 pointer-events-none" />
      <div className="absolute w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl -bottom-10 -left-10 pointer-events-none" />

      {/* Interactive Card 1: Claude / AI Assistant */}
      <div
        ref={card1Ref}
        className="absolute top-6 start-4 sm:start-8 bg-surface rounded-card p-4 sm:p-5 border border-line shadow-lg max-w-[210px] sm:max-w-[230px] transition-transform hover:scale-105"
      >
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-9 h-9 rounded-control bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-ink">Claude 3.5 Pro</div>
            <div className="text-[10px] text-muted">Anthropic AI</div>
          </div>
        </div>
        <div className="text-[11px] text-ink/80 font-medium bg-paper p-2 rounded-control border border-line">
          {locale === 'ar' ? 'توليد كود وبرمجة متقدمة' : 'Code generation & logic'}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'مضمون 100%' : '100% Guaranteed'}</span>
          </span>
          <span className="font-extrabold text-ink">79 د.ت</span>
        </div>
      </div>

      {/* Interactive Card 2: Canva / Creative Suite */}
      <div
        ref={card2Ref}
        className="absolute bottom-6 end-4 sm:end-8 bg-surface rounded-card p-4 sm:p-5 border border-line shadow-xl max-w-[210px] sm:max-w-[240px] transition-transform hover:scale-105 z-10"
      >
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-9 h-9 rounded-control bg-sky-50 text-sky-800 flex items-center justify-center font-bold">
            <Palette className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-ink">Canva Pro Team</div>
            <div className="text-[10px] text-muted">100M+ Templates</div>
          </div>
        </div>
        <div className="text-[11px] text-ink/80 font-medium bg-paper p-2 rounded-control border border-line">
          {locale === 'ar' ? 'تفعيل على بريدك الخاص' : 'Direct email activation'}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px]">
          <span className="text-tooly-red font-semibold">
            {locale === 'ar' ? 'سنة كاملة' : '1 Full Year'}
          </span>
          <span className="font-extrabold text-ink">149 د.ت</span>
        </div>
      </div>

      {/* Center Interactive Anchor: Cursor / Developer Suite */}
      <div
        ref={card3Ref}
        className="bg-surface/90 backdrop-blur-sm rounded-feature p-6 border-2 border-line shadow-2xl max-w-[240px] sm:max-w-[270px] text-center z-20"
      >
        <div className="w-12 h-12 mx-auto rounded-control bg-tooly-soft-red text-tooly-red flex items-center justify-center mb-3">
          <Cpu className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-extrabold text-ink mb-1">Tooly.tn Hub</h4>
        <p className="text-[11px] text-muted leading-relaxed mb-3">
          {locale === 'ar'
            ? 'منظومة الاشتراكات الرقمية التونسية الأولى'
            : 'Tunisia’s premier verified digital tools hub'}
        </p>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ink bg-paper px-3 py-1 rounded-full border border-line">
          <span>🇹🇳 الدفع محلي بالدينار</span>
        </div>
      </div>
    </div>
  );
}
