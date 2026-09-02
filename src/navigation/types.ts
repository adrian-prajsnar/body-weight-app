import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: { email?: string } | undefined;
  SignUp: undefined;
  ForgotPassword: { email?: string } | undefined;
};

export type ProfileStackParamList = {
  ProfileMain: { focusSection?: 'birthDate' | 'height' | 'sex' } | undefined;
  HeightHistory: undefined;
};

export type RootTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Comparison: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};
