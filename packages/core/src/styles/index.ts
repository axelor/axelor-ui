import bootstrap from './bootstrap.module.css';
import classNames, { Argument } from 'classnames';

export function styleNames(...args: Argument[]) {
  const names = classNames(...args);
  return names
    .split(/\s+/g)
    .map(name => bootstrap[name] ?? name)
    .filter(style => style)
    .join(' ');
}
