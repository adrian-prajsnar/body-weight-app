import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

import App from './app';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden in development reloads.
});

registerRootComponent(App);
