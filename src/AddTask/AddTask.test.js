import React from 'react';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import AddTask from './AddTask';

it('renders AddTask component correctly', () => {
  const onClose = jest.fn(); // Create a mock function for the onClose prop
  const component = renderer.create(<AddTask onClose={onClose} open={true} />); // Create the component
  let tree = component.toJSON(); // Get the initial snapshot

  // Simulate user input
  act(() => {
    const titleInput = component.root.findByProps({ name: 'title' }); // Find the title input element
    titleInput.props.onChange({ target: { value: 'Test Title' } }); // Update the title state variable
    const descriptionInput = component.root.findByProps({ name: 'description' }); // Find the description input element
    descriptionInput.props.onChange({ target: { value: 'Test Description' } }); // Update the description state variable
  });

  // Get a new snapshot after the state variables have been updated
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // Simulate form submission
  act(() => {
    const form = component.root.findByProps({ name: 'addTask' }); // Find the form element
    form.props.onSubmit({ preventDefault: jest.fn() }); // Submit the form with a mock event object
  });
});


