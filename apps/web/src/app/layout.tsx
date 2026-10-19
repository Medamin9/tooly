import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tooly.tn — سوق الاشتراكات الرقمية في تونس | Digital Marketplace',
  description:
    'Tooly.tn est la première marketplace tunisienne pour vos outils et abonnements digitaux (IA, Design, Développement) avec support local et tarification transparente en Dinar Tunisien (TND).',
  icons: {
    icon: '/brand/tooly-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink selection:bg-tooly-soft-red selection:text-tooly-red">
        {children}
      </body>
    </html>
  );
}
