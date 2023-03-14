import React from 'react';
import { render } from '@testing-library/react';
import TaskManager from './TaskManager';

describe('TaskManager', () => {
  it('renders correctly', () => {
    const { container } = render(<TaskManager />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
