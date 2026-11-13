'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Locale } from '@tooly/contracts';
import { VideoIntroOverlay } from './VideoIntroOverlay';

// Lazily load ChatWindow so conversational AI engine and knowledge bases are not in the critical initial layout bundle
const ChatWindow = dynamic(
  () => import('./ChatWindow').then((mod) => mod.ChatWindow),
  { ssr: false }
);

export interface ToolyAssistantProps {
  locale: Locale;
}

export function ToolyAssistant({ locale }: ToolyAssistantProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  // Close chat on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatOpen) {
        setIsChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen]);

  const handleAvatarClick = () => {
    setHasInteracted(true);
    setIsChatOpen((prev) => !prev);
  };

  const handleReplayVideo = () => {
    setIsChatOpen(false);
    setReplayCount((c) => c + 1);
  };

  return (
    <>
      {/* Intro Video Overlay & Morphing Circular Avatar */}
      <VideoIntroOverlay
        isChatOpen={isChatOpen}
        onAvatarClick={handleAvatarClick}
        forceReplayKey={replayCount}
        currentLocale={locale}
      />

      {/* Floating Tunisian Chatbot Dialog loaded only upon user activation */}
      {(hasInteracted || isChatOpen) && (
        <ChatWindow
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onReplayVideo={handleReplayVideo}
          currentLocale={locale}
        />
      )}
    </>
  );
}

export default ToolyAssistant;
