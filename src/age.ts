import { addDays, fromDateKey, getTodayDate, toDateKey } from './format';
import { t } from './i18n';
import { DateRange } from './types';

export type AgeParts = {
  years: number;
  months: number;
  /** Age in months, including a day fraction, for CDC LMS lookup. */
  ageMonths: number;
};

function birthdayOnYear(birth: Date, year: number): Date {
  const month = birth.getMonth();
  const day = birth.getDate();
  const candidate = new Date(year, month, day);
  candidate.setHours(0, 0, 0, 0);

  if (month === 1 && day === 29 && candidate.getMonth() !== 1) {
    return new Date(year, 1, 28);
  }

  return candidate;
}

export function getAgeOnDate(birthDateKey: string, onDateKey: string): AgeParts | null {
  if (onDateKey < birthDateKey) {
    return null;
  }

  const birth = fromDateKey(birthDateKey);
  const onDate = fromDateKey(onDateKey);

  let years = onDate.getFullYear() - birth.getFullYear();
  let monthDiff = onDate.getMonth() - birth.getMonth();
  let dayDiff = onDate.getDate() - birth.getDate();

  if (dayDiff < 0) {
    monthDiff -= 1;
    const previousMonth = new Date(onDate.getFullYear(), onDate.getMonth(), 0);
    dayDiff += previousMonth.getDate();
  }

  if (monthDiff < 0) {
    years -= 1;
    monthDiff += 12;
  }

  const daysInCurrentMonth = new Date(onDate.getFullYear(), onDate.getMonth() + 1, 0).getDate();
  const ageMonths = years * 12 + monthDiff + dayDiff / daysInCurrentMonth;

  return {
    years,
    months: monthDiff,
    ageMonths,
  };
}

export function getLastBirthdayDate(birthDateKey: string, todayInput?: Date): Date {
  const today = todayInput ? new Date(todayInput) : getTodayDate();
  today.setHours(0, 0, 0, 0);
  const birth = fromDateKey(birthDateKey);
  const thisYear = birthdayOnYear(birth, today.getFullYear());

  if (thisYear.getTime() <= today.getTime()) {
    return thisYear;
  }

  return birthdayOnYear(birth, today.getFullYear() - 1);
}

export function getPreviousBirthdayDate(birthDateKey: string, todayInput?: Date): Date {
  const last = getLastBirthdayDate(birthDateKey, todayInput);
  return birthdayOnYear(fromDateKey(birthDateKey), last.getFullYear() - 1);
}

export function getLastBirthdayKey(birthDateKey: string, todayInput?: Date): string {
  return toDateKey(getLastBirthdayDate(birthDateKey, todayInput));
}

export function getThisAgeYearRange(birthDateKey: string, todayInput?: Date): DateRange {
  const today = todayInput ? new Date(todayInput) : getTodayDate();
  today.setHours(0, 0, 0, 0);
  return {
    start: toDateKey(getLastBirthdayDate(birthDateKey, today)),
    end: toDateKey(today),
  };
}

export function getPreviousAgeYearRange(birthDateKey: string, todayInput?: Date): DateRange {
  const last = getLastBirthdayDate(birthDateKey, todayInput);
  const previous = getPreviousBirthdayDate(birthDateKey, todayInput);
  return {
    start: toDateKey(previous),
    end: toDateKey(addDays(last, -1)),
  };
}

export function daysUntilNextBirthday(birthDateKey: string, todayInput?: Date): number {
  const today = todayInput ? new Date(todayInput) : getTodayDate();
  today.setHours(0, 0, 0, 0);
  const birth = fromDateKey(birthDateKey);
  let next = birthdayOnYear(birth, today.getFullYear());
  if (next.getTime() < today.getTime()) {
    next = birthdayOnYear(birth, today.getFullYear() + 1);
  }
  return Math.round((next.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

export function isNearBirthday(birthDateKey: string, windowDays: number, todayInput?: Date): boolean {
  const until = daysUntilNextBirthday(birthDateKey, todayInput);
  const last = getLastBirthdayDate(birthDateKey, todayInput);
  const today = todayInput ? new Date(todayInput) : getTodayDate();
  today.setHours(0, 0, 0, 0);
  const sinceLast = Math.round((today.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
  return until <= windowDays || sinceLast <= windowDays;
}

export function formatAge(age: AgeParts | null): string {
  if (!age) {
    return t('common.emDash');
  }

  if (age.years < 18) {
    return t('age.yearsMonths', { years: age.years, months: age.months });
  }

  return t('age.years', { count: age.years });
}

export function birthdayKeysDescending(
  birthDateKey: string,
  todayInput?: Date,
  limit = 6,
): string[] {
  const last = getLastBirthdayDate(birthDateKey, todayInput);
  const birth = fromDateKey(birthDateKey);
  const keys: string[] = [];

  for (let offset = 0; offset < limit; offset += 1) {
    const year = last.getFullYear() - offset;
    const birthYear = birth.getFullYear();
    if (year < birthYear) {
      break;
    }
    keys.push(toDateKey(birthdayOnYear(birth, year)));
  }

  return keys;
}
