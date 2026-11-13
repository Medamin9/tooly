import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { fetchCatalogProducts, fetchCategories } from '@/lib/api/catalog';
import { mapApiProductToStorefrontPlan } from '@/lib/catalog/mappers';
import { resolveCategoryImagePath } from '@/lib/media/category-image';
import { HeroInteractiveScene } from '@/components/motion/HeroInteractiveScene';
import { PixelCard } from '@/components/motion/PixelCard';
import { FaqAccordionInteractive } from '@/components/motion/FaqAccordionInteractive';
import { StarfieldBackground } from '@/components/motion/StarfieldBackground';
import { HeroVelocityGuarantee } from '@/components/motion/HeroVelocityGuarantee';
import { BlurText } from '@/components/motion/BlurText';
import { Button } from '@/components/ui/Button';
import { CtaArrow } from '@/components/ui/CtaArrow';
import { Badge } from '@/components/ui/Badge';
import { MobileCardCarousel } from '@/components/ui/MobileCardCarousel';

// Dynamically import heavy below-the-fold motion components to optimize First Load JS and LCP
const CategoryCardSwap = dynamic(
  () => import('@/components/motion/CategoryCardSwap').then((m) => m.CategoryCardSwap),
  {
    loading: () => (
      <div className="w-full h-[460px] rounded-card bg-surface/30 animate-pulse border border-line/40" />
    ),
  }
);

const CuratedCardCylinder = dynamic(
  () => import('@/components/motion/CuratedCardCylinder').then((m) => m.CuratedCardCylinder),
  {
    loading: () => (
      <div className="w-full h-[480px] rounded-card bg-surface/30 animate-pulse border border-line/40" />
    ),
  }
);

const TrustInteractiveGrid = dynamic(
  () => import('@/components/motion/TrustInteractiveGrid').then((m) => m.TrustInteractiveGrid),
  {
    loading: () => (
      <div className="w-full h-[380px] rounded-card bg-surface/30 animate-pulse border border-line/40" />
    ),
  }
);

const ShapeHeroCta = dynamic(
  () => import('@/components/motion/ShapeHeroCta').then((m) => m.ShapeHeroCta),
  {
    loading: () => (
      <div className="w-full h-[360px] rounded-feature bg-surface/30 animate-pulse border border-line/40" />
    ),
  }
);

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }
  const typedLocale = locale as Locale;
  const dict = dictionaries[typedLocale];
  const [rawCatalog, rawCategories] = await Promise.all([
    fetchCatalogProducts({ locale: typedLocale, limit: 12 }),
    fetchCategories(typedLocale),
  ]);
  const mappedPlans = rawCatalog.items.map((item) =>
    mapApiProductToStorefrontPlan(item, typedLocale),
  );
  const preferredFeaturedSlugs = new Set([
    'claude-pro',
    'canva-pro',
    'chatgpt-plus',
    'capcut-pro',
    'cursor-pro',
  ]);
  const preferredFeatured = mappedPlans.filter((p) => preferredFeaturedSlugs.has(p.slug));
  const featuredPlans = (preferredFeatured.length > 0 ? preferredFeatured : mappedPlans).slice(0, 5);
  const categoriesWithResolvedImages = rawCategories.map((cat) => ({
    ...cat,
    resolvedImage: resolveCategoryImagePath(cat.imageUrl, cat.slug),
  }));

  return (
    <div className="relative isolate min-h-screen">
      {/* Three.js Interactive Starfield Tunnel Background */}
      <StarfieldBackground />

      <main className="relative z-10 space-y-16 sm:space-y-32">
        {/* 1. HERO SECTION */}
        <section className="relative pt-1 pb-4 sm:pt-2 sm:pb-16 overflow-hidden">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8 items-center">
              {/* Hero Copy */}
              <div className="lg:col-span-5 text-start">
                {/* <div className="inline-flex items-center gap-2 bg-tooly-soft-red text-tooly-red text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-tooly-red/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-tooly-red animate-pulse" />
                <span>{dict.hero.badge}</span>
              </div> */}

                <h1 className="text-2xl sm:text-5xl lg:text-5xl font-extrabold text-ink tracking-tight leading-[1.15] mb-2 md:mb-6">
                  <BlurText
                    as="span"
                    text={dict.hero.titlePart1}
                    delay={100}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />{' '}
                  <span className="text-tooly-red underline decoration-tooly-red/30 underline-offset-8 inline">
                    <BlurText
                      as="span"
                      text={dict.hero.titleHighlight}
                      delay={100}
                      animateBy="words"
                      direction="top"
                      className="inline"
                    />
                  </span>{' '}
                  {dict.hero.titlePart2 ? (
                    <BlurText
                      as="span"
                      text={dict.hero.titlePart2}
                      delay={100}
                      animateBy="words"
                      direction="top"
                      className="inline"
                    />
                  ) : null}
                </h1>

                <BlurText
                  as="p"
                  text={dict.hero.description}
                  delay={40}
                  animateBy="words"
                  direction="top"
                  className="text-xs sm:text-lg text-muted leading-relaxed max-w-2xl mb-4 sm:mb-8"
                />

                {/* CTAs */}
                <div className="flex flex-row sm:flex-row items-stretch sm:items-center gap-3 mb-3 md:mb-10">
                  <Link href={`/${typedLocale}/catalog`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto md:text-sm md:px-4 md:py-2.5 md:gap-2"
                    >

                      <BlurText
                        as="span"
                        text={dict.hero.primaryCta}
                        delay={60}
                        animateBy="words"
                        direction="top"
                        className="inline"
                      />
                      <CtaArrow className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto md:text-sm md:px-4 md:py-2.5 md:gap-2"
                    >
                      <BlurText
                        as="span"
                        text={dict.hero.secondaryCta}
                        delay={60}
                        animateBy="words"
                        direction="top"
                        className="inline"
                      />
                    </Button>
                  </a>
                </div>

                {/* Value propositions */}
                <div className="pt-3 sm:pt-6 border-t border-line grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3 text-[10px] md:text-xs font-semibold text-ink">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <BlurText
                      as="span"
                      text={dict.hero.feature1}
                      delay={50}
                      animateBy="words"
                      direction="top"
                      className="inline"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <BlurText
                      as="span"
                      text={dict.hero.feature2}
                      delay={50}
                      animateBy="words"
                      direction="top"
                      className="inline"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <BlurText
                      as="span"
                      text={dict.hero.feature3}
                      delay={50}
                      animateBy="words"
                      direction="top"
                      className="inline"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Interactive 3D / Tactile Scene */}
              <div className="lg:col-span-7 flex justify-center w-full md:pt-0 pt-10 lg:-me-4 xl:-me-8">
                <HeroInteractiveScene locale={typedLocale} dict={dict.heroScene} />
              </div>
            </div>
          </div>
        </section>

        {/* 30-DEGREE SCROLL VELOCITY GUARANTEE BANNER */}
        <HeroVelocityGuarantee dict={dict.velocityGuarantee} locale={typedLocale} />

        {/* 2. CATEGORY DISCOVERY SECTION */}
        <section id="categories" className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-10 md:scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-14 items-center">
            {/* Writing Side */}
            <div className="lg:col-span-5 text-start space-y-6">
              <div>
                <Badge variant="accent" size="sm" className="mb-3">
                  <BlurText
                    as="span"
                    text={dict.categories.badge}
                    delay={60}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </Badge>
                <BlurText
                  as="h2"
                  text={dict.categories.title}
                  delay={70}
                  animateBy="words"
                  direction="top"
                  className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight mb-3"
                />
                <BlurText
                  as="p"
                  text={dict.categories.subtitle}
                  delay={40}
                  animateBy="words"
                  direction="top"
                  className="text-sm sm:text-base text-muted leading-relaxed"
                />
              </div>

              {/* Value propositions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-ink font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <BlurText
                    as="span"
                    text={dict.categories.feature1}
                    delay={50}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-ink font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <BlurText
                    as="span"
                    text={dict.categories.feature2}
                    delay={50}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-ink font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <BlurText
                    as="span"
                    text={dict.categories.feature3}
                    delay={50}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </div>
              </div>

              {/* CTA Button to browse categories */}
              <div className="pt-2">
                <Link href={`/${typedLocale}/catalog`}>
                  <Button variant="primary" size="md" className="w-full sm:w-auto">

                    <BlurText
                      as="span"
                      text={dict.categories.exploreCta}
                      delay={60}
                      animateBy="words"
                      direction="top"
                      className="inline"
                    />
                    <CtaArrow className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Categories CardSwap 3D Stack */}
            <div className="lg:col-span-7 flex justify-center w-full">
              <CategoryCardSwap
                locale={typedLocale}
                dict={dict.categories}
                categories={categoriesWithResolvedImages}
              />
            </div>
          </div>
        </section>

        {/* 3. CURATED FEATURED PLANS (3D Horizontal Cylinder Carousel) */}
        <section id="curated" className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <CuratedCardCylinder
            plans={featuredPlans}
            locale={typedLocale}
            dict={dict.curated}
          />
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="border-y border-line py-16 sm:py-24 scroll-mt-20">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="accent" size="sm" className="mb-2">
                <BlurText
                  as="span"
                  text={dict.howItWorksSection.badge}
                  delay={60}
                  animateBy="words"
                  direction="top"
                  className="inline"
                />
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-3">
                <BlurText
                  as="span"
                  text={dict.howItWorksSection.title}
                  delay={70}
                  animateBy="words"
                  direction="top"
                  className="inline"
                />
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                <BlurText
                  as="span"
                  text={dict.howItWorksSection.subtitle}
                  delay={40}
                  animateBy="words"
                  direction="top"
                  className="inline"
                />
              </p>
            </div>

            <MobileCardCarousel
              desktopBreakpoint="md"
              locale={typedLocale}
              ariaLabel={dict.howItWorksSection.title}
            >
              <PixelCard
                variant="tooly"
                theme="dark"
                trigger="hover"
                origin="pointer"
                glow={0.55}
                spotlight={0.45}
                speed={30}
                gap={6}
                radius={20}
                className="p-6 sm:p-8 text-start min-h-[220px] h-full"
              >
                <span className="text-3xl font-black text-tooly-red/80 mb-2 block">
                  <BlurText
                    as="span"
                    text="01"
                    delay={60}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  <BlurText
                    as="span"
                    text={dict.howItWorksSection.step1Title}
                    delay={65}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </h3>
                <p className="text-xs sm:text-lg text-white leading-relaxed">
                  <BlurText
                    as="span"
                    text={dict.howItWorksSection.step1Desc}
                    delay={35}
                    animateBy="words"
                    direction="top"
                    color="#abababff"
                    className="inline text-white"
                  />
                </p>
              </PixelCard>

              <PixelCard
                variant="amber"
                theme="dark"
                trigger="hover"
                origin="pointer"
                glow={0.5}
                spotlight={0.45}
                speed={30}
                gap={6}
                radius={20}
                className="p-6 sm:p-8 text-start min-h-[220px] h-full"
              >
                <span className="text-3xl font-black text-amber-500/80 mb-2 block">
                  <BlurText
                    as="span"
                    text="02"
                    delay={60}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  <BlurText
                    as="span"
                    text={dict.howItWorksSection.step2Title}
                    delay={65}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </h3>
                <p className="text-xs sm:text-lg text-white leading-relaxed">
                  <BlurText
                    as="span"
                    text={dict.howItWorksSection.step2Desc}
                    delay={35}
                    animateBy="words"
                    direction="top"
                    color="#abababff"
                    className="inline text-white"
                  />
                </p>
              </PixelCard>

              <PixelCard
                variant="emerald"
                theme="dark"
                trigger="hover"
                origin="pointer"
                glow={0.5}
                spotlight={0.45}
                speed={30}
                gap={6}
                radius={20}
                className="p-6 sm:p-8 text-start min-h-[220px] h-full"
              >
                <span className="text-3xl font-black text-emerald-600/80 mb-2 block">
                  <BlurText
                    as="span"
                    text="03"
                    delay={60}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  <BlurText
                    as="span"
                    text={dict.howItWorksSection.step3Title}
                    delay={65}
                    animateBy="words"
                    direction="top"
                    className="inline"
                  />
                </h3>
                <p className="text-xs sm:text-lg text-white leading-relaxed">
                  <BlurText
                    as="span"
                    text={dict.howItWorksSection.step3Desc}
                    delay={35}
                    animateBy="words"
                    direction="top"
                    color="#abababff"
                    className="inline text-white"
                  />
                </p>
              </PixelCard>
            </MobileCardCarousel>
          </div>
        </section>

        {/* 5. TRUST & TRANSPARENCY SECTION */}
        <section id="trust" className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 relative">
          {/* Artistic ambient aura backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-5xl h-96 bg-gradient-to-r from-tooly-red/8 via-amber-500/8 to-emerald-500/8 blur-3xl pointer-events-none rounded-full -z-10" />

          <div className="text-start mb-12 sm:mb-16">
            <Badge variant="accent" size="sm" className="mb-2">
              <BlurText
                as="span"
                text={dict.trustSection.badge}
                delay={60}
                animateBy="words"
                direction="top"
                className="inline"
              />
            </Badge>
            <BlurText
              as="h2"
              text={dict.trustSection.title}
              delay={70}
              animateBy="words"
              direction="top"
              className="text-2xl sm:text-4xl font-extrabold text-ink mb-3 tracking-tight"
            />
            <BlurText
              as="p"
              text={dict.trustSection.subtitle}
              delay={40}
              animateBy="words"
              direction="top"
              className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed"
            />
          </div>

          {/* 3D Interactive Luminous Trust Grid */}
          <TrustInteractiveGrid dict={dict.trustSection} locale={typedLocale} />
        </section>

        {/* 6. FAQ ACCORDION */}
        <section id="faq" className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <FaqAccordionInteractive dict={dict.faqSection} locale={typedLocale} />
        </section>

        {/* 7. BOTTOM CALL TO ACTION */}
        <section className="w-full">
          <ShapeHeroCta dict={dict} locale={typedLocale} />
        </section>
      </main>
    </div>
  );
}
