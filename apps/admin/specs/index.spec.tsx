import React from 'react';

import Page from '../src/app/page';
import { appRender } from '../test/test-utils';

describe('Page', () => {
  it('should render successfully', async () => {
    const { baseElement } = await appRender(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
