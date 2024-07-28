import React from 'react';

import Page from '@/app/(dashboard)/page';
import { render } from '../test-utils';

describe('Page', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
