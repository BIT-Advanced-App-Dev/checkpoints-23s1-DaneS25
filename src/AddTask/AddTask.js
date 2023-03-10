/* 
Add Task component.
Click add task to add a new title and description of task
*/

import Modal from "../Modal/Modal"
import {useState} from 'react'
import './addTask.css'
import {db} from '../firebase' // Importing the Firebase database configuration
import {collection, addDoc, Timestamp} from 'firebase/firestore' // Importing Firebase Firestore functionalities

function AddTask({onClose, open}) {

  // Create state variables for title and description of the tasks
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Function to add new task to firestore
  const handleSubmit = async (e) => { // Receive event
    e.preventDefault() // Prevent default behaviour 
    try {
      await addDoc(collection(db, 'tasks'), { // addDoc function to add a new document to the 'tasks' collection in Firestore
        title: title,
        description: description,
        completed: false,
        created: Timestamp.now()
      })
      onClose() 
    } catch (err) {
      alert(err)
    }
  }

  return (
    <Modal modalLable='Add Task' onClose={onClose} open={open}> {/* Render in the Modal component with props modalLabel, onClose, and open */}
      <form onSubmit={handleSubmit} className='addTask' name='addTask'>
        <input 
          type='text' 
          name='title' 
          onChange={(e) => setTitle(e.target.value.toUpperCase())}
          value={title}
          placeholder='Enter title'/>
        <textarea 
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Enter task decription'
          value={description}></textarea>
        <button type='submit'>Done</button> {/* Button that will trigger the handleSubmit function when clicked */}
      </form> 
    </Modal>
  )
}

export default AddTask