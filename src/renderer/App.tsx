import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { FunctionComponent } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { AppLayout } from './components/AppLayout';
import { Theme } from '../theme';
import { useAppEffects, useTabEffects } from './store';
import { GlobalStyle } from './GlobalStyle';

export const App: FunctionComponent = () => {
  useAppEffects();
  useTabEffects();

  return (
    <Theme>
      <CssBaseline />
      <GlobalStyle />
      <AppLayout />
    </Theme>
  );
};
