import { WeightEntry, WeightStats } from './types';
import { toDateKey } from './format';

export function getStats(entries: WeightEntry[], days: number): WeightStats {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const cutoffKey = toDateKey(cutoff);

  const filtered = entries.filter((entry) => entry.date >= cutoffKey);
  if (filtered.length === 0) {
    return { average: null, min: null, max: null, count: 0 };
  }

  const weights = filtered.map((entry) => entry.weightKg);
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  return {
    average: Math.round((total / weights.length) * 100) / 100,
    min: Math.min(...weights),
    max: Math.max(...weights),
    count: weights.length,
  };
}
