import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const SAFE_FILENAME_REGEX = /^prod-[a-f0-9-]+\.(jpg|png|webp)$/;

/**
 * Image Path Handler Route for uploaded product logos.
 * Safely serves uploaded product icons from NestJS upload storage on the same origin.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  if (!filename || !SAFE_FILENAME_REGEX.test(filename)) {
    return NextResponse.json({ error: 'Invalid image filename' }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${API_BASE}/uploads/products/${encodeURIComponent(filename)}`,
      { cache: 'force-cache' }
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Product image not found' },
        { status: upstream.status === 404 ? 404 : 502 }
      );
    }

    const contentType = upstream.headers.get('content-type') || 'image/png';
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

