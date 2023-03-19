import Modal from "../Modal/Modal"
import { useState } from 'react'
import './addTask.css'

function AddTaskMock({ onClose, open, mockAddDoc }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await mockAddDoc({
        title: title,
        description: description,
        completed: false,
        created: { seconds: 1234567890 }
      });
  
      onClose();
    } catch (err) {
        console.log(err);
      console.error(err);
    }
  };
  

  return (
    <Modal modalLabel='Add Task' onClose={onClose} open={open}>
      <form onSubmit={handleSubmit} className='addTask' name='addTask'>
        <input
          type='text'
          name='title'
          onChange={(e) => setTitle(e.target.value.toUpperCase())}
          value={title}
          placeholder='Enter title'
        />
        <textarea
          name='description'
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Enter task description'
          value={description}
        ></textarea>
        <button type='submit' name='done'>
          Done
        </button>
      </form>
    </Modal>
  )
}

export default AddTaskMock



  