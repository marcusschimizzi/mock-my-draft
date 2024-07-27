import React from 'react';

import Page from '../src/app/page';
import { render } from '../test/test-utils';

describe('Page', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
