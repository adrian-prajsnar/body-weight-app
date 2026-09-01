import { t } from '../i18n';

type SupabaseRequestError = {
  message: string;
  code?: string;
};

export function isJwtClockSkewError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as SupabaseRequestError;

  if (candidate.code === 'PGRST303') {
    return true;
  }

  return candidate.message?.toLowerCase().includes('jwt issued at future') ?? false;
}

export function toSupabaseError(error: SupabaseRequestError): Error {
  if (error.message.toLowerCase().includes('permission denied')) {
    return new Error(t('errors.databasePermission'));
  }

  if (isJwtClockSkewError(error)) {
    return new Error(t('errors.jwtClockSkew'));
  }

  return new Error(error.message);
}

export function toSupabaseErrorFromUnknown(error: unknown): Error {
  if (error instanceof Error && !isJwtClockSkewError(error)) {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return toSupabaseError(error as SupabaseRequestError);
  }

  return new Error(t('errors.couldNotLoadData'));
}
