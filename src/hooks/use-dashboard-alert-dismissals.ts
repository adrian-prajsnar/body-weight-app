import { useCallback, useEffect, useState } from 'react';
import {
  DashboardAlertId,
  dismissDashboardAlert,
  getDismissedDashboardAlerts,
} from '../storage/dashboard-alert-dismissals';

export function useDashboardAlertDismissals() {
  const [dismissed, setDismissed] = useState<DashboardAlertId[] | null>(null);

  useEffect(() => {
    void getDismissedDashboardAlerts().then(setDismissed);
  }, []);

  const isDismissed = useCallback(
    (id: DashboardAlertId) => dismissed?.includes(id) ?? false,
    [dismissed],
  );

  const dismiss = useCallback(async (id: DashboardAlertId) => {
    await dismissDashboardAlert(id);
    setDismissed((current) => (current?.includes(id) ? current : [...(current ?? []), id]));
  }, []);

  return {
    isReady: dismissed !== null,
    isDismissed,
    dismiss,
  };
}
