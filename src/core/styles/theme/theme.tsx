import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { ClassValue, cssx } from "../../clsx";

import { adoptStyleSheet } from "./sheet";
import { ResponsiveThemeOptions } from "./types";

import stylesLtr from "../styles.module.scss";
import stylesRtl from "../styles.rtl.module.scss";

const STYLES: Record<string, CSSModuleClasses> = {
  ltr: stylesLtr,
  rtl: stylesRtl,
};

export interface ThemeContextValue {
  dir?: string;
  theme?: string;
  mode?: "light" | "dark";
  options?: ResponsiveThemeOptions;
}

export interface ThemeProviderProps extends Partial<ThemeContextValue> {
  children: React.ReactElement;
}

const ThemeContext = createContext<ThemeContextValue>({});

export function ThemeProvider({
  dir,
  theme,
  options = {},
  children,
}: ThemeProviderProps) {
  const curr = useContext(ThemeContext);
  const mode = options?.palette?.mode ?? "light";
  const value = useMemo(
    () => ({ ...curr, mode, dir, theme }),
    [mode, curr, dir, theme],
  );
  const classes = useStyles();

  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-bs-theme")) return;
    if (theme) root.setAttribute("data-bs-theme", theme);
    return () => {
      root.removeAttribute("data-bs-theme");
    };
  }, [theme]);

  useEffect(() => adoptStyleSheet(options, classes), [classes, dir, options]);

  return (
    <ThemeContext.Provider value={value}>
      {cloneElement(children, { dir: value.dir, "data-bs-theme": theme })}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useStyles() {
  const theme = useTheme();
  const dir = theme.dir;
  if (dir && dir in STYLES) {
    return STYLES[dir];
  }
  return STYLES.ltr;
}

export function useClassNames() {
  const styles = useStyles();
  return useCallback(
    (...args: ClassValue[]) => cssx(styles, ...args),
    [styles],
  );
}

export function useClasses(...args: ClassValue[]) {
  const styles = useStyles();
  const className = useMemo(() => {
    const res = cssx(styles, ...args);
    return res.trim().length ? res : undefined;
  }, [args, styles]);

  return className;
}
