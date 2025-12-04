import { useRef, useCallback } from "react";

function useThrottledCallback(cb, ms) {
  const lastRef = useRef(0);
  const timerRef = useRef(null);
  const pendingRef = useRef(null);

  return useCallback((...args) => {
    const now = performance.now();
    const remaining = ms - (now - lastRef.current);

    pendingRef.current = args;

    if (remaining <= 0) {
      lastRef.current = now;
      cb(...args);
      pendingRef.current = null;
      return;
    }

    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        lastRef.current = performance.now();
        if (pendingRef.current) cb(...pendingRef.current);
        pendingRef.current = null;
      }, remaining);
    }
  }, [cb, ms]);
}

export { useThrottledCallback };