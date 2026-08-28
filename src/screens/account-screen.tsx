import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { ScreenHeader } from '../components/screen-header';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { styles } from '../theme/styles';

function formatAccountDate(isoDate: string | undefined): string {
  if (!isoDate) {
    return '—';
  }

  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.accountRow}>
      <Text style={styles.accountLabel}>{label}</Text>
      <Text style={styles.accountValue}>{value}</Text>
    </View>
  );
}

export function AccountScreen() {
  const { session, signOut, deleteAccount } = useSupabaseAuth();
  const { entries } = useSharedWeightEntries();
  const user = session?.user;

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          void signOut();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account and all weight entries. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await deleteAccount();
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : 'Could not delete account.';
                Alert.alert('Delete failed', message);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Account" subtitle="Your profile and settings" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <AccountRow label="Email" value={user?.email ?? '—'} />
          <AccountRow label="Member since" value={formatAccountDate(user?.created_at)} />
          <AccountRow
            label="Weight entries"
            value={entries.length === 1 ? '1 entry' : `${entries.length} entries`}
          />
        </View>

        <Pressable style={styles.secondaryButton} onPress={handleSignOut}>
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>

        <Pressable style={styles.dangerButton} onPress={handleDeleteAccount}>
          <Text style={styles.dangerButtonText}>Delete account</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
