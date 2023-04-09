import { IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { isLinux } from '../utils';

const NavigationBarWapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;

  top: ${isLinux ? '40px' : 'env(titlebar-area-height)'};
  width: 100%;
  height: ${isLinux ? '40px' : 'env(titlebar-area-height)'};
  padding: 0 ${props => props.theme.spacing(0.5)};

  background-color: ${props =>
    props.theme.palette.mode === 'dark'
      ? props.theme.palette.tertiary.main
      : props.theme.palette.tertiary.light};
`;
export const NavigationBar: FunctionComponent = () => {
  const onGoBackClicked = () => {
    window.rendererAPI.currentTabGoBack();
  };

  const onGoForwardClicked = () => {
    window.rendererAPI.currentTabGoForward();
  };

  const onReloadClicked = () => {
    window.rendererAPI.currentTabReload();
  };

  return (
    <NavigationBarWapper>
      <IconButton
        size="small"
        aria-label="Go back"
        title="Go back"
        onClick={onGoBackClicked}
      >
        <NavigateBeforeIcon />
      </IconButton>

      <IconButton
        size="small"
        aria-label="Go forward"
        title="Go forward"
        onClick={onGoForwardClicked}
      >
        <NavigateNextIcon />
      </IconButton>

      <IconButton
        size="small"
        aria-label="Reload page"
        title="Reload page"
        onClick={onReloadClicked}
      >
        <RefreshIcon />
      </IconButton>
    </NavigationBarWapper>
  );
};
