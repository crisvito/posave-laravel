import type { Locale } from '.';

export function pickLocale<T extends object>(locale: Locale, item: T, field: string): string {
    const record = item as unknown as Record<string, unknown>;

    if (locale === 'en') {
        const enValue = record[`${field}_en`];
        if (typeof enValue === 'string' && enValue.length > 0) {
            return enValue;
        }
    }

    return String(record[field] ?? '');
}