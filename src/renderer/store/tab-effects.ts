import { useEffect } from 'react';
import { useTabStore } from './tab-store';
import { shallow } from 'zustand/shallow';

export const useTabEffects = () => {
  const {
    openNewTab,
    setTabTitle,
    closeCurrentTab,
    switchToNextTab,
    switchToPreviousTab,
  } = useTabStore(
    ({
      openNewTab,
      setTabTitle,
      closeCurrentTab,
      switchToNextTab,
      switchToPreviousTab,
    }) => ({
      openNewTab,
      setTabTitle,
      closeCurrentTab,
      switchToNextTab,
      switchToPreviousTab,
    }),
    shallow,
  );

  useEffect(() => {
    const openNewTabUnsubscribe = window.mainAPI.onOpenNewTab(({ id }) => {
      openNewTab(id);
    });

    const closeCurrentTabUnsubscribe = window.mainAPI.onCloseCurrentTab(() => {
      closeCurrentTab();
    });

    const setTabTitleUnsubscribe = window.mainAPI.onSetTabTitle(
      ({ id, title }) => {
        setTabTitle(id, title);
      },
    );

    const switchToNextTabUnsubscribe = window.mainAPI.onSwitchToNextTab(() => {
      switchToNextTab();
    });

    const switchToPreviousTabUnsubscribe = window.mainAPI.onSwitchToPreviousTab(
      () => {
        switchToPreviousTab();
      },
    );

    return () => {
      openNewTabUnsubscribe();
      closeCurrentTabUnsubscribe();
      setTabTitleUnsubscribe();
      switchToNextTabUnsubscribe();
      switchToPreviousTabUnsubscribe();
    };
  }, []);
};
