import React from 'react';
import { createTheme } from 'vite-pages-theme-basic';

export default createTheme({
  topNavs: [
    { text: 'Home', path: '/' },
    {
      text: 'Axelor UI',
      href: 'https://github.com/axelor/axelor-ui',
    },
  ],
  logo: <div style={{ fontWeight: 'bold' }}>Axelor UI</div>,
});
