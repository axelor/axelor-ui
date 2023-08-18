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

// adoptedStyleSheets and CSSStyleSheet() constructor are not supported in Firefox < 101.
const SUPPORTS_ADOPTED_STYLE_SHEETS =
  "adoptedStyleSheets" in document &&
  typeof CSSStyleSheet === "function" &&
  "replaceSync" in CSSStyleSheet.prototype;

const adopt: (text: string) => () => void = SUPPORTS_ADOPTED_STYLE_SHEETS
  ? (text) => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(text);
      const last = [...document.adoptedStyleSheets];
      document.adoptedStyleSheets = [...last, sheet];
      return () => (document.adoptedStyleSheets = last);
    }
  : (text) => {
      const head = document.getElementsByTagName("head")[0];
      const style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.innerHTML = text;
      head.appendChild(style);
      return () => head.removeChild(style);
    };

export function adoptStyleSheet(
  options: ThemeOptions,
  classes?: CSSModuleClasses
) {
  const opts = cleanUp(options);
  const root = createRootRule(opts);
  const buttons = createButtonRules(opts, classes);

  const text = [root, buttons].filter(Boolean).join("");

  return adopt(text);
}
