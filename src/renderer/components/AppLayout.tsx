import { FC } from 'react';
import { NavigationBar } from './NavigationBar';
import { TabBarContainer } from './TabBarContainer';

export const AppLayout: FC = () => (
  <>
    <TabBarContainer />
    <NavigationBar />
  </>
);
