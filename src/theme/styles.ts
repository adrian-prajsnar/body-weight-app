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
  backupRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
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
});
