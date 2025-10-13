// src/hooks/useMountedEffect.ts
import { useEffect, useRef } from 'react';

/**
 * Runs the effect only on the client (never during SSR).
 * Optionally runs again when dependencies change (after mount).
 */
export function useMountedEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList = []
) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return effect();
    } else {
      // Runs on dependency updates (after mount)
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}