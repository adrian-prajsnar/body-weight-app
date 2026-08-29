import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  screenHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    padding: 20,
    paddingTop: 72,
    paddingBottom: 32,
    gap: 16,
    justifyContent: 'center',
  },
  linkText: {
    textAlign: 'center',
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
  authInlineLink: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 4,
  },
  authNotice: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  authNoticeText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  content: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  fieldLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  passwordFieldGroup: {
    gap: 0,
  },
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingRight: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  passwordToggle: {
    padding: 6,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dateButtonLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateButtonValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  presetButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  presetButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  presetButtonTextActive: {
    color: '#1D4ED8',
  },
  statsText: {
    fontSize: 14,
    color: '#4B5563',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  warningText: {
    fontSize: 13,
    color: '#B45309',
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  errorCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
  },
  errorCardMessage: {
    fontSize: 14,
    color: '#7F1D1D',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyRowContent: {
    flex: 1,
    gap: 6,
    paddingRight: 12,
  },
  historyDate: {
    fontSize: 14,
    color: '#374151',
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  comparisonPeriodCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  comparisonPeriodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  differenceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D4ED8',
    marginTop: 4,
  },
  rangeRow: {
    gap: 8,
  },
  rangeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  filterFieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterPlaceholder: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  heightInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heightInputGroup: {
    flex: 1,
    gap: 4,
  },
  accountRow: {
    gap: 4,
    paddingVertical: 4,
  },
  accountLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  bmiBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bmiBadgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bmiBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bmiBadgeTextCompact: {
    fontSize: 12,
  },
  weightWithBmiInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  weightWithBmiStacked: {
    gap: 6,
  },
  statWithBmiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  bmiPreviewRow: {
    gap: 6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingText: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  settingHint: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  toastRoot: {
    flex: 1,
  },
  toastContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  toastCard: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    gap: 4,
  },
  toastCardSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  toastCardError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  toastCardInfo: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  toastTitleSuccess: {
    color: '#15803D',
  },
  toastTitleError: {
    color: '#DC2626',
  },
  toastTitleInfo: {
    color: '#1D4ED8',
  },
  toastMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  toastMessageSuccess: {
    color: '#166534',
  },
  toastMessageError: {
    color: '#991B1B',
  },
  toastMessageInfo: {
    color: '#1E3A8A',
  },
  loadingCard: {
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 16,
    zIndex: 2,
  },
  skeletonBlock: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  historyDeleteButton: {
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
