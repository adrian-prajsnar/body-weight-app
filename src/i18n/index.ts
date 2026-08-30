import { I18n } from 'i18n-js';
import en from './locales/en';
import pl from './locales/pl';
import { AppLocale } from './resolve-locale';

export type TranslationTree = typeof en;

const i18n = new I18n({ en, pl });

i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.enableFallback = true;

export function setI18nLocale(locale: AppLocale): void {
  i18n.locale = locale;
}

export function getI18nLocale(): AppLocale {
  return i18n.locale === 'pl' ? 'pl' : 'en';
}

export function t(scope: string, options?: Record<string, unknown>): string {
  return i18n.t(scope, options);
}

export { i18n };
