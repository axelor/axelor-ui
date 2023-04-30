export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Record<string, any>
  | ClassValue[];

const clean = (names: string[]) =>
  names.flatMap((n) => n.trim().split(/\s+/)).filter(Boolean);

const names = (item: ClassValue): string[] => {
  if (!item) return [];
  if (Array.isArray(item)) return item.flatMap(names);
  if (typeof item === "object") {
    return clean(Object.keys(item).filter((k) => Boolean(item[k])));
  }
  return clean([String(item)]);
};

/**
 * Compose class names from a list of values.
 *
 * @param args the list of values to compose class names from
 * @returns the composed class names
 */
export function clsx(...args: ClassValue[]) {
  return names(args).flat().filter(Boolean).join(" ");
}

/**
 * Compose class names from a list of values and map them to a styles object.
 *
 * This can be used to map class names to CSS modules.
 *
 * @param styles the styles object to map class names to
 * @param args the list of values to compose class names from
 * @returns the composed class names
 */
export function cssx(styles: Record<string, string>, ...args: ClassValue[]) {
  return names(args)
    .flat()
    .filter(Boolean)
    .map((name) => styles[name] ?? name)
    .join(" ");
}
