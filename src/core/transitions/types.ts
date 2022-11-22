import {
  TransitionProps as _TransitionProps,
  TransitionActions,
} from 'react-transition-group/Transition';

type TransitionHandlerKeys =
  | 'onEnter'
  | 'onEntering'
  | 'onEntered'
  | 'onExit'
  | 'onExiting'
  | 'onExited';

type TransitionKeys =
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
