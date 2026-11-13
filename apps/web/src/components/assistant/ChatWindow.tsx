'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Send,
  RotateCcw,
  Video,
  Sparkles,
} from 'lucide-react';
import { CtaArrow } from '@/components/ui/CtaArrow';
import { getTunisianBotResponse, BotAnswer } from './tunisianKnowledge';
import { getAssistantAIResponse } from './tunisianAIEngine';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  action?: {
    label: string;
    href: string;
  };
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayVideo: () => void;
  currentLocale: string;
}

export function ChatWindow({
  isOpen,
  onClose,
  onReplayVideo,
  currentLocale,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isAr = currentLocale === 'ar';

  // Update welcome message whenever currentLocale changes
  useEffect(() => {
    const initialTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages([
      {
        id: `welcome-${currentLocale}`,
        sender: 'bot',
        text: isAr
          ? `عسلامة يا باهي! 👋 مرحباً بيك في **Tooly.tn** (سوق الاشتراكات الرقمية في تونس)!

أنا المساعد التونسي الذكي متاعك. نعاونك باش تعرف أسعار الاشتراكات (Claude, ChatGPT, Canva...)، كيفاش تخلص بالـ D17 ولا Carte، ووقتاش يوصلك الطلب متاعك.

شنوة تحب تعرف اليوم؟ 🇹🇳`
          : `3aslema ya behi! 👋 Mar7ba bik fi **Tooly.tn** (سوق الاشتراكات الرقمية في تونس)!

Ena l'assistant virtuel mte3ek. N3awnek ta3ref les prix mte3 les abonnements (Claude, ChatGPT, Canva...), kifech tkhallas b D17 walla Carte, w waqtech touslek el commande.

Chnowa t7eb na3rfou lyoum? 🇹🇳`,
        timestamp: initialTime,
        quickReplies: isAr
          ? [
            'اشتراكات الذكاء الاصطناعي (Claude, ChatGPT)',
            'كيفاش نخلص بالـ D17؟',
            'وقتاش يوصلني الطلب؟',
            'فمّا ضمان؟',
          ]
          : [
            'Abonnements IA (Claude, ChatGPT)',
            'Kifech nkhallas b D17?',
            'Waqtech touselni el commande?',
            'Thamma garantie?',
          ],
        action: {
          label: isAr ? 'تفرّج في الكتالوج' : 'Tfarrag 3al Catalogue',
          href: `/${currentLocale}/catalog`,
        },
      },
    ]);
  }, [currentLocale, isAr]);

  // Focus input whenever chat window opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Send a message and trigger Tunisian AI bot response
  const handleSendMessage = async (textToSend?: string) => {
    const raw = textToSend !== undefined ? textToSend : inputValue;
    const trimmed = raw.trim();
    if (!trimmed) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: timeString,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputValue('');
    setIsTyping(true);

    try {
      // Intelligent AI reasoning response (supports open-ended questions, context memory, and live LLM if available)
      const botAnswer: BotAnswer = await getAssistantAIResponse({
        userMessage: trimmed,
        history: updatedHistory,
        locale: currentLocale,
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botAnswer.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        quickReplies: botAnswer.quickReplies,
        action: botAnswer.action,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    } catch {
      // Seamless fallback
      const fallback = getTunisianBotResponse(trimmed, currentLocale);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        quickReplies: fallback.quickReplies,
        action: fallback.action,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleResetChat = () => {
    const initialTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: isAr
          ? `مرحباً بيك من جديد! 👋 تفضل اسألني على أي حاجة تحبها: الأسعار، D17، فلوسي ولا الضمان! 🇹🇳`
          : `Mar7ba bik men jdid! 👋 TFaddal es'elni 3la ay 7aja t7ebha: les prix, D17, flouci walla el garantie! 🇹🇳`,
        timestamp: initialTime,
        quickReplies: isAr
          ? [
            'اشتراكات الذكاء الاصطناعي (Claude, ChatGPT)',
            'كيفاش نخلص بالـ D17؟',
            'وقتاش يوصلني الطلب؟',
          ]
          : [
            'Abonnements IA (Claude, ChatGPT)',
            'Kifech nkhallas b D17?',
            'Waqtech touselni el commande?',
          ],
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'محادثة المساعد التونسي الذكي' : 'Tooly Assistant Chat'}
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed bottom-18 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[390px] h-[500px] sm:h-[580px] max-h-[82vh] flex flex-col bg-paper text-ink border border-line shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* 1. HEADER */}
      <div className="p-3.5 bg-surface border-b border-line flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-tooly-red/40 bg-paper shrink-0">
            <Image
              src="/avatar.png"
              alt="Tooly Bot"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-ink" />
          </div>
          <div className="flex flex-col text-start">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-ink">{isAr ? 'سنجوب' : 'Sanjoub'}</span>
              <span className="text-[10px] bg-tooly-soft-red text-tooly-red font-bold px-1.5 py-0.2 rounded">
                TN 🇹🇳
              </span>
            </div>
            <span className="text-[11px] text-muted leading-tight">
              {isAr ? 'المساعد التونسي الذكي • متصل الآن' : 'المساعد التونسي الذكي • En ligne'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Replay Intro Video Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onReplayVideo();
            }}
            aria-label={isAr ? 'إعادة مشاهدة الفيديو' : "Revoir l'intro vidéo"}
            title={isAr ? 'إعادة مشاهدة الفيديو الترحيبي' : "Rejouer l'intro vidéo"}
            className="p-1.5 rounded-lg border border-line bg-paper text-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <Video className="w-4 h-4 text-tooly-red" />
          </button>

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={handleResetChat}
            aria-label={isAr ? 'إعادة تعيين المحادثة' : 'Réinitialiser la discussion'}
            title={isAr ? 'إعادة تعيين المحادثة' : 'Réinitialiser'}
            className="p-1.5 rounded-lg border border-line bg-paper text-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close Chat */}
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق المحادثة' : 'Fermer le chat'}
            title={isAr ? 'إغلاق' : 'Fermer'}
            className="p-1.5 rounded-lg border border-line bg-paper text-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MESSAGES STREAM */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-start bg-paper/50">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] p-3 text-xs leading-relaxed transition-all ${isBot
                  ? 'bg-surface text-ink border border-line/80 rounded-2xl rtl:rounded-tr-xs ltr:rounded-tl-xs shadow-2xs'
                  : 'bg-tooly-red text-white font-medium rounded-2xl rtl:rounded-tl-xs ltr:rounded-tr-xs shadow-sm'
                  }`}
              >
                {/* Message Text with bold/newlines handled cleanly */}
                <div className="whitespace-pre-line space-y-1">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={idx}>
                          {parts.map((p, i) =>
                            i % 2 === 1 ? <strong key={i} className="font-bold">{p}</strong> : p
                          )}
                        </p>
                      );
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>

                {/* Direct Action Link */}
                {msg.action && (
                  <div className="mt-2.5 pt-2 border-t border-line/50">
                    <Link
                      href={msg.action.href}
                      onClick={() => onClose()}
                      className="inline-flex items-center gap-1.5 bg-tooly-red text-white font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-tooly-red/90 transition-colors shadow-2xs"
                    >
                      <CtaArrow className="w-3.5 h-3.5" />
                      <span>{msg.action.label}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Message Footer: Timestamp */}
              <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-muted">
                <span>{msg.timestamp}</span>
              </div>

              {/* Quick Reply Suggestions */}
              {isBot && msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                  {msg.quickReplies.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => handleSendMessage(reply)}
                      className="text-[11px] font-semibold bg-surface hover:bg-tooly-soft-red hover:text-tooly-red text-ink border border-line hover:border-tooly-red/30 px-2.5 py-1 rounded-full transition-all active:scale-95 text-start shadow-2xs"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-muted bg-surface/60 border border-line/60 rounded-2xl rtl:rounded-tr-xs ltr:rounded-tl-xs px-3.5 py-2.5 w-fit animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-tooly-red animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-tooly-red animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-tooly-red animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-medium text-muted">
              {isAr ? 'تولي بوت يكتب الآن...' : 'Tooly Bot yekteb...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT FORM */}
      <div className="p-3 bg-surface border-t border-line shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isAr
                ? 'اكتب بالتونسي أو بالعربي (مثال: عسلامة، بقداش كلود برو؟)...'
                : 'Ikteb bel tounsi (ex: 3aslema, b9adeh Claude?)...'
            }
            className="flex-1 bg-paper border border-line rounded-xl px-3.5 py-2 text-xs text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-tooly-red focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            aria-label={isAr ? 'إرسال' : 'Envoyer'}
            className="w-9 h-9 rounded-xl bg-tooly-red hover:bg-tooly-red/90 disabled:opacity-40 disabled:hover:bg-tooly-red text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-2xs"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-muted/80 mt-2 px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-tooly-red" />
            <span>{isAr ? 'مساعد ذكي بالدارجة التونسية' : 'Tunisian AI Assistant • الدارجة التونسية'}</span>
          </span>
          <span className="font-semibold text-tooly-red">Tooly.tn 🇹🇳</span>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
