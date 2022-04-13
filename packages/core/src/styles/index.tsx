import { useCallback } from 'react';
import stylesLtr from './styles.module.scss';
import stylesRtl from './styles.rtl.module.scss';

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

export function styleNames(...args: StyleName[]) {
  console.warn(
    "Don't use `styleNames` function, use `useClassNames` hook instead."
  );
  return names(args)
    .flatMap(name => STYLES.ltr[name] ?? name)
    .join(' ');
}

export function useStyles() {
  const dir = document.dir;
  return STYLES[dir] || STYLES.ltr;
}

export function useClassNames() {
  const styles = useStyles();
  const cls = useCallback(
    (...args: StyleName[]) => {
      return names(args)
        .flatMap(name => styles[name] ?? name)
        .join(' ');
    },
    [styles]
  );
  return cls;
}
