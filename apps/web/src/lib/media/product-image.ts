/**
 * Product Icon / Logo Path Handler for Tooly.tn
 *
 * Normalizes and validates persisted product icon paths across:
 * 1. Backend-uploaded images (`/uploads/products/prod-xxx.png`) -> proxied via `/api/uploads/products/...`
 * 2. Local static logo artwork (`/images/logos/...` or `/images/...`)
 * 3. Validated http(s) URLs
 * 4. Slug-based fallback logos when an image is absent or invalid
 */

export const PRODUCT_FALLBACK_LOGOS: Record<string, string> = {
  'claude-pro': '/images/logos/claude.webp',
  'canva-pro': '/images/logos/canva.webp',
  'capcut-pro': '/images/logos/capcut.webp',
};

export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const SAFE_PRODUCT_UPLOAD_REGEX = /^prod-[a-f0-9-]+\.(jpg|png|webp)$/i;

export function getProductFallbackLogo(slug?: string | null): string | null {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  return PRODUCT_FALLBACK_LOGOS[normalized] || null;
}

export function resolveProductIconPath(
  iconUrl?: string | null,
  slug?: string | null
): string | null {
  const raw = typeof iconUrl === 'string' ? iconUrl.trim() : '';
  if (!raw) {
    return getProductFallbackLogo(slug);
  }

  const lower = raw.toLowerCase();
  if (
    raw.includes('..') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:')
  ) {
    return getProductFallbackLogo(slug);
  }

  const uploadMatch = raw.match(
    /^\/(?:api\/(?:v1\/)?)?uploads\/products\/([a-zA-Z0-9._-]+)$/
  );
  if (uploadMatch) {
    const filename = uploadMatch[1];
    if (SAFE_PRODUCT_UPLOAD_REGEX.test(filename)) {
      return `/api/uploads/products/${filename}`;
    }
    return getProductFallbackLogo(slug);
  }

  if (raw.startsWith('/images/')) {
    return raw;
  }

  if (lower.startsWith('https://') || lower.startsWith('http://')) {
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        return raw;
      }
    } catch {
      return getProductFallbackLogo(slug);
    }
  }

  return getProductFallbackLogo(slug);
}

