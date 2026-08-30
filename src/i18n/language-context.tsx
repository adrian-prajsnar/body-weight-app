import { useLocales } from 'expo-localization';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getLanguagePreference,
  LanguagePreference,
  setStoredLanguagePreference,
} from '../storage/language-preference';
import { setI18nLocale, t as translate } from './index';
import { AppLocale } from './resolve-locale';

type LanguageContextValue = {
  locale: AppLocale;
  preference: LanguagePreference;
  setPreference: (next: LanguagePreference) => Promise<void>;
  t: (scope: string, options?: Record<string, unknown>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locales = useLocales();
  const [preference, setPreferenceState] = useState<LanguagePreference>('system');

  useEffect(() => {
    void getLanguagePreference().then(setPreferenceState);
  }, []);

  const locale = useMemo(() => {
    if (preference === 'system') {
      const languageCode = locales[0]?.languageCode?.toLowerCase();
      return languageCode === 'pl' ? 'pl' : 'en';
    }
    return preference;
  }, [preference, locales]);

  useEffect(() => {
    setI18nLocale(locale);
  }, [locale]);

  const setPreference = useCallback(
    async (next: LanguagePreference) => {
      const nextLocale: AppLocale =
        next === 'system'
          ? locales[0]?.languageCode?.toLowerCase() === 'pl'
            ? 'pl'
            : 'en'
          : next;

      setI18nLocale(nextLocale);
      setPreferenceState(next);
      await setStoredLanguagePreference(next);
    },
    [locales],
  );

  const t = useCallback(
    (scope: string, options?: Record<string, unknown>) => translate(scope, options),
    [locale],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      preference,
      setPreference,
      t,
    }),
    [locale, preference, setPreference, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, locale, preference, setPreference } = useLanguage();
  return { t, locale, preference, setPreference };
}
