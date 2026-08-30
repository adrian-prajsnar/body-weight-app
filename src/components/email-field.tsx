import { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type EmailFieldProps = Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'returnKeyType' | 'onSubmitEditing'
>;

export function EmailField({
  value,
  onChangeText,
  returnKeyType = 'next',
  onSubmitEditing,
}: EmailFieldProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.passwordFieldGroup}>
      <Text style={styles.fieldLabel}>Email</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        placeholder="you@example.com"
        placeholderTextColor={colors.textSubtle}
      />
    </View>
  );
}
