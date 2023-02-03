import {
  TransitionProps as _TransitionProps,
  TransitionActions,
} from 'react-transition-group/Transition';

export type TransitionHandlerKeys =
  | 'onEnter'
  | 'onEntering'
  | 'onEntered'
  | 'onExit'
  | 'onExiting'
  | 'onExited';

export type TransitionKeys =
  | 'in'
  | 'timeout'
  | 'mountOnEnter'
  | 'unmountOnExit'
  | 'children'
  | TransitionHandlerKeys;

export interface TransitionHandlerProps
  extends Pick<_TransitionProps, TransitionHandlerKeys> {}

export interface TransitionProps
  extends TransitionActions,
    Partial<Pick<_TransitionProps, TransitionKeys>> {}
