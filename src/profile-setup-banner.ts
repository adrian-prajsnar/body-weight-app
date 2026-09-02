import { DashboardAlertId } from './storage/dashboard-alert-dismissals';

export function shouldShowProfileSetupBanner(
  hasBirthDate: boolean,
  hasSex: boolean,
  hasHeight: boolean,
  isDismissed: (id: DashboardAlertId) => boolean,
): boolean {
  const isComplete = hasBirthDate && hasSex && hasHeight;
  return !isComplete && !isDismissed('missingProfile');
}

export const PROFILE_SETUP_DISMISS_IDS: DashboardAlertId[] = [
  'missingProfile',
  'missingBirthDate',
  'missingSex',
  'missingHeight',
];
