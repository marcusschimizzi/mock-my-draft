import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { AppProvider } from '../src/providers/app';

export const appRender = (ui: ReactElement) => {
  return render(ui, {
    wrapper: AppProvider,
  });
};
