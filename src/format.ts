import { getI18nLocale, t } from './i18n';
import { getDateLocale } from './i18n/resolve-locale';
import {
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
  MAX_HEIGHT_CM,
  MAX_WEIGHT_KG,
  MAX_WEIGHT_LB,
  MIN_HEIGHT_CM,
  MIN_WEIGHT_KG,
  MIN_WEIGHT_LB,
  UnitSystem,
} from './units';
import { DateRange } from './types';

export function getWeightUnitLabel(units: UnitSystem): string {
  return units === 'imperial' ? t('common.lb') : t('common.kg');
}

export function formatWeightValue(weightKg: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return kgToLb(weightKg).toFixed(1);
  }
  return weightKg.toFixed(2);
}

export function parseWeightInput(input: string, units: UnitSystem): number | null {
  const trimmed = input.trim().replace(',', '.');
  if (!trimmed) {
    return null;
  }

  if (units === 'imperial') {
    if (!/^\d+(\.\d{0,1})?$/.test(trimmed)) {
      return null;
    }
    const pounds = Number(trimmed);
    if (!Number.isFinite(pounds) || pounds < MIN_WEIGHT_LB || pounds > MAX_WEIGHT_LB) {
      return null;
    }
    const weightKg = Math.round(lbToKg(pounds) * 100) / 100;
    if (weightKg < MIN_WEIGHT_KG || weightKg > MAX_WEIGHT_KG) {
      return null;
    }
    return weightKg;
  }

  if (!/^\d+(\.\d{0,2})?$/.test(trimmed)) {
    return null;
  }

  const weightKg = Math.round(Number(trimmed) * 100) / 100;
  if (!Number.isFinite(weightKg) || weightKg < MIN_WEIGHT_KG || weightKg > MAX_WEIGHT_KG) {
    return null;
  }

  return weightKg;
}

export function getWeightRangeMessage(units: UnitSystem): string {
  if (units === 'imperial') {
    return t('validation.weightRangeImperial', {
      min: MIN_WEIGHT_LB.toFixed(1),
      max: MAX_WEIGHT_LB.toFixed(1),
    });
  }
  return t('validation.weightRangeMetric', {
    min: MIN_WEIGHT_KG.toFixed(2),
    max: MAX_WEIGHT_KG.toFixed(2),
  });
}

export function formatWeightLabel(weightKg: number, units: UnitSystem): string {
  return `${formatWeightValue(weightKg, units)} ${getWeightUnitLabel(units)}`;
}

export function formatWeightDifference(deltaKg: number | null, units: UnitSystem): string {
  if (deltaKg === null) {
    return t('common.emDash');
  }
  const sign = deltaKg > 0 ? '+' : '';
  return `${sign}${formatWeightValue(deltaKg, units)} ${getWeightUnitLabel(units)}`;
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getTodayDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getMondayWeekStart(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  const day = normalized.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  normalized.setDate(normalized.getDate() + diff);
  return normalized;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getLocaleTag(): string {
  return getDateLocale(getI18nLocale());
}

export function formatDateTime(isoDate: string | null | undefined): string {
  if (!isoDate) {
    return t('common.emDash');
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return t('common.emDash');
  }

  return parsed.toLocaleString(getLocaleTag(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(getLocaleTag(), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthLabel(dateKey: string): string {
  return fromDateKey(dateKey).toLocaleDateString(getLocaleTag(), {
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateRange(range: DateRange): string {
  const start = fromDateKey(range.start);
  const end = fromDateKey(range.end);
  const sameYear = start.getFullYear() === end.getFullYear();
  const localeTag = getLocaleTag();
  const startLabel = start.toLocaleDateString(localeTag, {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  });
  const endLabel = end.toLocaleDateString(localeTag, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startLabel} – ${endLabel}`;
}

export function parseDateKey(input: string): string | null {
  const trimmed = input.trim();
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(trimmed);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return toDateKey(date);
}

export function getHeightRangeMessage(units: UnitSystem): string {
  if (units === 'imperial') {
    const min = cmToFeetInches(MIN_HEIGHT_CM);
    const max = cmToFeetInches(MAX_HEIGHT_CM);
    return t('validation.heightRangeImperial', {
      minFt: min.feet,
      minIn: min.inches,
      maxFt: max.feet,
      maxIn: max.inches,
    });
  }
  return t('validation.heightRangeMetric', {
    min: MIN_HEIGHT_CM,
    max: MAX_HEIGHT_CM,
  });
}

export function formatHeight(heightCm: number | null, units: UnitSystem): string {
  if (heightCm === null) {
    return t('common.notSet');
  }

  if (units === 'imperial') {
    const { feet, inches } = cmToFeetInches(heightCm);
    return `${feet} ${t('common.ft')} ${inches} ${t('common.in')}`;
  }

  const meters = Math.floor(heightCm / 100);
  const centimeters = heightCm % 100;
  return `${meters} m ${centimeters} cm`;
}

export function heightToInputParts(
  heightCm: number | null,
  units: UnitSystem,
): { primary: string; secondary: string } {
  if (heightCm === null) {
    return { primary: '', secondary: '' };
  }

  if (units === 'imperial') {
    const { feet, inches } = cmToFeetInches(heightCm);
    return {
      primary: String(feet),
      secondary: String(inches),
    };
  }

  return {
    primary: String(Math.floor(heightCm / 100)),
    secondary: String(heightCm % 100).padStart(2, '0'),
  };
}

export function parseHeightInput(
  units: UnitSystem,
  primaryInput: string,
  secondaryInput: string,
): number | null {
  const primary = primaryInput.trim();
  const secondary = secondaryInput.trim();

  if (!primary || !secondary) {
    return null;
  }

  if (units === 'imperial') {
    if (!/^\d{1,2}$/.test(primary) || !/^\d{1,2}$/.test(secondary)) {
      return null;
    }

    const feet = Number(primary);
    const inches = Number(secondary);

    if (inches < 0 || inches > 11) {
      return null;
    }

    const total = feetInchesToCm(feet, inches);
    if (total < MIN_HEIGHT_CM || total > MAX_HEIGHT_CM) {
      return null;
    }

    return total;
  }

  if (!/^\d{1,2}$/.test(primary) || !/^\d{1,2}$/.test(secondary)) {
    return null;
  }

  const metersValue = Number(primary);
  const centimetersValue = Number(secondary);

  if (centimetersValue < 0 || centimetersValue > 99) {
    return null;
  }

  const total = metersValue * 100 + centimetersValue;
  if (total < MIN_HEIGHT_CM || total > MAX_HEIGHT_CM) {
    return null;
  }

  return total;
}

export function formatChartWeightRange(minKg: number, maxKg: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return t('chart.rangeLabelImperial', {
      min: formatWeightValue(minKg, units),
      max: formatWeightValue(maxKg, units),
    });
  }
  return t('chart.rangeLabelMetric', {
    min: formatWeightValue(minKg, units),
    max: formatWeightValue(maxKg, units),
  });
}
