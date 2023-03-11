import { cloneElement, createContext, useCallback, useContext } from 'react';
import stylesLtr from './styles.module.scss';
import stylesRtl from './styles.rtl.module.scss';

type CSSModuleClasses = { readonly [key: string]: string };

const STYLES: Record<string, CSSModuleClasses> = {
  ltr: stylesLtr,
  rtl: stylesRtl,
};

export type StyleNameValue = string | number | boolean | undefined | null;
export type StyleName =
  | StyleNameValue
  | Record<string, StyleNameValue>
  | StyleName[];

const clean = (names: string[]) =>
  names.flatMap(n => n.trim().split(/\s+/)).filter(Boolean);

export const clsx = (...args: StyleName[]): string => {
  return names(args).flat().filter(Boolean).join(' ');
};

const names = (item: StyleName): string[] => {
  if (Array.isArray(item)) return item.flatMap(names);
  if (typeof item === 'object') {
    let items: string[] = [];
    for (let k in item) {
      if (item[k]) {
        items.push(k);
      }
    }
    return clean(items);
  }
  return item ? clean([item.toString()]) : [];
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
  const cls = useCallback(
    (...args: StyleName[]) => {
      return names(args)
        .flatMap(name => styles[name] ?? name)
        .filter(Boolean)
        .join(' ');
    },
    [styles]
  );
  return cls;
}
