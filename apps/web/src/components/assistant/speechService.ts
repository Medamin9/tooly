// Web Speech API text-to-speech service with Tunisian Derja & multilingual voice detection

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
      // Check stored mute preference
      try {
        const stored = localStorage.getItem('tooly_bot_muted');
        this.isMuted = stored === 'true';
      } catch {
        this.isMuted = false;
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('tooly_bot_muted', muted ? 'true' : 'false');
    } catch {
      // Ignore
    }
    if (muted) {
      this.stop();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !this.synth) {
      onEnd?.();
      return;
    }

    this.stop();

    // Clean text: strip markdown formatting, emojis, and URLs
    let clean = text
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[*_#`~[\]]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    if (!clean) {
      onEnd?.();
      return;
    }

    // Convert common Arabizi digits into phonetic hints for smoother browser voice reading
    clean = clean
      .replace(/\b3aslema\b/gi, 'asslema')
      .replace(/\bmar7ba\b/gi, 'marhaba')
      .replace(/\bwaqtech\b/gi, 'waktéch')
      .replace(/\bchne7welek\b/gi, 'chne7walek')
      .replace(/\bb9adeh\b/gi, 'bkaddéch')
      .replace(/\b3ala\b/gi, 'ala')
      .replace(/\b3aychek\b/gi, 'aaychek');

    const utterance = new SpeechSynthesisUtterance(clean);
    this.currentUtterance = utterance;

    // Detect if text is mostly Arabic script
    const hasArabicScript = /[\u0600-\u06FF]/.test(clean);

    if (hasArabicScript) {
      // Look for Arabic voices (prefer Tunisian if available, then other Arabic)
      const arVoice =
        this.voices.find((v) => v.lang.startsWith('ar-TN')) ||
        this.voices.find((v) => v.lang.startsWith('ar')) ||
        null;
      if (arVoice) utterance.voice = arVoice;
      utterance.lang = arVoice ? arVoice.lang : 'ar-SA';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
    } else {
      // Latin Derja / French / English: Prefer French voice (best rhythm for Franco-Arabizi) or English
      const frVoice =
        this.voices.find((v) => v.lang.startsWith('fr-FR')) ||
        this.voices.find((v) => v.lang.startsWith('fr')) ||
        null;
      if (frVoice) utterance.voice = frVoice;
      utterance.lang = frVoice ? frVoice.lang : 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch {
      onEnd?.();
    }
  }
}

export const speechService = typeof window !== 'undefined' ? new SpeechService() : null;

