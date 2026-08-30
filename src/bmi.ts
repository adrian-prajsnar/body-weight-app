import { t } from './i18n';
import { ColorScheme } from './theme/tokens';

export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export type BmiInfo = {
  value: number;
  category: BmiCategory;
  label: string;
};

export type BmiTheme = {
  backgroundColor: string;
  textColor: string;
};

const BMI_THEMES: Record<ColorScheme, Record<BmiCategory, BmiTheme>> = {
  light: {
    underweight: {
      backgroundColor: '#DBEAFE',
      textColor: '#1D4ED8',
    },
    normal: {
      backgroundColor: '#DCFCE7',
      textColor: '#15803D',
    },
    overweight: {
      backgroundColor: '#FEF3C7',
      textColor: '#B45309',
    },
    obese: {
      backgroundColor: '#FFE4E6',
      textColor: '#BE123C',
    },
  },
  dark: {
    underweight: {
      backgroundColor: '#16233F',
      textColor: '#93C5FD',
    },
    normal: {
      backgroundColor: '#0E2A22',
      textColor: '#6EE7B7',
    },
    overweight: {
      backgroundColor: '#2A2110',
      textColor: '#FCD34D',
    },
    obese: {
      backgroundColor: '#2B1620',
      textColor: '#FDA4AF',
    },
  },
};

function getCategoryLabel(category: BmiCategory): string {
  return t(`bmi.${category}`);
}

function getCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) {
    return 'underweight';
  }
  if (bmi < 25) {
    return 'normal';
  }
  if (bmi < 30) {
    return 'overweight';
  }
  return 'obese';
}

export function bmiInfoFromValue(value: number): BmiInfo {
  const category = getCategory(value);
  return {
    value,
    category,
    label: getCategoryLabel(category),
  };
}

export function calculateBmi(weightKg: number, heightCm: number): BmiInfo | null {
  if (weightKg <= 0 || heightCm <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  const value = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  const category = getCategory(value);

  return {
    value,
    category,
    label: getCategoryLabel(category),
  };
}

export function getBmiTheme(category: BmiCategory, scheme: ColorScheme): BmiTheme {
  return BMI_THEMES[scheme][category];
}

export function formatBmiValue(value: number): string {
  return value.toFixed(1);
}
