import { useEffect } from 'react';

let componentLoaded = false;

export const useAppEffects = (): void => {
  useEffect(() => {
    if (!componentLoaded) {
      window.rendererAPI.loaded();
      componentLoaded = true;
    }
  }, []);
};
