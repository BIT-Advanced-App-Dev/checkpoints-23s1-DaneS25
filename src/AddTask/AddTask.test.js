import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AddTaskMock from './AddTaskMock';

describe('AddTaskMock', () => {
  jest.setTimeout(10000);
  it('calls mockAddDoc when "Done" button is clicked', async () => {
    const mockAddDoc = jest.fn().mockResolvedValue({
      title: 'Mock Task Title',
      description: 'Mock Task Description',
      completed: false,
      created: { seconds: 1234567890 }
    });
    const handleClose = jest.fn();

    const { asFragment } = render(<AddTaskMock onClose={handleClose} open={true} mockAddDoc={mockAddDoc} />);

    const titleInput = screen.getByPlaceholderText('Enter title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    const doneButton = screen.getByRole('button', { name: 'Done' });

    fireEvent.change(titleInput, { target: { value: 'Mock Task Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Mock Task Description' } });

    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledWith({
        title: 'MOCK TASK TITLE',
        description: 'Mock Task Description',
        completed: false,
        created: expect.anything(),
      });
    }, { timeout: 5000 });

    expect(asFragment()).toMatchSnapshot();
  });
});









