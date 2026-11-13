import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { SUPPORTED_LOCALES } from '@tooly/contracts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Authenticated cache invalidation endpoint called after admin product changes.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let slug: string | undefined;
  try {
    const body = (await request.json()) as { slug?: unknown };
    if (typeof body?.slug === 'string' && /^[a-z0-9-]+$/i.test(body.slug.trim())) {
      slug = body.slug.trim().toLowerCase();
    }
  } catch {
    // Optional JSON body
  }

  try {
    const profileRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });

    if (!profileRes.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = (await profileRes.json()) as { role?: string };
    if (profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    revalidateTag('products');
    revalidateTag('categories');
    revalidateTag('catalog-options');
    for (const locale of SUPPORTED_LOCALES) {
      revalidatePath(`/${locale}`, 'page');
      revalidatePath(`/${locale}/catalog`, 'page');
      revalidatePath(`/${locale}/product/[slug]`, 'page');
      if (slug) {
        revalidatePath(`/${locale}/product/${slug}`, 'page');
      }
    }

    return NextResponse.json({ revalidated: true, slug: slug ?? null });
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}

