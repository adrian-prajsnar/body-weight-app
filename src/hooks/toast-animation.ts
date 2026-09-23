import { Easing, Keyframe } from 'react-native-reanimated';

export const toastEntering = new Keyframe({
  0: {
    opacity: 0,
    transform: [{ translateY: -28 }, { scale: 0.96 }],
  },
  65: {
    opacity: 1,
    transform: [{ translateY: 3 }, { scale: 1.01 }],
    easing: Easing.out(Easing.cubic),
  },
  100: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
    easing: Easing.out(Easing.quad),
  },
}).duration(360);

export const toastExiting = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
  100: {
    opacity: 0,
    transform: [{ translateY: -16 }, { scale: 0.98 }],
    easing: Easing.in(Easing.cubic),
  },
}).duration(220);
