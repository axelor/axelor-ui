import {
  ForwardedRef,
  RefCallback,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';

/**
 * This hook can be used to combine multiple hooks.
 *
 * This is especially useful with `React.forwardRef` when we have to forward
 * the ref and use local ref for some another purpose.
 *
 * @param refs refs to use
 * @returns RefCallback<T>
 */
export function useRefs<T>(...refs: ForwardedRef<T>[]): RefCallback<T> {
  return useCallback(
    (value: T) => {
      refs.forEach(ref => {
        if (ref && typeof ref === 'function') ref(value);
        if (ref && typeof ref === 'object') ref.current = value;
      });
    },
    [refs]
  );
}

/**
 * This hook can be used to return a new hook that also keeps the given
 * forwarded ref in sync.
 *
 * @param ref the ref to keep in sync
 * @returns RefObject<T>
 */
export function useForwardedRef<T>(ref: ForwardedRef<T>): RefObject<T> {
  const res = useRef<T>(null);
  useEffect(() => {
    if (ref && typeof ref === 'function') ref(res.current);
    if (ref && typeof ref === 'object') ref.current = res.current;
  }, [ref, res]);
  return res;
}
