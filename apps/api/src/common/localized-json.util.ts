import { registerDecorator, ValidationOptions } from 'class-validator';

export const CATALOG_LOCALES = ['ar', 'fr', 'en'] as const;
export type CatalogLocale = (typeof CATALOG_LOCALES)[number];

export interface LocalizedStringList {
  ar: string[];
  fr: string[];
  en: string[];
}

export function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function normalizeLocalizedList(value: unknown): LocalizedStringList {
  if (Array.isArray(value)) {
    return {
      ar: cleanStringArray(value),
      fr: [],
      en: [],
    };
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return {
      ar: cleanStringArray(record.ar),
      fr: cleanStringArray(record.fr),
      en: cleanStringArray(record.en),
    };
  }

  return { ar: [], fr: [], en: [] };
}

export function resolveLocalizedList(
  value: unknown,
  locale: CatalogLocale = 'ar',
): string[] {
  const normalized = normalizeLocalizedList(value);
  if (normalized[locale].length > 0) {
    return normalized[locale];
  }

  for (const fallbackLocale of CATALOG_LOCALES) {
    if (normalized[fallbackLocale].length > 0) {
      return normalized[fallbackLocale];
    }
  }

  return [];
}

function isValidStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Validates either a plain string[] or an object with localized arrays { ar?, fr?, en? }.
 * Compatible with global ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }).
 */
export function IsLocalizedStringList(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLocalizedStringList',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be an array of strings or an object with ar, fr, en string arrays`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          if (value === undefined || value === null) {
            return true;
          }
          if (isValidStringArray(value)) {
            return true;
          }
          if (typeof value === 'object' && !Array.isArray(value)) {
            const entries = Object.entries(value as Record<string, unknown>);
            return entries.every(
              ([key, arr]) =>
                (key === 'ar' || key === 'fr' || key === 'en') &&
                (arr === undefined || isValidStringArray(arr)),
            );
          }
          return false;
        },
      },
    });
  };
}

