import styled from 'styled-components';
import {
  TabUnstyled,
  tabUnstyledClasses,
  TabsListUnstyled,
  TabsUnstyled,
} from '@mui/base';
import { FC } from 'react';
import { IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Tab } from '../model';

const TabBarWrapper = styled.div`
  width: 100%;
  height: calc(env(titlebar-area-height) + 1px);
  background-color: ${props =>
    props.theme.palette.mode === 'dark'
      ? props.theme.palette.tertiary.dark
      : props.theme.palette.tertiary.main};
`;

const TabBarInner = styled.div`
  position: fixed;
  top: env(titlebar-area-y);
  left: env(titlebar-area-x);
  width: env(titlebar-area-width);
  height: calc(env(titlebar-area-height) + 1px);

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TabsRoot = styled.div`
  height: 100%;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    height: 0;
  }
`;

const TabListRoot = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const TabRoot = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;

  background-color: transparent;
  color: ${props => props.theme.palette.tertiary.contrastText};

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  &:hover {
    cursor: default;
  }

  &:not(.${tabUnstyledClasses.selected}):hover {
    background-color: ${props => props.theme.palette.action?.hover};
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${props =>
      props.theme.palette.mode === 'dark'
        ? props.theme.palette.tertiary.main
        : props.theme.palette.tertiary.light};
  }
`;

const CloseButton = styled(IconButton)`
  margin-left: ${props => props.theme.spacing(0.5)};
  margin-right: ${props => props.theme.spacing(0.5)};
  opacity: 0;

  ${TabRoot}:hover &,
  ${TabRoot}.${tabUnstyledClasses.selected} & {
    opacity: 1;
  }
`;

const TabContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 300px;
  padding-left: ${props => props.theme.spacing(2)};
  white-space: nowrap;
`;

interface TabContentProps {
  title: string;
  onTabClose: () => void;
}

const TabContent: FC<TabContentProps> = ({ title, onTabClose }) => (
  <TabContentWrapper>
    <Typography noWrap maxWidth={150}>
      {title}
    </Typography>

    <CloseButton
      size="small"
      aria-label="Close tab"
      title="Close tab"
      onClick={event => {
        event.stopPropagation();
        onTabClose();
      }}
    >
      <CloseIcon />
    </CloseButton>
  </TabContentWrapper>
);

const OpenNewTabButton = styled(IconButton)`
  margin-left: ${props => props.theme.spacing(0.5)};
`;

interface OpenNewTabProps {
  onOpenNewTab: () => void;
}

const OpenNewTab: FC<OpenNewTabProps> = ({ onOpenNewTab }) => (
  <OpenNewTabButton
    size="small"
    aria-label="Open new tab"
    title="Open new tab"
    onClick={onOpenNewTab}
  >
    <AddIcon />
  </OpenNewTabButton>
);

export interface TabBarProps {
  tabs: Tab[];
  currentTabId: string;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
  onOpenNewTab: () => void;
}

export const TabBar: FC<TabBarProps> = ({
  tabs,
  currentTabId,
  onTabChange,
  onTabClose,
  onOpenNewTab,
}) => (
  <TabBarWrapper>
    <TabBarInner>
      <TabsUnstyled
        component={TabsRoot}
        value={currentTabId}
        onChange={(_, id) => onTabChange(String(id))}
      >
        <TabsListUnstyled component={TabListRoot}>
          {tabs.map(({ id, title }) => (
            <TabUnstyled component={TabRoot} value={id} key={id}>
              <TabContent title={title} onTabClose={() => onTabClose(id)} />
            </TabUnstyled>
          ))}
        </TabsListUnstyled>
      </TabsUnstyled>

      <OpenNewTab onOpenNewTab={onOpenNewTab} />
    </TabBarInner>
  </TabBarWrapper>
);
