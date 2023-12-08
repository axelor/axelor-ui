import { createButtonRules } from "./buttons";
import { processVars, toCommonVars } from "./common";
import { toComponentVars } from "./components";
import { ResponsiveThemeOptions, ThemeOptions } from "./types";

function createRootRule(options: ThemeOptions) {
  const vars = {
    ...toCommonVars(options),
    ...toComponentVars(options),
  };

  const text = processVars(options, vars);

  return `:root{${text}}`;
}

const cleanUp = (options: ResponsiveThemeOptions): ResponsiveThemeOptions =>
  JSON.parse(
    JSON.stringify(options, (key, value) =>
      value || value === 0 ? value : undefined,
    ),
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

function createRules(
  options: ThemeOptions,
  classes?: CSSModuleClasses,
  width?: number,
) {
  const root = createRootRule(options);
  const buttons = createButtonRules(options, classes);
  const text = [root, buttons].filter(Boolean).join("");
  return width ? `@media(min-width:${width}px){${text}}` : text;
}

export function adoptStyleSheet(
  options: ResponsiveThemeOptions,
  classes?: CSSModuleClasses,
) {
  const { sm, md, lg, xl, xxl, ...xs } = cleanUp(options);
  const rules = [
    xs && createRules(xs, classes),
    sm && createRules(sm, classes, 576),
    md && createRules(md, classes, 768),
    lg && createRules(lg, classes, 992),
    xl && createRules(xl, classes, 1200),
    xxl && createRules(xxl, classes, 1400),
  ];
  const text = rules.filter(Boolean).join("");
  return adopt(text);
}
