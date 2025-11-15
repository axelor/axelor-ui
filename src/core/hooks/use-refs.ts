import { useCallback } from "react";

export type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * This hook can be used to combine multiple hooks.
 *
 * This is especially useful with `React.forwardRef` when we have to forward
 * the ref and use local ref for some another purpose.
 *
 * @param refs refs to use
 * @returns RefCallback<T>
 */
export function useRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return useCallback(
    (value: T) => {
      const cleanups = refs
        .map((ref) => {
          if (ref && typeof ref === "function") return ref(value);
          if (ref && typeof ref === "object") {
            ref.current = value;
          }
        })
        .filter((cleanup) => typeof cleanup === "function");

      if (cleanups.length > 0) {
        return () => {
          cleanups.forEach((cleanup) => cleanup());
        };
      }
    },
    [refs],
  );
}
