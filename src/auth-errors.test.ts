import { describe, expect, it } from 'vitest';
import {
  formatSignInError,
  formatSignUpError,
  isEmailNotConfirmedError,
  isNetworkError,
} from './auth-errors';

describe('isNetworkError', () => {
  it('detects common network failure messages', () => {
    expect(isNetworkError(new Error('Network request failed'))).toBe(true);
    expect(isNetworkError(new Error('Failed to fetch'))).toBe(true);
    expect(isNetworkError(new Error('Invalid login credentials'))).toBe(false);
  });
});

describe('isEmailNotConfirmedError', () => {
  it('detects unconfirmed email errors', () => {
    expect(isEmailNotConfirmedError(new Error('Email not confirmed'))).toBe(true);
    expect(isEmailNotConfirmedError(new Error('email_not_confirmed'))).toBe(true);
  });
});

describe('formatSignInError', () => {
  it('maps invalid credentials to a generic message', () => {
    expect(formatSignInError(new Error('Invalid login credentials'))).toBe(
      'Invalid email or password.',
    );
  });

  it('maps network failures to the offline message', () => {
    expect(formatSignInError(new Error('Network request failed'))).toBe(
      'No internet connection. Check your network and try again.',
    );
  });
});

describe('formatSignUpError', () => {
  it('maps duplicate registration to a friendly message', () => {
    expect(formatSignUpError(new Error('User already registered'))).toBe(
      'An account with this email already exists.',
    );
  });
});
