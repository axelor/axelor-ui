import React, { useCallback, useEffect, useState } from "react";

function isDispatchFunction<T>(
  newState: React.SetStateAction<T>,
): newState is (prevState: T) => T {
  return typeof newState === "function";
}

export function useControlled<T>(options: {
  name: string;
  prop: string;
  state: T | undefined;
  defaultState?: T;
}) {
  const [isControlled] = useState(() => options.state !== undefined);
  const [defaultState] = useState(() => options.defaultState);
  const [internalState, setInternalState] = useState(defaultState);

  const state = isControlled ? options.state : internalState;

  const setControlledState = useCallback(
    (newState: React.SetStateAction<T | undefined>) => {
      if (isDispatchFunction(newState)) {
        newState(state);
      }
    },
    [state],
  );

  useEffect(() => {
    if (isControlled || options.defaultState === defaultState) return;
    console.error(
      `A component is chaning the default ${options.prop} state of an uncontrolled ${options.name} after being initialized.`,
    );
  }, [
    defaultState,
    isControlled,
    options.defaultState,
    options.name,
    options.prop,
  ]);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (isControlled !== (options.state !== undefined)) {
        console.error(
          `A component is changing the ${isControlled ? "" : "un"}controlled ${
            options.prop
          } state of ${options.name} to be ${
            isControlled ? "un" : ""
          }controlled.`,
        );
      }
    }, [isControlled, options.name, options.prop, options.state]);
  }

  return isControlled
    ? ([state, setControlledState] as const)
    : ([state, setInternalState] as const);
}
