import { Platform, StyleSheet } from 'react-native';
import { fontFamily, radius, spacing } from '../tokens';
import { StyleContext, cardSurface, floatingSurface, tabularNums } from './helpers';

export function createDashboardStyles({ colors, scheme }: StyleContext) {
  return {
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    statTile: {
      flexGrow: 1,
      flexBasis: '46%',
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.xs,
    },
    statTileLabel: {
      fontSize: 12,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: colors.textSubtle,
      fontFamily: fontFamily.semibold,
    },
    statTileValue: {
      fontSize: 20,
      color: colors.text,
      fontFamily: fontFamily.bold,
      ...tabularNums,
    },
    statTileUnit: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    statTileValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: spacing.xs,
    },

    heroLabel: {
      fontSize: 12,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.textSubtle,
      fontFamily: fontFamily.semibold,
    },
    heroValueRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
    heroValue: {
      fontSize: 48,
      lineHeight: 54,
      letterSpacing: -1.6,
      color: colors.text,
      fontFamily: fontFamily.bold,
      ...tabularNums,
    },
    heroUnit: {
      fontSize: 18,
      color: colors.textMuted,
      marginBottom: 8,
      fontFamily: fontFamily.medium,
    },
    heroMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },

    deltaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: 5,
    },
    deltaChipText: {
      fontSize: 13,
      fontFamily: fontFamily.semibold,
      ...tabularNums,
    },

    chartArea: {
      marginHorizontal: -spacing.xs,
    },
    chartEmpty: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    chartAxisRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    chartAxisLabel: {
      fontSize: 11,
      color: colors.textSubtle,
      fontFamily: fontFamily.medium,
      ...tabularNums,
    },

    warningText: {
      fontSize: 13,
      color: colors.warningText,
      fontFamily: fontFamily.medium,
    },
    errorCard: {
      backgroundColor: colors.dangerSoft,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.dangerBorder,
      gap: spacing.sm,
    },
    errorCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    errorCardTitle: {
      fontSize: 15,
      color: colors.dangerText,
      fontFamily: fontFamily.semibold,
    },
    errorCardMessage: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.dangerText,
      fontFamily: fontFamily.regular,
    },

    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xxl,
    },
    emptyStateIcon: {
      width: 52,
      height: 52,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
      marginBottom: spacing.xs,
    },
    emptyStateTitle: {
      fontSize: 16,
      color: colors.text,
      fontFamily: fontFamily.semibold,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
      fontFamily: fontFamily.regular,
    },
  };
}
