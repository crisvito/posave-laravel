import en from './en';
import id from './id';

export type Locale = 'id' | 'en';

export const dictionaries = { id, en } as const;