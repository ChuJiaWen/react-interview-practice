// hooks/useThrottle.ts - 简化版
import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  const lastRunRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      // 如果距离上次执行超过 delay，立即执行
      if (now - lastRunRef.current >= delay) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        fn(...args);
        lastRunRef.current = now;
        return;
      }

      // 否则，在剩余时间后执行
      if (!timerRef.current) {
        const remaining = delay - (now - lastRunRef.current);
        timerRef.current = setTimeout(() => {
          fn(...args);
          lastRunRef.current = Date.now();
          timerRef.current = null;
        }, remaining);
      }
    },
    [fn, delay]
  ) as T;
}