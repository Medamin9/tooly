'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Cpu,
  Palette,
  Video as VideoIcon,
  Code2,
  Clock,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CtaArrow } from '@/components/ui/CtaArrow';
import type { Locale } from '@tooly/contracts';
import type { DemoPlan } from '@/lib/catalog/data';
import type { StorefrontPlan } from '@/lib/catalog/mappers';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import './CuratedCardCylinder.css';

type SupportedLang = 'ar' | 'fr' | 'en';

// Premium high-energy ambient video loops provided in spec
const CARD_VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_030111_a9e15665-d379-4a7f-8116-695bbe452ad1.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_171347_f640c30d-ec21-426a-98bc-77e07c2c60cb.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4',
];

// Appropriate themed styling and brand emblems for each offer type
interface CardOfferTheme {
  categoryLabel: { ar: string; fr: string; en: string };
  tierBadge: string;
  serialCode: string;
  cardHolder: string;
  cvv: string;
  accentGlow: string;
  borderGlow: string;
  renderLogo: () => React.ReactNode;
}

const OFFER_THEMES: Record<string, CardOfferTheme> = {
  'claude-pro': {
    categoryLabel: { ar: 'ذكاء اصطناعي فائق', fr: 'IA & Raisonnement', en: 'Advanced AI & Reasoning' },
    tierBadge: 'SONNET 3.5 • PRO PASS',
    serialCode: 'TOOLY • 7942 • 8831 • CLDE',
    cardHolder: 'PRO RESEARCHER',
    cvv: '350',
    accentGlow: 'from-amber-500/25 via-orange-600/15 to-transparent',
    borderGlow: 'border-amber-400/40',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 text-amber-200">
        <Cpu className="w-5 h-5 text-amber-300" />
        <span className="font-black text-sm tracking-widest text-white drop-shadow">ANTHROPIC</span>
      </div>
    ),
  },
  'canva-pro': {
    categoryLabel: { ar: 'تصميم وجرافيك', fr: 'Design & Création', en: 'Design & Graphics' },
    tierBadge: 'CREATIVE SUITE • 1TB CLOUD',
    serialCode: 'TOOLY • 1490 • 5521 • CNVA',
    cardHolder: 'LEAD DESIGNER',
    cvv: '109',
    accentGlow: 'from-cyan-500/25 via-purple-600/15 to-transparent',
    borderGlow: 'border-cyan-400/40',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 text-cyan-200">
        <Palette className="w-5 h-5 text-cyan-300" />
        <span className="font-black text-sm tracking-widest text-white drop-shadow italic">Canva</span>
      </div>
    ),
  },
  'chatgpt-plus': {
    categoryLabel: { ar: 'ذكاء اصطناعي وتوليد', fr: 'IA Générative & Vision', en: 'Generative AI & Vision' },
    tierBadge: 'GPT-4O & O1 • PLUS PASS',
    serialCode: 'TOOLY • 8500 • 3394 • GPT4',
    cardHolder: 'AI ARCHITECT',
    cvv: '764',
    accentGlow: 'from-emerald-500/25 via-teal-600/15 to-transparent',
    borderGlow: 'border-emerald-400/40',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 text-emerald-200">
        <Sparkles className="w-5 h-5 text-emerald-300" />
        <span className="font-black text-sm tracking-widest text-white drop-shadow">OPENAI</span>
      </div>
    ),
  },
  'capcut-pro': {
    categoryLabel: { ar: 'مونتاج وصناعة الفيديو', fr: 'Montage Vidéo & Motion', en: 'Video Editing & 4K' },
    tierBadge: '4K 60FPS • AI AUTO CUT',
    serialCode: 'TOOLY • 1290 • 9912 • CPUT',
    cardHolder: 'MOTION CREATOR',
    cvv: '491',
    accentGlow: 'from-fuchsia-500/25 via-violet-600/15 to-transparent',
    borderGlow: 'border-fuchsia-400/40',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 text-fuchsia-200">
        <VideoIcon className="w-5 h-5 text-fuchsia-300" />
        <span className="font-black text-sm tracking-widest text-white drop-shadow">CapCut</span>
      </div>
    ),
  },
  'cursor-pro': {
    categoryLabel: { ar: 'تطوير وبرمجة سحابية', fr: 'IDE & Code IA', en: 'AI IDE & Codebase' },
    tierBadge: 'CODEBASE AI • PRO SEAT',
    serialCode: 'TOOLY • 8900 • 4481 • CRSR',
    cardHolder: 'DEV ENGINEER',
    cvv: '255',
    accentGlow: 'from-sky-500/25 via-blue-600/15 to-transparent',
    borderGlow: 'border-sky-400/40',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 text-sky-200">
        <Code2 className="w-5 h-5 text-sky-300" />
        <span className="font-black text-sm tracking-widest text-white drop-shadow font-mono">CURSOR</span>
      </div>
    ),
  },
};

const DEFAULT_THEME: CardOfferTheme = {
  categoryLabel: { ar: 'اشتراك احترافي', fr: 'Pass Professionnel', en: 'Pro Pass' },
  tierBadge: 'TOOLY VERIFIED PASS',
  serialCode: 'TOOLY • 9900 • 0000 • PASS',
  cardHolder: 'VERIFIED SUBSCRIBER',
  cvv: '888',
  accentGlow: 'from-tooly-red/25 via-ink/20 to-transparent',
  borderGlow: 'border-white/20',
  renderLogo: () => (
    <div className="flex items-center gap-1.5 text-white">
      <Zap className="w-5 h-5 text-tooly-red" />
      <span className="font-black text-sm tracking-widest text-white drop-shadow">TOOLY.TN</span>
    </div>
  ),
};

interface CuratedCardCylinderProps {
  plans: Array<DemoPlan | StorefrontPlan>;
  locale: Locale;
  dict: Dictionary['curated'];
}

export function CuratedCardCylinder({ plans, locale, dict }: CuratedCardCylinderProps) {
  // We use exactly 5 plans for the circular cylinder carousel
  const activePlans = useMemo(() => {
    return plans.slice(0, 5);
  }, [plans]);

  const cardCount = activePlans.length;
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameId = useRef<number>(0);

  // Continuous scroll progress
  const progress = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reactive active index to synchronize side panels
  const [activeIndex, setActiveIndex] = useState(0);
  const lastActiveIndex = useRef<number>(0);

  // Track mouse coordinates for interactive 3D parallax tilt with inertia damping
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Responsive state containing card dimensions (credit card standard 1.59 ratio)
  const [metrics, setMetrics] = useState({
    cardW: 340,
    cardH: 214,
    stageH: 480,
  });

  // Mouse move handler for 3D parallax tilt
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const rx = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      const ry = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      mouse.current.targetX = Math.max(-1, Math.min(1, rx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ry));
    };

    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Resize handler for responsive card dimensions (accounts for 3D z=400 perspective magnification ~1.42x)
  useEffect(() => {
    const updateMetrics = () => {
      const vw = Math.min(
        window.innerWidth,
        document.documentElement?.clientWidth || window.innerWidth
      );
      const stageWidth =
        containerRef.current?.clientWidth || Math.max(220, vw - 64);
      const maxFittingCardW = Math.max(150, Math.floor((stageWidth - 28) / 1.46));

      let cardW = 340;
      if (vw < 480) {
        cardW = Math.min(196, maxFittingCardW);
      } else if (vw < 640) {
        cardW = Math.min(230, maxFittingCardW);
      } else if (vw < 1024) {
        cardW = Math.min(310, maxFittingCardW);
      } else {
        cardW = 340;
      }

      const cardH = Math.round(cardW / 1.5925);
      const stageH = vw < 640 ? 340 : 480;
      setMetrics((prev) =>
        prev.cardW === cardW && prev.cardH === cardH && prev.stageH === stageH
          ? prev
          : { cardW, cardH, stageH }
      );
    };

    updateMetrics();
    const rafId = requestAnimationFrame(updateMetrics);
    window.addEventListener('resize', updateMetrics);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(updateMetrics);
      ro.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateMetrics);
      ro?.disconnect();
    };
  }, []);

  // 60fps render loop with smoothstep cylinder interpolation
  const renderLoop = useCallback(() => {
    if (!isPaused) {
      // Gentle, calm continuous rotation
      progress.current += 0.0016;
    }

    // Smooth inertia damping for cursor parallax
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

    const cards = cardsRefs.current;
    const { cardH, stageH } = metrics;
    const h = stageH; // Height of the 3D stage

    const continuousProgress = progress.current;
    const roundedIndex = Math.round(continuousProgress);
    const diffFromRound = continuousProgress - roundedIndex;

    // Non-linear magnetic dwell logic
    const easedDiff = Math.sign(diffFromRound) * Math.pow(Math.abs(diffFromRound) * 2, 4.2) / 2;
    const virtualActiveIndex = roundedIndex + easedDiff;

    // Determine current active card index for side panels synchronization
    const currentActiveCardIndex = ((roundedIndex % cardCount) + cardCount) % cardCount;
    if (currentActiveCardIndex !== lastActiveIndex.current) {
      lastActiveIndex.current = currentActiveCardIndex;
      setActiveIndex(currentActiveCardIndex);
    }

    for (let i = 0; i < cardCount; i++) {
      const card = cards[i];
      if (!card) continue;

      let offset = i - virtualActiveIndex;
      const halfCount = cardCount / 2;
      while (offset > halfCount) offset -= cardCount;
      while (offset < -halfCount) offset += cardCount;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      if (absOffset > 3.0) {
        card.style.visibility = 'hidden';
        continue;
      } else {
        card.style.visibility = 'visible';
      }

      const gap = 36;
      const peekAmount = -55;
      const D = 1350;

      let y = 0;
      let z = 0;
      let rot = 0;

      if (absOffset <= 1) {
        const t = absOffset;
        const easedT = t * t * (3 - 2 * t);
        const targetY = cardH + gap;
        y = -sign * (easedT * targetY);
        z = 400 + easedT * (220 - 400);
        rot = easedT * 132;
      } else if (absOffset <= 2) {
        const t = absOffset - 1;
        const easedT = t * t * (3 - 2 * t);
        const yStart = cardH + gap;
        const zStart = 220;
        const rotStart = 132;
        const zEnd = -60;
        const rotEnd = 175;

        const sEnd = D / (D - zEnd);
        const yEnd = (h / 2 - peekAmount) / sEnd - (cardH / 2);
        const currentY = yStart + easedT * (yEnd - yStart);
        y = -sign * currentY;
        z = zStart + easedT * (zEnd - zStart);
        rot = rotStart + easedT * (rotEnd - rotStart);
      } else {
        const t = Math.min(absOffset - 2, 1);
        const easedT = t * t * (3 - 2 * t);
        const zStart = -60;
        const rotStart = 175;
        const zEnd3 = -250;
        const rotEnd3 = 195;

        const sEnd2 = D / (D - zStart);
        const yEnd2 = (h / 2 - peekAmount) / sEnd2 - (cardH / 2);
        const sEnd3 = D / (D - zEnd3);
        const yEnd3 = (h / 2 + 100) / sEnd3 + (cardH / 2);
        const currentY = yEnd2 + easedT * (yEnd3 - yEnd2);
        y = -sign * currentY;
        z = zStart + easedT * (zEnd3 - zStart);
        rot = rotStart + easedT * (rotEnd3 - rotStart);
      }

      const localCardRotation = -sign * rot;
      const centerFactor = Math.max(0, 1 - absOffset);

      const maxTiltY = 15;
      const maxTiltX = 12;

      const activeTiltX = -mouse.current.y * maxTiltX * centerFactor;
      const activeTiltY = mouse.current.x * maxTiltY * centerFactor;

      const totalRotX = localCardRotation + activeTiltX;
      const totalRotY = activeTiltY;

      card.style.zIndex = Math.round(z).toString();
      card.style.opacity = '1';
      card.style.transform = `translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) rotateZ(-3deg)`;
    }
  }, [cardCount, isPaused, metrics]);

  useEffect(() => {
    let inView = true;
    let isHidden = false;

    const tick = () => {
      if (!inView || isHidden) {
        frameId.current = 0;
        return;
      }
      renderLoop();
      frameId.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frameId.current && inView && !isHidden) {
        frameId.current = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
        frameId.current = 0;
      }
    };

    const onVisibility = () => {
      isHidden = typeof document !== 'undefined' ? document.hidden : false;
      if (isHidden) stop();
      else start();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) start();
        else stop();
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    document.addEventListener('visibilitychange', onVisibility);

    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [renderLoop]);

  // Jump smoothly to a specific card
  const navigateToCard = (targetIndex: number) => {
    const currentRound = Math.round(progress.current);
    const currentPos = ((currentRound % cardCount) + cardCount) % cardCount;
    let diff = targetIndex - currentPos;
    if (diff > cardCount / 2) diff -= cardCount;
    if (diff < -cardCount / 2) diff += cardCount;
    progress.current = currentRound + diff;
    setActiveIndex(targetIndex);
  };

  const handleNext = () => {
    const target = (activeIndex + 1) % cardCount;
    navigateToCard(target);
  };

  const handlePrev = () => {
    const target = (activeIndex - 1 + cardCount) % cardCount;
    navigateToCard(target);
  };

  // 3D volumetric thickness layers (-1.47px to 1.47px)
  const thicknessLayers = [-1.47, -0.73, 0, 0.73, 1.47];

  const currentPlan = activePlans[activeIndex] || activePlans[0];
  const currentTheme = OFFER_THEMES[currentPlan.slug] || DEFAULT_THEME;
  const lang: SupportedLang = (locale === 'fr' || locale === 'en') ? locale : 'ar';

  return (
    <div className="relative w-full rounded-[32px] bg-[#000000] border border-white/10 p-4 sm:p-8 lg:p-10 shadow-2xl overflow-hidden select-none">
      {/* Background ambient radial glow responding to the active offer */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 bg-gradient-to-b ${currentTheme.accentGlow}`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header with Title and Catalog Link */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success" size="sm" className="bg-black text-white border-none font-bold">
              {locale === 'ar' ? 'عروض مختارة 3D' : locale === 'fr' ? 'Sélection 3D' : 'Curated 3D Passes'}
            </Badge>
            <span className="text-[11px] text-white/50 tracking-wider font-mono uppercase">
              {dict.inStock}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {dict.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-xl mt-1">
            {dict.subtitle}
          </p>
        </div>

        {/* Carousel controls & Catalog button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={dict.prevCard}
              className="p-2 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
              className="p-2 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={dict.nextCard}
              className="p-2 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <Link href={`/${locale}/catalog`}>
            <Button variant="outline" size="sm" className="border-white/20 text-black/80 bg-black hover:bg-white hover:text-black">

              <span>{locale === 'ar' ? 'عرض الكتالوج الكامل' : locale === 'fr' ? 'Tout le catalogue' : 'View Full Catalog'}</span>
              <CtaArrow className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main 3-Column Center Stage */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[380px] lg:min-h-[520px]">
        {/* SIDE 1 (Start side): TYPE OF OFFER & DETAILS */}
        <div className="lg:col-span-3 order-2 lg:order-1 text-start">
          <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/25">
            {/* Offer Type Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-tooly-red font-semibold bg-tooly-red/10 px-2 py-0.5 rounded-md border border-tooly-red/20">
                {currentTheme.categoryLabel[lang] || currentPlan.category}
              </span>
              <span className="text-[11px] font-mono text-white/40">
                0{activeIndex + 1} / 0{cardCount}
              </span>
            </div>

            {/* Provider and Title */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-white/60 mb-0.5 uppercase tracking-wider">
                {currentPlan.provider}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentPlan.name}
              </h3>
            </div>

            {/* Tagline & Description */}
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed mb-4 min-h-[40px]">
              {currentPlan.tagline[lang]}
            </p>

            <div className="h-px w-full bg-white/10 my-4" />

            {/* Price and Duration Display */}
            <div className="mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  {currentPlan.priceTND.toFixed(0)}
                </span>
                <span className="text-sm font-bold text-tooly-red">TND</span>
                <span className="text-xs text-white/50">
                  / {currentPlan.durationLabel[lang]}
                </span>
              </div>
              <div className="text-[11px] text-white/40 mt-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{dict.deliveryTime}</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col gap-2.5">
              <Link href={`/${locale}/catalog/${currentPlan.slug}`} className="w-full">
                <Button className="w-full bg-tooly-red hover:bg-tooly-red/90 text-white font-bold py-2.5 text-xs sm:text-sm shadow-lg shadow-tooly-red/25 border-none">
                  <span>{dict.orderNow}</span>
                  <Zap className="w-3.5 h-3.5" />
                </Button>
              </Link>

              <Link href={`/${locale}/catalog/${currentPlan.slug}`} className="w-full">
                <Button variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/5 text-xs py-2">
                  <span>{dict.viewDetails}</span>
                  <ExternalLink className="w-3 h-3 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: INTERACTIVE 3D HORIZONTAL CYLINDER CAROUSEL */}
        <div
          ref={containerRef}
          className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center justify-center relative w-full h-[340px] sm:h-[490px] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle top/bottom fade gradients to blend off-screen cylinder cards smoothly */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#000000] to-transparent z-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#000000] to-transparent z-30 pointer-events-none" />

          {/* 3D Perspective Camera Viewport */}
          <div
            className="tooly-cylinder-wrapper relative w-full h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{ perspective: '1350px' }}
          >
            {/* Dynamic 3D coordinate viewport */}
            <div
              className="absolute tooly-preserve-3d"
              style={{
                width: `${metrics.cardW}px`,
                height: `${metrics.cardH}px`,
                transformStyle: 'preserve-3d',
              }}
            >
              {activePlans.map((plan, i) => {
                const theme = OFFER_THEMES[plan.slug] || DEFAULT_THEME;
                const videoSrc = CARD_VIDEOS[i % CARD_VIDEOS.length];

                return (
                  <div
                    key={plan.id}
                    ref={(el) => {
                      cardsRefs.current[i] = el;
                    }}
                    onClick={() => navigateToCard(i)}
                    className="absolute inset-0 tooly-card-slice cursor-pointer"
                    style={{
                      width: `${metrics.cardW}px`,
                      height: `${metrics.cardH}px`,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'visible',
                    }}
                  >
                    {/* Volumetric 3D thickness with stacked parallel slices */}
                    {thicknessLayers.map((zOffset, layerIdx) => {
                      const isFrontFace = layerIdx === thicknessLayers.length - 1;
                      const isBackFace = layerIdx === 0;

                      // Middle structural volumetric depth slices
                      if (!isFrontFace && !isBackFace) {
                        return (
                          <div
                            key={layerIdx}
                            className="absolute inset-0 rounded-[18px] border border-[#555555] pointer-events-none overflow-hidden"
                            style={{
                              backgroundColor: '#262626',
                              transform: `translateZ(${zOffset}px)`,
                            }}
                          />
                        );
                      }

                      // Front Face Slice
                      if (isFrontFace) {
                        return (
                          <div
                            key={layerIdx}
                            className={`tooly-front-face absolute inset-0 rounded-[18px] border ${theme.borderGlow} pointer-events-none overflow-hidden bg-[#0d0d0d] shadow-2xl`}
                            style={{
                              transform: `translateZ(${zOffset}px)`,
                              backfaceVisibility: 'hidden',
                              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25), 0 20px 40px -15px rgba(0,0,0,0.8)',
                            }}
                          >
                            {/* Autoplaying ambient video background */}
                            <video
                              src={videoSrc}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="none"
                              className="absolute inset-0 w-full h-full object-cover rounded-[18px] opacity-85"
                            />

                            {/* Card Content & Brand Watermark */}
                            <div className="absolute inset-0 p-3 sm:p-5 text-white h-full w-full font-sans z-10 bg-black/25 flex flex-col justify-between">
                              {/* Top Bar: Brand Logo on Right, Pass Tier on Left */}
                              <div className="flex items-center justify-between gap-1.5 w-full">
                                <div className="text-[7px] sm:text-[9px] font-mono tracking-wider sm:tracking-widest uppercase bg-black/40 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded border border-white/10 text-white/90 truncate max-w-[56%]">
                                  {theme.tierBadge}
                                </div>
                                <div className="shrink-0 [&_svg]:w-3.5 [&_svg]:h-3.5 sm:[&_svg]:w-5 sm:[&_svg]:h-5 [&_span]:text-[10px] sm:[&_span]:text-sm">
                                  {theme.renderLogo()}
                                </div>
                              </div>

                              {/* Center Contact Chip & Plan Identity */}
                              <div className="flex items-center justify-between gap-2 my-auto">
                                {/* Silver Metallic Chip SVG */}
                                <div className="relative shrink-0">
                                  <svg
                                    className="w-5 h-5 sm:w-8 sm:h-8 drop-shadow"
                                    viewBox="0 0 60 60"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M20 8H40V14C40.0016 14.5299 40.2128 15.0377 40.5875 15.4125C40.9623 15.7872 41.4701 15.9984 42 16H59V24H42C41.4701 24.0016 40.9623 24.2128 40.5875 24.5875C40.2128 24.9623 40.0016 25.4701 40 26V52H20V8ZM18 8H8.00039C4.47435 8 1.56576 10.6083 1.08 14H18V8ZM1 16V24V26V34V36V44H18V36H1V34H18V26H1V24H18V16H1ZM1.08 46C1.56576 49.3917 4.47435 52 8.00039 52H18V46H1.08ZM42 14V8H52.0004C55.5264 8 58.4342 10.6084 58.92 14H42ZM59 26H42V34H59V26ZM59 36H42V44H59V36ZM52.0004 52H42V46H58.92C58.4342 49.3916 55.5264 52 52.0004 52Z"
                                      fill={`url(#paint0_linear_tooly_${i})`}
                                    />
                                    <defs>
                                      <linearGradient
                                        id={`paint0_linear_tooly_${i}`}
                                        x1="30"
                                        y1="8"
                                        x2="30"
                                        y2="52"
                                        gradientUnits="userSpaceOnUse"
                                      >
                                        <stop stopColor="#FFFFFF" />
                                        <stop offset="0.5" stopColor="#D4D4D8" />
                                        <stop offset="1" stopColor="#71717A" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </div>

                                {/* Plan Watermark */}
                                <div className="text-end min-w-0">
                                  <div className="text-xs sm:text-lg font-black tracking-tight text-white drop-shadow leading-tight truncate">
                                    {plan.name}
                                  </div>
                                  <div className="text-[8px] sm:text-[10px] font-mono text-white/70 truncate">
                                    {plan.priceTND} TND / {plan.durationLabel.en}
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Details: Pass Number & Intersecting Circles */}
                              <div className="flex items-end justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="font-mono text-[7px] sm:text-[9px] text-white/50 uppercase tracking-widest">
                                    VERIFIED PASS
                                  </div>
                                  <div className="font-mono text-[8px] sm:text-[11px] font-medium tracking-[0.08em] sm:tracking-[0.14em] text-white/95 truncate">
                                    {theme.serialCode}
                                  </div>
                                </div>

                                {/* Double intersecting circles emblem */}
                                <div className="flex -space-x-2 sm:-space-x-2.5 items-center opacity-85 shrink-0">
                                  <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white/20 backdrop-blur-md border border-white/20" />
                                  <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-tooly-red/40 backdrop-blur-md border border-tooly-red/30" />
                                </div>
                              </div>
                            </div>

                            {/* Gloss sheen line overlay */}
                            <div className="absolute inset-0 tooly-gloss-sheen pointer-events-none" />
                          </div>
                        );
                      }

                      // Back Face Slice (flipped 180 degrees)
                      if (isBackFace) {
                        return (
                          <div
                            key={layerIdx}
                            className={`tooly-back-face absolute inset-0 rounded-[18px] border ${theme.borderGlow} pointer-events-none overflow-hidden bg-[#0a0a0a]`}
                            style={{
                              transform: `translateZ(${zOffset}px) rotateX(180deg)`,
                              backfaceVisibility: 'hidden',
                              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
                            }}
                          >
                            {/* Blurred video texture on back face */}
                            <div className="absolute inset-0 pointer-events-none scale-125 filter blur-lg opacity-60">
                              <video
                                src={videoSrc}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Magnetic Stripe */}
                            <div className="absolute left-0 right-0 top-3 sm:top-5 h-5 sm:h-8 bg-black/90 backdrop-blur-md z-10 border-y border-white/10" />

                            {/* Subscriber info and security verification */}
                            <div className="absolute left-3 right-3 bottom-2.5 sm:left-5 sm:right-5 sm:bottom-4 z-20 flex flex-col gap-0.5 sm:gap-1 text-start font-mono">
                              <div className="text-[7px] sm:text-[9px] text-white/50 tracking-wider">
                                {dict.passHolder}
                              </div>
                              <div className="text-[9px] sm:text-[11px] font-medium text-white tracking-widest uppercase truncate">
                                {theme.cardHolder}
                              </div>
                              <div className="flex items-center justify-between gap-2 text-[7px] sm:text-[8px] text-white/60 pt-1 border-t border-white/10 mt-0.5 sm:mt-1">
                                <span className="truncate">{theme.serialCode}</span>
                                <span className="shrink-0">CVV: {theme.cvv}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Navigation Dots Below Center */}
          <div className="relative z-30 flex items-center justify-center gap-2 mt-4">
            {activePlans.map((plan, idx) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => navigateToCard(idx)}
                aria-label={plan.name}
                className={`transition-all duration-300 rounded-full ${idx === activeIndex
                  ? 'w-8 h-2 bg-tooly-red shadow-sm shadow-tooly-red'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
              />
            ))}
          </div>

          <div className="text-[10px] text-white/40 mt-2 font-mono">
            {dict.interactiveHint}
          </div>
        </div>

        {/* SIDE 2 (End side): FEATURES & VERIFICATION OF ACTIVE OFFER */}
        <div className="lg:col-span-3 order-3 text-start">
          <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/25">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {dict.featuresLabel}
              </h4>
            </div>

            {/* Feature Checklist */}
            <ul className="space-y-3 mb-5">
              {currentPlan.features[lang].map((feat: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-white/80 leading-snug">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="h-px w-full bg-white/10 my-4" />

            {/* Delivery Method Badge */}
            <div className="mb-4 bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-tooly-red" />
                <span>{dict.deliveryBadge}</span>
              </div>
              <p className="text-xs text-white/90 leading-tight">
                {currentPlan.deliveryMethod[lang]}
              </p>
            </div>

            {/* 100% Continuity Guarantee Shield */}
            <div className="flex items-center gap-2.5 text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium text-[11px] leading-tight">
                {dict.guaranteeBadge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CuratedCardCylinder;

