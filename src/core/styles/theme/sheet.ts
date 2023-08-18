import { createButtonRules } from "./buttons";
import { processVars, toCommonVars } from "./common";
import { toComponentVars } from "./components";
import { ThemeOptions } from "./types";

function createRootRule(options: ThemeOptions) {
  const vars = {
    ...toCommonVars(options),
    ...toComponentVars(options),
  };

  const text = processVars(options, vars);

  return `:root{${text}}`;
}

const cleanUp = (options: ThemeOptions): ThemeOptions =>
  JSON.parse(
    JSON.stringify(options, (key, value) =>
      value || value === 0 ? value : undefined
    )
  );

const isStyleSheetSupported = () =>
  typeof CSSStyleSheet === "function" &&
  "replaceSync" in CSSStyleSheet.prototype &&
  "adoptedStyleSheets" in document;

export function createStyleSheet(
  options: ThemeOptions,
  classes?: CSSModuleClasses
) {
  const opts = cleanUp(options);
  const root = createRootRule(opts);
  const buttons = createButtonRules(opts, classes);

  const text = [root, buttons].filter(Boolean).join("");

  if (!isStyleSheetSupported()) return text;

  const sheet = new CSSStyleSheet();

  sheet.replaceSync(text);

  return sheet;
}
