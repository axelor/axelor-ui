export type TVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type TBackground = TVariant | 'body' | 'transparent';
export type TForeground = TVariant | 'white' | 'black-50' | 'white-50' | 'body' | 'muted';
