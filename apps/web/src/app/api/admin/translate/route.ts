import { NextRequest, NextResponse } from 'next/server';
import {
  autoTranslateProductMetadata,
  autoTranslateVariantPack,
  SupportedLocale,
  translateText,
} from '@/lib/translation/auto-translate';

/**
 * Admin 1-Click Translation API Route for Tooly.tn
 *
 * Translates product metadata, individual packs, or batch of packs
 * across Arabic (ar), French (fr), and English (en).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const sourceLocale: SupportedLocale = body.sourceLocale || 'ar';
    const targetLocales: SupportedLocale[] =
      Array.isArray(body.targetLocales) && body.targetLocales.length > 0
        ? body.targetLocales
        : (['fr', 'en'] as SupportedLocale[]);

    // 1. Single Text Translation
    if (typeof body.text === 'string') {
      const target = (body.to || (sourceLocale === 'ar' ? 'fr' : 'en')) as SupportedLocale;
      const translated = await translateText(body.text, sourceLocale, target);
      return NextResponse.json({
        success: true,
        text: translated,
        from: sourceLocale,
        to: target,
      });
    }

    // 2. Single Pack Translation
    if (body.pack && typeof body.pack === 'object') {
      const translated = await autoTranslateVariantPack(
        {
          featuresText: body.pack.featuresText || '',
          restrictionsText: body.pack.restrictionsText || '',
        },
        sourceLocale,
        targetLocales
      );

      return NextResponse.json({
        success: true,
        pack: translated,
      });
    }

    // 3. Product Info Translation
    if (body.product && typeof body.product === 'object' && !body.packs) {
      const translated = await autoTranslateProductMetadata(
        {
          name: body.product.name || '',
          tagline: body.product.tagline || '',
          description: body.product.description || '',
        },
        sourceLocale,
        targetLocales
      );

      return NextResponse.json({
        success: true,
        product: translated,
      });
    }

    // 4. Batch Translation (Product Info + Multiple Packs)
    if (Array.isArray(body.packs) || body.product) {
      let translatedProduct = null;
      if (body.product) {
        translatedProduct = await autoTranslateProductMetadata(
          {
            name: body.product.name || '',
            tagline: body.product.tagline || '',
            description: body.product.description || '',
          },
          sourceLocale,
          targetLocales
        );
      }

      const translatedPacks = [];
      if (Array.isArray(body.packs)) {
        for (const item of body.packs) {
          const packRes = await autoTranslateVariantPack(
            {
              featuresText: item.featuresText || '',
              restrictionsText: item.restrictionsText || '',
            },
            sourceLocale,
            targetLocales
          );
          translatedPacks.push({
            index: item.index,
            slug: item.slug,
            ...packRes,
          });
        }
      }

      return NextResponse.json({
        success: true,
        product: translatedProduct,
        packs: translatedPacks,
      });
    }

    return NextResponse.json(
      { error: 'Invalid payload for translation. Expected text, pack, product, or packs array.' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[API Translate Error]:', err);
    return NextResponse.json(
      { error: err?.message || 'Translation service encountered an error' },
      { status: 500 }
    );
  }
}
