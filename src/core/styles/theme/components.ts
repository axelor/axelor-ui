import { findColor } from "./common";
import { ThemeElementBorder, ThemeOptions } from "./types";

function toBorder(
  options: ThemeOptions,
  opts?: ThemeElementBorder,
  fallback?: ThemeElementBorder
) {
  const {
    width = fallback?.width,
    style = fallback?.style,
    color = fallback?.color,
  } = opts ?? {};

  if (width && style && color) {
    return [width, style, findColor(options, color)].join(" ");
  }
}

function toShellVars(options: ThemeOptions) {
  const opts = options.components?.Shell ?? {};
  return {
    "--ax-theme-shell-bg": opts.bg,
    "--ax-theme-shell-color": opts.color,
    "--ax-theme-shell-scrollbar-color": opts.scrollbar?.color,
    "--ax-theme-shell-sidebar-bg": opts.sidebar?.bg,
    "--ax-theme-shell-sidebar-color": opts.sidebar?.color,
    "--ax-theme-shell-sidebar-paddding": opts.sidebar?.padding,
    "--ax-theme-shell-sidebar-border": toBorder(options, opts.sidebar?.border),
    "--ax-theme-shell-view-toolbar-bg": opts.view?.toolbar?.bg,
    "--ax-theme-shell-view-toolbar-color": opts.view?.toolbar?.color,
    "--ax-theme-shell-view-toolbar-padding": opts.view?.toolbar?.padding,
    "--ax-theme-shell-view-toolbar-border": toBorder(
      options,
      opts.view?.toolbar?.border
    ),
    "--ax-theme-shell-view-content-bg": opts.view?.content?.bg,
    "--ax-theme-shell-view-content-color": opts.view?.content?.color,
    "--ax-theme-shell-view-content-padding": opts.view?.content?.padding,
    "--ax-theme-shell-view-content-border": toBorder(
      options,
      opts.view?.content?.border
    ),
  };
}

function toPanelVars(options: ThemeOptions) {
  const opts = options.components?.Panel ?? {};
  return {
    "--ax-theme-panel-bg": opts.bg,
    "--ax-theme-panel-color": opts.color,

    "--ax-theme-panel-border-width": opts.border?.width,
    "--ax-theme-panel-border-color": opts.border?.color,
    "--ax-theme-panel-border-radius": opts.border?.radius,
    "--ax-theme-panel-shadow": opts.shadow,

    "--ax-theme-panel-header-bg": opts.header?.bg,
    "--ax-theme-panel-header-color": opts.header?.color,
    "--ax-theme-panel-header-border": toBorder(
      options,
      opts.header?.border,
      opts.border
    ),
    "--ax-theme-panel-header-padding": opts.header?.padding,
    "--ax-theme-panel-header-title-padding": opts.title?.padding,
    "--ax-theme-panel-header-gap": opts.header?.gap,
    "--ax-theme-panel-header-font-size": opts.header?.fontSize,
    "--ax-theme-panel-header-font-weight": opts.header?.fontWeight,

    "--ax-theme-panel-footer-bg": opts.footer?.bg,
    "--ax-theme-panel-footer-color": opts.footer?.color,
    "--ax-theme-panel-footer-border": toBorder(
      options,
      opts.header?.border,
      opts.border
    ),
    "--ax-theme-panel-footer-padding": opts.footer?.padding,
    "--ax-theme-panel-footer-gap": opts.footer?.gap,
    "--ax-theme-panel-footer-font-size": opts.footer?.fontSize,
    "--ax-theme-panel-footer-font-weight": opts.footer?.fontWeight,
    "--ax-theme-panel-body-padding": opts.padding,
  };
}

function toTableVars(options: ThemeOptions) {
  const opts = options.components?.Table ?? {};
  return {
    "--ax-theme-table-color": opts.color,
    "--ax-theme-table-bg": opts.bg,
    "--ax-theme-table-border-color": opts.border?.color,
    "--ax-theme-table-striped-color": opts.row_odd?.color,
    "--ax-theme-table-striped-bg": opts.row_odd?.bg,
    "--ax-theme-table-active-color": opts.row_active?.color,
    "--ax-theme-table-active-bg": opts.row_active?.bg,
    "--ax-theme-table-hover-color": opts.row_hover?.color,
    "--ax-theme-table-hover-bg": opts.row_hover?.bg,

    "--ax-theme-table-active-cell-color": opts.cell_active?.color,
    "--ax-theme-table-active-cell-bg": opts.cell_active?.bg,

    "--ax-theme-table-th-color": opts.header?.color,
    "--ax-theme-table-th-bg": opts.header?.bg,
    "--ax-theme-table-th-font-weight": opts.header?.fontWeight,

    "--ax-theme-table-cell-padding": opts.cell?.padding,
    "--ax-theme-table-cell-active-bg": opts.cell_active?.bg,
  };
}

function toNavMenuVars(options: ThemeOptions) {
  const opts = options.components?.NavMenu ?? {};
  return {
    "--ax-theme-nav-menu-bg": opts.bg,
    "--ax-theme-nav-menu-border-color": opts.border?.color,
    "--ax-theme-nav-menu-border": toBorder(options, opts.border),
    "--ax-theme-nav-menu-shadow": opts.shadow,
    "--ax-theme-nav-menu-width": opts.width,
    "--ax-theme-nav-menu-zIndex": opts.zIndex,

    "--ax-theme-nav-menu-header-bg": opts.header?.bg,
    "--ax-theme-nav-menu-header-color": opts.header?.color,

    "--ax-theme-nav-menu-icons-width": opts.buttons?.width,
    "--ax-theme-nav-menu-icons-bg": opts.buttons?.bg,
    "--ax-theme-nav-menu-icon-bg": opts.icon?.bg,
    "--ax-theme-nav-menu-icon-color": opts.icon?.color,

    "--ax-theme-nav-menu-icon-hover-bg": opts.icon_hover?.bg,
    "--ax-theme-nav-menu-icon-hover-color": opts.icon_hover?.color,

    "--ax-theme-nav-menu-icon-active-bg": opts.icon_active?.bg,
    "--ax-theme-nav-menu-icon-active-color": opts.icon_active?.color,

    "--ax-theme-nav-menu-item-radius": opts.item?.border?.radius,

    "--ax-theme-nav-menu-item-hover-bg": opts.item_hover?.bg,
    "--ax-theme-nav-menu-item-hover-color": opts.item_hover?.color,

    "--ax-theme-nav-menu-item-active-bg": opts.item_active?.bg,
    "--ax-theme-nav-menu-item-active-color": opts.item_active?.color,
  };
}

function toNavTabsVars(options: ThemeOptions) {
  const opts = options.components?.NavTabs ?? {};
  return {
    "--ax-theme-nav-tabs-icon-bg": opts.icon?.bg,
    "--ax-theme-nav-tabs-icon-color": opts.icon?.color,
    "--ax-theme-nav-tabs-icon-padding": opts.icon?.padding,

    "--ax-theme-nav-tabs-tab-padding": opts.item?.padding,
    "--ax-theme-nav-tabs-tab-bg": opts.item?.bg,
    "--ax-theme-nav-tabs-tab-color": opts.item?.color,
    "--ax-theme-nav-tabs-tab-font-weight": opts.item?.fontWeight,

    "--ax-theme-nav-tabs-tab-text-transform": opts.text?.transform,
    "--ax-theme-nav-tabs-tab-text-padding": opts.text?.padding,

    "--ax-theme-nav-tabs-tab-hover-bg": opts.item_hover?.bg,
    "--ax-theme-nav-tabs-tab-hover-color": opts.item_hover?.color,
    "--ax-theme-nav-tabs-tab-hover-font-weight": opts.item_hover?.fontWeight,

    "--ax-theme-nav-tabs-tab-active-bg": opts.item_active?.bg,
    "--ax-theme-nav-tabs-tab-active-color": opts.item_active?.color,
    "--ax-theme-nav-tabs-tab-active-font-weight": opts.item_active?.fontWeight,

    "--ax-theme-nav-tabs-icon-hover-bg": opts.icon_hover?.bg,
    "--ax-theme-nav-tabs-icon-hover-color": opts.icon_hover?.color,

    "--ax-theme-nav-tabs-icon-active-bg": opts.icon_active?.bg,
    "--ax-theme-nav-tabs-icon-active-color": opts.icon_active?.color,

    "--ax-theme-nav-tabs-indicator-size": opts.indicator?.height,
    "--ax-theme-nav-tabs-indicator-color": opts.indicator?.bg,
  };
}

function toCommandBarVars(options: ThemeOptions) {
  const opts = options.components?.CommandBar ?? {};
  return {
    "--ax-theme-command-bar-button-paddding": opts.button?.padding,
    "--ax-theme-command-bar-button-bg": opts.button?.bg,
    "--ax-theme-command-bar-button-color": opts.button?.color,
    "--ax-theme-command-bar-button-border-color": opts.button?.border?.color,
    "--ax-theme-command-bar-button-hover-bg": opts.button_hover?.bg,
    "--ax-theme-command-bar-button-hover-color": opts.button_hover?.color,
    "--ax-theme-command-bar-button-hover-border-color":
      opts.button_hover?.border?.color,
    "--ax-theme-command-bar-button-active-bg": opts.button_active?.bg,
    "--ax-theme-command-bar-button-active-color": opts.button_active?.color,
    "--ax-theme-command-bar-button-active-border-color":
      opts.button_active?.border?.color,
    "--ax-theme-command-bar-button-active-shadow": opts.button_active?.shadow,
  };
}

function toDropdownVars(options: ThemeOptions) {
  const opts = options.components?.Dropdown ?? {};
  return {
    "--ax-theme-dropdown-bg": opts.bg,
    "--ax-theme-dropdown-color": opts.color,
    "--ax-theme-dropdown-border-color": opts.border?.color,
    "--ax-theme-dropdown-border-radius": opts.border?.radius,
    "--ax-theme-dropdown-border-width": opts.border?.width,
    "--ax-theme-dropdown-box-shadow": opts.shadow,
    "--ax-theme-dropdown-link-color": opts.item?.color,
    "--ax-theme-dropdown-link-hover-bg": opts.item_hover?.bg,
    "--ax-theme-dropdown-link-hover-color": opts.item_hover?.color,
    "--ax-theme-dropdown-link-active-color": opts.item_active?.color,
    "--ax-theme-dropdown-link-active-bg": opts.item_active?.bg,
    "--ax-theme-dropdown-divider-bg": opts.divider?.bg,
  };
}

function toInputVars(options: ThemeOptions) {
  const opts = options.components?.Input ?? {};
  return {
    "--ax-theme-input-border": toBorder(options, opts.border),
    "--ax-theme-input-focus-border": toBorder(options, opts.focus?.border),
    "--ax-theme-input-focus-shadow": opts.focus?.shadow,
    "--ax-theme-input-invalid-border": toBorder(options, opts.invalid?.border),
    "--ax-theme-input-invalid-focus-border": toBorder(
      options,
      opts.invalid_focus?.border
    ),
    "--ax-theme-input-invalid-focus-shadow": opts.invalid_focus?.shadow,
    "--ax-theme-input-border-radius": opts.border?.radius,
    "--ax-theme-input-border-radius-sm": opts.border_sm?.radius,
    "--ax-theme-input-border-radius-lg": opts.border_lg?.radius,
  };
}

function toBadgeVars(options: ThemeOptions) {
  const opts = options.components?.Badge ?? {};
  return {
    "--ax-theme-badge-opacity": opts.opacity,
    "--ax-theme-badge-color": opts.color,
    "--ax-theme-badge-padding": opts.padding,
    "--ax-theme-badge-font-size": opts.fontSize,
    "--ax-theme-badge-font-weight": opts.fontWeight,
    "--ax-theme-badge-border-radius": opts.border?.radius,
    "--ax-theme-badge-primary-color": opts.color,
    "--ax-theme-badge-secondary-color": opts.color,
    "--ax-theme-badge-success-color": opts.color,
    "--ax-theme-badge-danger-color": opts.color,
    "--ax-theme-badge-warning-color": opts.color,
    "--ax-theme-badge-info-color": opts.color,
    "--ax-theme-badge-light-color": opts.color,
    "--ax-theme-badge-dark-color": opts.color,
  };
}

export function toComponentVars(options: ThemeOptions) {
  return {
    ...toShellVars(options),
    ...toPanelVars(options),
    ...toTableVars(options),
    ...toNavMenuVars(options),
    ...toNavTabsVars(options),
    ...toCommandBarVars(options),
    ...toDropdownVars(options),
    ...toInputVars(options),
    ...toBadgeVars(options),
  };
}
