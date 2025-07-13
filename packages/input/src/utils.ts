export function throttle<T extends (...args: never[]) => void>(fn: T, limit: number): T {
  let inThrottle: boolean;
  return function(this: never, ...args: never[]) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  } as T;
}
