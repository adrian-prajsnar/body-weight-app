import { describe, expect, it } from 'vitest';
import { isValidPassword } from './password';

describe('isValidPassword', () => {
  it('accepts a password that meets all requirements', () => {
    expect(isValidPassword('Abcdef1!')).toBe(true);
  });

  it('rejects passwords shorter than 8 characters', () => {
    expect(isValidPassword('Ab1!xyz')).toBe(false);
  });

  it('rejects passwords without lowercase letters', () => {
    expect(isValidPassword('ABCDEF1!')).toBe(false);
  });

  it('rejects passwords without uppercase letters', () => {
    expect(isValidPassword('abcdef1!')).toBe(false);
  });

  it('rejects passwords without digits', () => {
    expect(isValidPassword('Abcdefg!')).toBe(false);
  });

  it('rejects passwords without symbols', () => {
    expect(isValidPassword('Abcdef12')).toBe(false);
  });
});
