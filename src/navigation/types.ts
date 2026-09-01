export type AuthStackParamList = {
  Login: { email?: string } | undefined;
  SignUp: undefined;
  ForgotPassword: { email?: string } | undefined;
};

export type RootTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Comparison: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  HeightHistory: undefined;
};
