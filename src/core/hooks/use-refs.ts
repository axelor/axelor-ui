import {
  ForwardedRef,
  MutableRefObject,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

export type PossibleRef<T> = Ref<T> | ForwardedRef<T> | undefined;

export type MergedRef<T> = React.RefObject<T> & ((value: T) => void);

export type MergedRefType<T> = T extends React.SetStateAction<infer P> ? P : T;

/**
 * This hook can be used to combine multiple hooks.
 *
 * This is especially useful with `React.forwardRef` when we have to forward
 * the ref and use local ref for some another purpose.
 *
 * @param refs refs to use
 * @returns RefCallback<T>
 */
export function useRefs<T>(
  ...refs: PossibleRef<T>[]
): MergedRef<MergedRefType<T>> {
  const combinedRef = useCallback(
    (value: T) => {
      (combinedRef as unknown as MutableRefObject<T>).current = value;
      refs.forEach((ref) => {
        if (ref && typeof ref === "function") ref(value);
        if (ref && typeof ref === "object")
          (ref as MutableRefObject<T>).current = value;
      });
    },
    [refs],
  );
  return combinedRef as unknown as MergedRef<MergedRefType<T>>;
}

/**
 * This hook can be used to return a new hook that also keeps the given
 * forwarded ref in sync.
 *
 * @param ref the ref to keep in sync
 * @returns RefObject<T>
 */
export function useForwardedRef<T>(ref: ForwardedRef<T>): RefObject<T | null> {
  const res = useRef<T>(null);
  useEffect(() => {
    if (ref && typeof ref === "function") ref(res.current);
    if (ref && typeof ref === "object") ref.current = res.current;
  }, [ref, res]);
  return res;
}
