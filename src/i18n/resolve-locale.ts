import { getLocales } from 'expo-localization';
import { LanguagePreference } from '../storage/language-preference';

export type AppLocale = 'en' | 'pl';

export function getDeviceLocale(): AppLocale {
  const languageCode = getLocales()[0]?.languageCode?.toLowerCase();
  return languageCode === 'pl' ? 'pl' : 'en';
}

export function resolveLocale(preference: LanguagePreference): AppLocale {
  if (preference === 'en' || preference === 'pl') {
    return preference;
  }
  return getDeviceLocale();
}

export function getDateLocale(locale: AppLocale): string {
  return locale === 'pl' ? 'pl-PL' : 'en-US';
}
