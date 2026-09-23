import { useRef } from 'react';
import { PanResponder } from 'react-native';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const TOAST_SWIPE_AXIS_LOCK_OFFSET = 6;
const TOAST_SWIPE_DISMISS_OFFSET = 48;
const TOAST_SWIPE_DISMISS_VELOCITY = 0.6;
const TOAST_SWIPE_UP_DISMISS_OFFSET = -48;
const TOAST_SWIPE_UP_DISMISS_VELOCITY = -0.6;
const TOAST_SWIPE_DISMISS_DISTANCE_X = 400;
const TOAST_SWIPE_DISMISS_DISTANCE_Y = 160;

type SwipeAxis = 'x' | 'y';

type UseToastSwipeDismissOptions = {
  onDismiss: () => void;
  pauseAutoDismiss: () => void;
  resumeAutoDismiss: () => void;
};

export function useToastSwipeDismiss({
  onDismiss,
  pauseAutoDismiss,
  resumeAutoDismiss,
}: UseToastSwipeDismissOptions) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const axisRef = useRef<SwipeAxis | null>(null);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const pauseAutoDismissRef = useRef(pauseAutoDismiss);
  pauseAutoDismissRef.current = pauseAutoDismiss;
  const resumeAutoDismissRef = useRef(resumeAutoDismiss);
  resumeAutoDismissRef.current = resumeAutoDismiss;

  const dismissAfterSwipeRef = useRef((axis: SwipeAxis, direction: number) => {
    pauseAutoDismissRef.current();
    if (axis === 'x') {
      translateX.value = withTiming(direction * TOAST_SWIPE_DISMISS_DISTANCE_X, { duration: 160 }, (finished) => {
        if (finished) {
          runOnJS(onDismissRef.current)();
        }
      });
      return;
    }

    translateY.value = withTiming(-TOAST_SWIPE_DISMISS_DISTANCE_Y, { duration: 160 }, (finished) => {
      if (finished) {
        runOnJS(onDismissRef.current)();
      }
    });
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > TOAST_SWIPE_AXIS_LOCK_OFFSET ||
        Math.abs(gestureState.dx) > TOAST_SWIPE_AXIS_LOCK_OFFSET,
      onPanResponderGrant: () => {
        axisRef.current = null;
        pauseAutoDismissRef.current();
      },
      onPanResponderMove: (_, gestureState) => {
        if (axisRef.current === null) {
          if (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.dx) > TOAST_SWIPE_AXIS_LOCK_OFFSET
          ) {
            axisRef.current = 'x';
          } else if (
            Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
            gestureState.dy < 0 &&
            Math.abs(gestureState.dy) > TOAST_SWIPE_AXIS_LOCK_OFFSET
          ) {
            axisRef.current = 'y';
          }
        }

        if (axisRef.current === 'x') {
          translateX.value = gestureState.dx;
          return;
        }

        if (axisRef.current === 'y') {
          translateY.value = gestureState.dy;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const axis = axisRef.current;
        axisRef.current = null;

        if (axis === 'x') {
          if (
            Math.abs(gestureState.dx) > TOAST_SWIPE_DISMISS_OFFSET ||
            Math.abs(gestureState.vx) > TOAST_SWIPE_DISMISS_VELOCITY
          ) {
            dismissAfterSwipeRef.current('x', Math.sign(gestureState.dx) || 1);
            return;
          }

          translateX.value = withTiming(0);
          resumeAutoDismissRef.current();
          return;
        }

        if (axis === 'y') {
          if (
            gestureState.dy < TOAST_SWIPE_UP_DISMISS_OFFSET ||
            gestureState.vy < TOAST_SWIPE_UP_DISMISS_VELOCITY
          ) {
            dismissAfterSwipeRef.current('y', -1);
            return;
          }

          translateY.value = withTiming(0);
          resumeAutoDismissRef.current();
          return;
        }

        resumeAutoDismissRef.current();
      },
    }),
  ).current;

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: Math.max(
      0.35,
      1 - Math.max(Math.abs(translateX.value), Math.abs(translateY.value)) / 120,
    ),
  }));

  return {
    panHandlers: panResponder.panHandlers,
    animatedCardStyle,
  };
}
