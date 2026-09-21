import type { SiteLocale } from '../i18n';

export type ScreenshotId = 'home' | 'history' | 'compare' | 'profile';
export type ScreenshotTheme = 'light' | 'dark';

export function screenshotPath(
  id: ScreenshotId,
  locale: SiteLocale,
  theme: ScreenshotTheme,
): string {
  return `/screenshots/${id}-${theme}-${locale}.webp`;
}
