import { AriaAttributes } from "react";

import { DataProps } from "./props";
import { Breakpoints } from "./types";

export const isNumber = (value: any) => typeof value === "number";

export const isString = (value: any) => typeof value === "string";

export const isNumeric = (value: any) =>
  isString(value) && +value - parseFloat(value) + 1 >= 0;

export const isUnitSize = (value: any) =>
  isString(value) && parseFloat(value).toString() !== value;

export const isReponsive = (value: any) =>
  typeof value === "object" && Breakpoints.some((bp) => bp in value);

export const toPixel = (value: any): any => {
  if (isUnitSize(value)) return value;
  if (isNumeric(value)) return `${value}px`;
  if (isNumber(value)) return `${value}px`;
  return value;
};

export const extractDataProps = <T extends object>(obj: T): DataProps => {
  return Object.entries(obj)
    .filter(([key, _]) => key.startsWith("data-"))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as DataProps);
};

export const extractAriaProps = <T extends object>(obj: T): AriaAttributes => {
  return Object.entries(obj)
    .filter(([key, _]) => key.startsWith("aria-"))
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {} as AriaAttributes,
    );
};

export const findAriaProp = <K extends keyof AriaAttributes>(
  obj: object,
  ariaProp: K,
): AriaAttributes[K] | undefined => {
  return (obj as AriaAttributes)[ariaProp];
};

export const findDataProp = (
  obj: object,
  dataProp: `data-${string}`,
): string | undefined => {
  return (obj as DataProps)[dataProp];
};

/**
 * Create a scoped test id.
 *
 * When a parent component has data-testid, child components can create scoped
 * testids that are unique only within their parent's scope. This keeps testids
 * short and readable while maintaining the ability to precisely target elements.
 *
 * @param scope - The parent's testid (acts as a flag to enable scoped testids)
 * @param args - The testid parts to join (e.g., "header", "button", item.id)
 * @returns Joined testid if scope is defined, undefined otherwise
 *
 * @example
 * // Parent has data-testid="panel"
 * makeTestId(testId, "header") // Returns "header"
 * makeTestId(testId, "node", item.id) // Returns "node-item1"
 *
 * // Parent has no testid
 * makeTestId(undefined, "header") // Returns undefined
 */
export const makeTestId = (
  scope: string | undefined,
  ...args: (string | number | undefined)[]
) => {
  if (scope === undefined) return undefined;
  const filtered = args.filter((arg) => arg !== undefined);
  return filtered.length > 0 ? filtered.join(":") : undefined;
};
