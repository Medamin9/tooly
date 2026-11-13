'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Palette,
  Video,
  Workflow,
  Code2,
  Layers,
} from 'lucide-react';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { useTheme } from '@/components/theme/ThemeProvider';
import { resolveCategoryImagePath } from '@/lib/media/category-image';
import { CardSwap, CardSwapRef, CardSwapItem } from './CardSwap';

export interface HomeCategoryCardData {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  resolvedImage?: string;
  productsCount?: number;
}

export interface CategoryCardSwapProps {
  locale: string;
  dict: Dictionary['categories'];
  categories?: HomeCategoryCardData[];
}

type KnownCategorySlug = 'ai' | 'design' | 'video' | 'productivity' | 'developer';

const KNOWN_CATEGORY_SLUGS: readonly KnownCategorySlug[] = [
  'ai',
  'design',
  'video',
  'productivity',
  'developer',
];

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  ai: <Sparkles className="w-4 h-4 text-amber-600" />,
  design: <Palette className="w-4 h-4 text-cyan-600" />,
  video: <Video className="w-4 h-4 text-rose-600" />,
  productivity: <Workflow className="w-4 h-4 text-emerald-600" />,
  developer: <Code2 className="w-4 h-4 text-indigo-600" />,
};

export function CategoryCardSwap({
  locale,
  dict,
  categories,
}: CategoryCardSwapProps) {
  const router = useRouter();
  const cardSwapRef = useRef<CardSwapRef | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { resolvedTheme } = useTheme();

  const isArabic = locale === 'ar';

  const formatFallbackBadge = (productsCount = 0) => {
    if (locale === 'ar') return productsCount > 0 ? `${productsCount} خطط` : 'جديد';
    if (locale === 'fr') return productsCount > 0 ? `${productsCount} offres` : 'Nouveau';
    return productsCount > 0 ? `${productsCount} plans` : 'Featured';
  };

  const sourceList: HomeCategoryCardData[] =
    categories && categories.length > 0
      ? categories
      : KNOWN_CATEGORY_SLUGS.map((slug, idx) => ({
        id: String(idx + 1),
        slug,
        name: dict[slug].name,
        description: dict[slug].desc,
        imageUrl: null,
      }));

  const categoryItems: (CardSwapItem & { slug: string })[] = sourceList.map((cat) => {
    const knownMeta = KNOWN_CATEGORY_SLUGS.includes(cat.slug as KnownCategorySlug)
      ? dict[cat.slug as KnownCategorySlug]
      : null;

    return {
      key: cat.id || cat.slug,
      slug: cat.slug,
      title: cat.name || knownMeta?.name || cat.slug,
      desc: cat.description || knownMeta?.desc || '',
      badge: knownMeta?.badge || formatFallbackBadge(cat.productsCount),
      image: cat.resolvedImage || resolveCategoryImagePath(cat.imageUrl, cat.slug),
      icon: CATEGORY_ICON_MAP[cat.slug] || <Layers className="w-4 h-4 text-tooly-red" />,
      href: `/${locale}/catalog?category=${cat.slug}`,
    };
  });

  const handleCardClick = (index: number) => {
    // If clicking on the active front card, navigate to the category catalog page
    if (index === activeIndex) {
      const activeItem = categoryItems[index];
      if (activeItem?.href) {
        router.push(activeItem.href);
      }
    }
  };

  return (
    <div className="relative w-full max-w-[720px] flex items-center justify-center">
      {/* 3D Stack Container */}
      <div className="w-full h-[460px] sm:h-[500px] lg:h-[540px] flex items-center justify-center">
        <CardSwap
          ref={cardSwapRef}
          items={categoryItems}
          width={600}
          height={480}
          cardDistance={isArabic ? -65 : 65}
          verticalDistance={75}
          depth={90}
          skewAmount={isArabic ? -5 : 5}
          visibleCards={4}
          delay={4000}
          autoplay={true}
          pauseOnHover={true}
          draggable={true}
          speed={1}
          bounce={0.35}
          parallax={0.45}
          hoverSpread={0.14}
          dim={0.45}
          cardRadius={20}
          theme={resolvedTheme}
          onCardClick={handleCardClick}
          onChange={(newIndex) => setActiveIndex(newIndex)}
        />
      </div>
    </div>
  );
}

export default CategoryCardSwap;
