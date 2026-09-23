import { Platform, StyleSheet } from 'react-native';
import { fontFamily, radius, spacing } from '../tokens';
import { StyleContext, cardSurface, floatingSurface, tabularNums } from './helpers';

export function createProfileStyles({ colors, scheme }: StyleContext) {
  return {
    rangeRow: {
      gap: spacing.sm,
    },
    filterFieldHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filterPlaceholder: {
      color: colors.textSubtle,
      fontFamily: fontFamily.regular,
    },

    heightInputRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    heightInputGroup: {
      flex: 1,
      gap: spacing.xs + 2,
    },

    insightRow: {
      gap: spacing.xs,
      paddingVertical: spacing.sm,
    },
    insightRowHeader: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    insightValue: {
      fontSize: 18,
      lineHeight: 22,
      color: colors.text,
      fontFamily: fontFamily.bold,
      ...tabularNums,
      ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
    },
    insightValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: spacing.sm,
    },
    insightMeta: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    insightList: {
      gap: 0,
    },
    accountRow: {
      gap: spacing.xs + 2,
      paddingVertical: spacing.xs,
    },
    accountLabel: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    accountValue: {
      fontSize: 16,
      color: colors.text,
      fontFamily: fontFamily.medium,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    profileRowIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    profileRowText: {
      flex: 1,
      gap: 2,
    },
    versionFooterContainer: {
      alignItems: 'center',
      gap: 4,
      paddingTop: spacing.sm,
      paddingBottom: spacing.lg,
    },
    versionFooter: {
      textAlign: 'center',
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    dangerButton: {
      backgroundColor: colors.dangerSoft,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.dangerBorder,
      minHeight: 46,
    },
    dangerButtonText: {
      color: colors.dangerText,
      fontSize: 15,
      fontFamily: fontFamily.semibold,
    },

    bmiBadge: {
      alignSelf: 'flex-start',
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: 5,
    },
    bmiBadgeInteractive: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    bmiBadgeCompact: {
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: 3,
    },
    bmiBadgeCentered: {
      alignSelf: 'center',
    },
    bmiBadgeText: {
      fontSize: 13,
      lineHeight: 16,
      fontFamily: fontFamily.semibold,
      ...tabularNums,
      ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
    },
    bmiBadgeTextCompact: {
      fontSize: 12,
      lineHeight: 14,
    },
    bmiBadgeChevron: {
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 1,
    },
    bmiBadgeChevronCompact: {
      height: 14,
    },
    weightWithBmiInline: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.sm,
    },
    weightWithBmiStacked: {
      gap: spacing.xs + 2,
    },
    bmiPreviewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    bmiDetailsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    bmiDetailsLabel: {
      color: colors.textMuted,
      fontSize: 14,
      fontFamily: fontFamily.medium,
    },
    bmiDetailsValue: {
      flex: 1,
      textAlign: 'right',
      color: colors.text,
      fontSize: 14,
      fontFamily: fontFamily.semibold,
    },
    bmiDetailsNote: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      fontFamily: fontFamily.regular,
    },
    bmiDetailsSection: {
      marginTop: spacing.sm,
      color: colors.text,
      fontSize: 15,
      fontFamily: fontFamily.semibold,
    },

    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.lg,
    },
    settingText: {
      flex: 1,
      gap: spacing.xs,
    },
    settingLabel: {
      fontSize: 15,
      color: colors.text,
      fontFamily: fontFamily.semibold,
    },
    settingHint: {
      fontSize: 13,
      color: colors.textMuted,
      lineHeight: 18,
      fontFamily: fontFamily.regular,
    },
    settingHintWarning: {
      fontSize: 12,
      color: colors.warningText,
      lineHeight: 16,
      fontFamily: fontFamily.regular,
    },
  };
}
