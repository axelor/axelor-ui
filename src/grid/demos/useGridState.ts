import React from "react";
import { produce } from "immer";
import * as TYPES from "../types";

function useGridState(
  initState?: Partial<TYPES.GridState>,
): [
  TYPES.GridState,
  (state: TYPES.GridState | TYPES.GridStateHandler) => void,
] {
  const [state, setState] = React.useState<TYPES.GridState>({
    columns: [],
    rows: [],
    ...initState,
  });

  const setMutableState = React.useCallback(
    (state: TYPES.GridState | TYPES.GridStateHandler) =>
      setState(produce(state as any) as any),
    [setState],
  );

  return [state, setMutableState];
}

export default useGridState;
