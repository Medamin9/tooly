'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Palette,
  Video,
  Code2,
  Zap,
  Wand2,
  Search,
  Layout,
  AudioLines,
  Terminal,
  FileText,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { dictionaries, Dictionary } from '@/lib/i18n/dictionaries';
import './DriftWall.css';

export interface OfferMetadata {
  id: string;
  slug: string;
  price: number;
  color: string;
  iconType:
  | 'sparkles'
  | 'bot'
  | 'palette'
  | 'video'
  | 'code'
  | 'zap'
  | 'wand'
  | 'search'
  | 'layout'
  | 'audio'
  | 'terminal'
  | 'file';
  href?: string;
}

// Technical and layout metadata — all textual translations come from dictionaries.ts
const PLATFORM_OFFERS_METADATA: OfferMetadata[] = [
  {
    id: 'claude-pro',
    slug: 'claude-pro',
    price: 79,
    color: '#D97706',
    iconType: 'sparkles',
  },
  {
    id: 'chatgpt-plus',
    slug: 'chatgpt-plus',
    price: 85,
    color: '#10A37F',
    iconType: 'bot',
  },
  {
    id: 'canva-pro',
    slug: 'canva-pro',
    price: 149,
    color: '#00C4CC',
    iconType: 'palette',
  },
  {
    id: 'capcut-pro',
    slug: 'capcut-pro',
    price: 129,
    color: '#E11D48',
    iconType: 'video',
  },
  {
    id: 'cursor-pro',
    slug: 'cursor-pro',
    price: 89,
    color: '#6366F1',
    iconType: 'code',
  },
  {
    id: 'gemini-advanced',
    slug: 'gemini-advanced',
    price: 75,
    color: '#2563EB',
    iconType: 'zap',
  },
  {
    id: 'midjourney-std',
    slug: 'midjourney',
    price: 115,
    color: '#8B5CF6',
    iconType: 'wand',
  },
  {
    id: 'perplexity-pro',
    slug: 'perplexity-pro',
    price: 79,
    color: '#0D9488',
    iconType: 'search',
  },
  {
    id: 'figma-pro',
    slug: 'figma-pro',
    price: 95,
    color: '#F24E1E',
    iconType: 'layout',
  },
  {
    id: 'elevenlabs-creator',
    slug: 'elevenlabs',
    price: 85,
    color: '#4F46E5',
    iconType: 'audio',
  },
  {
    id: 'github-copilot',
    slug: 'github-copilot',
    price: 45,
    color: '#1F2937',
    iconType: 'terminal',
  },
  {
    id: 'notion-ai',
    slug: 'notion-ai',
    price: 55,
    color: '#374151',
    iconType: 'file',
  },
  {
    id: 'grok-2',
    slug: 'grok-2',
    price: 65,
    color: '#18181B',
    iconType: 'zap',
  },
  {
    id: 'runway-gen3',
    slug: 'runway',
    price: 99,
    color: '#EC4899',
    iconType: 'video',
  },
  {
    id: 'claude-team',
    slug: 'claude-pro',
    price: 119,
    color: '#B45309',
    iconType: 'sparkles',
  },
];

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

function renderOfferIcon(iconType: OfferMetadata['iconType']) {
  const iconClass = 'w-3 h-3 sm:w-4 sm:h-4';
  switch (iconType) {
    case 'sparkles':
      return <Sparkles className={iconClass} />;
    case 'bot':
      return <Bot className={iconClass} />;
    case 'palette':
      return <Palette className={iconClass} />;
    case 'video':
      return <Video className={iconClass} />;
    case 'code':
      return <Code2 className={iconClass} />;
    case 'zap':
      return <Zap className={iconClass} />;
    case 'wand':
      return <Wand2 className={iconClass} />;
    case 'search':
      return <Search className={iconClass} />;
    case 'layout':
      return <Layout className={iconClass} />;
    case 'audio':
      return <AudioLines className={iconClass} />;
    case 'terminal':
      return <Terminal className={iconClass} />;
    case 'file':
      return <FileText className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
}

export interface DriftWallProps {
  locale?: string;
  dictScene: Dictionary['heroScene'];
  items?: OfferMetadata[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function DriftWall({
  locale = 'ar',
  dictScene,
  items = PLATFORM_OFFERS_METADATA,
  columns = 3,
  tileWidth = 215,
  tileHeight = 152,
  gap = 16,
  radius = 14,
  tilt = 8,
  turn = -10,
  roll = 0,
  perspective = 1100,
  depth = 50,
  speed = 28,
  direction = 'up',
  variance = 0.35,
  parallax = 0.45,
  pauseOnHover = true,
  lift = 52,
  fade = 0.52,
  dim = 0.85,
  className = '',
  style,
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef<number>(-1);
  const wallHoveredRef = useRef<boolean>(false);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerDampedRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState<number>(500);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo(() => {
    const cols: OfferMetadata[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map((col) => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry?.contentRect?.height || 500);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.0) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  const containerRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    let inView = true;
    let isHidden = false;

    const animate = (ts: number) => {
      if (!inView || isHidden) {
        rafRef.current = null;
        return;
      }

      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, (ts - lastTsRef.current) / 1000));
      lastTsRef.current = ts;

      const maxTilt = parallax * 7;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta)
            el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (rafRef.current === null && inView && !isHidden) {
        lastTsRef.current = null;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTsRef.current = null;
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
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id: string, index: number) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      let rect = containerRectRef.current;
      if (!rect) {
        rect = containerRef.current?.getBoundingClientRect() || null;
        containerRectRef.current = rect;
      }
      if (!rect) return;

      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }

      const target = e.target as HTMLElement | null;
      const tile = target && target.closest ? (target.closest('[data-tile-id]') as HTMLElement | null) : null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (!id || id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    containerRectRef.current = null;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo(
    () =>
      ({
        '--dw-tile-w': `${tileWidth}px`,
        '--dw-tile-h': `${tileHeight}px`,
        '--dw-gap': `${gap}px`,
        '--dw-radius': `${radius}px`,
        '--dw-perspective': `${perspective}px`,
        '--dw-lift': `${lift}px`,
        '--dw-dim': dim,
        '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
        ...style,
      }) as React.CSSProperties,
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, fade, style]
  );

  const renderTile = (item: OfferMetadata, id: string, colIndex: number) => {
    // Sourced entirely from dictionaries.ts
    const translation = dictScene?.offers?.[item.id] || {
      name: item.id,
      provider: '',
      badge: '',
      highlight: '',
      guarantee: '',
      period: 'mo',
    };

    const inner = (
      <span className="drift-wall__inner p-2 sm:p-4 flex flex-col justify-between">
        {/* Top: Icon + Name + Badge */}
        <div>
          <div className="flex items-start justify-between gap-1 sm:gap-1.5 mb-1 sm:mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span
                className="w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                {renderOfferIcon(item.iconType)}
              </span>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[14px] font-bold text-ink truncate leading-tight">
                  {translation.name}
                </div>
                <div className="text-[8.5px] sm:text-[11px] text-muted font-medium truncate">
                  {translation.provider}
                </div>
              </div>
            </div>
            <span
              className="hidden sm:inline-block text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 border"
              style={{
                backgroundColor: `${item.color}10`,
                color: item.color,
                borderColor: `${item.color}30`,
              }}
            >
              {translation.badge}
            </span>
          </div>

          {/* Perk highlight */}
          <div className="px-1.5 py-0.5 sm:px-2 sm:py-1.5 bg-paper/90 rounded sm:rounded-md border border-line/60 text-[8.5px] sm:text-[11px] text-ink/85 font-medium truncate leading-tight">
            {translation.highlight}
          </div>
        </div>

        {/* Bottom: Guarantee + Price */}
        <div className="flex items-center justify-between pt-1 sm:pt-1.5 border-t border-line/50 text-[9px] sm:text-[10px] mt-auto">
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5 sm:gap-1 min-w-0">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline text-[11px] truncate">{translation.guarantee}</span>
          </span>
          <div className="flex items-baseline gap-0.5 sm:gap-1 font-extrabold text-ink shrink-0">
            <span className="text-[10.5px] sm:text-sm text-tooly-red font-black">{item.price}</span>
            <span className="text-[8px] sm:text-[10.5px] text-muted font-semibold">
              {dictScene?.currency || 'TND'} / {translation.period}
            </span>
            <ArrowUpRight className="hidden sm:inline-block w-3 h-3 text-muted/50 rtl:rotate-[-90deg]" />
          </div>
        </div>
      </span>
    );

    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
    };

    const targetUrl = item.href || `/${locale}/catalog/${item.slug}`;

    return (
      <Link
        key={id}
        href={targetUrl}
        aria-label={`${translation.name} - ${item.price} ${dictScene?.currency || 'TND'}`}
        {...commonProps}
      >
        {inner}
      </Link>
    );
  };

  const rootClass = [
    'drift-wall',
    reduced ? 'drift-wall--reduced' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
        containerRectRef.current = containerRef.current?.getBoundingClientRect() || null;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="region"
      aria-label={dictScene?.ariaLabel || 'Digital subscription offers'}
    >
      <div ref={planeRef} className="drift-wall__plane" dir="ltr">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta?.copies || 2 });
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div
                className="drift-wall__track"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) =>
                    renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c)
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface HeroInteractiveSceneProps {
  locale?: string;
  dict?: Dictionary['heroScene'];
}

export function HeroInteractiveScene({
  locale = 'ar',
  dict,
}: HeroInteractiveSceneProps) {
  const isArabic = locale === 'ar';
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync, { passive: true });
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  // Fallback to dictionaries.ts if dict prop is not passed directly
  const dictScene =
    dict ||
    dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : 'ar']
      .heroScene;

  return (
    <div
      className="relative w-full max-w-[760px] h-[250px] sm:h-[420px] md:h-[520px] lg:h-[600px] rounded-feature overflow-hidden"
      aria-label={dictScene.ariaLabel}
    >
      {/* Decorative ambient background glows */}


      {/* Floating status badge anchor */}
      {/* <div className="absolute top-4 start-4 z-20 flex items-center gap-2 bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-line shadow-2xs text-[11px] sm:text-xs font-bold text-ink">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{dictScene.statusBadge}</span>
      </div> */}

      {/* 3-Column React Bits DriftWall featuring authentic platform offers */}
      <DriftWall
        locale={locale}
        dictScene={dictScene}
        items={PLATFORM_OFFERS_METADATA}
        columns={3}
        tileWidth={isMobile ? 104 : 215}
        tileHeight={isMobile ? 74 : 152}
        gap={isMobile ? 6 : 16}
        radius={isMobile ? 10 : 14}
        tilt={8}
        turn={isArabic ? 10 : -10}
        roll={0}
        depth={50}
        perspective={1100}
        speed={28}
        variance={0.35}
        parallax={0.45}
        pauseOnHover={true}
        lift={isMobile ? 24 : 52}
        fade={0.52}
        dim={0.85}
      />

      {/* Cloud Effect Layers on the sides & bottom of the 3 columns */}
      <div className="hero-clouds-container" aria-hidden="true">
        {/* Soft misty gradients framing the left and right */}


        {/* Floating cloud puffs drifting gently on the sides */}

      </div>
    </div>
  );
}

export default HeroInteractiveScene;
