import { ExpoConfig, ConfigContext } from 'expo/config';

const SPLASH_BACKGROUND = '#F6F7F9';

function requireSupabasePublicEnv(): void {
  if (process.env.EAS_BUILD !== 'true') {
    return;
  }

  const missing = [
    !process.env.EXPO_PUBLIC_SUPABASE_URL && 'EXPO_PUBLIC_SUPABASE_URL',
    !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY && 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `EAS Build requires: ${missing.join(', ')}. From your project root run: npx eas-cli env:push --environment production --path .env`,
    );
  }
}

export default ({ config }: ConfigContext): ExpoConfig => {
  requireSupabasePublicEnv();

  return {
    ...config,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: SPLASH_BACKGROUND,
    },
    android: {
      ...config.android,
      versionCode: 3,
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: false,
          data: [
            {
              scheme: 'body-weight-app',
              host: 'auth',
              pathPrefix: '/callback',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
  } as ExpoConfig;
};
