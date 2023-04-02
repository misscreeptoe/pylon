import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { FunctionComponent } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Theme } from '../theme';
import { AppLayout } from './components/AppLayout';

export const App: FunctionComponent = () => {
  return (
    <Theme>
      <CssBaseline />
      <AppLayout />
    </Theme>
  );
};
