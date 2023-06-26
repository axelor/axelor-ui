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

export function createStyleSheet(
  options: ThemeOptions,
  classes?: CSSModuleClasses
) {
  const root = createRootRule(options);
  const buttons = createButtonRules(options, classes);

  const text = [root, buttons].filter(Boolean).join("");
  const sheet = new CSSStyleSheet();

  sheet.replaceSync(text);

  return sheet;
}
