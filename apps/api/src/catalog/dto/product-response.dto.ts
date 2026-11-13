export interface LocalizedOptionLabelDto {
  ar: string;
  fr: string;
  en: string;
}

export interface PlanVariantResponseDto {
  id: string;
  slug: string;
  duration: string;
  durationLabels?: LocalizedOptionLabelDto;
  price: number;
  currency: string;
  isAvailable: boolean;
  isDemo: boolean;
  features?: string[];
  restrictions?: string[];
}

export interface ProductResponseDto {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  provider: string;
  categorySlug: string;
  categoryName?: string;
  deliveryMethod: string;
  deliveryMethodLabels?: LocalizedOptionLabelDto;
  isPublished: boolean;
  isDemo: boolean;
  iconUrl?: string | null;
  variants: PlanVariantResponseDto[];
}

export interface PaginatedProductsResponseDto {
  items: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
