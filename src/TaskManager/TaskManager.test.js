import React from 'react';
import { render } from '@testing-library/react';
import TaskManager from './TaskManager';

// Basic render check, matches snapshot
describe('TaskManager', () => {
  it('renders correctly', () => {
    const { container } = render(<TaskManager />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
