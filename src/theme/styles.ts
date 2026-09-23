import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './theme-context';
import { ColorScheme, Palette } from './tokens';
import { createAuthStyles } from './styles/auth';
import { createDashboardStyles } from './styles/dashboard';
import { createEntryFormStyles } from './styles/entry-form';
import { StyleContext } from './styles/helpers';
import { createFormStyles } from './styles/forms';
import { createLayoutStyles } from './styles/layout';
import { createListStyles } from './styles/lists';
import { createOverlayStyles } from './styles/overlays';
import { createProfileStyles } from './styles/profile';
import { createScreenStyles } from './styles/screen';

export function createStyles(colors: Palette, scheme: ColorScheme) {
  const context: StyleContext = { colors, scheme };
  const merged = {
    ...createScreenStyles(context),
    ...createAuthStyles(context),
    ...createLayoutStyles(context),
    ...createFormStyles(context),
    ...createDashboardStyles(context),
    ...createListStyles(context),
    ...createProfileStyles(context),
    ...createOverlayStyles(context),
    ...createEntryFormStyles(context),
  };

  return StyleSheet.create(merged as Record<string, object>);
}

export type AppStyles = ReturnType<typeof createStyles>;

const cache = new Map<ColorScheme, AppStyles>();

export function useAppStyles(): AppStyles {
  const { colors, scheme } = useTheme();

  return useMemo(() => {
    const cached = cache.get(scheme);
    if (cached) {
      return cached;
    }
    const created = createStyles(colors, scheme);
    cache.set(scheme, created);
    return created;
  }, [colors, scheme]);
}
