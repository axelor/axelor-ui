import { ForwardedRef, useCallback } from 'react';

export function useRefs<T>(...refs: ForwardedRef<T>[]) {
  return useCallback((value: T) => {
    refs.forEach(ref => {
      if (ref && typeof ref === 'function') ref(value);
      if (ref && typeof ref === 'object') ref.current = value;
    });
  }, refs);
}
