import { cloneElement, createContext, useCallback, useContext } from "react";
import { ClassValue, cssx } from "../clsx";
import stylesLtr from "./styles.module.scss";
import stylesRtl from "./styles.rtl.module.scss";

type CSSModuleClasses = { readonly [key: string]: string };

const STYLES: Record<string, CSSModuleClasses> = {
  ltr: stylesLtr,
  rtl: stylesRtl,
};

export interface ThemeContextValue {
  dir?: string;
}

export interface ThemeProviderProps {
  dir?: string;
  children: React.ReactElement;
}

const ThemeContext = createContext<ThemeContextValue>({});

export function ThemeProvider({ dir, children }: ThemeProviderProps) {
  const curr = useContext(ThemeContext);
  return (
    <ThemeContext.Provider value={{ dir: dir || curr.dir }}>
      {dir
        ? cloneElement(children, {
            dir: children.props.dir || dir,
          })
        : children}
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
    [styles]
  );
}
