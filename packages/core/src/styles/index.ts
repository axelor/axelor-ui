import styles from './styles.module.scss';

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
  return names(args)
    .flatMap(name => styles[name] ?? name)
    .join(' ');
}
