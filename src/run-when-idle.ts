export type IdleTask = {
  cancel: () => void;
};

export function runWhenIdle(callback: () => void): IdleTask {
  if (typeof requestIdleCallback === 'function') {
    const handle = requestIdleCallback(callback);
    return {
      cancel: () => cancelIdleCallback(handle),
    };
  }

  const frameId = requestAnimationFrame(callback);
  return {
    cancel: () => cancelAnimationFrame(frameId),
  };
}
