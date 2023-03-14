import React from 'react';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import EditTask from './EditTask';

it('renders EditTask component correctly', () => {
  const onClose = jest.fn(); // Create a mock function for the onClose prop
  const toEditTitle = 'Test Title';
  const toEditDescription = 'Test Description';
  const id = 'test-id';
  const component = renderer.create(<EditTask onClose={onClose} open={true} toEditTitle={toEditTitle} toEditDescription={toEditDescription} id={id} />); // Create the component
  let tree = component.toJSON(); // Get the initial snapshot

  // Simulate user input
  act(() => {
    const titleInput = component.root.findByProps({ name: 'title' }); // Find the title input element
    titleInput.props.onChange({ target: { value: 'New Test Title' } }); // Update the title state variable
    const descriptionInput = component.root.findByType('textarea'); // Find the description textarea element
    descriptionInput.props.onChange({ target: { value: 'New Test Description' } }); // Update the description state variable
  });

  // Get a new snapshot after the state variables have been updated
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // Simulate form submission
  act(() => {
    const form = component.root.findByProps({ name: 'editTask' }); // Find the form element
    form.props.onSubmit({ preventDefault: jest.fn() }); // Submit the form with a mock event object
  });
});
