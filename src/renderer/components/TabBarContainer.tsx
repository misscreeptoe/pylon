import { FC } from 'react';
import { useTabStore } from '../store';
import { shallow } from 'zustand/shallow';
import { TabBar } from './TabBar';

export const TabBarContainer: FC = () => {
  const { tabs, switchToTab, currentTabId, closeTab } = useTabStore(
    ({ tabs, switchToTab, currentTabId, closeTab }) => ({
      tabs,
      switchToTab,
      currentTabId,
      closeTab,
    }),
    shallow,
  );

  if (!currentTabId || !tabs) {
    return <></>;
  }

  return (
    <TabBar
      tabs={tabs}
      currentTabId={currentTabId}
      onTabChange={switchToTab}
      onTabClose={closeTab}
      onOpenNewTab={() => window.rendererAPI.openNewTab()}
    />
  );
};
