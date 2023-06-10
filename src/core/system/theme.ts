export type TVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

export type TSubtleVariant =
  | "primary-subtle"
  | "secondary-subtle"
  | "success-subtle"
  | "danger-subtle"
  | "warning-subtle"
  | "info-subtle"
  | "light-subtle"
  | "dark-subtle";

export type TEmphasisVariant =
  | "primary-emphasis"
  | "secondary-emphasis"
  | "success-emphasis"
  | "danger-emphasis"
  | "warning-emphasis"
  | "info-emphasis"
  | "light-emphasis"
  | "dark-emphasis";

export type TBackground =
  | TVariant
  | TSubtleVariant
  | "body"
  | "body-secondary"
  | "body-tertiary"
  | "black"
  | "white"
  | "transparent";

export type TForeground =
  | TVariant
  | TEmphasisVariant
  | "white"
  | "black"
  | "black-50"
  | "white-50"
  | "body"
  | "body-emphasis"
  | "body-secondary"
  | "body-tertiary";
