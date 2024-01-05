import {
  OverflowDividerEntry,
  OverflowGroupState,
  OverflowItemEntry,
} from "@fluentui/priority-overflow";
import {
  Context,
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

export type OverflowState = {
  itemVisibility: Record<string, boolean>;
  groupVisibility: Record<string, OverflowGroupState>;
  hasOverflow: boolean;
};

export type OverflowFuncs = {
  registerItem: (item: OverflowItemEntry) => void;
  registerOverflowMenu: (el: HTMLElement) => void;
  registerDivider: (divider: OverflowDividerEntry) => () => void;
  updateOverflow: (padding?: number) => void;
};

export type OverflowContextValue = OverflowState & OverflowFuncs;

export const OverflowContext = createContext<OverflowContextValue | undefined>(
  undefined,
) as Context<OverflowContextValue>;

const defaultValue: OverflowContextValue = {
  itemVisibility: {},
  groupVisibility: {},
  hasOverflow: false,
  registerItem: () => () => null,
  registerOverflowMenu: () => () => null,
  registerDivider: () => () => null,
  updateOverflow: () => null,
};

export const useOverflowContext = <SelectedValue,>(
  selector: ContextSelector<OverflowContextValue, SelectedValue>,
) => useContextSelector(OverflowContext, (ctx = defaultValue) => selector(ctx));
