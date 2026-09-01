import { refreshSessionOnForeground } from './app-lifecycle';
import { isJwtClockSkewError, toSupabaseErrorFromUnknown } from './errors';

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function withAuthRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isJwtClockSkewError(error) || attempt === MAX_ATTEMPTS - 1) {
        throw toSupabaseErrorFromUnknown(error);
      }

      await refreshSessionOnForeground();
      await delay(RETRY_DELAY_MS);
    }
  }

  throw toSupabaseErrorFromUnknown(lastError);
}
