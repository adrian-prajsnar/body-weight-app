import { getI18nLocale, t } from './i18n';
import { getDateLocale } from './i18n/resolve-locale';
import { DateRange } from './types';

const MIN_WEIGHT_KG = 20;
const MAX_WEIGHT_KG = 300;

export function getWeightRangeMessage(): string {
  return t('validation.weightRange', {
    min: MIN_WEIGHT_KG.toFixed(2),
    max: MAX_WEIGHT_KG.toFixed(2),
  });
}

export function formatKg(value: number): string {
  return value.toFixed(2);
}

export function parseKg(input: string): number | null {
  const trimmed = input.trim().replace(',', '.');
  if (!trimmed) {
    return null;
  }

  if (!/^\d+(\.\d{0,2})?$/.test(trimmed)) {
    return null;
  }

  const value = Math.round(Number(trimmed) * 100) / 100;
  if (!Number.isFinite(value) || value < MIN_WEIGHT_KG || value > MAX_WEIGHT_KG) {
    return null;
  }

  return value;
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

export function formatDifferenceKg(value: number | null): string {
  if (value === null) {
    return t('common.emDash');
  }
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatKg(value)} ${t('common.kg')}`;
}

const MIN_HEIGHT_CM = 100;
const MAX_HEIGHT_CM = 250;

export function getHeightRangeMessage(): string {
  return t('validation.heightRange', {
    min: MIN_HEIGHT_CM,
    max: MAX_HEIGHT_CM,
  });
}

export function formatHeightCm(heightCm: number | null): string {
  if (heightCm === null) {
    return t('common.notSet');
  }

  const meters = Math.floor(heightCm / 100);
  const centimeters = heightCm % 100;
  return `${meters} m ${centimeters} cm`;
}

export function heightCmToParts(heightCm: number | null): { meters: string; centimeters: string } {
  if (heightCm === null) {
    return { meters: '', centimeters: '' };
  }

  return {
    meters: String(Math.floor(heightCm / 100)),
    centimeters: String(heightCm % 100).padStart(2, '0'),
  };
}

export function parseHeightCm(metersInput: string, centimetersInput: string): number | null {
  const meters = metersInput.trim();
  const centimeters = centimetersInput.trim();

  if (!meters || !centimeters) {
    return null;
  }

  if (!/^\d{1,2}$/.test(meters) || !/^\d{1,2}$/.test(centimeters)) {
    return null;
  }

  const metersValue = Number(meters);
  const centimetersValue = Number(centimeters);

  if (centimetersValue < 0 || centimetersValue > 99) {
    return null;
  }

  const total = metersValue * 100 + centimetersValue;
  if (total < MIN_HEIGHT_CM || total > MAX_HEIGHT_CM) {
    return null;
  }

  return total;
}
