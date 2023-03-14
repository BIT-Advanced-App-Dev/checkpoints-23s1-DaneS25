import React from 'react';
import { render } from '@testing-library/react';
import TaskItem from './TaskItem';


// Render task item, check for title and description
describe('TaskItem', () => {
  it('renders the title and description', () => {
    const title = 'Test Title';
    const description = 'Test Description';
    const onClose = jest.fn();
    const open = true;

    const { getByText } = render(
      <TaskItem title={title} description={description} onClose={onClose} open={open} />
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(description)).toBeInTheDocument();
  });
});
