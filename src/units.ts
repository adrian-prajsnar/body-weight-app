import { UnitPreference } from './storage/unit-preference';

export type UnitSystem = 'metric' | 'imperial';

export const MIN_WEIGHT_KG = 20;
export const MAX_WEIGHT_KG = 300;
export const MIN_HEIGHT_CM = 100;
export const MAX_HEIGHT_CM = 250;

const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

export const WEIGHT_STEP_KG = 0.1;
export const WEIGHT_STEP_LB = 0.5;

export const MIN_WEIGHT_LB = kgToLb(MIN_WEIGHT_KG);
export const MAX_WEIGHT_LB = kgToLb(MAX_WEIGHT_KG);

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function cmToFeetInches(heightCm: number): { feet: number; inches: number } {
  const totalInches = Math.round(heightCm / CM_PER_IN);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * CM_PER_IN);
}

export function resolveUnitSystem(
  preference: UnitPreference,
  measurementSystem: string | null | undefined,
): UnitSystem {
  if (preference === 'metric' || preference === 'imperial') {
    return preference;
  }
  return measurementSystem === 'us' ? 'imperial' : 'metric';
}
