export interface CategoryResponseDto {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  productsCount: number;
  imageUrl?: string | null;
}
