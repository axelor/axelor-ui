export type Size = 'sm' | 'md' | 'lg' | 'xl' | string;

export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type NamedColor =
  | 'red'
  | 'pink'
  | 'purple'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'grey'
  | 'black'
  | 'white';

export type Color = ThemeColor | NamedColor | string;

export type ColorShade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
