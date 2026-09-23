import type en from './locales/en';

type Leaves<T, Prefix extends string = ''> = T extends string
  ? Prefix
  : T extends readonly unknown[]
    ? Prefix
    : {
        [K in keyof T & string]:
          | (Prefix extends '' ? K : `${Prefix}.${K}`)
          | Leaves<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>;
      }[keyof T & string];

export type TranslationKey = Leaves<typeof en>;

export type TranslateOptions = Record<string, unknown>;
