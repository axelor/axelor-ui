import bootstrap from './bootstrap.module.css';

type Value = string | number | boolean | undefined | null;
type Argument = Value | Record<string, Value> | Argument[];

const clean = (names: string[]) =>
  names.flatMap(n => n.trim().split(/\s+/)).filter(Boolean);

const names = (item: Argument): string[] => {
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

export function styleNames(...args: Argument[]) {
  return names(args)
    .flatMap(name => bootstrap[name] ?? name)
    .join(' ');
}
