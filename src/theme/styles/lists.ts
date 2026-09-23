import { Platform, StyleSheet } from 'react-native';
import { fontFamily, radius, spacing } from '../tokens';
import { StyleContext, cardSurface, floatingSurface, tabularNums } from './helpers';

export function createListStyles({ colors, scheme }: StyleContext) {
  return {
    historyGroup: {
      gap: spacing.xs,
    },
    historyGroupLabel: {
      fontSize: 12,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.textSubtle,
      fontFamily: fontFamily.semibold,
      marginTop: spacing.sm,
    },
    historyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    historyRowContent: {
      flex: 1,
      gap: spacing.xs + 2,
      paddingRight: spacing.md,
    },
    historyDate: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    historyRowWhen: {
      gap: 2,
    },
    historyEntryMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      columnGap: spacing.sm,
      rowGap: 2,
    },
    historyEntryMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    historyEntryMetaText: {
      fontSize: 11,
      color: colors.textSubtle,
      fontFamily: fontFamily.regular,
    },
    comparisonDayNoData: {
      fontSize: 13,
      color: colors.textSubtle,
      fontFamily: fontFamily.regular,
    },
    comparisonDayDelta: {
      flexShrink: 0,
      alignSelf: 'center',
      maxWidth: 120,
      alignItems: 'flex-end',
    },
    comparisonDayDeltaEmpty: {
      fontSize: 13,
      color: colors.textSubtle,
      fontFamily: fontFamily.medium,
      ...tabularNums,
    },
    historyWeight: {
      fontSize: 17,
      color: colors.text,
      fontFamily: fontFamily.semibold,
      ...tabularNums,
    },
    historyDeleteButton: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },

    comparisonPeriodCard: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      padding: spacing.lg,
      gap: spacing.sm,
    },
    comparisonDeltaBlock: {
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
    },
    comparisonTrendCard: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      gap: 0,
    },
    comparisonTrendDayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.sm + 2,
    },
    comparisonTrendDayDate: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    comparisonTrendDayWeight: {
      fontSize: 16,
    },
    comparisonTrendDayValues: {
      alignItems: 'flex-end',
      flexShrink: 0,
      maxWidth: '58%',
    },
    comparisonTrendPeriodBlock: {
      paddingVertical: spacing.sm + 2,
    },
    comparisonTrendPeriodRow: {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: spacing.sm,
    },
    comparisonTrendRowMain: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    comparisonTrendPeriodSubtitle: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: fontFamily.regular,
    },
    comparisonTrendPeriodStats: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
    },
    comparisonTrendPeriodStat: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    comparisonTrendPeriodStatCenter: {
      alignItems: 'center',
    },
    comparisonTrendPeriodStatEnd: {
      alignItems: 'flex-end',
    },
    comparisonTrendPeriodStatLabel: {
      fontSize: 10,
      letterSpacing: 0.35,
      textTransform: 'uppercase',
      color: colors.textSubtle,
      fontFamily: fontFamily.medium,
    },
    comparisonTrendPeriodStatValue: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
      ...tabularNums,
    },
    comparisonTrendNoDataText: {
      fontSize: 13,
      color: colors.textSubtle,
      fontFamily: fontFamily.medium,
    },
    comparisonTrendNoDataInline: {
      fontSize: 13,
      color: colors.textSubtle,
      fontFamily: fontFamily.medium,
      textAlign: 'right',
      flexShrink: 1,
    },
    comparisonTrendDeltaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: 2,
    },
    comparisonTrendDeltaValue: {
      fontSize: 15,
      fontFamily: fontFamily.semibold,
      ...tabularNums,
    },
    comparisonNoDataText: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
      marginBottom: spacing.sm,
    },
    differenceValue: {
      fontSize: 28,
      letterSpacing: -0.8,
      color: colors.text,
      fontFamily: fontFamily.bold,
      ...tabularNums,
    },
  };
}
