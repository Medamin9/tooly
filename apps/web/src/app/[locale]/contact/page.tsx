'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { submitContactMessageApi } from '@/lib/api/contacts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const isAr = typedLocale === 'ar';
  const isFr = typedLocale === 'fr';

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjectOptions = [
    {
      value: 'general',
      label: isAr
        ? 'استفسار عام أو مساعدة'
        : isFr
          ? 'Renseignement général'
          : 'General Inquiry',
    },
    {
      value: 'subscription_inquiry',
      label: isAr
        ? 'استفسار حول اشتراك أو أداة معينة'
        : isFr
          ? 'Question sur un abonnement / outil'
          : 'Subscription or Tool Question',
    },
    {
      value: 'payment_transfer',
      label: isAr
        ? 'الدفع والتحويل البنكي أو D17'
        : isFr
          ? 'Paiement, virement bancaire ou D17'
          : 'Payment, Bank Transfer or D17',
    },
    {
      value: 'business_quote',
      label: isAr
        ? 'طلب اشتراك للشركات والفرق (B2B)'
        : isFr
          ? 'Offres pour entreprises et équipes (B2B)'
          : 'Business & Team Subscriptions (B2B)',
    },
    {
      value: 'technical_support',
      label: isAr
        ? 'دعم فني ومساعدة في التفعيل'
        : isFr
          ? 'Support technique et activation'
          : 'Technical Support & Activation',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(
        isAr
          ? 'يرجى تعبئة كافة الحقول الإلزامية المطلوبة.'
          : isFr
            ? 'Veuillez remplir tous les champs obligatoires.'
            : 'Please fill in all required fields.',
      );
      return;
    }

    setLoading(true);
    setError(null);

    const selectedOption = subjectOptions.find((o) => o.value === subject);
    const subjectTitle = selectedOption ? selectedOption.label : subject;

    try {
      await submitContactMessageApi({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subjectTitle,
        message: message.trim(),
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('general');
      setMessage('');
    } catch (err) {
      setError(
        (err as Error).message ||
          (isAr
            ? 'تعذر إرسال الرسالة حالياً. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة عبر واتساب.'
            : isFr
              ? 'Échec de l’envoi. Veuillez réessayer ou nous contacter via WhatsApp.'
              : 'Failed to send message. Please try again or reach us via WhatsApp.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-start">
      {/* Header Breadcrumb & Title */}
      <div className="mb-8 sm:mb-12">
        <Link
          href={`/${typedLocale}`}
          className="text-xs text-muted hover:text-ink flex items-center gap-1.5 mb-3 group transition-colors inline-flex"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
          <span>
            {isAr ? 'العودة للرئيسية' : isFr ? 'Retour à l’accueil' : 'Back to home'}
          </span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tooly-soft-red text-tooly-red text-xs font-bold mb-3 border border-tooly-red/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {isAr
              ? 'فريق الدعم في تونس رهن إشارتك'
              : isFr
                ? 'Support client réactif en Tunisie'
                : 'Customer Support in Tunisia'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          {isAr
            ? 'تواصل معنا واستفسر عن اشتراكاتك'
            : isFr
              ? 'Contactez l’équipe Tooly.tn'
              : 'Get in Touch with Tooly.tn'}
        </h1>
        <p className="text-sm sm:text-base text-muted mt-2 max-w-2xl leading-relaxed">
          {isAr
            ? 'سواء كنت بحاجة لمساعدة في اختيار الأداة المناسبة، أو استفسار حول طرق الدفع بالدينار التونسي، فريقنا التونسي مستعد للإجابة خلال أقل من ساعتين.'
            : isFr
              ? 'Besoin d’aide pour choisir votre abonnement ou d’une assistance de paiement en TND ? Notre équipe basée en Tunisie vous répond rapidement.'
              : 'Need help picking the right plan or assistance with local Tunisian payment? Our dedicated team typically responds within 2 hours.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-surface border border-line shadow-sm relative z-10">
            {success ? (
              <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-ink">
                  {isAr
                    ? 'شكراً لتواصلك معنا! تم استلام رسالتك بنجاح'
                    : isFr
                      ? 'Message envoyé avec succès !'
                      : 'Message Sent Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'تم تسجيل رسالتك في نظام الدعم الفني، وسيتواصل معك مستشارنا عبر البريد الإلكتروني أو الهاتف في أقرب وقت.'
                    : isFr
                      ? 'Votre message a été enregistré avec soin. Notre équipe support vous recontactera par e-mail ou téléphone très rapidement.'
                      : 'Your message has been safely logged. A member of our support team will get back to you shortly.'}
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSuccess(false)}
                    className="mx-auto"
                  >
                    <span>
                      {isAr
                        ? 'إرسال رسالة أخرى'
                        : isFr
                          ? 'Envoyer un autre message'
                          : 'Send another message'}
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-ink mb-1.5 cursor-pointer"
                  >
                    {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'مثال: أحمد بن علي' : isFr ? 'Ex: Ahmed Ben Ali' : 'e.g. Ahmed Ben Ali'}
                    className="w-full h-11 px-3.5 py-2.5 bg-paper text-ink text-base sm:text-xs rounded-control border border-line focus:outline-none focus:ring-2 focus:ring-tooly-red focus:border-tooly-red transition-all cursor-text touch-manipulation placeholder:text-muted/60"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-ink mb-1.5 cursor-pointer"
                    >
                      {isAr
                        ? 'البريد الإلكتروني *'
                        : isFr
                          ? 'Adresse e-mail *'
                          : 'Email Address *'}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ahmed@example.tn"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full h-11 px-3.5 py-2.5 bg-paper text-ink text-base sm:text-xs rounded-control border border-line focus:outline-none focus:ring-2 focus:ring-tooly-red focus:border-tooly-red transition-all cursor-text touch-manipulation placeholder:text-muted/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold text-ink mb-1.5 cursor-pointer"
                    >
                      {isAr
                        ? 'رقم الهاتف أو واتساب'
                        : isFr
                          ? 'Téléphone ou WhatsApp'
                          : 'Phone / WhatsApp'}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+216 98 000 000"
                      className="w-full h-11 px-3.5 py-2.5 bg-paper text-ink text-base sm:text-xs rounded-control border border-line font-mono focus:outline-none focus:ring-2 focus:ring-tooly-red focus:border-tooly-red transition-all cursor-text touch-manipulation placeholder:text-muted/60"
                    />
                  </div>
                </div>

                {/* Subject Selector */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-ink mb-1.5 cursor-pointer"
                  >
                    {isAr ? 'موضوع الرسالة' : isFr ? 'Sujet du message' : 'Subject'}
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-11 px-3.5 py-2.5 bg-paper text-ink text-sm sm:text-xs rounded-control border border-line focus:outline-none focus:ring-2 focus:ring-tooly-red focus:border-tooly-red transition-all cursor-pointer"
                  >
                    {subjectOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Body */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-ink mb-1.5 cursor-pointer"
                  >
                    {isAr ? 'نص الرسالة والاستفسار *' : isFr ? 'Votre message *' : 'Your Message *'}
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isAr
                        ? 'اكتب استفسارك بالتفصيل وسيقوم فريق الدعم بالرد عليك...'
                        : isFr
                          ? 'Détaillez votre demande ou question ici...'
                          : 'Describe your inquiry or question here...'
                    }
                    className="w-full p-3.5 bg-paper text-ink text-base sm:text-xs rounded-control border border-line focus:outline-none focus:ring-2 focus:ring-tooly-red focus:border-tooly-red transition-all cursor-text touch-manipulation resize-y placeholder:text-muted/60"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={loading}
                  className="w-full h-12 gap-2 text-sm font-bold shadow-sm active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 shrink-0 rtl:rotate-180" />
                  <span>
                    {isAr
                      ? 'إرسال الرسالة الآن'
                      : isFr
                        ? 'Envoyer le message'
                        : 'Send Message'}
                  </span>
                </Button>

                <p className="text-[11px] text-muted text-center pt-1">
                  {isAr
                    ? '🔒 بياناتك محمية ومشفرة. لا نشارك معلوماتك مع أي طرف خارجي.'
                    : isFr
                      ? '🔒 Vos coordonnées restent strictement confidentielles.'
                      : '🔒 Your data is fully protected and kept confidential.'}
                </p>
              </form>
            )}
          </Card>
        </div>

        {/* Right Column: Direct Channels & Information */}
        <div className="lg:col-span-5 space-y-4">
          {/* WhatsApp Direct Card */}
          <div className="p-5 sm:p-6 rounded-card border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 text-ink space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">
                  {isAr
                    ? 'محادثة فورية عبر واتساب'
                    : isFr
                      ? 'Assistance directe WhatsApp'
                      : 'Direct WhatsApp Support'}
                </h3>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAr ? 'متاح الآن للرد' : 'En ligne actuellement'}</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {isAr
                ? 'تحب إجابة سريعة في بضع دقائق؟ تواصل مع المستشار التونسي مباشرة عبر الواتساب.'
                : isFr
                  ? 'Besoin d’une réponse immédiate ? Contactez un conseiller Tooly directement sur WhatsApp.'
                  : 'Prefer instant chat? Chat directly with a support agent on WhatsApp.'}
            </p>
            <a
              href="https://wa.me/21698000000?text=Bonjour%20Tooly.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-control transition-all active:scale-[0.98] shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'فتح محادثة واتساب الآن' : 'Ouvrir WhatsApp'}</span>
            </a>
          </div>

          {/* Quick Channels Info */}
          <Card className="p-5 sm:p-6 bg-surface border border-line space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted pb-2 border-b border-line">
              {isAr ? 'معلومات الاتصال المباشرة' : isFr ? 'Coordonnées directes' : 'Direct Contacts'}
            </h3>

            <div className="flex items-start gap-3 text-xs">
              <Mail className="w-4 h-4 text-tooly-red shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink block">
                  {isAr ? 'البريد الإلكتروني الرسمي:' : 'E-mail officiel :'}
                </span>
                <a
                  href="mailto:contact@tooly.tn"
                  className="text-tooly-red hover:underline font-mono"
                >
                  contact@tooly.tn
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <Clock className="w-4 h-4 text-tooly-red shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink block">
                  {isAr ? 'أوقات العمل والاستجابة:' : 'Horaires d’assistance :'}
                </span>
                <span className="text-muted">
                  {isAr
                    ? 'كامل أيام الأسبوع (7/7) من 09:00 إلى 22:00 (توقيت تونس)'
                    : '7j/7 de 09h00 à 22h00 (Heure de Tunis)'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-4 h-4 text-tooly-red shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink block">
                  {isAr ? 'المقر وسوق الخدمة:' : 'Siège & Couverture :'}
                </span>
                <span className="text-muted">
                  {isAr ? 'تونس العاصمة، الجمهورية التونسية' : 'Tunis, République Tunisienne'}
                </span>
              </div>
            </div>
          </Card>

          {/* Track Order Direct Redirect */}
          <Card className="p-5 bg-paper border border-line space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-ink">
              <PackageCheck className="w-4 h-4 text-tooly-red" />
              <span>
                {isAr
                  ? 'هل قمت بطلب وتريد تتبع التفعيل؟'
                  : isFr
                    ? 'Vous avez déjà passé commande ?'
                    : 'Already have an order?'}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {isAr
                ? 'يمكنك الاطلاع فوراً على حالة الدفع والتسليم دون الحاجة لمراسلتنا عبر بوابة تتبع الطلبات.'
                : isFr
                  ? 'Suivez directement l’état d’activation de votre abonnement sur notre page dédiée.'
                  : 'Track your subscription activation directly via our order tracking portal.'}
            </p>
            <Link
              href={`/${typedLocale}/order/lookup`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-tooly-red hover:underline"
            >
              <span>{isAr ? 'الانتقال لصفحة تتبع الطلبات ←' : 'Accéder au suivi de commande →'}</span>
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}

