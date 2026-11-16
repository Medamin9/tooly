import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const SAFE_FILENAME_REGEX = /^prod-[a-f0-9-]+\.(jpg|png|webp)$/i;

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

function tryReadLocalFile(filename: string): Buffer | null {
  const candidates = [
    path.resolve(process.cwd(), '..', 'api', 'uploads', 'products', filename),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'products', filename),
    path.resolve(process.cwd(), 'uploads', 'products', filename),
    process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR, 'products', filename) : null,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        return fs.readFileSync(candidate);
      } catch {
        // continue to next candidate
      }
    }
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  if (!filename || !SAFE_FILENAME_REGEX.test(filename)) {
    return NextResponse.json({ error: 'Invalid product image filename' }, { status: 400 });
  }

  const ext = filename.split('.').pop()?.toLowerCase() || 'png';
  const mimeType = EXT_TO_MIME[ext] || 'image/png';

  // 1. Check local filesystem directly (lightning-fast in dev and local environments)
  const localBuffer = tryReadLocalFile(filename);
  if (localBuffer) {
    return new NextResponse(new Uint8Array(localBuffer), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // 2. Fallback to API upstream
  try {
    const upstreamUrl = `${API_BASE}/uploads/products/${encodeURIComponent(filename)}`;
    let upstream = await fetch(upstreamUrl, { cache: 'force-cache' });

    if (!upstream.ok) {
      // Try root /uploads fallback if API_BASE includes /api/v1
      const rootBase = API_BASE.replace(/\/api\/v1\/?$/, '');
      if (rootBase !== API_BASE) {
        upstream = await fetch(`${rootBase}/uploads/products/${encodeURIComponent(filename)}`, {
          cache: 'force-cache',
        });
      }
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Product image not found' },
        { status: upstream.status === 404 ? 404 : 502 }
      );
    }

    const contentType = upstream.headers.get('content-type') || mimeType;
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to retrieve product image' },
      { status: 502 }
    );
  }
}
