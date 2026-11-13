'use client';

import React, { type ReactNode, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Palette,
  Video,
  Code2,
  Wand2,
  Search,
  Layout,
  Terminal,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { Button } from '@/components/ui/Button';
import { CtaArrow } from '@/components/ui/CtaArrow';
import { cn } from '@/lib/utils';
import SplashCursor from './SplashCursor';
import { BlurText } from './BlurText';

export interface HeroShape {
  id: string;
  content?: ReactNode;
  className?: string;
}

export interface ShapeHeroCtaProps {
  dict: Dictionary;
  locale: Locale;
  className?: string;
}

/* ---------------------------------------------------------------------------
 * Rigid-body solver for pills (capsules): a segment with a radius.
 * Fixed 120Hz steps, sequential impulses with friction, and the whole pile
 * sleeps once it settles.
 * ------------------------------------------------------------------------ */

const STEP = 1 / 120;
const GRAVITY = 2400;
const ITERATIONS = 16;
const FRICTION = 0.5;
const RESTITUTION = 0.22;
const BOUNCE_THRESHOLD = 140;
const SLOP = 0.4;
const CORRECTION = 0.3;
const MAX_SPEED = 3000;
const MAX_SPIN = 18;
const SLEEP_SPEED = 9;
const SLEEP_STEPS = 40;
const REST_SPEED = 30;
const DRAG_REACH = 0.28;

interface Body {
  x: number;
  y: number;
  a: number;
  vx: number;
  vy: number;
  w: number;
  half: number;
  r: number;
  invMass: number;
  invInertia: number;
  width: number;
  height: number;
  el: HTMLElement;
}

interface Contact {
  a: Body;
  b: Body | null;
  nx: number;
  ny: number;
  rax: number;
  ray: number;
  rbx: number;
  rby: number;
  depth: number;
  correct: boolean;
  target: number;
  kn: number;
  kt: number;
  jn: number;
  jt: number;
}

interface Drag {
  body: Body;
  lx: number;
  ly: number;
  tx: number;
  ty: number;
  id: number;
}

type Point = [number, number];

function ends(body: Body): Point[] {
  if (body.half === 0) {
    return [[body.x, body.y]];
  }
  const c = Math.cos(body.a) * body.half;
  const s = Math.sin(body.a) * body.half;
  return [
    [body.x - c, body.y - s],
    [body.x + c, body.y + s],
  ];
}

function closest(p: Point, seg: Point[]): Point {
  const [a, b = a] = seg;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = dx * dx + dy * dy;
  const t =
    length === 0
      ? 0
      : Math.min(
        Math.max(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length, 0),
        1
      );
  return [a[0] + dx * t, a[1] + dy * t];
}

function contact(
  a: Body,
  b: Body | null,
  nx: number,
  ny: number,
  px: number,
  py: number,
  depth: number
): Contact {
  return {
    a,
    b,
    nx,
    ny,
    rax: px - a.x,
    ray: py - a.y,
    rbx: b ? px - b.x : 0,
    rby: b ? py - b.y : 0,
    depth,
    correct: true,
    target: 0,
    kn: 0,
    kt: 0,
    jn: 0,
    jt: 0,
  };
}

function collidePair(a: Body, b: Body, out: Contact[]) {
  const reach = a.r + b.r;
  const spineA = ends(a);
  const spineB = ends(b);
  const test = (p: Point, q: Point, fromB: boolean) => {
    const dx = fromB ? q[0] - p[0] : p[0] - q[0];
    const dy = fromB ? q[1] - p[1] : p[1] - q[1];
    const distance = Math.hypot(dx, dy);
    if (distance >= reach + 0.5) return;
    const nx = distance > 1e-6 ? dx / distance : 0;
    const ny = distance > 1e-6 ? dy / distance : -1;
    const [ax, ay] = fromB ? q : p;
    const px = ax - nx * (a.r - (reach - distance) / 2);
    const py = ay - ny * (a.r - (reach - distance) / 2);
    out.push(contact(a, b, nx, ny, px, py, reach - distance));
  };
  for (const p of spineA) test(p, closest(p, spineB), false);
  for (const p of spineB) test(p, closest(p, spineA), true);
  if (out.length === 0) {
    const p = closest([b.x, b.y], spineA);
    test(p, closest(p, spineB), false);
  }
}

function collideWalls(body: Body, width: number, height: number, out: Contact[]) {
  for (const [x, y] of ends(body)) {
    if (y + body.r - height > -0.5) {
      out.push(contact(body, null, 0, -1, x, height, y + body.r - height));
    }
    if (body.r - x > -0.5) {
      out.push(contact(body, null, 1, 0, 0, y, body.r - x));
    }
    if (x + body.r - width > -0.5) {
      out.push(contact(body, null, -1, 0, width, y, x + body.r - width));
    }
  }
}

function relativeVelocity(c: Contact): Point {
  const { a, b } = c;
  let vx = a.vx - a.w * c.ray;
  let vy = a.vy + a.w * c.rax;
  if (b) {
    vx -= b.vx - b.w * c.rby;
    vy -= b.vy + b.w * c.rbx;
  }
  return [vx, vy];
}

function applyImpulse(c: Contact, jx: number, jy: number) {
  const { a, b } = c;
  a.vx += jx * a.invMass;
  a.vy += jy * a.invMass;
  a.w += a.invInertia * (c.rax * jy - c.ray * jx);
  if (b) {
    b.vx -= jx * b.invMass;
    b.vy -= jy * b.invMass;
    b.w -= b.invInertia * (c.rbx * jy - c.rby * jx);
  }
}

function effectiveMass(c: Contact, nx: number, ny: number) {
  const { a, b } = c;
  const ra = c.rax * ny - c.ray * nx;
  let k = a.invMass + a.invInertia * ra * ra;
  if (b) {
    const rb = c.rbx * ny - c.rby * nx;
    k += b.invMass + b.invInertia * rb * rb;
  }
  return k;
}

function prepare(c: Contact) {
  c.kn = effectiveMass(c, c.nx, c.ny);
  c.kt = effectiveMass(c, -c.ny, c.nx);
  const [vx, vy] = relativeVelocity(c);
  const vn = vx * c.nx + vy * c.ny;
  if (c.depth < 0) {
    c.target = c.depth / STEP;
  } else {
    c.target = vn < -BOUNCE_THRESHOLD ? -RESTITUTION * vn : 0;
  }
}

function solve(c: Contact) {
  let [vx, vy] = relativeVelocity(c);
  const vn = vx * c.nx + vy * c.ny;
  const jn = Math.max(c.jn + (c.target - vn) / c.kn, 0);
  const dn = jn - c.jn;
  c.jn = jn;
  applyImpulse(c, c.nx * dn, c.ny * dn);

  [vx, vy] = relativeVelocity(c);
  const tx = -c.ny;
  const ty = c.nx;
  const limit = FRICTION * c.jn;
  const jt = Math.min(Math.max(c.jt - (vx * tx + vy * ty) / c.kt, -limit), limit);
  const dt = jt - c.jt;
  c.jt = jt;
  applyImpulse(c, tx * dt, ty * dt);
}

function correct(c: Contact) {
  if (!c.correct || c.depth <= SLOP) return;
  const { a, b } = c;
  const total = a.invMass + (b ? b.invMass : 0);
  const push = ((c.depth - SLOP) * CORRECTION) / total;
  a.x += c.nx * push * a.invMass;
  a.y += c.ny * push * a.invMass;
  if (b) {
    b.x -= c.nx * push * b.invMass;
    b.y -= c.ny * push * b.invMass;
  }
}

function applyDrag(drag: Drag) {
  const { body } = drag;
  const cos = Math.cos(body.a);
  const sin = Math.sin(body.a);
  const rx = drag.lx * cos - drag.ly * sin;
  const ry = drag.lx * sin + drag.ly * cos;
  const handle = contact(body, null, 0, 0, body.x + rx, body.y + ry, 0);
  const [vx] = relativeVelocity(handle);
  const wantX = ((drag.tx - body.x - rx) / STEP) * DRAG_REACH;
  const wantY = ((drag.ty - body.y - ry) / STEP) * DRAG_REACH;
  applyImpulse(handle, (wantX - vx) / effectiveMass(handle, 1, 0), 0);
  const [, vy] = relativeVelocity(handle);
  applyImpulse(handle, 0, (wantY - vy) / effectiveMass(handle, 0, 1));
  body.w *= 0.96;
}

function clampSpeed(body: Body) {
  const speed = Math.hypot(body.vx, body.vy);
  if (speed > MAX_SPEED) {
    body.vx *= MAX_SPEED / speed;
    body.vy *= MAX_SPEED / speed;
  }
  body.w = Math.min(Math.max(body.w, -MAX_SPIN), MAX_SPIN);
}

interface World {
  bodies: Body[];
  width: number;
  height: number;
  drag: Drag | null;
  still: number;
}

function step(world: World) {
  const { bodies, width, height, drag } = world;
  for (const body of bodies) {
    body.vy += GRAVITY * STEP;
    body.vx *= 0.999;
    body.w *= 0.995;
  }
  if (drag) applyDrag(drag);

  const contacts: Contact[] = [];
  for (let i = 0; i < bodies.length; i++) {
    collideWalls(bodies[i], width, height, contacts);
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      const near = a.half + a.r + b.half + b.r;
      if (Math.abs(a.x - b.x) < near && Math.abs(a.y - b.y) < near) {
        collidePair(a, b, contacts);
      }
    }
  }
  for (const c of contacts) prepare(c);
  for (let k = 0; k < ITERATIONS; k++) {
    for (const c of contacts) solve(c);
  }

  let fastest = 0;
  for (const body of bodies) {
    clampSpeed(body);
    if (
      body !== drag?.body &&
      Math.hypot(body.vx, body.vy) + Math.abs(body.w) * body.r < REST_SPEED
    ) {
      body.vx *= 0.8;
      body.vy *= 0.8;
      body.w *= 0.8;
    }
    body.x += body.vx * STEP;
    body.y += body.vy * STEP;
    body.a += body.w * STEP;
    fastest = Math.max(
      fastest,
      Math.hypot(body.vx, body.vy) + Math.abs(body.w) * (body.half + body.r)
    );
  }
  for (const c of contacts) correct(c);

  world.still = fastest < SLEEP_SPEED && !drag ? world.still + 1 : 0;
  return world.still > SLEEP_STEPS;
}

function render(bodies: Body[]) {
  for (const body of bodies) {
    body.el.style.transform = `translate3d(${(body.x - body.width / 2).toFixed(2)}px, ${(body.y - body.height / 2).toFixed(2)}px, 0) rotate(${body.a.toFixed(4)}rad)`;
  }
}

const scatter = (n: number) => (Math.sin(n * 12.9898) * 43_758.5453) % 1;

function createBodies(
  elements: HTMLElement[],
  width: number,
  height: number,
  fill: number
) {
  const bodies: Body[] = [];
  let area = 0;
  for (const [index, el] of elements.entries()) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (area + w * h > width * height * fill) {
      el.style.visibility = 'hidden';
      continue;
    }
    area += w * h;
    const r = Math.min(w, h) / 2;
    const mass = (w * h) / 1000;
    bodies.push({
      x: width * (0.15 + 0.7 * Math.abs(scatter(index + 1))),
      y: -h - index * 54,
      a: scatter(index + 7) * 0.9,
      vx: scatter(index + 3) * 120,
      vy: 0,
      w: scatter(index + 5) * 2,
      half: Math.max(w - h, 0) / 2,
      r,
      invMass: 1 / mass,
      invInertia: 12 / (mass * (w * w + h * h)),
      width: w,
      height: h,
      el,
    });
    el.style.visibility = 'visible';
  }
  return bodies;
}

function hitTest(bodies: Body[], x: number, y: number) {
  for (let i = bodies.length - 1; i >= 0; i--) {
    const body = bodies[i];
    const [qx, qy] = closest([x, y], ends(body));
    if (Math.hypot(x - qx, y - qy) <= body.r) return body;
  }
  return null;
}

/* ---------------------------------------------------------------------------
 * Tool Shapes: Pills & Circular Badges with Tool Logos & Colors
 * ------------------------------------------------------------------------ */

const PILL =
  'h-12 sm:h-14 px-5 sm:px-6 font-bold text-xs sm:text-sm tracking-tight border shadow-lg flex items-center gap-2.5 transition-shadow cursor-grab select-none';

export function ShapeHeroCta({ dict, locale, className }: ShapeHeroCtaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  // Localized texts matching original section
  const titleText =
    locale === 'ar'
      ? 'جاهز لرفع إنتاجيتك بالحلول الرقمية الحديثة؟'
      : locale === 'fr'
        ? 'Prêt à booster votre productivité avec nos solutions digitales ?'
        : 'Ready to elevate your productivity with modern digital tools?';

  const descText =
    locale === 'ar'
      ? 'تصفح كتالوج الأدوات المتاح حالياً وتواصل معنا لاختيار الخطة الأنسب لعملك أو دراستك.'
      : locale === 'fr'
        ? 'Parcourez le catalogue et contactez notre équipe pour choisir la formule idéale.'
        : 'Explore our catalog of verified subscriptions and reach out to select the right plan.';

  const shapes: HeroShape[] = [
    // 1. ChatGPT Plus
    {
      id: 'chatgpt',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-[#10A37F] text-white flex items-center justify-center text-xs font-black shadow-xs">
            <Bot className="w-4 h-4" />
          </span>
          <span>ChatGPT Plus</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#10A37F]/15 border-[#10A37F]/40 text-emerald-300 backdrop-blur-md'
      ),
    },
    // 2. Claude Pro
    {
      id: 'claude',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-white text-white flex items-center justify-center text-xs font-black shadow-xs">
            <img src="/images/logos/claude.webp" className='w-4 h-4' alt="" />
          </span>
          <span>Claude Pro</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#D97706]/15 border-[#D97706]/40 text-amber-300 backdrop-blur-md'
      ),
    },
    // 3. Canva Pro
    {
      id: 'canva',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-white text-white flex items-center justify-center text-xs font-black shadow-xs">
            <img src="/images/logos/canva.png" className='w-4 h-4' alt="" />
          </span>
          <span>Canva Pro</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#00C4CC]/15 border-[#00C4CC]/40 text-cyan-300 backdrop-blur-md'
      ),
    },
    // 4. Tooly Circular Orb (Brand)
    {
      id: 'tooly-dot',
      content: (
        <span className="font-black text-xs tracking-wider text-white">TOOLY</span>
      ),
      className:
        'size-16 sm:size-18 bg-tooly-red border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg shadow-tooly-red/30 cursor-grab',
    },
    // 5. CapCut Pro
    {
      id: 'capcut',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shadow-xs">
            <img src="/images/logos/capcut1.webp" className='w-4 h-4' alt="" />
          </span>
          <span>CapCut Pro</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#E11D48]/15 border-[#E11D48]/40 text-rose-300 backdrop-blur-md'
      ),
    },
    // 6. Cursor AI
    {
      id: 'cursor',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs font-black shadow-xs">
            <Code2 className="w-4 h-4" />
          </span>
          <span>Cursor AI</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#6366F1]/15 border-[#6366F1]/40 text-indigo-300 backdrop-blur-md'
      ),
    },
    // 7. Midjourney
    {
      id: 'midjourney',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-xs font-black shadow-xs">
            <Wand2 className="w-4 h-4" />
          </span>
          <span>Midjourney</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-purple-300 backdrop-blur-md'
      ),
    },
    // 8. TND Dinar Orb
    {
      id: 'tnd-dot',
      content: (
        <span className="font-extrabold text-xs text-amber-300">TND د.ت</span>
      ),
      className:
        'size-14 bg-amber-500/20 border border-amber-400/40 rounded-full flex items-center justify-center shadow-md cursor-grab backdrop-blur-md',
    },
    // 9. Gemini Advanced
    {
      id: 'gemini',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-black shadow-xs">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>Gemini Adv.</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#2563EB]/15 border-[#2563EB]/40 text-blue-300 backdrop-blur-md'
      ),
    },
    // 10. Figma Pro
    {
      id: 'figma',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-[#F97316] text-white flex items-center justify-center text-xs font-black shadow-xs">

            <img src="/images/logos/figma.png" className='w-4 h-4' alt="" />
          </span>
          <span>Figma Pro</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#F97316]/15 border-[#F97316]/40 text-orange-300 backdrop-blur-md'
      ),
    },
    // 11. Perplexity Pro
    {
      id: 'perplexity',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs font-black shadow-xs">
            <Search className="w-4 h-4" />
          </span>
          <span>Perplexity Pro</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#0D9488]/15 border-[#0D9488]/40 text-teal-300 backdrop-blur-md'
      ),
    },
    // 12. Emerald SLA Guarantee Orb
    {
      id: 'sla-dot',
      content: (
        <span className="flex items-center gap-1 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>100%</span>
        </span>
      ),
      className:
        'size-14 sm:size-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center shadow-md cursor-grab backdrop-blur-md',
    },
    // 13. GitHub Copilot
    {
      id: 'copilot',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-[#334155] text-white flex items-center justify-center text-xs font-black shadow-xs">
            <Terminal className="w-4 h-4" />
          </span>
          <span>GitHub Copilot</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#334155]/25 border-white/20 text-neutral-200 backdrop-blur-md'
      ),
    },
    // 14. Notion AI
    {
      id: 'notion',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-white text-ink flex items-center justify-center text-xs font-black shadow-xs">
            <FileText className="w-4 h-4" />
          </span>
          <span>Notion AI</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-white/10 border-white/20 text-white backdrop-blur-md'
      ),
    },
    // 15. Runway Gen-3
    {
      id: 'runway',
      content: (
        <>
          <span className="w-7 h-7 rounded-full bg-[#EC4899] text-white flex items-center justify-center text-xs font-black shadow-xs">
            <Video className="w-4 h-4" />
          </span>
          <span>Runway Gen-3</span>
        </>
      ),
      className: cn(
        PILL,
        'bg-[#EC4899]/15 border-[#EC4899]/40 text-pink-300 backdrop-blur-md'
      ),
    },
    // 16. Fast Support Orb
    {
      id: 'live-dot',
      content: (
        <span className="flex items-center gap-1.5 text-xs font-bold text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>LIVE</span>
        </span>
      ),
      className:
        'size-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center shadow-md cursor-grab backdrop-blur-md',
    },
  ];

  const fill = 0.32;

  useEffect(() => {
    const root = rootRef.current;
    const layer = layerRef.current;
    if (!(root && layer)) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = [...layer.querySelectorAll<HTMLElement>('[data-shape]')];
    const world: World = {
      bodies: [],
      width: layer.clientWidth,
      height: layer.clientHeight,
      drag: null,
      still: 0,
    };
    let raf = 0;
    let last = 0;
    let carry = 0;
    let started = false;
    let visible = false;
    let cancelled = false;

    const loop = (now: number) => {
      raf = 0;
      carry += Math.min((now - last) / 1000, 0.05);
      last = now;
      let asleep = false;
      while (carry >= STEP) {
        asleep = step(world);
        carry -= STEP;
      }
      render(world.bodies);
      if (!asleep && visible) {
        raf = requestAnimationFrame(loop);
      }
    };

    const wake = () => {
      world.still = 0;
      if (!raf && started && visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const begin = () => {
      if (started || cancelled) return;
      started = true;
      world.bodies = createBodies(elements, world.width, world.height, fill);
      if (reduceMotion) {
        let steps = 0;
        while (steps < 2400 && !step(world)) {
          steps++;
        }
        render(world.bodies);
        return;
      }
      render(world.bodies);
      wake();
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) {
          if (document.fonts?.ready) {
            document.fonts.ready.then(begin);
          } else {
            begin();
          }
          wake();
        }
      },
      { threshold: 0.2 }
    );
    intersection.observe(root);

    const onVisibility = () => {
      visible = !document.hidden;
      wake();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(() => {
      world.width = layer.clientWidth;
      world.height = layer.clientHeight;
      wake();
    });
    resizeObserver.observe(layer);

    const local = (event: PointerEvent): Point => {
      const rect = layer.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top];
    };

    const onDown = (event: PointerEvent) => {
      if (!started || world.drag || event.button !== 0) return;
      const [x, y] = local(event);
      const body = hitTest(world.bodies, x, y);
      if (!body) return;
      event.preventDefault();
      const dx = x - body.x;
      const dy = y - body.y;
      const cos = Math.cos(-body.a);
      const sin = Math.sin(-body.a);
      world.drag = {
        body,
        lx: dx * cos - dy * sin,
        ly: dx * sin + dy * cos,
        tx: x,
        ty: y,
        id: event.pointerId,
      };
      layer.setPointerCapture(event.pointerId);
      layer.dataset.dragging = '';
      wake();
    };

    const onMove = (event: PointerEvent) => {
      if (world.drag?.id === event.pointerId) {
        [world.drag.tx, world.drag.ty] = local(event);
        wake();
      }
    };

    const onUp = (event: PointerEvent) => {
      if (world.drag?.id === event.pointerId) {
        world.drag = null;
        delete layer.dataset.dragging;
        wake();
      }
    };

    layer.addEventListener('pointerdown', onDown);
    layer.addEventListener('pointermove', onMove);
    layer.addEventListener('pointerup', onUp);
    layer.addEventListener('pointercancel', onUp);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      layer.removeEventListener('pointerdown', onDown);
      layer.removeEventListener('pointermove', onMove);
      layer.removeEventListener('pointerup', onUp);
      layer.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative flex min-h-[660px] sm:min-h-[820px] w-full flex-col items-center justify-center overflow-hidden border-t border-b-0 border-white/10 bg-gradient-to-b from-[#181924] via-[#12131A] to-[#0A0B0E] px-6 py-20 sm:py-24 text-white shadow-2xl select-none isolate',
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-tooly-red/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-tooly-red/15 rounded-full blur-3xl pointer-events-none" />

      {/* Interactive fluid splash cursor layer (contained inside ShapeHeroCta) */}
      <SplashCursor
        contained
        zIndex={0}
        colors={['#F52F3D', '#FF6B6B', '#4f8cff', '#2dd4bf', '#ffd166']}
        rainbow={true}
        swirl={3.5}
        intensity={1.2}
        force={1.1}
        trail={1.1}
        glow={0.25}
      />

      {/* Physics layer containing interactive dropping pills & logos */}
      <div
        aria-hidden="true"
        className="group/shapes absolute inset-0 touch-pan-y z-0"
        ref={layerRef}
      >
        {shapes.map((shape) => (
          <div
            className={cn(
              'absolute top-0 left-0 flex cursor-grab touch-none select-none items-center justify-center whitespace-nowrap rounded-full will-change-transform group-data-dragging/shapes:cursor-grabbing',
              shape.className
            )}
            data-shape=""
            key={shape.id}
            style={{ visibility: 'hidden' }}
          >
            {shape.content}
          </div>
        ))}
      </div>

      {/* Foreground Content: Title, description, CTAs with pointer-events-none so users can grab shapes underneath */}
      <div className="pointer-events-none relative z-10 flex max-w-2xl flex-col items-center text-center">
        {/* Subtle decorative pill */}
        <div className="pointer-events-auto inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-tooly-red mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-tooly-red animate-pulse" />
          <span className="text-white">Tooly.tn</span>
          <span className="text-white/40">•</span>
          <BlurText
            as="span"
            text={dict.shapeHeroCta.tagline}
            delay={55}
            animateBy="words"
            direction="top"
            className="text-neutral-300 inline"
          />
        </div>

        <h2 className="text-balance font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-4 text-white">
          <BlurText
            as="span"
            text={titleText}
            delay={75}
            animateBy="words"
            direction="top"
            className="inline"
          />
        </h2>

        <p className="mt-2 max-w-lg text-pretty text-sm sm:text-base text-neutral-300 leading-relaxed mb-8">
          <BlurText
            as="span"
            text={descText}
            delay={40}
            animateBy="words"
            direction="top"
            className="inline"
          />
        </p>

        {/* Buttons (pointer-events-auto so they remain fully clickable) */}
        <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link href={`/${locale}/catalog`} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-tooly-red/30">

              <BlurText
                as="span"
                text={dict.common.viewCatalog}
                delay={60}
                animateBy="words"
                direction="top"
                className="inline"
              />
              <CtaArrow className="w-4 h-4" />
            </Button>
          </Link>
          <a
            href="mailto:support@tooly.tn"
            className="w-full sm:w-auto inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 border border-white/20 hover:bg-white/10 text-white text-base px-6 py-3.5 backdrop-blur-sm"
          >
            <BlurText
              as="span"
              text={dict.common.contactSupport}
              delay={60}
              animateBy="words"
              direction="top"
              className="inline"
            />
          </a>
        </div>

        {/* Subtle throw hint */}
        <p className="mt-8 text-[11px] text-white/40 font-medium">
          💡{' '}
          <BlurText
            as="span"
            text={dict.shapeHeroCta.physicsHint}
            delay={40}
            animateBy="words"
            direction="top"
            className="inline"
          />
        </p>
      </div>
    </div>
  );
}

export default ShapeHeroCta;
