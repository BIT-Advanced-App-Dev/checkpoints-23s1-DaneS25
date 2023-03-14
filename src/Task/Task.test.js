import React from 'react';
import { render } from '@testing-library/react';
import Task from './Task';

// Check single task matches snapshot of TEST TASK
test('renders task component', () => {
  const { asFragment } = render(
    <Task 
      id={1} 
      title="TEST TASK" 
      description="This is a test task" 
      completed={false} 
    />
  );
  expect(asFragment()).toMatchSnapshot();
});

