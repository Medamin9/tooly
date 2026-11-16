'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX, X, Sparkles, MessageSquare, Radio } from 'lucide-react';

export interface VideoIntroOverlayProps {
  onAvatarClick: () => void;
  isChatOpen: boolean;
  forceReplayKey?: number;
  currentLocale: string;
}

/**
 * High-performance lightweight HTML5 Canvas generating authentic retro TV static snow
 * Uses a 160x120 direct Uint32Array frame buffer scaled up with pixelated rendering.
 */
function TvStaticScreen({ isVisible }: { isVisible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 160);
    const height = (canvas.height = 120);
    const imgData = ctx.createImageData(width, height);
    const buf = new Uint32Array(imgData.data.buffer);
    const len = buf.length;

    let frame = 0;
    const render = () => {
      frame++;
      for (let i = 0; i < len; i++) {
        // Random grayscale noise with subtle horizontal jitter lines
        const noise = (Math.random() * 255) | 0;
        buf[i] = 0xff000000 | (noise << 16) | (noise << 8) | noise;
      }
      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export function VideoIntroOverlay({
  onAvatarClick,
  isChatOpen,
  forceReplayKey = 0,
  currentLocale,
}: VideoIntroOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage =
    pathname === `/${currentLocale}` ||
    pathname === `/${currentLocale}/` ||
    pathname === '/' ||
    pathname === '';

  // Stages: 'overlay' | 'morphing' | 'avatar'
  // Default to 'avatar' so inner pages (e.g. /order/lookup, /checkout) never have interactive inputs blocked
  const [stage, setStage] = useState<'overlay' | 'morphing' | 'avatar'>('avatar');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [hasUnreadNotice, setHasUnreadNotice] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isAr = currentLocale === 'ar';

  // Responsive screen detection and overlay activation strictly on homepage
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    try {
      const seen = sessionStorage.getItem('tooly_assistant_intro_seen');
      // Only show full 3D TV overlay on the storefront homepage if the user hasn't seen it yet
      if (!seen && isHomePage) {
        setStage('overlay');
      } else {
        setStage('avatar');
        if (seen) {
          setShowSpeechBubble(true);
        }
      }
    } catch {
      setStage('avatar');
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [isHomePage]);

  // Immediately settle into avatar if user navigates away from the homepage
  useEffect(() => {
    if (!isHomePage && stage === 'overlay') {
      setStage('avatar');
    }
  }, [isHomePage, stage]);

  // Handle replaying video if requested by parent (e.g. from chatbot replay button)
  useEffect(() => {
    if (forceReplayKey > 0 && mounted) {
      setStage('overlay');
      setIsVideoReady(false);
      setIsVideoMuted(false);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    }
  }, [forceReplayKey, mounted]);

  // Attempt autoplay when entering overlay stage
  useEffect(() => {
    if (stage === 'overlay' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => {
          setIsVideoReady(true);
        })
        .catch(() => {
          setIsVideoMuted(true);
          videoRef.current?.play().then(() => setIsVideoReady(true)).catch(() => {});
        });
    }
  }, [stage]);

  // Trigger smooth morph transition to bottom-right circular avatar
  const handleStartMorph = () => {
    if (stage !== 'overlay') return;
    setStage('morphing');

    try {
      sessionStorage.setItem('tooly_assistant_intro_seen', 'true');
    } catch {
      // Ignore
    }

    // Morph transition runs for 750ms, then settles into 'avatar' stage
    setTimeout(() => {
      setStage('avatar');
      setShowSpeechBubble(true);
    }, 780);
  };

  // Hide the floating speech bubble after 8 seconds
  useEffect(() => {
    if (showSpeechBubble) {
      const timer = setTimeout(() => {
        setShowSpeechBubble(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showSpeechBubble]);

  const toggleVideoSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsVideoMuted(nextMuted);
    }
  };

  if (!mounted) {
    return null;
  }

  const isOverlay = stage === 'overlay';
  const isMorphing = stage === 'morphing';
  const isAvatar = stage === 'avatar';

  // Responsive morph container sizing
  const avatarSize = isMobile ? 48 : 64;
  const avatarInset = isMobile ? 16 : 24;

  const morphContainerStyle: React.CSSProperties = isOverlay
    ? {
        position: 'fixed',
        right: 'calc(50vw - min(46vw, 215px))',
        bottom: 'calc(50vh - min(46vw, 215px))',
        width: 'min(92vw, 430px)',
        height: 'min(92vw, 410px)',
        borderRadius: '32px',
        transition: 'all 750ms cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 50,
      }
    : isMorphing
      ? {
          position: 'fixed',
          right: `${avatarInset}px`,
          bottom: `${avatarInset}px`,
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          borderRadius: '9999px',
          transition: 'all 750ms cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 50,
        }
      : {
          position: 'fixed',
          right: `${avatarInset}px`,
          bottom: `${avatarInset}px`,
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          borderRadius: '9999px',
          zIndex: 40,
        };

  return (
    <>
      {/* 1. BACKDROP OVERLAY DURING 'overlay' (Tap anywhere outside TV to dismiss/morph) */}
      <div
        onClick={handleStartMorph}
        role="button"
        tabIndex={isOverlay ? 0 : -1}
        aria-label="Fermer l'intro vidéo"
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-700 ease-out ${
          isOverlay ? 'opacity-100 pointer-events-auto cursor-pointer' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2. MORPHING 3D TV CONTAINER (Glides smoothly from Center to Bottom-Right) */}
      {!isAvatar && (
        <div
          style={morphContainerStyle}
          className={`overflow-visible pointer-events-auto transition-transform ${
            isOverlay ? 'scale-100' : 'scale-95'
          }`}
        >
          {/* 3D TV CABINET */}
          <div className="relative w-full h-full bg-gradient-to-b from-[#252834] via-[#1a1c25] to-[#111218] p-2.5 sm:p-3.5 rounded-[24px] sm:rounded-[32px] border-[5px] sm:border-[7px] border-[#383d4f] shadow-[0_30px_70px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden">
            {/* Retro TV Antenna Ears (Visible during full overlay) */}
            {isOverlay && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-end gap-5 pointer-events-none z-10">
                <div className="w-1 h-5 bg-gradient-to-t from-[#383d4f] to-[#71717a] -rotate-[22deg] origin-bottom rounded-full shadow-sm" />
                <div className="w-1 h-5 bg-gradient-to-t from-[#383d4f] to-[#71717a] rotate-[22deg] origin-bottom rounded-full shadow-sm" />
              </div>
            )}

            {/* TV TOP BEZEL BAR: Brand & On-Screen LED */}
            {isOverlay && (
              <div className="flex items-center justify-between pb-1.5 px-1 select-none text-[10px] font-mono z-20">
                {/* Left: TV Brand & Power indicator */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tooly-red animate-pulse shadow-[0_0_8px_#f52f3d]" />
                  <span className="font-extrabold tracking-widest text-white/90">
                    TOOLY<span className="text-tooly-red font-sans">.TV</span>
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono tracking-wider bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30 hidden sm:inline">
                    {isVideoReady ? 'CH 01 • TUNED' : 'SEARCHING...'}
                  </span>
                </div>

                {/* Right: Skip button */}
                <button
                  type="button"
                  onClick={handleStartMorph}
                  className="flex items-center gap-1 text-[10px] text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full border border-white/20 transition-all active:scale-95 shadow"
                >
                  <span>{isAr ? 'تخطي ✕' : 'Passer ✕'}</span>
                </button>
              </div>
            )}

            {/* THE TV SCREEN (CRT INNER BEZEL) */}
            <div className="relative flex-1 w-full rounded-[16px] sm:rounded-[20px] overflow-hidden bg-black shadow-[inset_0_0_35px_rgba(0,0,0,0.95),0_0_0_2px_#0e0f14] flex items-center justify-center">
              {/* 1. TV Static Canvas (Active until video is fully ready) */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  isVideoReady ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'
                }`}
              >
                <TvStaticScreen isVisible={!isVideoReady} />

                {/* On-screen display during tuning */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[0.5px] select-none text-center p-3">
                  <div className="font-mono text-xs sm:text-sm font-bold text-emerald-400 tracking-wider bg-black/80 px-3 py-1.5 rounded border border-emerald-500/40 mb-2 shadow-lg animate-pulse">
                    SIGNAL: TUNING IN...
                  </div>
                  <span className="text-[10px] text-white/80 font-mono">
                    {isAr ? 'جاري استقبال بث Tooly.tn...' : 'Synchronisation du signal Tooly...'}
                  </span>
                </div>
              </div>

              {/* 2. Video element */}
              <video
                ref={videoRef}
                src="/video.mp4"
                playsInline
                autoPlay
                preload="auto"
                muted={isVideoMuted}
                onCanPlay={() => setIsVideoReady(true)}
                onLoadedData={() => setIsVideoReady(true)}
                onPlaying={() => setIsVideoReady(true)}
                onEnded={handleStartMorph}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isMorphing ? 'opacity-0 scale-110' : isVideoReady ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* 3. Circular avatar image cross-fading in during morph */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center bg-black/20 z-30 ${
                  isMorphing ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <Image
                  src="/avatar.png"
                  alt="Tooly Bot"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* 4. CRT Scanline overlay effect */}
              {isOverlay && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-20 z-10"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 2px)',
                  }}
                />
              )}

              {/* 5. CRT Curved Glass Specular Highlight */}
              {isOverlay && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.12] rounded-[16px] sm:rounded-[20px] z-10"
                />
              )}

              {/* Sound control overlay on bottom left */}
              {isOverlay && (
                <div className="absolute bottom-2.5 left-2.5 z-20">
                  <button
                    type="button"
                    onClick={toggleVideoSound}
                    className="flex items-center gap-1.5 bg-black/75 hover:bg-black/90 text-white text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-md transition-all active:scale-95 shadow-md"
                  >
                    {isVideoMuted ? (
                      <>
                        <VolumeX className="w-3 h-3 text-tooly-red" />
                        <span>{isAr ? 'تشغيل الصوت 🔊' : 'Son 🔊'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-emerald-400" />
                        <span>{isAr ? 'الصوت يعمل' : 'Son activé'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Start Chat button on bottom right */}
              {isOverlay && (
                <div className="absolute bottom-2.5 right-2.5 z-20">
                  <button
                    type="button"
                    onClick={handleStartMorph}
                    className="flex items-center gap-1.5 bg-tooly-red hover:bg-tooly-red-dark text-white text-[10px] sm:text-xs font-bold px-3.5 py-1 rounded-full shadow-lg transition-all active:scale-95"
                  >
                    <span>{isAr ? 'نبدأ الشات 👋' : 'Nabdew el chat 👋'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* TV BOTTOM PANEL: Retro Speaker Slits & Tuning Dials */}
            {isOverlay && (
              <div className="pt-2 px-1 flex items-center justify-between text-white/50 select-none z-20">
                {/* Speaker Grille Slits */}
                <div className="flex items-center gap-1">
                  <div className="w-4 sm:w-6 h-1 bg-black/70 rounded-full border-t border-white/10" />
                  <div className="w-4 sm:w-6 h-1 bg-black/70 rounded-full border-t border-white/10" />
                  <div className="w-4 sm:w-6 h-1 bg-black/70 rounded-full border-t border-white/10" />
                </div>

                {/* TV Model label */}
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-white/40 uppercase">
                  MODEL TLY-CRT26
                </span>

                {/* Retro Rotary Knobs */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-[#4b5266] to-[#1e2029] border border-white/20 shadow-inner flex items-center justify-center">
                    <div className="w-0.5 h-1.5 bg-white/60 rounded-full transform -rotate-45" />
                  </div>
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-[#4b5266] to-[#1e2029] border border-white/20 shadow-inner flex items-center justify-center">
                    <div className="w-0.5 h-1.5 bg-white/60 rounded-full transform rotate-30" />
                  </div>
                </div>
              </div>
            )}

            {/* 3D TV Feet (Angled Legs) */}
            {isOverlay && (
              <>
                <div className="absolute -bottom-2.5 left-6 w-5 h-3 bg-[#1e2029] border-b-2 border-black -skew-x-[20deg] rounded-b shadow-lg pointer-events-none" />
                <div className="absolute -bottom-2.5 right-6 w-5 h-3 bg-[#1e2029] border-b-2 border-black skew-x-[20deg] rounded-b shadow-lg pointer-events-none" />
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. SETTLED CIRCULAR AVATAR LAUNCHER FIXED AT BOTTOM RIGHT (Optimized Mobile Dimensions) */}
      {isAvatar && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
          {/* Floating welcome speech bubble */}
          {showSpeechBubble && !isChatOpen && (
            <div
              onClick={() => {
                setShowSpeechBubble(false);
                onAvatarClick();
              }}
              className="absolute bottom-[calc(100%+10px)] sm:bottom-[calc(100%+14px)] right-0 w-[210px] sm:w-[270px] bg-paper text-ink border border-line shadow-card rounded-2xl p-2.5 sm:p-3.5 text-start cursor-pointer hover:border-tooly-red/40 transition-all transform hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-300 group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-tooly-red flex items-center gap-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAr ? 'سنجوب' : 'Sanjoub'}</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeechBubble(false);
                  }}
                  className="text-muted hover:text-ink text-xs p-0.5 rounded hover:bg-surface"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] sm:text-xs text-ink font-medium leading-relaxed">
                {isAr
                  ? 'عسلامة! 👋 تحب نعاونك في حاجة ؟ '
                  : '3aslema! 👋 T7eb n3awnek fi haja ?'}
              </p>

              <span className="text-[9px] sm:text-[10px] text-muted mt-1 sm:mt-1.5 font-semibold group-hover:text-tooly-red transition-colors flex items-center gap-1">
                <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-tooly-red" />
                <span>{isAr ? 'انقر هنا للدردشة الآن ←' : 'Cliquez pour discuter ←'}</span>
              </span>

              {/* Triangle pointer pointing down directly into the circular avatar */}
              <div className="absolute -bottom-1.5 right-4 sm:right-6 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-paper border-b border-r border-line transform rotate-45" />
            </div>
          )}

          {/* Circular Avatar Button - Mobile: 48px, Desktop: 64px */}
          <button
            type="button"
            onClick={() => {
              setShowSpeechBubble(false);
              setHasUnreadNotice(false);
              onAvatarClick();
            }}
            aria-label={isAr ? 'فتح المحادثة مع المساعد الذكي' : 'Open Tooly Assistant Chat'}
            title={isAr ? 'تولي بوت (المساعد التونسي الذكي)' : 'Tooly Assistant'}
            className={`relative group w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-tooly-red bg-paper p-0.5 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tooly-red/30 block ${
              isChatOpen ? 'ring-4 ring-tooly-red/30 scale-95' : ''
            }`}
          >
            {/* Glowing aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-tooly-red/40 to-emerald-400/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity -z-10" />

            {/* Avatar Image */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-surface">
              <Image
                src="/avatar.png"
                alt="Tooly.tn Avatar Assistant"
                fill
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Online green indicator badge */}
            <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-ink ring-2 ring-emerald-500/20" />

            {/* Unread badge indicator */}
            {!isChatOpen && hasUnreadNotice && (
              <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tooly-red opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-tooly-red border-2 border-white dark:border-ink" />
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default VideoIntroOverlay;
