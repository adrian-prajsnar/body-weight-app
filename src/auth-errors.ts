export function isEmailNotConfirmedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return message.includes('email not confirmed') || message.includes('email_not_confirmed');
}

export function formatSignInError(error: unknown): string {
  if (isEmailNotConfirmedError(error)) {
    return 'Confirm your email first. Check your inbox, then try again.';
  }

  return error instanceof Error ? error.message : 'Sign in failed.';
}
