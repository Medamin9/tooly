/**
 * Category Image Path Handler for Tooly.tn
 *
 * Normalizes and validates persisted category image paths across:
 * 1. Backend-uploaded images (`/uploads/categories/cat-xxx.jpg`) -> proxied via `/api/uploads/categories/...`
 * 2. Local static category artwork (`/images/categories/...`)
 * 3. Validated http(s) URLs
 * 4. Slug-based fallback artwork when an image is absent or invalid
 */

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  ai: '/images/categories/ia.jpg',
  design: '/images/categories/design.jpg',
  video: '/images/categories/video.jpg',
  productivity: '/images/categories/productivity.jpg',
  developer: '/images/categories/devtools.jpg',
};

export const DEFAULT_CATEGORY_IMAGE = '/images/categories/ia.jpg';

export const ALLOWED_CATEGORY_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const MAX_CATEGORY_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const SAFE_UPLOAD_FILENAME_REGEX = /^cat-[a-f0-9-]+\.(jpg|png|webp)$/i;

/**
 * Returns the default static artwork path for a category slug.
 */
export function getCategoryFallbackImage(slug?: string | null): string {
  if (!slug) return DEFAULT_CATEGORY_IMAGE;
  const normalized = slug.toLowerCase().trim();
  return CATEGORY_FALLBACK_IMAGES[normalized] || DEFAULT_CATEGORY_IMAGE;
}

/**
 * Resolves a stored category image path into a safe, browser-loadable URL/path.
 * Uses the Next.js `/api/uploads/categories/[filename]` handler for backend Multer uploads.
 */
export function resolveCategoryImagePath(
  imageUrl?: string | null,
  slug?: string | null
): string {
  const raw = typeof imageUrl === 'string' ? imageUrl.trim() : '';
  if (!raw) {
    return getCategoryFallbackImage(slug);
  }

  // Reject directory traversal or unsafe URI schemes
  const lower = raw.toLowerCase();
  if (
    raw.includes('..') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:')
  ) {
    return getCategoryFallbackImage(slug);
  }

  // Normalize Multer upload paths to the Next.js image path handler
  const uploadMatch = raw.match(
    /^\/(?:api\/(?:v1\/)?)?uploads\/categories\/([a-zA-Z0-9._-]+)$/
  );
  if (uploadMatch) {
    const filename = uploadMatch[1];
    if (SAFE_UPLOAD_FILENAME_REGEX.test(filename)) {
      return `/api/uploads/categories/${filename}`;
    }
    return getCategoryFallbackImage(slug);
  }

  // Local static public assets
  if (raw.startsWith('/images/')) {
    return raw;
  }

  // Validated external HTTP(S) URLs
  if (lower.startsWith('https://') || lower.startsWith('http://')) {
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        return raw;
      }
    } catch {
      return getCategoryFallbackImage(slug);
    }
  }

  return getCategoryFallbackImage(slug);
}

