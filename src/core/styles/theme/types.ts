export interface ThemePalette {
  // common colors
  blue?: string;
  indigo?: string;
  purple?: string;
  pink?: string;
  red?: string;
  orange?: string;
  yellow?: string;
  green?: string;
  teal?: string;
  cyan?: string;

  // gray
  white?: string;
  black?: string;
  gray?: string;
  gray_dark?: string;
  gray_100?: string;
  gray_200?: string;
  gray_300?: string;
  gray_400?: string;
  gray_500?: string;
  gray_600?: string;
  gray_700?: string;
  gray_800?: string;
  gray_900?: string;

  // body colors
  body_bg?: string;
  body_color?: string;
  secondary_bg?: string;
  secondary_color?: string;
  tertiary_bg?: string;
  tertiary_color?: string;
  emphasis_color?: string;

  // theme colors
  primary?: string;
  secondary?: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  light?: string;
  dark?: string;
}

export interface ThemeTypograpy {
  fontFamily?: string | string[];
  fontSize?: string;
  fontWeight?: number | string;
  lineHeight?: number | string;
}

export interface ThemeElementColors {
  bg?: string;
  color?: string;
  shadow?: string;
}

export interface ThemeElementBorder {
  width?: string;
  color?: string;
  style?: React.CSSProperties["borderStyle"];
  radius?: string;
}

export interface ThemeElementSpacing {
  padding?: string;
  gap?: string;
}

export interface ThemeElementCommon
  extends ThemeTypograpy,
    ThemeElementColors,
    ThemeElementSpacing {
  border?: ThemeElementBorder;
}

export interface ThemeOptions {
  palette?: ThemePalette;
  typography?: {
    body?: ThemeTypograpy;
    code?: ThemeTypograpy;
  };
  border?: ThemeElementBorder;
  link?: {
    color?: string;
    hover?: string;
    decoration?: React.CSSProperties["textDecorationStyle"];
  };
  components?: {
    Input?: {
      border?: ThemeElementBorder;
      border_sm?: ThemeElementBorder;
      border_lg?: ThemeElementBorder;
      focus?: {
        border?: ThemeElementBorder;
        shadow?: string;
      };
      invalid?: {
        color?: string;
        border?: ThemeElementBorder;
      };
      invalid_focus?: {
        color?: string;
        border?: ThemeElementBorder;
        shadow?: string;
      };
    };
    Shell?: ThemeElementColors & {
      scrollbar?: { color?: string };
      sidebar?: ThemeElementCommon;
      view?: {
        toolbar?: ThemeElementCommon;
        content?: ThemeElementCommon;
      };
    };
    Panel?: ThemeElementCommon & {
      title?: ThemeElementSpacing;
      header?: ThemeElementCommon;
      footer?: ThemeElementCommon;
    };
    Table?: ThemeElementCommon & {
      header?: ThemeElementCommon;
      row?: ThemeElementCommon;
      row_odd?: ThemeElementColors;
      row_hover?: ThemeElementColors;
      row_active?: ThemeElementColors;
      cell?: ThemeElementSpacing;
      cell_active?: ThemeElementColors;
    };
    NavMenu?: ThemeElementCommon & {
      width?: string;
      zIndex?: number;
      header?: ThemeElementColors & ThemeElementSpacing;
      item?: ThemeElementColors &
        ThemeElementSpacing & { border?: ThemeElementBorder };
      item_hover?: ThemeElementColors;
      item_active?: ThemeElementColors;
      icon?: ThemeElementColors & ThemeElementSpacing;
      icon_hover?: ThemeElementColors;
      icon_active?: ThemeElementColors;
      buttons?: ThemeElementColors & ThemeElementSpacing & { width?: string };
    };
    NavTabs?: ThemeElementCommon & {
      item?: ThemeElementCommon & {
        transform?: React.CSSProperties["textTransform"];
      };
      item_hover?: ThemeElementCommon;
      item_active?: ThemeElementCommon;
      icon?: ThemeElementColors & ThemeElementSpacing;
      icon_hover?: ThemeElementColors;
      icon_active?: ThemeElementColors;
      indicator?: {
        bg?: string;
        height?: string;
      };
    };
    CommandBar?: {
      button?: ThemeElementCommon;
      button_hover?: ThemeElementColors & {
        border?: ThemeElementBorder;
      };
      button_active?: ThemeElementColors & {
        border?: ThemeElementBorder;
        shadow?: string;
      };
    };
    Dropdown?: ThemeElementCommon & {
      item?: ThemeElementColors;
      item_hover?: ThemeElementColors;
      item_active?: ThemeElementColors;
    };
    NavSelect?: {
      item?: ThemeElementCommon;
      item_hover?: ThemeElementCommon;
      item_active?: ThemeElementCommon;
    };
    Badge?: ThemeElementCommon & {
      opacity?: number;
      primary?: { color?: string };
      secondary?: { color?: string };
      success?: { color?: string };
      danger?: { color?: string };
      warning?: { color?: string };
      info?: { color?: string };
      light?: { color?: string };
      dark?: { color?: string };
    };
  };
}
