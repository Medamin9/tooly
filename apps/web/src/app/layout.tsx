import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

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
    <html lang="ar" dir="rtl" className="h-full" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts CDN with crossOrigin for minimal network latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload critical font stylesheet with display=swap for zero FOIT and fast FCP */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
        {/* Preload assistant video stream for instant first-frame playback */}
        <link rel="preload" href="/video.mp4" as="video" type="video/mp4" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var seg = (window.location.pathname || '').split('/')[1];
                  if (seg === 'fr' || seg === 'en') {
                    document.documentElement.lang = seg;
                    document.documentElement.dir = 'ltr';
                  } else {
                    document.documentElement.lang = 'ar';
                    document.documentElement.dir = 'rtl';
                  }
                  var stored = localStorage.getItem('tooly-theme');
                  if (stored === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink selection:bg-tooly-soft-red selection:text-tooly-red font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
