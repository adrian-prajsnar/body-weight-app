import { useMemo } from 'react';
import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from './theme-context';
import { ColorScheme, fontFamily, Palette, radius, spacing } from './tokens';

const tabularNums: TextStyle = { fontVariant: ['tabular-nums'] };

/** Flat cards: border separation only (matches the clean dark-mode look). */
function cardSurface(colors: Palette, scheme: ColorScheme, level: 1 | 2): ViewStyle {
  return {
    borderWidth: scheme === 'dark' ? 1 : StyleSheet.hairlineWidth,
    borderColor: level === 2 && scheme === 'light' ? colors.borderStrong : colors.border,
  };
}

/** Floating chrome (tab bar): border separation only — elevation/shadow tint badly on light Android. */
function floatingSurface(colors: Palette, scheme: ColorScheme): ViewStyle {
  return {
    borderWidth: scheme === 'dark' ? 1 : StyleSheet.hairlineWidth,
    borderColor: scheme === 'dark' ? colors.border : colors.borderStrong,
  };
}

export function createStyles(colors: Palette, scheme: ColorScheme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenHeader: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.md,
      backgroundColor: colors.background,
    },
    screenHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    screenHeaderHairline: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    historyDateFilters: {
      gap: spacing.sm,
    },
    filterActionsRow: {
      alignItems: 'flex-end',
      marginBottom: spacing.sm,
      minHeight: 20,
    },
    comparisonFilterSection: {
      gap: spacing.md,
    },
    scrollView: {
      flex: 1,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    authContent: {
      flexGrow: 1,
      padding: spacing.xl,
      paddingTop: 64,
      paddingBottom: 40,
      gap: spacing.lg,
      justifyContent: 'center',
    },
    authBrand: {
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    authLogo: {
      width: 64,
      height: 64,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    authBackdrop: {
      ...StyleSheet.absoluteFill,
      height: 360,
    },
    linkText: {
      textAlign: 'center',
      color: colors.accent,
      fontSize: 15,
      fontFamily: fontFamily.semibold,
    },
    authInlineLink: {
      alignSelf: 'flex-end',
      marginTop: -spacing.xs,
      marginBottom: spacing.xs,
    },
    authNotice: {
      backgroundColor: colors.accentSoft,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.sm + 2,
      borderWidth: 1,
      borderColor: colors.accentBorder,
    },
    authNoticeText: {
      fontSize: 14,
      color: colors.accentText,
      lineHeight: 20,
      fontFamily: fontFamily.regular,
    },
    infoBanner: {
      backgroundColor: colors.accentSoft,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.accentBorder,
    },
    infoBannerHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    infoBannerText: {
      flex: 1,
      fontSize: 14,
      color: colors.accentText,
      lineHeight: 20,
      fontFamily: fontFamily.regular,
    },
    infoBannerLink: {
      alignSelf: 'flex-start',
      color: colors.accent,
      fontSize: 14,
      fontFamily: fontFamily.semibold,
    },
    content: {
      padding: spacing.xl,
      paddingTop: spacing.xs,
      paddingBottom: 120,
      gap: spacing.lg,
    },
    title: {
      fontSize: 30,
      letterSpacing: -0.6,
      color: colors.text,
      fontFamily: fontFamily.bold,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textMuted,
      marginTop: 2,
      fontFamily: fontFamily.regular,
    },
    sectionLabel: {
      fontSize: 12,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.textSubtle,
      fontFamily: fontFamily.semibold,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xl,
      gap: spacing.md,
      ...cardSurface(colors, scheme, 1),
    },
    cardElevated: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.xl,
      gap: spacing.lg,
      ...cardSurface(colors, scheme, 2),
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    cardTitle: {
      fontSize: 17,
      letterSpacing: -0.2,
      color: colors.text,
      fontFamily: fontFamily.semibold,
    },
    cardSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.regular,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },

    fieldLabel: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: Platform.OS === 'ios' ? 14 : 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
      fontFamily: fontFamily.regular,
    },
    inputFocused: {
      borderColor: colors.accent,
      backgroundColor: colors.surface,
    },
    passwordFieldGroup: {
      gap: spacing.sm,
    },
    passwordField: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceMuted,
      paddingRight: spacing.sm,
    },
    passwordInput: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: Platform.OS === 'ios' ? 14 : 12,
      fontSize: 16,
      color: colors.text,
      fontFamily: fontFamily.regular,
    },
    passwordToggle: {
      padding: spacing.sm,
    },
    dateButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surfaceMuted,
    },
    dateButtonValue: {
      fontSize: 16,
      color: colors.text,
      fontFamily: fontFamily.medium,
    },
    dateButtonReadOnly: {
      backgroundColor: colors.surfaceSunken,
    },
    dateButtonInStepper: {
      flex: 1,
    },

    primaryButton: {
      backgroundColor: colors.accent,
      borderRadius: radius.md,
      paddingVertical: 15,
      paddingHorizontal: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
    },
    primaryButtonText: {
      color: colors.onAccent,
      fontSize: 16,
      fontFamily: fontFamily.semibold,
    },
    secondaryButton: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 46,
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 15,
      fontFamily: fontFamily.semibold,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.985 }],
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    iconButtonDanger: {
      backgroundColor: colors.dangerSoft,
    },

    presetScroll: {
      marginHorizontal: -spacing.xl,
    },
    presetScrollContent: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
    },
    presetButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surfaceMuted,
    },
    presetButtonActive: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accent,
    },
    presetButtonText: {
      color: colors.textMuted,
      fontSize: 14,
      fontFamily: fontFamily.medium,
    },
    presetButtonTextActive: {
      color: colors.accentText,
      fontFamily: fontFamily.semibold,
    },

    segmentedTrack: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceSunken,
      borderRadius: radius.md,
      padding: 4,
      position: 'relative',
    },
    segmentedIndicator: {
      position: 'absolute',
      top: 4,
      bottom: 4,
      left: 0,
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      borderWidth: scheme === 'dark' ? 1 : StyleSheet.hairlineWidth,
      borderColor: colors.borderStrong,
    },
    segmentedItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm + 1,
      borderRadius: radius.sm,
    },
    segmentedLabel: {
      fontSize: 13,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    segmentedLabelActive: {
      color: colors.text,
      fontFamily: fontFamily.semibold,
    },

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

    toastRoot: {
      flex: 1,
    },

    overlayRoot: {
      flex: 1,
    },
    modalBackdropCentered: {
      flex: 1,
      backgroundColor: scheme === 'dark' ? 'rgba(0, 0, 0, 0.62)' : 'rgba(15, 23, 42, 0.42)',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    confirmDialogCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xl,
      gap: spacing.md,
      borderWidth: scheme === 'dark' ? 1 : StyleSheet.hairlineWidth,
      borderColor: colors.borderStrong,
    },
    confirmDialogTitle: {
      fontSize: 18,
      color: colors.text,
      fontFamily: fontFamily.semibold,
    },
    confirmDialogMessage: {
      fontSize: 15,
      color: colors.textMuted,
      lineHeight: 22,
      fontFamily: fontFamily.regular,
    },
    confirmDialogActions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    confirmDialogButton: {
      flex: 1,
      minHeight: 46,
    },
    confirmDialogDestructiveButton: {
      backgroundColor: colors.danger,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 46,
    },
    confirmDialogDestructiveButtonText: {
      color: colors.onAccent,
      fontSize: 15,
      fontFamily: fontFamily.semibold,
    },
    modalSheetBackdrop: {
      flex: 1,
      backgroundColor: scheme === 'dark' ? 'rgba(0, 0, 0, 0.62)' : 'rgba(15, 23, 42, 0.42)',
      justifyContent: 'flex-end',
    },
    modalSheetDismissArea: {
      flex: 1,
    },
    datePickerSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
      borderTopWidth: scheme === 'dark' ? 1 : StyleSheet.hairlineWidth,
      borderColor: colors.borderStrong,
    },
    datePickerSheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    datePickerSheetTitle: {
      flex: 1,
      fontSize: 18,
      color: colors.text,
      fontFamily: fontFamily.semibold,
    },
    datePickerSheetConfirm: {
      marginTop: spacing.xs,
    },
    datePickerPeriodRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    datePickerPeriodButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surfaceMuted,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
    },
    datePickerPeriodButtonActive: {
      borderColor: colors.accentBorder,
      backgroundColor: colors.accentSoft,
    },
    datePickerPeriodButtonText: {
      fontSize: 15,
      color: colors.text,
      fontFamily: fontFamily.semibold,
    },
    datePickerPeriodButtonTextActive: {
      color: colors.accentText,
    },
    datePickerMonthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    datePickerMonthCell: {
      width: '30%',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surfaceMuted,
      paddingVertical: spacing.md,
    },
    datePickerMonthCellSelected: {
      borderColor: colors.accentBorder,
      backgroundColor: colors.accent,
    },
    datePickerMonthCellDisabled: {
      opacity: 0.4,
    },
    datePickerMonthCellText: {
      fontSize: 14,
      color: colors.text,
      fontFamily: fontFamily.medium,
    },
    datePickerMonthCellTextSelected: {
      color: colors.onAccent,
      fontFamily: fontFamily.semibold,
    },
    datePickerMonthCellTextDisabled: {
      color: colors.textSubtle,
    },
    datePickerYearList: {
      maxHeight: 240,
    },
    datePickerYearListContent: {
      paddingVertical: spacing.xs,
    },
    datePickerYearRow: {
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      marginBottom: spacing.xs,
    },
    datePickerYearRowSelected: {
      backgroundColor: colors.accentSoft,
    },
    datePickerYearRowText: {
      fontSize: 16,
      color: colors.text,
      fontFamily: fontFamily.medium,
    },
    datePickerYearRowTextSelected: {
      color: colors.accentText,
      fontFamily: fontFamily.semibold,
    },
    toastContainer: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      zIndex: 100,
    },
    toastCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderWidth: 1,
      borderLeftWidth: 4,
      ...(scheme === 'dark'
        ? {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }
        : {}),
    },
    toastTextGroup: {
      flex: 1,
      gap: 2,
    },
    toastCardSuccess: {
      backgroundColor: colors.successSoft,
      borderColor: colors.successBorder,
      borderLeftColor: colors.success,
    },
    toastCardError: {
      backgroundColor: colors.dangerSoft,
      borderColor: colors.dangerBorder,
      borderLeftColor: colors.danger,
    },
    toastCardInfo: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accentBorder,
      borderLeftColor: colors.accent,
    },
    toastTitle: {
      fontSize: 14,
      fontFamily: fontFamily.semibold,
    },
    toastTitleSuccess: {
      color: colors.successText,
    },
    toastTitleError: {
      color: colors.dangerText,
    },
    toastTitleInfo: {
      color: colors.accentText,
    },
    toastMessage: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: fontFamily.regular,
    },
    toastMessageSuccess: {
      color: colors.successText,
    },
    toastMessageError: {
      color: colors.dangerText,
    },
    toastMessageInfo: {
      color: colors.accentText,
    },

    loadingCard: {
      position: 'relative',
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.overlay,
      borderRadius: radius.lg,
      zIndex: 2,
    },
    skeletonBlock: {
      backgroundColor: colors.skeleton,
      borderRadius: radius.sm,
      overflow: 'hidden',
    },
    skeletonShimmer: {
      ...StyleSheet.absoluteFill,
    },

    tabBar: {
      flexDirection: 'row',
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      borderRadius: radius.xl,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.surface,
      ...floatingSurface(colors, scheme),
    },
    tabBarItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
    },
    tabBarLabel: {
      fontSize: 11,
      fontFamily: fontFamily.medium,
    },
    tabBarIndicator: {
      position: 'absolute',
      top: spacing.sm,
      bottom: spacing.sm,
      backgroundColor: colors.accentSoft,
      borderRadius: radius.md,
    },

    weightEntryRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: spacing.md,
    },
    weightInputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: spacing.md,
    },
    weightInput: {
      flex: 1,
      textAlign: 'center',
      fontSize: 32,
      paddingVertical: spacing.md,
      color: colors.text,
      fontFamily: fontFamily.bold,
      ...tabularNums,
    },
    weightInputUnit: {
      fontSize: 16,
      color: colors.textMuted,
      fontFamily: fontFamily.medium,
    },
    stepperButton: {
      width: 52,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
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
