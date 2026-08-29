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

const BMI_THEMES: Record<BmiCategory, BmiTheme> = {
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
    backgroundColor: '#FEE2E2',
    textColor: '#DC2626',
  },
};

const BMI_LABELS: Record<BmiCategory, string> = {
  underweight: 'Underweight',
  normal: 'Normal',
  overweight: 'Overweight',
  obese: 'Obese',
};

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
    label: BMI_LABELS[category],
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
    label: BMI_LABELS[category],
  };
}

export function getBmiTheme(category: BmiCategory): BmiTheme {
  return BMI_THEMES[category];
}

export function formatBmiValue(value: number): string {
  return value.toFixed(1);
}
