import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Layers, Globe2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Notice Banner */}
      <div className="bg-ink text-surface py-2 px-4 text-xs font-medium text-center">
        <span>🇹🇳 منصة Tooly.tn الأولى في تونس — الاشتراكات الرقمية بالدينار التونسي (TND)</span>
      </div>

      {/* Main Header */}
      <header className="border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-28 sm:w-36">
              <Image
                src="/brand/tooly-logo.png"
                alt="Tooly.tn Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="hidden sm:inline-block text-xs bg-tooly-soft-red text-tooly-red font-semibold px-2.5 py-1 rounded-full border border-tooly-red/20">
              Phase 0: Foundation
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted font-medium bg-paper px-3 py-1.5 rounded-control border border-line">
              <Globe2 className="w-3.5 h-3.5 text-ink" />
              <span className="text-tooly-red font-bold">العربية</span>
              <span className="text-line">|</span>
              <span className="hover:text-ink cursor-pointer">Français</span>
              <span className="text-line">|</span>
              <span className="hover:text-ink cursor-pointer">English</span>
            </div>
            <a
              href="http://localhost:4000/api/v1/health"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-ink text-surface text-xs font-semibold px-4 py-2 rounded-control hover:bg-ink-light transition-colors"
            >
              <span>API Health</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero / Foundation Overview */}
      <main className="flex-1 max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-tooly-soft-red text-tooly-red text-sm font-semibold px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-tooly-red animate-pulse" />
            جاهزية الأساس الفني والهيكلي
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-tight mb-6">
            سوق الأدوات والاشتراكات الرقمية في تونس
          </h1>
          <p className="text-base sm:text-lg text-muted leading-relaxed mb-8">
            تم إرساء أسس المشروع (Phase 0) بنجاح وفق أعلى معايير الأمان والتوافق مع بيئة العمل: بنية Monorepo
            متكاملة تضم Next.js 15 و NestJS 11 مع دعم اللغة العربية (RTL)، والعملة المحلية (TND)، ونظام
            التسليم والمعالجة خارج المنصة.
          </p>
        </div>

        {/* Foundation Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="bg-surface p-6 rounded-card border border-line shadow-sm hover:border-tooly-red/40 transition-colors">
            <div className="w-10 h-10 rounded-control bg-tooly-soft-red text-tooly-red flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Next.js 15 App Router</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              واجهة المستخدم العصرية مع دعم Tailwind CSS المصمم خصيصاً لهوية Tooly والألوان المعتمدة مع دعم كامل لاتجاه RTL.
            </p>
            <div className="text-xs font-mono text-ink/70 bg-paper p-2 rounded-control border border-line">
              apps/web (Port 3000)
            </div>
          </div>

          <div className="bg-surface p-6 rounded-card border border-line shadow-sm hover:border-tooly-red/40 transition-colors">
            <div className="w-10 h-10 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">NestJS 11 REST API</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              المحرك الرئيسي لقواعد الأعمال، والتحقق الصارم من المدخلات عبر DTOs، وتوثيق OpenAPI Swagger المتكامل.
            </p>
            <div className="text-xs font-mono text-ink/70 bg-paper p-2 rounded-control border border-line">
              apps/api (Port 4000)
            </div>
          </div>

          <div className="bg-surface p-6 rounded-card border border-line shadow-sm hover:border-tooly-red/40 transition-colors">
            <div className="w-10 h-10 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">PostgreSQL & Prisma</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              مخطط البيانات المعتمد لدعم المنتجات، والخطط، والأسعار بدقة المليم التونسي (3 Decimal Places)، وحالات الطلب.
            </p>
            <div className="text-xs font-mono text-ink/70 bg-paper p-2 rounded-control border border-line">
              apps/api/prisma/schema.prisma
            </div>
          </div>
        </div>

        {/* Status Verification Checklist */}
        <div className="bg-surface border border-line rounded-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-ink mb-4">قائمة التحقق للمرحلة التأسيسية (Phase 0 Done)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2.5 text-ink">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>إعداد Monorepo وتوحيد سياق npm workspaces</span>
            </div>
            <div className="flex items-center gap-2.5 text-ink">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>فصل apps/web عن apps/api وحزم العقود المشتركة</span>
            </div>
            <div className="flex items-center gap-2.5 text-ink">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>نقطة الفحص الصحي GET /api/v1/health مع اختبار آلي</span>
            </div>
            <div className="flex items-center gap-2.5 text-ink">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تثبيت قرار معالجة الدفع خارج المنصة (Offline Transfer)</span>
            </div>
            <div className="flex items-center gap-2.5 text-ink">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تكامل شعار وألوان Tooly.tn الرسمية</span>
            </div>
            <div className="flex items-center gap-2.5 text-ink">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تهيئة أوامر الاختبار والبناء الموحدة</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-surface py-6 text-center text-xs text-muted">
        <p>© 2026 Tooly.tn — جميع الحقوق محفوظة. تم التأسيس وفق معايير Antigravity الهندسية.</p>
      </footer>
    </div>
  );
}
