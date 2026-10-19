import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-paper text-ink">
      <span className="text-sm font-bold text-tooly-red bg-tooly-soft-red px-3 py-1 rounded-full mb-4">
        خطأ 404
      </span>
      <h1 className="text-3xl font-extrabold mb-2">الصفحة غير موجودة</h1>
      <p className="text-muted text-sm max-w-md mb-6">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها على Tooly.tn.
      </p>
      <Link
        href="/"
        className="bg-ink text-surface text-xs font-semibold px-5 py-2.5 rounded-control hover:bg-ink-light transition-colors"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}
