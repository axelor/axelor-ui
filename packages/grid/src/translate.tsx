import React from 'react';
import * as TYPES from './types';

const TranslateContext = React.createContext<TYPES.GridProps['translate']>(
  (str: string) => str
);

export function TranslateProvider({
  t,
  children,
}: {
  children: React.ReactChild;
  t: TYPES.GridProps['translate'];
}) {
  return (
    <TranslateContext.Provider value={t}>{children}</TranslateContext.Provider>
  );
}

export function useTranslation(): any {
  return React.useContext(TranslateContext);
}
