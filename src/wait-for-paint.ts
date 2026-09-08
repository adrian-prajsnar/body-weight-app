import { runWhenIdle } from './run-when-idle';

export function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

export function waitForInteractions(): Promise<void> {
  return new Promise((resolve) => {
    runWhenIdle(resolve);
  });
}
