import { AppCard } from './app-card';
import { WeightEntryFormBody } from './weight-entry-form-body';
import { useSharedUserProfile } from '../context/user-profile-context';
import { useTranslation } from '../i18n/language-context';
import { WeightEntry } from '../types';

type EntryFormProps = {
  entries: WeightEntry[];
  onSaved: () => Promise<void>;
  isDataLoading?: boolean;
};

export function EntryForm({ entries, onSaved, isDataLoading = false }: EntryFormProps) {
  const { t } = useTranslation();
  const { isLoading: isProfileLoading } = useSharedUserProfile();

  return (
    <AppCard title={t('entryForm.title')} isBusy={isDataLoading || isProfileLoading} delay={60}>
      <WeightEntryFormBody
        entries={entries}
        onSaved={onSaved}
        isDataLoading={isDataLoading}
      />
    </AppCard>
  );
}
