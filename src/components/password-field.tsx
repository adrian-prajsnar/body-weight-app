import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { styles } from '../theme/styles';

type PasswordFieldProps = {
  label: string;
} & Pick<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'returnKeyType'
  | 'onSubmitEditing'
  | 'autoComplete'
  | 'textContentType'
>;

export function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  returnKeyType,
  onSubmitEditing,
  autoComplete,
  textContentType,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.passwordFieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.passwordField}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isVisible}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
        <Pressable
          style={styles.passwordToggle}
          onPress={() => setIsVisible((current) => !current)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isVisible ? 'Hide password' : 'Show password'}
        >
          <Ionicons
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#6B7280"
          />
        </Pressable>
      </View>
    </View>
  );
}
